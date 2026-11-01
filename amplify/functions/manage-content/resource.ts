import { defineFunction } from '@aws-amplify/backend';

// No static AWS credentials - runs under its own auto-managed execution
// role, granted the minimum DynamoDB actions on exactly the PageContent,
// InsightArticle and AudienceProfile tables (plus read-only access to
// AdminPermission to re-derive the caller's editablePages), scoped to their
// specific resource ARNs in backend.ts.
//
// This is now the ONLY place those three models are ever written (see
// amplify/data/resource.ts - their schema auth no longer grants any
// authenticated-user write access). Before this function existed, any
// signed-in user - not just ones actually granted editablePages - could
// write to these models directly via the API, since the Moderator/
// editablePages system was only ever enforced in the UI (hiding Edit
// buttons), never at the schema layer. This function re-derives and
// enforces the same editablePages/isAdmin check server-side, closing that
// gap the same way manage-permissions already closed it for AdminPermission
// itself.
export const manageContent = defineFunction({
  name: 'manage-content',
  entry: './handler.ts',
  timeoutSeconds: 15,
  // Same reasoning as manage-permissions: grouped into the data stack
  // (not its own nested stack) because this function is both a mutation
  // handler for the data schema AND needs grants against data-stack table
  // resources in backend.ts - keeping it in its own stack would create a
  // circular dependency between the function stack and the data stack.
  resourceGroupName: 'data',
});
