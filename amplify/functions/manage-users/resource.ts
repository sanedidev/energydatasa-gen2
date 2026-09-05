import { defineFunction } from '@aws-amplify/backend';

// No static AWS credentials here or anywhere in this function - it runs
// under its own auto-managed execution role, which is granted the minimum
// Cognito admin actions (scoped to this one user pool's ARN) in backend.ts.
// Invocation is gated by the Admins-group @auth rule on the GraphQL
// mutation that calls it (see amplify/data/resource.ts), and the handler
// independently re-checks the caller's group membership as well.
export const manageUsers = defineFunction({
  name: 'manage-users',
  entry: './handler.ts',
  timeoutSeconds: 15,
});
