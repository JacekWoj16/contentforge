import Link from "next/link";

import type { CaseStudyListBlock } from "@/types/cms";

export function CaseStudyList({ heading, caseStudies }: CaseStudyListBlock) {
  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-neutral-200 py-16">
      <div className="mx-auto max-w-4xl px-6">
        {heading ? (
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {heading}
          </h2>
        ) : null}

        <ul className="mt-10 space-y-10">
          {caseStudies.map((caseStudy) => (
            <li key={caseStudy.documentId}>
              <article>
                <p className="text-sm uppercase tracking-wide text-neutral-500">
                  {caseStudy.client}
                  {caseStudy.industry ? ` \u00b7 ${caseStudy.industry}` : ""}
                </p>

                <h3 className="mt-2 text-xl font-medium text-neutral-900">
                  <Link
                    href={`/work/${caseStudy.slug}`}
                    className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                  >
                    {caseStudy.title}
                  </Link>
                </h3>

                {caseStudy.challenge ? (
                  <p className="mt-3 max-w-2xl leading-relaxed text-neutral-600">
                    {caseStudy.challenge}
                  </p>
                ) : null}

                {caseStudy.results.length > 0 ? (
                  <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                    {caseStudy.results.map((result, index) => (
                      <div key={`${result.label}-${index}`}>
                        <dt className="text-sm text-neutral-500">
                          {result.label}
                        </dt>
                        <dd className="text-lg font-medium text-neutral-900">
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
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
