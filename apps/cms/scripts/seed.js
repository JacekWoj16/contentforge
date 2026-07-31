'use strict';

/**
 * Seeds the CMS with demo content.
 *
 * The script boots Strapi in-process and writes through the Document
 * Service API rather than the public REST API, so it needs no API token
 * and can publish entries in the same call that creates them.
 *
 * It is destructive and idempotent: seeded collections are emptied first,
 * so running it twice leaves the same result rather than duplicates.
 *
 * Usage: npm run seed  (from the repository root)
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');
const data = require('./seed-data');

const UID = {
  service: 'api::service.service',
  author: 'api::author.author',
  article: 'api::article.article',
  caseStudy: 'api::case-study.case-study',
  page: 'api::page.page',
  global: 'api::global.global',
};

async function clearCollection(app, uid) {
  const documents = await app.documents(uid).findMany({
    fields: ['documentId'],
    status: 'draft',
    limit: 1000,
  });

  for (const document of documents) {
    await app.documents(uid).delete({ documentId: document.documentId });
  }

  return documents.length;
}

/**
 * Seed data refers to related entries by slug, because slugs are readable
 * and stable while documentIds only exist after creation. This swaps them
 * for the real identifiers.
 */
function resolveBlock(block, services, caseStudies) {
  const { serviceSlugs, caseStudySlugs, ...rest } = block;

  return {
    ...rest,
    ...(serviceSlugs && { services: serviceSlugs.map((slug) => services.get(slug)) }),
    ...(caseStudySlugs && {
      caseStudies: caseStudySlugs.map((slug) => caseStudies.get(slug)),
    }),
  };
}

async function seed() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  try {
    // Deleted in reverse dependency order, created in dependency order, so
    // a relation target always exists by the time something points at it.
    for (const uid of [UID.page, UID.caseStudy, UID.article, UID.author, UID.service]) {
      const removed = await clearCollection(app, uid);
      console.log(`cleared ${String(removed).padStart(3)} × ${uid}`);
    }

    const services = new Map();
    for (const service of data.services) {
      const created = await app.documents(UID.service).create({
        data: service,
        status: 'published',
      });
      services.set(service.slug, created.documentId);
    }

    const authors = new Map();
    for (const author of data.authors) {
      const created = await app.documents(UID.author).create({
        data: author,
        status: 'published',
      });
      authors.set(author.name, created.documentId);
    }

    const caseStudies = new Map();
    for (const { serviceSlugs, ...caseStudy } of data.caseStudies) {
      const created = await app.documents(UID.caseStudy).create({
        data: {
          ...caseStudy,
          services: serviceSlugs.map((slug) => services.get(slug)),
        },
        status: 'published',
      });
      caseStudies.set(caseStudy.slug, created.documentId);
    }

    for (const { authorName, ...article } of data.articles) {
      await app.documents(UID.article).create({
        data: { ...article, author: authors.get(authorName) },
        status: 'published',
      });
    }

    for (const { blocks, ...page } of data.pages) {
      await app.documents(UID.page).create({
        data: {
          ...page,
          blocks: blocks.map((block) => resolveBlock(block, services, caseStudies)),
        },
        status: 'published',
      });
    }

    // Global is a single type, so it is updated in place when it already
    // exists instead of being cleared and recreated.
    const existingGlobal = await app.documents(UID.global).findFirst({ status: 'draft' });
    if (existingGlobal) {
      await app.documents(UID.global).update({
        documentId: existingGlobal.documentId,
        data: data.global,
        status: 'published',
      });
    } else {
      await app.documents(UID.global).create({ data: data.global, status: 'published' });
    }

    console.log(
      `\nseeded ${data.services.length} services, ${data.authors.length} authors, ` +
        `${data.caseStudies.length} case studies, ${data.articles.length} articles, ` +
        `${data.pages.length} pages and the global settings`,
    );
  } finally {
    // Knex can reject in-flight pool acquisitions while shutting down,
    // which would fail the script after the content was already written.
    await app.destroy().catch(() => {});
  }
}

// Knex's connection pool rejects any in-flight acquisitions when it shuts
// down. Those promises have no owner, so the rejection cannot be caught at
// the call site, and Node treats unhandled rejections as fatal. Ignore that
// one specific rejection and let every other one fail the script.
process.on('unhandledRejection', (reason) => {
  if (reason instanceof Error && reason.message === 'aborted') {
    return;
  }
  console.error(reason);
  process.exit(1);
});

seed()
  .then(() => {
    // Knex's connection pool rejects in-flight acquisitions while it shuts
    // down. Nothing owns that promise, and Node treats unhandled rejections
    // as fatal, so the script would exit non-zero after the content was
    // already written. Exit explicitly once the work is done.
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
