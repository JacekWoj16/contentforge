# ContentForge

[![CI](https://github.com/JacekWoj16/contentforge/actions/workflows/ci.yml/badge.svg)](https://github.com/JacekWoj16/contentforge/actions/workflows/ci.yml)

A headless CMS setup for **ContentForge Studio**, a fictional UX and
development agency. Strapi 5 holds the content and serves it over REST. A
Next.js 16 frontend renders it as a static site with incremental
revalidation.

**Live site:** https://contentforge-studio.vercel.app
**CMS admin:** https://contentforge-0rc3.onrender.com/admin

The agency is invented. The clients, case studies and metrics in the demo
content are invented too. The architecture is not.

---

## What this demonstrates

An editor composes a page from blocks in the CMS and publishes it. The page
exists on the site without a developer touching the code. That is the whole
point of the project, and everything below serves it.

| Concern | How it is handled |
| --- | --- |
| Content modelling | Reusable components, a Dynamic Zone for page layout, relations instead of duplicated data |
| Rendering | One block registry maps CMS component names to React components |
| Type safety | Hand-written types, a discriminated union on the block type, no `any` on CMS data |
| Performance | Static generation with ISR, per-block populate so responses carry only what is rendered |
| SEO | Metadata, sitemap and JSON-LD all generated from CMS content |
| Accessibility | Semantic landmarks, skip link, visible focus states, description lists for figures |
| Quality | Lint, typecheck and unit tests on every push and pull request |

---

## Running it locally

Requires Node 22 (see `.nvmrc`) and Docker.

The two applications run as separate processes, so this needs three
terminals. The root `package.json` holds no dependencies of its own — it
only forwards scripts — so there is nothing to install there.

**1. Clone and configure**

```bash
git clone https://github.com/JacekWoj16/contentforge.git
cd contentforge

cp .env.example .env                          # database, read by Docker
cp apps/cms/.env.example apps/cms/.env        # CMS secrets and database
cp apps/web/.env.example apps/web/.env.local  # CMS address for the frontend
```

The committed defaults work for local development. The CMS secrets in
`apps/cms/.env.example` are placeholders and must be replaced before the CMS
is deployed anywhere:

```bash
node -e "const c=require('crypto'),k=()=>c.randomBytes(16).toString('base64');console.log('APP_KEYS='+[k(),k(),k(),k()].join(','));for(const n of ['API_TOKEN_SALT','ADMIN_JWT_SECRET','TRANSFER_TOKEN_SALT','JWT_SECRET','ENCRYPTION_KEY'])console.log(n+'='+k())"
```

**2. Install and start the database**

```bash
docker compose up -d                # PostgreSQL 16 on host port 15432
npm install --prefix apps/cms
npm install --prefix apps/web
```

**3. Load the demo content**

The seed script boots its own Strapi instance, so the CMS must **not** be
running yet.

```bash
npm run seed
```

It is destructive by design: it clears the collections it owns before
writing, so running it twice produces the same result rather than
duplicates. Never point it at content you care about.

**4. Start the CMS** — in its own terminal, it stays in the foreground:

```bash
npm run dev:cms                     # http://localhost:1337
```

**5. Open the admin panel and grant public access**

Go to http://localhost:1337/admin and create the first administrator. This
account is local to your database; nothing is registered anywhere.

Then go to **Settings → Users & Permissions → Roles → Public** and enable
`find` and `findOne` for Article, Author, Case-study, Page and Service, and
`find` for Global. Save.

This step is not optional. Strapi denies public access to every content type
until it is granted, and the frontend will fail with a 403 without it. It
cannot be seeded, because the permission records belong to the Strapi
instance rather than to the content.

**6. Start the frontend** — in a third terminal:

```bash
npm run dev:web                     # http://localhost:3000
```

To confirm the CMS is answering before starting the frontend:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:1337/api/pages
```

`200` means ready. `403` means step 5 was skipped.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev:cms` | Strapi in watch mode |
| `npm run dev:web` | Next.js in dev mode |
| `npm run seed` | Reset and reload the demo content, with the CMS stopped |
| `npm run build:web` | Production build of the frontend |
| `npm run lint:web` | ESLint |
| `npm run typecheck:web` | `tsc --noEmit` |
| `npm run test:web` | Vitest |

---

## Content model

Everything an editor touches lives in the CMS. Nothing on the site is
hardcoded copy.

### Components

Components are reusable field groups. Strapi stores them separately from
content types, under `apps/cms/src/components/`.

| Component | Fields | Used by |
| --- | --- | --- |
| `shared.seo` | metaTitle (max 60), metaDescription (max 160), ogImage, noIndex | Page, Article, Service, CaseStudy, Global |
| `shared.link` | label, href, isExternal | navigation, hero, CTA banner, social links |
| `shared.metric` | label, value, unit | stats block, case study results |

The length limits on `shared.seo` are not decoration. They stop an editor
from writing a title that a search result will truncate.

`shared.metric.value` is a string, not a number, so an editor can write
`+34`, `2.5x` or `<1s`. A numeric field would need a second field for the
format and would gain nothing.

### Blocks

Blocks are the components a `Page` can be built from. The Dynamic Zone
accepts these, in the order they appear in the editor's menu.

| Block | Fields |
| --- | --- |
| `blocks.hero` | heading, subheading, image, cta |
| `blocks.rich-text` | body (Blocks editor) |
| `blocks.services-grid` | heading, intro, services (relation) |
| `blocks.stats` | heading, metrics (repeatable) |
| `blocks.case-study-list` | heading, caseStudies (relation) |
| `blocks.cta-banner` | heading, text, cta |

`services-grid` and `case-study-list` hold **relations**, not copies. An
editor picks existing entries instead of retyping their titles, so service
and case study data has a single owner.

### Content types

| Type | Kind | Notes |
| --- | --- | --- |
| `Page` | collection | `blocks` is a Dynamic Zone; any page an editor creates becomes a route |
| `Article` | collection | Blocks rich text body, author relation |
| `CaseStudy` | collection | Repeatable metrics, many-to-many with Service |
| `Service` | collection | Reverse side of the CaseStudy relation |
| `Author` | collection | Referenced by articles |
| `Global` | **single type** | Navigation, footer, social links, default SEO |

`Global` is a single type because there is exactly one navigation and one
footer. Strapi has a separate kind for this, and using a collection here
would let an editor create a second one.

The `CaseStudy` to `Service` relation is bidirectional, so a service page
lists the projects that used it without an editor maintaining that list a
second time.

---

## How the frontend consumes it

### One registry, not one template per page

`apps/web/src/components/blocks/index.tsx` maps each Dynamic Zone component
name to a React component. Adding a block to the site means adding one file
and one entry. Page templates do not change.

An unregistered block renders nothing rather than crashing the page,
because an editor can publish a block before the frontend implements it.

### Types as a contract

`apps/web/src/types/cms.ts` is written by hand rather than generated. The
frontend only needs the fields it renders, and an explicit contract makes it
obvious when the content model and the UI drift apart.

`Block` is a discriminated union on `__component`. That is what lets each
block component receive exactly its own props without a cast, and it turns a
model change into a compile error rather than a runtime surprise.

Fields marked optional in the types are populated only by detail queries. A
list query deliberately leaves them out, and the type says so.

### A thin client, not an SDK

`apps/web/src/lib/strapi.ts` is a typed `fetch` wrapper. No CMS SDK, so the
shape of every response stays visible in the codebase.

Strapi returns no relations, components or media unless the request asks for
them. Each query declares what it needs, per block type rather than with a
wildcard, so a page request carries only the fields its blocks render.

Every request carries cache tags. A one-hour window is the fallback; in
practice a CMS webhook expires the affected tags the moment an editor
publishes, so a change appears in seconds. `POST /api/revalidate` maps the
Strapi event to its tags and authenticates with a shared secret.

### Routing

| Route | Source |
| --- | --- |
| `/` | the CMS page with slug `home` |
| `/[slug]` | any other CMS page |
| `/journal`, `/journal/[slug]` | articles |
| `/work/[slug]` | case studies |
| `/services/[slug]` | services |

`/[slug]` is what makes the demo worth looking at: publishing a page in the
CMS creates a route. Slugs are collected at build time and prerendered;
pages added later render on first request.

Static segments win over dynamic ones in Next.js, so `/journal` is served by
its own file even if a CMS page shares that slug.

---

### Previewing drafts

An editor opens a draft from the admin panel and sees it rendered as a page,
in an iframe, next to the form they are editing. The CMS builds a signed URL
per entry; `/api/preview` checks the secret, turns on Next.js draft mode and
redirects. From then on the CMS client asks Strapi for drafts and bypasses
the cache, because a preview served from cache would show the version the
editor just replaced.

Draft mode is a cookie, so it follows the editor around the site until they
visit `/api/preview/disable`. That endpoint exists precisely so an editor
does not keep reviewing drafts while believing they are looking at the live
site.

---

## SEO

- **Metadata** comes from the `shared.seo` component, with the site name and
  default description from `Global` as the fallback. CMS titles are marked
  absolute, which bypasses the layout template, because an editor writes the
  full title.
- **`sitemap.xml`** is generated from CMS content, not from a hardcoded
  list, and carries the CMS `updatedAt` as `lastModified`.
- **`robots.txt`** points at the sitemap.
- **JSON-LD** is server-rendered into the initial HTML. `Organization` is
  emitted once in the layout and referenced by `@id` everywhere else, so an
  editor changing the site description updates every page that cites it.
  Articles add `BlogPosting`, case studies `Article`, services `Service`,
  and detail pages add `BreadcrumbList`.

Social links from the CMS become `sameAs`, which is how a crawler ties the
entity to its profiles elsewhere.

---

## Accessibility

What is in place:

- A skip link, visually hidden until focused, as the first element in the body
- Landmark elements: `header`, `nav` with a label, `main`, `footer`
- One `h1` per page, headings in order below it
- Metrics as description lists, so each number stays associated with its label
- Visible focus rings on every interactive element
- `alt` text sourced from the CMS `alternativeText` field

What is not: this has not been through a formal WCAG 2.2 AA audit. The list
above is a baseline, not a compliance claim.

---

## Testing and CI

Vitest covers the helpers that hold real branching: the metadata builder,
the media URL resolver, and the structured data builders. Presentational
components are not unit tested, which is a deliberate limit rather than an
oversight — asserting on markup that has no logic in it produces tests that
break on every style change and catch nothing.

GitHub Actions runs lint, typecheck and tests on every push and pull
request, as two jobs with separate dependency caches, matching the way the
repository treats the two applications.

**The frontend build is deliberately not in CI.** `next build` fetches
content over the network, and the CMS runs on a free instance that sleeps
after inactivity. Including the build would produce red runs caused by
hosting rather than by code. The deployment platform builds on every push,
so the build is still verified — just not twice.

---

## Deployment

| Part | Where | Notes |
| --- | --- | --- |
| Frontend | Vercel | Root directory `apps/web` |
| CMS | Render | Root directory `apps/cms`, free instance |
| Database | Render PostgreSQL | Free instance |

The site is fully static. Every page is rendered to HTML at build time and
served from the CDN, so a visitor never reaches the CMS at all. The CMS is
needed at build time, when an editor logs in, and when a webhook fires.

This is what makes free-tier hosting a reasonable choice rather than a
compromise: if the CMS sleeps, or goes away entirely, the site keeps
serving. Only publishing and rebuilding stop working. Under server-side
rendering the same sleeping instance would mean a minute of waiting for
every visitor, and the free tier would be unusable.

Known limits of this free setup, listed because they are real:

- The CMS instance sleeps after inactivity. The first admin login can take
  around a minute.
- The free database expires 30 days after creation. When it goes, the schema
  redeploys from the repository and `npm run seed` restores the content.
- There is no persistent disk, so media uploaded through the panel does not
  survive a redeploy. The demo content uses no uploads.

None of these would apply to a paid instance. They are consequences of the
hosting tier, not of the architecture.

---

## Portability to Storyblok and Contentful

Strapi was chosen to learn a self-hosted Node CMS end to end. The content
model maps onto the SaaS platforms without a redesign:

| This project | Storyblok | Contentful |
| --- | --- | --- |
| Dynamic Zone of blocks | Blocks field | References to entries, or the rich text embedded entry |
| Component (`shared.seo`) | Nestable blok | Content type referenced from others |
| Blocks rich text | Richtext field | Rich Text field |
| `documentId` | `uuid` | `sys.id` |
| Webhook to on-demand revalidation | Webhook, or Pipelines | Webhook |
| Draft and Publish | Draft and Published versions | Preview and Delivery APIs |

The parts that would need real work are the ones the platforms do
differently rather than better: Storyblok's Visual Editor expects the
frontend to expose a bridge, and Contentful's Content Delivery and Preview
APIs are separate endpoints with separate tokens, which changes the client
rather than the model.

The registry pattern survives either move: only the discriminator key
changes, from `__component` to Storyblok's `component` or Contentful's
`sys.contentType.sys.id`. The query layer in `lib/strapi.ts` would be
rewritten, and the response types would need the identifier fields renamed.
The block components themselves would not be touched.

---

## What this project deliberately does not do

- **No CMS SDK.** A thin fetch client keeps the API contract visible.
- **No workspace tool.** Two npm projects sharing an HTTP contract do not
  need pnpm workspaces or Turborepo. See ADR-002.
- **No i18n.** The model would take it — a locale field and a translation
  strategy per type — but implementing it would repeat work rather than
  demonstrate anything new here.
- **No end-to-end tests.** With a small budget, unit tests on the logic and
  a build check on every deploy catch more per hour spent.
- **No payment integration.** A UX agency does not sell through a checkout,
  and an integration for its own sake would be noise.
- **No design system.** Tailwind and a handful of components. The project is
  about the content pipeline, not about the visual layer.

---

## Notes on Strapi

Things that cost time and are not obvious from the documentation:

- **Content types are created in the admin UI.** Strapi writes them to
  `schema.json` files, which are committed like any other source. The UI is
  the source of truth and the files are the artifact — the opposite of
  Payload CMS, where the config file *is* the schema.
- **`repeatable` cannot be toggled after a component field is created.** The
  UI offers no way back; the field has to be deleted and recreated. Where
  this project corrects such a field, the change is applied to the schema
  file directly, which is a deliberate exception to the rule above.
- **Strapi ignores unknown keys on write but rejects them on read.** A field
  name that does not match the schema fails silently when seeding and
  returns a 400 when queried. The seed script is therefore also an
  integrity check on the model.
- **`documentId` is the public identifier**, not the numeric `id`.
  Publishing creates new rows, so `id` changes while `documentId` stays put.
- **Relation field names are derived from the plural API ID** of the target
  type, which mixes naming conventions into the API contract. This project
  renames them.
- **A new content type is not publicly readable** until `find` and `findOne`
  are enabled for the Public role.

---

## Architecture decisions

Longer decisions, including the alternatives that lost, are recorded in
[`docs/adr/`](docs/adr/).
