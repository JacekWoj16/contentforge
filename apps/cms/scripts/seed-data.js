'use strict';

/**
 * Demo content for the seed script.
 *
 * Related entries are referenced by slug or name. The seed script swaps
 * those for documentIds once the targets exist.
 */

// Helpers for the Blocks rich text format, which is structured JSON rather
// than markdown: every node has a type and a children array.
const p = (text) => ({ type: 'paragraph', children: [{ type: 'text', text }] });
const h = (level, text) => ({ type: 'heading', level, children: [{ type: 'text', text }] });
const ul = (...items) => ({
  type: 'list',
  format: 'unordered',
  children: items.map((text) => ({
    type: 'list-item',
    children: [{ type: 'text', text }],
  })),
});

const services = [
  {
    title: 'UX Audit',
    slug: 'ux-audit',
    summary:
      'A structured review of your product against usability heuristics, with findings ranked by impact and effort.',
    icon: 'search',
    seo: {
      metaTitle: 'UX Audit | ContentForge Studio',
      metaDescription:
        'A structured usability review of your product, with findings ranked by impact and effort.',
      noIndex: false,
    },
  },
  // TODO: web-design, frontend-development, seo-and-performance
];

const authors = [
  {
    name: 'Maya Lindqvist',
    role: 'Lead UX Researcher',
    bio: 'Maya runs the research practice at ContentForge Studio and has spent ten years turning user interviews into product decisions.',
  },
  // TODO: one more author
];

const articles = [
  {
    title: 'What a UX audit actually tells you',
    slug: 'what-a-ux-audit-actually-tells-you',
    excerpt:
      'An audit is not a list of complaints. It is a ranked map of where users lose momentum, and what it costs to fix each spot.',
    authorName: 'Maya Lindqvist',
    body: [
      p('Teams often ask for an audit expecting a verdict. What they need is a map.'),
      h(2, 'Findings without ranking are noise'),
      p(
        'A list of forty issues helps nobody. We score every finding on user impact and implementation effort, so the first sprint after the audit is obvious.',
      ),
      ul(
        'High impact, low effort: fix this week',
        'High impact, high effort: plan it properly',
        'Low impact: document it and move on',
      ),
      h(2, 'The report is the beginning'),
      p(
        'An audit that ends with a PDF has failed. We walk the team through the findings and stay available while the fixes ship.',
      ),
    ],
    seo: {
      metaTitle: 'What a UX audit actually tells you',
      metaDescription:
        'An audit is a ranked map of where users lose momentum, not a list of complaints.',
      noIndex: false,
    },
  },
  // TODO: two more articles, 150-250 words each
];

const caseStudies = [
  {
    title: 'Cutting checkout abandonment for a specialist retailer',
    slug: 'specialist-retailer-checkout',
    client: 'Nordwald Outfitters',
    industry: 'E-commerce',
    challenge:
      'Customers filled the cart and left at the shipping step. Analytics showed the drop but not the reason.',
    solution:
      'Session replays and eight moderated tests located the problem: shipping cost appeared only after address entry. We restructured the flow to show cost earlier and cut the form to the fields that were actually used.',
    results: [
      { label: 'Checkout completion', value: '+34', unit: '%' },
      { label: 'Time to purchase', value: '-1:40', unit: 'min' },
      { label: 'Support tickets about shipping', value: '-60', unit: '%' },
    ],
    serviceSlugs: ['ux-audit'],
    seo: {
      metaTitle: 'Nordwald Outfitters checkout redesign | ContentForge Studio',
      metaDescription:
        'How restructuring a shipping step lifted checkout completion by 34 percent.',
      noIndex: false,
    },
  },
  // TODO: two more case studies
];

const pages = [
  {
    title: 'Home',
    slug: 'home',
    blocks: [
      {
        __component: 'blocks.hero',
        heading: 'Research-led design for products people rely on',
        subheading:
          'We audit, design and build digital products, and we measure whether the changes worked.',
        cta: { label: 'See our work', href: '/work', isExternal: false },
      },
      {
        __component: 'blocks.services-grid',
        heading: 'What we do',
        intro: 'Four practices, usually combined on a single engagement.',
        serviceSlugs: ['ux-audit'],
      },
      {
        __component: 'blocks.case-study-list',
        heading: 'Recent work',
        caseStudySlugs: ['specialist-retailer-checkout'],
      },
      {
        __component: 'blocks.cta-banner',
        heading: 'Have a product that is harder to use than it should be?',
        text: 'Tell us where it hurts. The first conversation is free.',
        cta: { label: 'Get in touch', href: '/contact', isExternal: false },
      },
    ],
    seo: {
      metaTitle: 'ContentForge Studio | Research-led product design',
      metaDescription:
        'A UX and development studio that audits, designs and builds digital products, then measures the result.',
      noIndex: false,
    },
  },
  // TODO: an "about" page using hero, rich-text and stats
];

const global = {
  siteName: 'ContentForge Studio',
  navigation: [
    { label: 'Services', href: '/services', isExternal: false },
    { label: 'Work', href: '/work', isExternal: false },
    { label: 'Journal', href: '/journal', isExternal: false },
    { label: 'Contact', href: '/contact', isExternal: false },
  ],
  footerText: 'ContentForge Studio — a fictional agency built to demonstrate a headless CMS architecture.',
  defaultSeo: {
    metaTitle: 'ContentForge Studio',
    metaDescription:
      'A UX and development studio that audits, designs and builds digital products.',
    noIndex: false,
  },
};

module.exports = { services, authors, articles, caseStudies, pages, global };
