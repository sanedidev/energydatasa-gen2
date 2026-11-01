import type { AppSyncIdentityCognito, AppSyncResolverHandler } from 'aws-lambda';
import { randomUUID } from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());

const ADMIN_PERMISSION_TABLE = process.env.ADMIN_PERMISSION_TABLE_NAME!;

type ModelName = 'PageContent' | 'InsightArticle' | 'AudienceProfile';

const TABLES: Record<ModelName, string> = {
  PageContent: process.env.PAGE_CONTENT_TABLE_NAME!,
  InsightArticle: process.env.INSIGHT_ARTICLE_TABLE_NAME!,
  AudienceProfile: process.env.AUDIENCE_PROFILE_TABLE_NAME!,
};

const SLUG_INDEXES: Record<ModelName, string> = {
  PageContent: 'pageContentsBySlug',
  InsightArticle: 'insightArticlesBySlug',
  AudienceProfile: 'audienceProfilesBySlug',
};

const TYPENAMES: Record<ModelName, string> = {
  PageContent: 'PageContent',
  InsightArticle: 'InsightArticle',
  AudienceProfile: 'AudienceProfile',
};

type Args = {
  model?: ModelName | null;
  op: 'upsert' | 'create' | 'update' | 'delete' | 'revert';
  pageKeys?: (string | null)[] | null;
  id?: string | null;
  slug?: string | null;
  data?: unknown;
  historyLabel?: string | null;
};

// Mirrors app/context/permissions.js's canEdit() exactly - any drift between
// this and the client copy would mean the UI shows an Edit button the
// server then rejects (or worse, the other way around).
function hasAccess(editablePages: string[], pageKey: string): boolean {
  return editablePages.some((p) => {
    if (p === '*') return true;
    if (p === pageKey) return true;
    if (p.endsWith('.*')) {
      const prefix = p.slice(0, -1); // keeps the trailing dot
      return pageKey.startsWith(prefix);
    }
    return false;
  });
}

async function findPermissionByEmail(email: string) {
  // Same approach as manage-permissions' findByEmail - this table is small
  // (granted editors + moderators only), so a filtered scan is simpler and
  // safer than depending on a guessed GSI name.
  const res = await ddb.send(
    new ScanCommand({
      TableName: ADMIN_PERMISSION_TABLE,
      FilterExpression: 'email = :e',
      ExpressionAttributeValues: { ':e': email },
    })
  );
  return (res.Items?.[0] as { editablePages?: string[] } | undefined) ?? null;
}

async function findBySlug(model: ModelName, slug: string) {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLES[model],
      IndexName: SLUG_INDEXES[model],
      KeyConditionExpression: 'slug = :s',
      ExpressionAttributeValues: { ':s': slug },
      Limit: 1,
    })
  );
  return (res.Items?.[0] as Record<string, unknown> | undefined) ?? null;
}

async function logHistory(entry: {
  slug: string;
  label?: string | null;
  email: string;
  action: 'create' | 'update' | 'delete';
  before?: unknown;
  after?: unknown;
}) {
  const MAX_ENTRIES = 150;
  const MAX_CONTENT = 4000;
  const HISTORY_SLUG = '__history__.__index__';

  const truncate = (v: unknown) => {
    if (v === null || v === undefined) return null;
    const s = typeof v === 'string' ? v : JSON.stringify(v);
    return s.length <= MAX_CONTENT ? s : s.slice(0, MAX_CONTENT) + '…[truncated]';
  };

  try {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const historyEntry = {
      id,
      slug: entry.slug,
      label: entry.label || entry.slug,
      email: entry.email,
      action: entry.action,
      timestamp: new Date().toISOString(),
      before: truncate(entry.before),
      after: truncate(entry.after),
    };

    const rec = await findBySlug('PageContent', HISTORY_SLUG);
    let entries: unknown[] = [];
    if (rec?.content) {
      try {
        entries = JSON.parse(rec.content as string);
      } catch {
        /* ignore */
      }
    }
    entries = [historyEntry, ...entries].slice(0, MAX_ENTRIES);
    const content = JSON.stringify(entries);

    if (rec?.id) {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLES.PageContent,
          Key: { id: rec.id },
          UpdateExpression: 'SET content = :c, updatedAt = :u',
          ExpressionAttributeValues: { ':c': content, ':u': new Date().toISOString() },
        })
      );
    } else {
      const now = new Date().toISOString();
      await ddb.send(
        new PutCommand({
          TableName: TABLES.PageContent,
          Item: { id: randomUUID(), slug: HISTORY_SLUG, content, createdAt: now, updatedAt: now, __typename: 'PageContent' },
        })
      );
    }
  } catch (err) {
    // Non-fatal - history failure must never break a save.
    console.warn('[manage-content] failed to log history:', (err as Error)?.message ?? err);
  }
}

export const handler: AppSyncResolverHandler<Args, unknown> = async (event) => {
  const identity = event.identity as AppSyncIdentityCognito | undefined;
  const callerGroups = identity?.groups ?? [];
  const callerEmail = (identity?.username as string | undefined) ?? (identity?.claims?.email as string | undefined) ?? undefined;
  if (!callerEmail) throw new Error('Forbidden');

  const isCallerAdmin = callerGroups.includes('Admins');
  const { model, op, pageKeys, id, slug, data, historyLabel } = event.arguments;

  // Revert can restore ANY historical slug across any model/category, so
  // unlike everything else here it's Admin-only rather than
  // editablePages-gated - matching the fact that the history/revert UI in
  // the admin panel is already shown to Admins only.
  if (op === 'revert') {
    if (!isCallerAdmin) throw new Error('Forbidden');
    if (!slug) throw new Error('slug is required');
    const payload = data as { content?: string } | undefined;
    if (payload?.content === undefined) throw new Error('data.content is required');

    const existing = await findBySlug('PageContent', slug);
    if (!existing) throw new Error('Record not found');
    const before = existing.content;

    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.PageContent,
        Key: { id: existing.id },
        UpdateExpression: 'SET content = :c, updatedAt = :u',
        ExpressionAttributeValues: { ':c': payload.content, ':u': new Date().toISOString() },
      })
    );
    await logHistory({ slug, label: 'Revert', email: callerEmail, action: 'update', before, after: payload.content });
    return { ok: true };
  }

  if (!model || !TABLES[model]) throw new Error('A valid model is required');

  if (!isCallerAdmin) {
    const keys = (pageKeys ?? []).filter((k): k is string => !!k);
    if (keys.length === 0) throw new Error('Forbidden');
    const permRecord = await findPermissionByEmail(callerEmail);
    const editablePages = permRecord?.editablePages ?? [];
    const allowed = keys.some((k) => hasAccess(editablePages, k));
    if (!allowed) throw new Error('Forbidden');
  }

  const tableName = TABLES[model];
  const now = new Date().toISOString();

  if (op === 'delete') {
    if (!id) throw new Error('id is required');
    const existing = await ddb.send(new GetCommand({ TableName: tableName, Key: { id } }));
    await ddb.send(new DeleteCommand({ TableName: tableName, Key: { id } }));
    if (existing.Item) {
      await logHistory({
        slug: (existing.Item.slug as string) ?? id,
        label: historyLabel,
        email: callerEmail,
        action: 'delete',
        before: existing.Item,
        after: null,
      });
    }
    return { ok: true };
  }

  // upsert: PageContent-only convenience - every call site for this model
  // already did its own "find by slug, then update or create" round-trip;
  // consolidating that here removes a client round-trip and a whole class
  // of possible TOCTOU duplicate-record bugs.
  if (op === 'upsert') {
    if (model !== 'PageContent') throw new Error('upsert is only supported for PageContent');
    if (!slug) throw new Error('slug is required');
    const payload = (data as Record<string, unknown>) ?? {};
    const existing = await findBySlug('PageContent', slug);

    if (existing) {
      const before = existing.content;
      await ddb.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { id: existing.id },
          UpdateExpression: 'SET content = :c, updatedAt = :u',
          ExpressionAttributeValues: { ':c': payload.content ?? null, ':u': now },
        })
      );
      await logHistory({ slug, label: historyLabel, email: callerEmail, action: 'update', before, after: payload.content });
      return { ok: true, record: { ...existing, content: payload.content, updatedAt: now } };
    }

    const item = { id: randomUUID(), slug, content: payload.content ?? null, createdAt: now, updatedAt: now, __typename: TYPENAMES[model] };
    await ddb.send(new PutCommand({ TableName: tableName, Item: item }));
    await logHistory({ slug, label: historyLabel, email: callerEmail, action: 'create', before: null, after: payload.content });
    return { ok: true, record: item };
  }

  if (op === 'create') {
    const payload = (data as Record<string, unknown>) ?? {};
    const recordSlug = (payload.slug as string | undefined) ?? slug;
    if (!recordSlug) throw new Error('slug is required');
    const item = { id: randomUUID(), ...payload, slug: recordSlug, createdAt: now, updatedAt: now, __typename: TYPENAMES[model] };
    await ddb.send(new PutCommand({ TableName: tableName, Item: item }));
    await logHistory({ slug: recordSlug, label: historyLabel, email: callerEmail, action: 'create', before: null, after: payload });
    return { ok: true, record: item };
  }

  if (op === 'update') {
    if (!id) throw new Error('id is required');
    const payload = (data as Record<string, unknown>) ?? {};
    const existing = await ddb.send(new GetCommand({ TableName: tableName, Key: { id } }));
    if (!existing.Item) throw new Error('Record not found');

    const fields = Object.keys(payload);
    if (fields.length === 0) return { ok: true, record: existing.Item };

    const names: Record<string, string> = {};
    const values: Record<string, unknown> = { ':u': now };
    const sets = fields.map((f, i) => {
      const nk = `#f${i}`;
      const vk = `:v${i}`;
      names[nk] = f;
      values[vk] = payload[f];
      return `${nk} = ${vk}`;
    });

    await ddb.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression: `SET ${sets.join(', ')}, updatedAt = :u`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
      })
    );
    await logHistory({
      slug: (existing.Item.slug as string) ?? id,
      label: historyLabel,
      email: callerEmail,
      action: 'update',
      before: existing.Item,
      after: { ...existing.Item, ...payload },
    });
    return { ok: true, record: { ...existing.Item, ...payload, updatedAt: now } };
  }

  throw new Error(`Unknown op: ${op}`);
};
