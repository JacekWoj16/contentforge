import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { metadataFromSeo } from "@/lib/seo";
import { breadcrumbSchema, serviceSchema } from "@/lib/structured-data";
import { getServiceBySlug, getServices } from "@/lib/strapi";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();

  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return metadataFromSeo(service.seo, service.title);
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const caseStudies = service.caseStudies ?? [];

  return (
    <article className="py-16">
      <JsonLd data={serviceSchema(service)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {service.title}
        </h1>

        {service.summary ? (
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            {service.summary}
          </p>
        ) : null}

        {/* The relation is bidirectional, so a service knows which projects
            used it without the editor maintaining a second list. */}
        {caseStudies.length > 0 ? (
          <section className="mt-14 border-t border-neutral-200 pt-10">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Where we have applied it
            </h2>

            <ul className="mt-8 space-y-8">
              {caseStudies.map((caseStudy) => (
                <li key={caseStudy.documentId}>
                  <h3 className="text-lg font-medium text-neutral-900">
                    <Link
                      href={`/work/${caseStudy.slug}`}
                      className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                      {caseStudy.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {caseStudy.client}
                  </p>
                  {caseStudy.results.length > 0 ? (
                    <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                      {caseStudy.results.map((result, index) => (
                        <div key={`${result.label}-${index}`}>
                          <dt className="text-sm text-neutral-500">
                            {result.label}
                          </dt>
                          <dd className="font-medium text-neutral-900">
                            {result.value}
                            {result.unit ? (
                              <span className="ml-0.5 text-neutral-500">
                                {result.unit}
                              </span>
                            ) : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
