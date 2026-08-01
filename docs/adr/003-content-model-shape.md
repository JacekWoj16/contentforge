# ADR-003: Compose pages from blocks, and reference entries rather than copy them

- **Status:** accepted
- **Date:** 2026-07-31

## Context

The site has five pages that share sections: a hero on most, a services
grid on two, a case study list on two, a call to action on three. It also
has three content types with their own detail pages.

A fixed template per page would have been faster to build. It would also
mean that adding a section, or reordering two, is a developer task.

## Decision

`Page` holds a Dynamic Zone of block components. The frontend maps each
component name to a React component in one registry.

Blocks that display other content types hold relations to them, not copies
of their fields. `services-grid` points at Service entries;
`case-study-list` points at CaseStudy entries.

Fields that repeat across types are extracted into shared components. `seo`
is used by five types.

## Consequences

Easy: an editor composes and reorders pages without a deploy. Adding a
block type is one component in the CMS and one file plus one registry entry
in the frontend.

Easy: a service title exists in one place. Changing it updates every block
that shows it.

Hard: a Dynamic Zone response is heterogeneous, so the query has to declare
what to populate per block type. A wildcard would over-fetch, and a missing
entry produces `undefined` where the type promises an array.

Trade-off: relations inside components are one-directional in Strapi, so
`services-grid` can point at a Service but a Service cannot see which
blocks reference it. Between two content types the relation can be
bidirectional, which is what lets a service page list its case studies.

## Alternatives considered

A fixed section list per page type: simpler queries and simpler types, but
every layout change becomes a deploy, which defeats the purpose of the
project.

Copying service titles into the block: removes the populate complexity and
creates two owners for the same string. Rejected on the first edit that
would have to happen twice.
