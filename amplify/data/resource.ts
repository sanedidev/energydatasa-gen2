import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { manageUsers } from '../functions/manage-users/resource';

// Mirrors the original energydatasa app's content models. Public read (via
// API key, matching the old app's apiKey auth mode) + any signed-in user can
// write - that's an intentional, low-stakes "wiki-style" choice for ordinary
// CMS content, same as the original.
const schema = a.schema({
  PageContent: a
    .model({
      slug: a.string().required(),
      content: a.string(),
    })
    .secondaryIndexes((index) => [index('slug').queryField('pageContentBySlug')])
    .authorization((allow) => [
      allow.publicApiKey().to(['read']),
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

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
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
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
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
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
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
    ]),

  // Replaces the old app's __admin__.superAdmins / __permissions__.<email>
  // PageContent records. isAdmin is NOT a field here - it's real Cognito
  // group membership (checked via cognito:groups), which can't be granted
  // through a data write at all. This model only holds the fine-grained,
  // non-security-critical "which extra pages can this non-admin user edit"
  // grants, and only admins can write it - closing the hole where any
  // authenticated user could write these records directly.
  AdminPermission: a
    .model({
      email: a.string().required(),
      editablePages: a.string().array(),
    })
    .secondaryIndexes((index) => [index('email').queryField('adminPermissionByEmail')])
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.group('Admins').to(['create', 'update', 'delete']),
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
