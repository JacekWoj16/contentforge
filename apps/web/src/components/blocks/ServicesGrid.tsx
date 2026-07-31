import Link from "next/link";

import type { ServicesGridBlock } from "@/types/cms";

export function ServicesGrid({ heading, intro, services }: ServicesGridBlock) {
  if (services.length === 0) {
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

        {intro ? (
          <p className="mt-3 max-w-2xl leading-relaxed text-neutral-600">
            {intro}
          </p>
        ) : null}

        <ul className="mt-10 grid gap-8 sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.documentId}>
              <h3 className="text-lg font-medium text-neutral-900">
                <Link
                  href={`/services/${service.slug}`}
                  className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                >
                  {service.title}
                </Link>
              </h3>
              {service.summary ? (
                <p className="mt-2 leading-relaxed text-neutral-600">
                  {service.summary}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
