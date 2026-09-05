import type { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
  AdminListGroupsForUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

// No static credentials - CognitoIdentityProviderClient picks up this
// function's auto-managed execution role automatically.
const client = new CognitoIdentityProviderClient();
const USER_POOL_ID = process.env.USER_POOL_ID!;

type Args = {
  action: 'list' | 'create' | 'delete' | 'setPassword';
  email?: string | null;
  newPassword?: string | null;
};

function emailOf(user: { Attributes?: { Name?: string; Value?: string }[]; Username?: string }) {
  return user.Attributes?.find((a) => a.Name === 'email')?.Value ?? user.Username ?? '';
}

export const handler: AppSyncResolverHandler<Args, unknown> = async (event) => {
  // Defense in depth: the GraphQL mutation this backs already restricts
  // invocation to the Admins group via its @auth rule (AppSync rejects a
  // non-admin caller before this code ever runs), but an admin-power
  // function like this should never rely on a single layer of enforcement.
  const identity = event.identity as AppSyncIdentityCognito | undefined;
  const callerGroups = identity?.groups ?? [];
  const callerEmail = (identity?.claims?.email as string | undefined) ?? undefined;

  if (!callerGroups.includes('Admins')) {
    throw new Error('Forbidden');
  }

  const { action, email, newPassword } = event.arguments;

  switch (action) {
    case 'list': {
      const res = await client.send(new ListUsersCommand({ UserPoolId: USER_POOL_ID, Limit: 60 }));
      const users = await Promise.all(
        (res.Users ?? []).map(async (u) => {
          const groupsRes = await client.send(
            new AdminListGroupsForUserCommand({ UserPoolId: USER_POOL_ID, Username: u.Username! })
          );
          return {
            email: emailOf(u),
            status: u.UserStatus,
            enabled: u.Enabled,
            isAdmin: (groupsRes.Groups ?? []).some((g) => g.GroupName === 'Admins'),
          };
        })
      );
      return { users };
    }

    case 'create': {
      if (!email) throw new Error('email is required');
      await client.send(
        new AdminCreateUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: email,
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'email_verified', Value: 'true' },
          ],
          DesiredDeliveryMediums: ['EMAIL'],
        })
      );
      return { ok: true };
    }

    case 'delete': {
      if (!email) throw new Error('email is required');
      if (callerEmail && email === callerEmail) {
        throw new Error("You can't delete your own account here.");
      }
      await client.send(new AdminDeleteUserCommand({ UserPoolId: USER_POOL_ID, Username: email }));
      return { ok: true };
    }

    case 'setPassword': {
      if (!email || !newPassword) throw new Error('email and newPassword are required');
      if (callerEmail && email === callerEmail) {
        throw new Error("You can't reset your own password here.");
      }
      if (newPassword.length < 8) throw new Error('Password must be at least 8 characters.');
      await client.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: USER_POOL_ID,
          Username: email,
          Password: newPassword,
          Permanent: true,
        })
      );
      return { ok: true };
    }

    default:
      throw new Error(`Unknown action: ${action}`);
  }
};
