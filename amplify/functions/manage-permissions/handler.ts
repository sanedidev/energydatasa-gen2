import type { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient, AdminListGroupsForUserCommand } from '@aws-sdk/client-cognito-identity-provider';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());
const cognito = new CognitoIdentityProviderClient();
const TABLE_NAME = process.env.ADMIN_PERMISSION_TABLE_NAME!;
const USER_POOL_ID = process.env.USER_POOL_ID!;

type Args = {
  action: 'grant' | 'setPages' | 'revoke' | 'setModerator';
  targetEmail: string;
  editablePages?: string[] | null;
  isModerator?: boolean | null;
};

async function findByEmail(email: string) {
  // The table is small (granted editors + moderators only), so a filtered
  // scan is simpler and safer here than depending on a guessed GSI name -
  // no risk of silently querying the wrong index.
  const res = await ddb.send(
    new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'email = :e',
      ExpressionAttributeValues: { ':e': email },
    })
  );
  return (res.Items?.[0] as Record<string, unknown> | undefined) ?? null;
}

async function isCognitoAdmin(email: string): Promise<boolean> {
  try {
    const res = await cognito.send(new AdminListGroupsForUserCommand({ UserPoolId: USER_POOL_ID, Username: email }));
    return (res.Groups ?? []).some((g) => g.GroupName === 'Admins');
  } catch {
    // Account doesn't exist in Cognito (yet) - can't be an admin.
    return false;
  }
}

export const handler: AppSyncResolverHandler<Args, unknown> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito | undefined;
  const callerGroups = identity?.groups ?? [];
  // The ID token's claims don't reliably include "email" in this identity
  // shape, but this app signs in with email as the Cognito username
  // (loginWith: { email: true }), so identity.username is the dependable
  // source - claims.email is kept only as a secondary fallback.
  const callerEmail = (identity?.username as string | undefined) ?? (identity?.claims?.email as string | undefined) ?? undefined;
  if (!callerEmail) throw new Error('Forbidden');

  const isCallerAdmin = callerGroups.includes('Admins');

  // Defense in depth: re-derive the caller's own moderator status from the
  // database rather than trusting anything the client sent.
  let isCallerModerator = false;
  if (!isCallerAdmin) {
    const callerRecord = await findByEmail(callerEmail);
    isCallerModerator = callerRecord?.isModerator === true;
    if (!isCallerModerator) throw new Error('Forbidden');
  }

  const { action, targetEmail, editablePages, isModerator } = event.arguments;
  if (!targetEmail) throw new Error('targetEmail is required');

  // setModerator is Admin-only, full stop - this is the one and only path
  // that can ever change who is a Moderator, and a Moderator can never take
  // it, including for themselves.
  if (action === 'setModerator') {
    if (!isCallerAdmin) throw new Error('Forbidden: only Admins can grant or revoke Moderator status.');
    const existing = await findByEmail(targetEmail);
    const now = new Date().toISOString();
    if (existing) {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id: existing.id },
          UpdateExpression: 'SET isModerator = :m, updatedAt = :u',
          ExpressionAttributeValues: { ':m': !!isModerator, ':u': now },
        })
      );
    } else {
      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            id: randomUUID(),
            email: targetEmail,
            editablePages: [],
            isModerator: !!isModerator,
            createdAt: now,
            updatedAt: now,
            __typename: 'AdminPermission',
          },
        })
      );
    }
    return { ok: true };
  }

  // Everything below (grant / setPages / revoke) touches editablePages only
  // - never isModerator - so even a fully malicious Moderator repeatedly
  // hitting this endpoint cannot escalate their own or anyone else's
  // moderator/admin status through it.
  if (!isCallerAdmin) {
    if (targetEmail === callerEmail) {
      throw new Error("Moderators can't change their own permissions here.");
    }
    const targetRecord = await findByEmail(targetEmail);
    if (targetRecord?.isModerator) {
      throw new Error("Moderators can't change another moderator's permissions.");
    }
    if (await isCognitoAdmin(targetEmail)) {
      throw new Error("Moderators can't change an admin's permissions.");
    }
  }

  if (action === 'grant') {
    const existing = await findByEmail(targetEmail);
    if (existing) return { ok: true, record: existing };
    const now = new Date().toISOString();
    const item = {
      id: randomUUID(),
      email: targetEmail,
      editablePages: [],
      isModerator: false,
      createdAt: now,
      updatedAt: now,
      __typename: 'AdminPermission',
    };
    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return { ok: true, record: item };
  }

  if (action === 'setPages') {
    const existing = await findByEmail(targetEmail);
    const now = new Date().toISOString();
    if (existing) {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id: existing.id },
          UpdateExpression: 'SET editablePages = :p, updatedAt = :u',
          ExpressionAttributeValues: { ':p': editablePages ?? [], ':u': now },
        })
      );
      return { ok: true };
    }
    const item = {
      id: randomUUID(),
      email: targetEmail,
      editablePages: editablePages ?? [],
      isModerator: false,
      createdAt: now,
      updatedAt: now,
      __typename: 'AdminPermission',
    };
    await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return { ok: true, record: item };
  }

  if (action === 'revoke') {
    const existing = await findByEmail(targetEmail);
    if (existing) {
      await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: existing.id } }));
    }
    return { ok: true };
  }

  throw new Error(`Unknown action: ${action}`);
};
