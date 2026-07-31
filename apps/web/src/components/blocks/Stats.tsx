import type { StatsBlock } from "@/types/cms";

export function Stats({ heading, metrics }: StatsBlock) {
  if (metrics.length === 0) {
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

        {/* A description list keeps each label associated with its number for
            assistive technology, which a grid of divs would not. */}
        <dl className="mt-10 grid gap-8 sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div key={`${metric.label}-${index}`}>
              <dt className="text-sm text-neutral-600">{metric.label}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
                {metric.value}
                {metric.unit ? (
                  <span className="ml-1 text-xl font-normal text-neutral-500">
                    {metric.unit}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
