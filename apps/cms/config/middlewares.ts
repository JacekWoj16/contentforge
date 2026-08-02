import type { Core } from '@strapi/strapi';

const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:3000';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    /**
     * The preview feature renders the frontend inside an iframe in the admin
     * panel. Embedding has to be allowed on both sides: the frontend permits
     * it through frame-ancestors, and the CMS needs frame-src here, because
     * the default policy is default-src 'self' and would block the frame.
     */
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'frame-src': ["'self'", CLIENT_URL],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
