import { defineStorage } from '@aws-amplify/backend';

// Mirrors the original app's "insights/" media bucket: any visitor (even
// unauthenticated - content pages are public) can view images, but only
// the Admins group can upload/replace/delete them.
export const storage = defineStorage({
  name: 'energydatasaMedia',
  access: (allow) => ({
    'insights/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
      allow.groups(['Admins']).to(['read', 'write', 'delete']),
    ],
  }),
});
