import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { mediaUrl } from "@/lib/media";
import { metadataFromSeo } from "@/lib/seo";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/strapi";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();

  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  return metadataFromSeo(caseStudy.seo, caseStudy.title);
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-sm uppercase tracking-wide text-neutral-500">
          {caseStudy.client}
          {caseStudy.industry ? ` \u00b7 ${caseStudy.industry}` : ""}
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">
          {caseStudy.title}
        </h1>

        {caseStudy.coverImage ? (
          <Image
            src={mediaUrl(caseStudy.coverImage.url)}
            alt={caseStudy.coverImage.alternativeText ?? ""}
            width={caseStudy.coverImage.width}
            height={caseStudy.coverImage.height}
            priority
            className="mt-10 h-auto w-full rounded"
          />
        ) : null}

        {caseStudy.challenge ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              The challenge
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-700">
              {caseStudy.challenge}
            </p>
          </section>
        ) : null}

        {caseStudy.solution ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              What we did
            </h2>
            <p className="mt-4 leading-relaxed text-neutral-700">
              {caseStudy.solution}
            </p>
          </section>
        ) : null}

        {caseStudy.results.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Results
            </h2>
            <dl className="mt-6 grid gap-8 sm:grid-cols-3">
              {caseStudy.results.map((result, index) => (
                <div key={`${result.label}-${index}`}>
                  <dt className="text-sm text-neutral-600">{result.label}</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
                    {result.value}
                    {result.unit ? (
                      <span className="ml-1 text-xl font-normal text-neutral-500">
                        {result.unit}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {caseStudy.services && caseStudy.services.length > 0 ? (
          <section className="mt-12 border-t border-neutral-200 pt-8">
            <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              Services on this project
            </h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {caseStudy.services.map((service) => (
                <li key={service.documentId}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-neutral-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
