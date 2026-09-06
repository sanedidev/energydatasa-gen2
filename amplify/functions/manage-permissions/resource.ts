import { defineFunction } from '@aws-amplify/backend';

// No static AWS credentials - runs under its own auto-managed execution
// role, granted the minimum DynamoDB actions on exactly the AdminPermission
// table plus one read-only Cognito action, both scoped to their specific
// resource ARNs in backend.ts. This is the ONLY place AdminPermission
// records are ever written (see amplify/data/resource.ts - the model's own
// schema auth allows nobody direct write access), and it's what makes the
// Moderator role possible without reintroducing the original app's
// self-escalatable permission system: the function enforces who can do what
// in code, in one place, rather than relying on a Cognito-group schema rule
// that a Moderator (not being an Admin) could never pass anyway.
export const managePermissions = defineFunction({
  name: 'manage-permissions',
  entry: './handler.ts',
  timeoutSeconds: 15,
  // Grouped into the data stack (not its own nested stack) because this
  // function is both a mutation handler for the data schema AND needs a
  // grant against a data-stack table resource in backend.ts - leaving it in
  // its own stack creates a circular dependency between the function stack
  // and the data stack. Living in the same stack as what it's bound to on
  // both sides removes the cycle.
  resourceGroupName: 'data',
});
