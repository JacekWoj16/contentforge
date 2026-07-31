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
  {
    title: 'Web Design',
    slug: 'web-design',
    summary:
      'Interface design grounded in usability testing, not house style — every screen is validated with real users before it ships.',
    icon: 'layout',
    seo: {
      metaTitle: 'Web Design | ContentForge Studio',
      metaDescription:
        'Interface design validated with real users, not house style, before a single screen ships.',
      noIndex: false,
    },
  },
  {
    title: 'Frontend Development',
    slug: 'frontend-development',
    summary:
      'Production builds of the interfaces we design, with performance and accessibility budgets enforced from the first commit.',
    icon: 'code',
    seo: {
      metaTitle: 'Frontend Development | ContentForge Studio',
      metaDescription:
        'Production builds with performance and accessibility budgets enforced from the first commit.',
      noIndex: false,
    },
  },
  {
    title: 'SEO & Performance',
    slug: 'seo-and-performance',
    summary:
      'Technical SEO and load-time work aimed at the metrics that move rankings and conversion, not vanity scores.',
    icon: 'trending-up',
    seo: {
      metaTitle: 'SEO & Performance | ContentForge Studio',
      metaDescription:
        'Technical SEO and load-time work aimed at the metrics that move rankings and conversions.',
      noIndex: false,
    },
  },
];

const authors = [
  {
    name: 'Maya Lindqvist',
    role: 'Lead UX Researcher',
    bio: 'Maya runs the research practice at ContentForge Studio and has spent ten years turning user interviews into product decisions.',
  },
  {
    name: 'Dennis Okafor',
    role: 'Frontend Lead',
    bio: 'Dennis leads frontend delivery at ContentForge Studio, after five years building and tuning storefronts for mid-size e-commerce platforms.',
  },
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
  {
    title: 'Why a good Lighthouse score can still feel slow',
    slug: 'why-a-good-lighthouse-score-can-still-feel-slow',
    excerpt:
      'Performance scores measure a lab run on a clean connection. Users feel something else: whether the page responds when they touch it.',
    authorName: 'Dennis Okafor',
    body: [
      p(
        'A team came to us with a Lighthouse score of 96 and a bounce rate that refused to move. The lab test and the real page had stopped agreeing with each other.',
      ),
      h(2, 'Field data over lab data'),
      p(
        'Lighthouse runs once, on a fast connection, with no user in the loop. We pulled Core Web Vitals from real sessions instead and found the gap immediately: Interaction to Next Paint spiked every time the mobile nav opened, because it re-rendered the entire product grid sitting behind it.',
      ),
      ul(
        'Lab score: 96',
        'Real-user INP on mobile: 340ms, past the "needs improvement" threshold',
        'Cause: one event listener re-rendering unrelated components',
      ),
      h(2, 'Fixing the actual bottleneck'),
      p(
        'Isolating the nav state cut INP to 90ms without touching anything Lighthouse already scored well. The lab number moved by a single point; the field number is what changed the bounce rate.',
      ),
      p(
        'The lesson generalizes past this one client. Lab tools measure a page loading with nothing else running: no held-open connections, no low-end CPU, no user mid-scroll when the JavaScript arrives. They are useful for catching regressions before release, but they cannot tell you what a real interaction costs on the hardware your users actually carry.',
      ),
      p(
        'We now treat Lighthouse as a floor, not a target. Every engagement that touches performance ships with a field dashboard first, so the team is optimizing for what visitors experience rather than for a number that happens to be easy to screenshot.',
      ),
    ],
    seo: {
      metaTitle: 'Why a good Lighthouse score can still feel slow',
      metaDescription:
        'Lab scores and real-user performance can disagree. Here is how we found the gap on a 96-scoring site.',
      noIndex: false,
    },
  },
  {
    title: "What card sorting told us that stakeholder opinions didn't",
    slug: 'what-card-sorting-told-us-that-stakeholder-opinions-didnt',
    excerpt:
      'Everyone in the room had agreed on the new navigation. The users we tested it on had not, and that disagreement was the useful part.',
    authorName: 'Maya Lindqvist',
    body: [
      p(
        'A navigation redesign had already been agreed in three internal meetings before anyone asked a user to find something in it.',
      ),
      h(2, 'The plan looked obvious from inside'),
      p(
        'Grouping products by department made sense to the merchandising team, because that is how the company is organized. It made no sense to shoppers, who think in terms of what a product is for, not who owns its budget line.',
      ),
      h(2, 'What the sort revealed'),
      ul(
        '22 participants, open card sort, no prompted categories',
        'Only 3 of 22 grouped items the way the proposed navigation did',
        'A different grouping, by use case, appeared in 17 of 22 sorts',
      ),
      p(
        'We rebuilt the navigation around the use-case grouping instead of the org chart. Task success in the follow-up usability test went from 61% to 89%, and nobody in the room needed convincing twice.',
      ),
      h(2, 'Why the meetings got it wrong'),
      p(
        'Nobody in those three meetings was being careless. Everyone in the room reasoned from the org chart because that is the structure they see every day: the categories on their own dashboards, in their own reporting lines. Shoppers have never seen that chart and have no reason to organize their thinking around it.',
      ),
      p(
        'That is the real value of a card sort: it is not a nicer way to vote on an already-agreed idea, it is a way to find out what structure exists in someone else\'s head before you build a navigation around your own.',
      ),
    ],
    seo: {
      metaTitle: "What card sorting told us that opinions didn't",
      metaDescription:
        'A navigation everyone agreed on failed an open card sort. Task success rose from 61% to 89% after we rebuilt it.',
      noIndex: false,
    },
  },
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
  {
    title: 'Rebuilding a SaaS trial flow that converted at 4%',
    slug: 'saas-trial-flow-rebuild',
    client: 'Fenwick Ledger',
    industry: 'B2B SaaS',
    challenge:
      'Trial signups were healthy but only 4% of trial users reached their first saved report, the point at which the product usually earns a paid conversion.',
    solution:
      'We shadowed twelve onboarding sessions and found the setup wizard asked for company data before showing any value. We moved the first report ahead of the wizard and cut the wizard itself from nine fields to three.',
    results: [
      { label: 'Trial-to-first-report rate', value: '+51', unit: '%' },
      { label: 'Time to first report', value: '-6:20', unit: 'min' },
      { label: 'Trial-to-paid conversion', value: '+12', unit: '%' },
    ],
    serviceSlugs: ['ux-audit', 'frontend-development'],
    seo: {
      metaTitle: 'Fenwick Ledger onboarding rebuild | ContentForge Studio',
      metaDescription:
        'Moving the first report ahead of setup lifted a SaaS trial-to-paid conversion rate by 12 percent.',
      noIndex: false,
    },
  },
  {
    title: 'Recovering organic traffic after a botched CMS migration',
    slug: 'media-site-seo-recovery',
    client: 'Harrow & Vine Journal',
    industry: 'Digital publishing',
    challenge:
      'A platform migration eight months earlier had quietly stripped canonical tags and slowed article pages, and organic traffic had been sliding since without anyone identifying the cause.',
    solution:
      'A full-site crawl turned up 14,000 pages missing canonical tags and a median Largest Contentful Paint of 4.1 seconds on article pages. We restored canonicalization, deferred ad scripts until after content, and rebuilt the image pipeline to serve responsive sizes.',
    results: [
      { label: 'Organic sessions', value: '+68', unit: '%' },
      { label: 'Article LCP', value: '-2.3', unit: 's' },
      { label: 'Pages with valid canonical tags', value: '+14,000', unit: 'pages' },
    ],
    serviceSlugs: ['seo-and-performance'],
    seo: {
      metaTitle: 'Harrow & Vine Journal SEO recovery | ContentForge Studio',
      metaDescription:
        'Fixing canonical tags and article page speed reversed an eight-month organic traffic decline.',
      noIndex: false,
    },
  },
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
  {
    title: 'About',
    slug: 'about',
    blocks: [
      {
        __component: 'blocks.hero',
        heading: 'A studio built around evidence, not opinions',
        subheading:
          'Founded in 2016, ContentForge Studio pairs UX research with design and engineering so recommendations arrive already tested.',
        cta: { label: 'Start a project', href: '/contact', isExternal: false },
      },
      {
        __component: 'blocks.rich-text',
        body: [
          h(2, 'How we work'),
          p(
            'Every engagement starts with research, not a mood board. We watch people use the product before we suggest anything should change.',
          ),
          h(2, 'Design and build under one roof'),
          p(
            'Recommendations that stop at a slide deck rarely survive contact with a sprint backlog. Our designers and engineers work from the same research, so what ships matches what was tested.',
          ),
          h(2, 'What we measure'),
          p(
            'An engagement is finished once we can point to a number that moved: completion rate, load time, support tickets, revenue. Anything else is opinion.',
          ),
        ],
      },
      {
        __component: 'blocks.stats',
        heading: 'Since 2016',
        metrics: [
          { label: 'Engagements delivered', value: '140', unit: '+' },
          { label: 'Median lift in the primary metric', value: '32', unit: '%' },
          { label: 'Client retention past year one', value: '78', unit: '%' },
        ],
      },
    ],
    seo: {
      metaTitle: 'About | ContentForge Studio',
      metaDescription:
        'A UX studio that pairs research with design and engineering, and measures whether changes worked.',
      noIndex: false,
    },
  },
  {
    title: 'Services',
    slug: 'services',
    blocks: [
      {
        __component: 'blocks.hero',
        heading: 'Four practices, one accountable team',
        subheading:
          'Audit, design, build and optimize — as a single engagement or as focused, standalone work.',
        cta: { label: 'Start a project', href: '/contact', isExternal: false },
      },
      {
        __component: 'blocks.services-grid',
        heading: 'What we do',
        intro: 'Pick one practice or combine all four across a single engagement.',
        serviceSlugs: ['ux-audit', 'web-design', 'frontend-development', 'seo-and-performance'],
      },
    ],
    seo: {
      metaTitle: 'Services | ContentForge Studio',
      metaDescription:
        'UX audits, web design, frontend development and SEO & performance, delivered by one accountable team.',
      noIndex: false,
    },
  },
  {
    title: 'Work',
    slug: 'work',
    blocks: [
      {
        __component: 'blocks.hero',
        heading: 'Work that moved a number, not just a mood',
        subheading:
          'Case studies from retail, SaaS and publishing, each with a measurable before-and-after.',
        cta: { label: 'Discuss a project', href: '/contact', isExternal: false },
      },
      {
        __component: 'blocks.case-study-list',
        heading: 'Case studies',
        caseStudySlugs: [
          'specialist-retailer-checkout',
          'saas-trial-flow-rebuild',
          'media-site-seo-recovery',
        ],
      },
    ],
    seo: {
      metaTitle: 'Our Work | ContentForge Studio',
      metaDescription:
        'Case studies from retail, SaaS and publishing, each with a measurable before-and-after result.',
      noIndex: false,
    },
  },
  {
    title: 'Contact',
    slug: 'contact',
    blocks: [
      {
        __component: 'blocks.hero',
        heading: "Let's talk about where it hurts",
        subheading:
          'Tell us what is not working. We will tell you honestly whether we can help before we ask for a contract.',
        cta: { label: 'Email us', href: 'mailto:hello@contentforge.studio', isExternal: true },
      },
      {
        __component: 'blocks.rich-text',
        body: [
          h(2, 'What the first call looks like'),
          p(
            'Thirty minutes, no slides. Bring the problem as you see it today: a metric that dropped, a support queue that keeps filling up, a launch that underperformed. We ask questions until we understand what you have already tried and why it did not stick.',
          ),
          h(2, 'What you get afterward'),
          p(
            'Within two business days we send a short written note: what we think is going on, whether it needs research or can be fixed directly, and a rough estimate of scope. If the answer is "you do not need us for this," we say that too.',
          ),
        ],
      },
      {
        __component: 'blocks.cta-banner',
        heading: 'Ready when you are',
        text: 'No discovery workshop required to have the first conversation.',
        cta: { label: 'Get in touch', href: 'mailto:hello@contentforge.studio', isExternal: true },
      },
    ],
    seo: {
      metaTitle: 'Contact | ContentForge Studio',
      metaDescription:
        'Start with a thirty-minute call. We tell you honestly whether we can help before we send a contract.',
      noIndex: false,
    },
  },
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
