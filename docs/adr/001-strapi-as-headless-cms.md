# ADR-001: Strapi 5 as the headless CMS

- **Status:** accepted
- **Date:** 2026-07-30

## Context

This project is a portfolio demo. It has two goals: show an end-to-end
headless setup, and let me work with a Node-based CMS I had not used before.
My previous commercial headless work used Payload CMS embedded in Next.js
and WordPress in headless mode behind a custom REST API.

## Decision

Use Strapi 5 as a standalone CMS service, with PostgreSQL, consumed by a
separate Next.js frontend over REST.

## Consequences

Easy: a clear service boundary. The frontend only knows the API contract,
so the CMS can be replaced without touching the rendering layer.

Hard: content types are created in the admin UI, and Strapi writes them to
`schema.json` files. The code is an artifact of the UI, not the source of
truth. This differs from Payload, where the config file *is* the schema.
Schema changes therefore need care in review, and the files must be
committed like any other source.

Trade-off: Strapi has no visual editor comparable to Storyblok. The README
documents how this content model maps onto Storyblok and Contentful
instead.

## Alternatives considered

Storyblok: closest match to a SaaS-first workflow, but the modelling work
would repeat what I already do with Payload, and it would not exercise the
container and deployment side of the stack.

Contentful: same reasoning, with a more restrictive free tier.
