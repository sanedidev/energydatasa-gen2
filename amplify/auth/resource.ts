import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  // "Admins" is enforced natively by AppSync (@auth allow.group rules check
  // this at the API layer) - unlike the original app, admin status can never
  // be self-granted through a data write, since group membership isn't a
  // record in the data model at all.
  groups: ['Admins'],
});
