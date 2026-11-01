import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { manageUsers } from './functions/manage-users/resource';
import { managePermissions } from './functions/manage-permissions/resource';
import { manageContent } from './functions/manage-content/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  manageUsers,
  managePermissions,
  manageContent,
});

// Self-registration is disabled account-wide: the only way to create a new
// user is through the manageUsers function (Admins group only), never the
// public SignUp API. This isn't just a UI choice - AllowAdminCreateUserOnly
// makes Cognito itself reject a direct SignUp API call, so removing the
// signup page's UI/link alone wouldn't have been enough (the public app
// client ID isn't a secret - it ships in the site's own JS bundle).
// addPropertyOverride (not a plain property assignment) because Amplify's
// own auth construct sets AdminCreateUserConfig internally too (for the
// admin-invite email template) - a plain assignment here got silently
// clobbered by that internal logic in testing. addPropertyOverride patches
// the final synthesized template directly, so it always wins.
backend.auth.resources.cfnResources.cfnUserPool.addPropertyOverride(
  'AdminCreateUserConfig.AllowAdminCreateUserOnly',
  true
);

// Least-privilege: only the specific Cognito admin actions this function
// actually uses, scoped to this one user pool's ARN - never a wildcard
// resource or broader account access. No static credentials involved at
// all; this grants the function's own auto-managed execution role, which
// Lambda assumes at runtime.
const userPool = backend.auth.resources.userPool;
backend.manageUsers.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: [
      'cognito-idp:ListUsers',
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminDeleteUser',
      'cognito-idp:AdminSetUserPassword',
      'cognito-idp:AdminListGroupsForUser',
    ],
    resources: [userPool.userPoolArn],
  })
);
backend.manageUsers.addEnvironment('USER_POOL_ID', userPool.userPoolId);

// managePermissions needs direct DynamoDB access to the AdminPermission
// table, since that model's own schema auth deliberately allows no one
// write access at all (see amplify/data/resource.ts) - this function is
// the sole door in. Scoped to exactly this one table (base + indexes),
// never a wildcard. It also needs the same read-only Cognito group lookup
// as manageUsers, to verify a Moderator's target isn't secretly an Admin.
const adminPermissionTable = backend.data.resources.tables['AdminPermission'];
backend.managePermissions.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:Scan', 'dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
    resources: [adminPermissionTable.tableArn, `${adminPermissionTable.tableArn}/index/*`],
  })
);
backend.managePermissions.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['cognito-idp:AdminListGroupsForUser'],
    resources: [userPool.userPoolArn],
  })
);
backend.managePermissions.addEnvironment('ADMIN_PERMISSION_TABLE_NAME', adminPermissionTable.tableName);
backend.managePermissions.addEnvironment('USER_POOL_ID', userPool.userPoolId);

// manageContent needs direct DynamoDB access to PageContent, InsightArticle
// and AudienceProfile, since those models' schema auth no longer grants
// authenticated-user write access (see amplify/data/resource.ts) - this
// function is the sole door in, the same pattern as managePermissions is for
// AdminPermission. It also needs read-only access to AdminPermission, to
// re-derive the caller's editablePages server-side rather than trusting
// whatever the client claims. Scoped to exactly these four tables (base +
// indexes), never a wildcard.
const pageContentTable = backend.data.resources.tables['PageContent'];
const insightArticleTable = backend.data.resources.tables['InsightArticle'];
const audienceProfileTable = backend.data.resources.tables['AudienceProfile'];
backend.manageContent.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem', 'dynamodb:Query'],
    resources: [
      pageContentTable.tableArn,
      `${pageContentTable.tableArn}/index/*`,
      insightArticleTable.tableArn,
      `${insightArticleTable.tableArn}/index/*`,
      audienceProfileTable.tableArn,
      `${audienceProfileTable.tableArn}/index/*`,
    ],
  })
);
backend.manageContent.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ['dynamodb:Scan'],
    resources: [adminPermissionTable.tableArn],
  })
);
backend.manageContent.addEnvironment('PAGE_CONTENT_TABLE_NAME', pageContentTable.tableName);
backend.manageContent.addEnvironment('INSIGHT_ARTICLE_TABLE_NAME', insightArticleTable.tableName);
backend.manageContent.addEnvironment('AUDIENCE_PROFILE_TABLE_NAME', audienceProfileTable.tableName);
backend.manageContent.addEnvironment('ADMIN_PERMISSION_TABLE_NAME', adminPermissionTable.tableName);
