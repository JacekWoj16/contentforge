import type { Core } from '@strapi/strapi';

/**
 * Maps a content type and entry to the path where the frontend renders it.
 *
 * Returning null means the type has no page of its own, so the admin panel
 * shows no preview button for it rather than a broken one.
 */
const previewPathname = (uid: string, document: { slug?: string }): string | null => {
  switch (uid) {
    case 'api::page.page':
      return document.slug === 'home' ? '/' : `/${document.slug}`;
    case 'api::article.article':
      return `/journal/${document.slug}`;
    case 'api::case-study.case-study':
      return `/work/${document.slug}`;
    case 'api::service.service':
      return `/services/${document.slug}`;
    default:
      return null;
  }
};

const config = ({ env }: Core.Config.Shared.ConfigParams) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  /**
   * Renders the frontend inside the admin panel, so an editor sees a draft
   * as a page rather than as a form. The handler hands Strapi a URL; the
   * frontend route behind it turns on draft mode and redirects to the entry.
   */
  preview: {
    enabled: env.bool('PREVIEW_ENABLED', false),
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://localhost:3000')],
      async handler(uid: string, { documentId, status }: { documentId: string; status: string }) {
        const document = await strapi.documents(uid as never).findOne({
          documentId,
          fields: ['slug'],
          status: status as 'draft' | 'published',
        });

        if (!document) {
          return null;
        }

        const pathname = previewPathname(uid, document as { slug?: string });

        if (!pathname) {
          return null;
        }

        const params = new URLSearchParams({
          secret: env('PREVIEW_SECRET', ''),
          pathname,
          status,
        });

        return `${env('CLIENT_URL', 'http://localhost:3000')}/api/preview?${params}`;
      },
    },
  },
});

export default config;
