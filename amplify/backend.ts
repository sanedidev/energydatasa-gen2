import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { manageUsers } from './functions/manage-users/resource';
import { managePermissions } from './functions/manage-permissions/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  manageUsers,
  managePermissions,
});

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
