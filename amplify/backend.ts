import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { manageUsers } from './functions/manage-users/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  manageUsers,
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
