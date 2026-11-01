import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { manageUsers } from '../functions/manage-users/resource';
import { managePermissions } from '../functions/manage-permissions/resource';
import { manageContent } from '../functions/manage-content/resource';

// Mirrors the original energydatasa app's content models. Public read (via
// API key, matching the old app's apiKey auth mode) is unrestricted, but
// writes are NOT open to every signed-in user any more - that used to be an
// intentional "wiki-style" choice, but it meant the Moderator/editablePages
// system (see AdminPermission below) only ever hid Edit buttons in the UI
// without enforcing anything server-side: any self-registered account could
// write to these models directly via the API. Writes now go only through
// the Admins group or the manageContent function below, which re-derives
// and enforces editablePages the same way managePermissions already does
// for AdminPermission itself.
const schema = a.schema({
  PageContent: a
    .model({
      slug: a.string().required(),
      content: a.string(),
    })
    .secondaryIndexes((index) => [index('slug').queryField('pageContentBySlug')])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.group('Admins').to(['read', 'create', 'update', 'delete']),
    ]),

  // Unused by any part of the app (the Eskom coal station pages store their
  // content as PageContent records instead, via EditableSections) - kept
  // only so existing data isn't orphaned, locked to read-only/Admins since
  // nothing should ever be writing to it.
  EskomCoalPowerStation: a
    .model({
      slug: a.string().required(),
      name: a.string().required(),
      generalIdentification: a.string(),
      plantConfiguration: a.string(),
      fuelSupply: a.string(),
      boilerTurbineGenerator: a.string(),
      performanceEfficiency: a.string(),
      environmentalEmissions: a.string(),
      reliabilityAvailability: a.string(),
      operationsMaintenance: a.string(),
      gridIntegration: a.string(),
      financialEconomic: a.string(),
      regulatoryPolicy: a.string(),
      futureOutlook: a.string(),
    })
    .secondaryIndexes((index) => [index('slug').queryField('eskomCoalPowerStationBySlug')])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.group('Admins').to(['read', 'create', 'update', 'delete']),
    ]),

  InsightArticle: a
    .model({
      slug: a.string().required(),
      title: a.string().required(),
      excerpt: a.string().required(),
      body: a.string().required(),
      publishedAt: a.date(),
      imageKey: a.string().required(),
    })
    .secondaryIndexes((index) => [index('slug').queryField('insightArticleBySlug')])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.group('Admins').to(['read', 'create', 'update', 'delete']),
    ]),

  AudienceProfile: a
    .model({
      slug: a.string().required(),
      title: a.string().required(),
      subtitle: a.string(),
      logo: a.string(),
      overview: a.string(),
      useCases: a.string(),
      datasets: a.string(),
      tools: a.string(),
      insights: a.string(),
      gettingStarted: a.string(),
    })
    .secondaryIndexes((index) => [index('slug').queryField('audienceProfileBySlug')])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.group('Admins').to(['read', 'create', 'update', 'delete']),
    ]),

  // Replaces the old app's __admin__.superAdmins / __permissions__.<email>
  // PageContent records. isAdmin is NOT a field here - it's real Cognito
  // group membership (checked via cognito:groups), which can't be granted
  // through a data write at all. This model only holds the fine-grained,
  // non-security-critical "which extra pages can this non-admin user edit"
  // grants, plus the isModerator flag (see managePermissions below). Nobody
  // - not even Admins - writes this model directly any more: every write
  // goes through the managePermissions function, which is the single place
  // that enforces who can change what. That keeps the enforcement logic in
  // one auditable spot instead of splitting it between schema rules and
  // whatever each caller happens to be.
  AdminPermission: a
    .model({
      email: a.string().required(),
      editablePages: a.string().array(),
      isModerator: a.boolean(),
    })
    .secondaryIndexes((index) => [index('email').queryField('adminPermissionByEmail')])
    .authorization((allow) => [
      allow.authenticated().to(['read']),
    ]),

  // Cognito user management (list / invite / delete / reset-password),
  // backed by the manage-users function. Restricted to the Admins group at
  // the AppSync layer - a non-admin's request is rejected before the
  // function ever runs. The function itself independently re-checks the
  // caller's group membership too (see its handler). This can never grant
  // Admin group membership to anyone - that stays a manual, out-of-band
  // Cognito action, same as everywhere else in this app.
  manageUsers: a
    .mutation()
    .arguments({
      action: a.string().required(), // "list" | "create" | "delete" | "setPassword"
      email: a.string(),
      newPassword: a.string(),
    })
    .returns(a.json())
    .handler(a.handler.function(manageUsers))
    .authorization((allow) => [allow.group('Admins')]),

  // Grants/edits/revokes AdminPermission records (page-editing access) and
  // toggles the isModerator flag. Unlike manageUsers, this mutation is open
  // to any authenticated caller at the schema layer - it HAS to be, since a
  // Moderator (by design) isn't in the Admins Cognito group and would be
  // rejected before the function ever ran if this were group-gated like
  // manageUsers is. The function itself is therefore the only enforcement
  // layer here, and it enforces a strict hierarchy:
  //   - Admins (real Cognito group membership): unrestricted.
  //   - Moderators (isModerator: true on their own AdminPermission record):
  //     can grant/edit/revoke editablePages for other non-admin,
  //     non-moderator users only - never for themselves, another moderator,
  //     or an admin, and the "setModerator" action is refused outright.
  //   - Everyone else: Forbidden.
  // The isModerator flag itself can ONLY ever be changed by an Admin - a
  // Moderator can never promote anyone (including themselves) to Moderator
  // or Admin through this or any other path, closing the exact hole that
  // made the original app's permission system self-escalatable.
  managePermissions: a
    .mutation()
    .arguments({
      action: a.string().required(), // "grant" | "setPages" | "revoke" | "setModerator"
      targetEmail: a.string().required(),
      editablePages: a.string().array(),
      isModerator: a.boolean(),
    })
    .returns(a.json())
    .handler(a.handler.function(managePermissions))
    .authorization((allow) => [allow.authenticated()]),

  // The sole write path for PageContent, InsightArticle and AudienceProfile
  // now that their schema auth above no longer grants authenticated-user
  // write access. Open to any authenticated caller at the schema layer for
  // the same reason managePermissions is - a Moderator or an editablePages
  // holder isn't in the Admins group - with the function itself re-deriving
  // and enforcing the caller's actual editablePages via AdminPermission
  // before touching anything. "revert" is Admin-only (see the function).
  manageContent: a
    .mutation()
    .arguments({
      model: a.string(), // "PageContent" | "InsightArticle" | "AudienceProfile"
      op: a.string().required(), // "upsert" | "create" | "update" | "delete" | "revert"
      pageKeys: a.string().array(), // editablePages keys that authorize this write (OR'd)
      id: a.string(),
      slug: a.string(),
      data: a.json(),
      historyLabel: a.string(),
    })
    .returns(a.json())
    .handler(a.handler.function(manageContent))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
