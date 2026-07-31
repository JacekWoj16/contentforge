import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCaseStudyList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_case_study_lists';
  info: {
    displayName: 'case-study-list';
    icon: 'bulletList';
  };
  attributes: {
    caseStudies: Schema.Attribute.Relation<
      'oneToMany',
      'api::case-study.case-study'
    >;
    heading: Schema.Attribute.String;
  };
}

export interface BlocksCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_banners';
  info: {
    displayName: 'cta-banner';
    icon: 'landscape';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.Text;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'hero';
    icon: 'write';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subheading: Schema.Attribute.Text;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'rich-text';
    icon: 'code';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface BlocksServicesGrid extends Struct.ComponentSchema {
  collectionName: 'components_blocks_services_grids';
  info: {
    displayName: 'services-grid';
    icon: 'apps';
  };
  attributes: {
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
  };
}

export interface BlocksStats extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stats';
  info: {
    displayName: 'stats';
    icon: 'chartPie';
  };
  attributes: {
    heading: Schema.Attribute.String;
    metrics: Schema.Attribute.Component<'shared.metric', true>;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'book';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMetric extends Struct.ComponentSchema {
  collectionName: 'components_shared_metrics';
  info: {
    displayName: 'Metric';
    icon: 'chartCircle';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'Seo';
    icon: 'earth';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.case-study-list': BlocksCaseStudyList;
      'blocks.cta-banner': BlocksCtaBanner;
      'blocks.hero': BlocksHero;
      'blocks.rich-text': BlocksRichText;
      'blocks.services-grid': BlocksServicesGrid;
      'blocks.stats': BlocksStats;
      'shared.link': SharedLink;
      'shared.metric': SharedMetric;
      'shared.seo': SharedSeo;
    }
  }
}
