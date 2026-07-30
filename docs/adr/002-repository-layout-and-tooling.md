# ADR-002: Two apps in one repository, no workspace tool

- **Status:** accepted
- **Date:** 2026-07-30

## Context

The repository holds two independent applications: a Strapi CMS and a
Next.js frontend. They share no code, only an HTTP contract.

## Decision

Keep `apps/cms` and `apps/web` as separate npm projects with their own
lockfiles. Run them from the root with `npm run <script> --prefix <dir>`.
Pin Node to the 20-22 range in `engines` and `.nvmrc`.

## Consequences

Easy: each app installs and builds in isolation. Vercel can build the
frontend without seeing the CMS. CI can cache the two dependency trees
separately.

Hard: no shared types package. The frontend defines its own types for the
API responses. With two apps and no shared code, that cost is small.

Trade-off: pnpm workspaces would deduplicate dependencies, but Strapi is
sensitive to hoisting. For a two-app repository the deduplication is not
worth the risk.

## Alternatives considered

pnpm workspaces or Turborepo: appropriate for shared packages and many
apps. Here it would add configuration without solving a problem this
repository has.
