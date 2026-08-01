# ADR-004: Statically generate pages and invalidate by cache tag

- **Status:** accepted
- **Date:** 2026-07-31

## Context

The site is content-heavy and changes when an editor publishes, not when a
visitor arrives. The CMS runs on a free instance that sleeps after
inactivity.

## Decision

Render every page statically at build time through `generateStaticParams`,
with incremental revalidation on a one-hour window. Tag every CMS request
by entity and by slug, so a specific entry can be invalidated on demand.

## Consequences

Easy: visitors never wait on the CMS. A sleeping CMS costs the site nothing,
which is what makes free-tier hosting viable here.

Easy: tagging is already in place, so webhook-driven revalidation is a route
handler away rather than a refactor.

Hard: the build depends on the CMS being reachable. A sleeping instance can
push the first request past a timeout, which is why the build is not part of
CI.

Trade-off: until webhook revalidation is wired up, a published change can
take up to an hour to appear. For a marketing site that is acceptable; for a
newsroom it would not be.

## Alternatives considered

Server-side rendering every request: content is fresh immediately, and every
visitor pays for a round trip to a CMS that may be asleep. Wrong shape for a
site that changes a few times a week.

Full static export with a rebuild per publish: fastest possible pages, but a
deploy per typo fix, and no way to update a single entry.
