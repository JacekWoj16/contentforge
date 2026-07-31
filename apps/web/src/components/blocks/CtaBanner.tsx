import { SmartLink } from "@/components/SmartLink";
import type { CtaBannerBlock } from "@/types/cms";

export function CtaBanner({ heading, text, cta }: CtaBannerBlock) {
  return (
    <section className="bg-neutral-900 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {heading}
        </h2>

        {text ? (
          <p className="mt-3 leading-relaxed text-neutral-300">{text}</p>
        ) : null}

        <SmartLink
          href={cta.href}
          isExternal={cta.isExternal}
          className="mt-8 inline-block rounded bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {cta.label}
        </SmartLink>
      </div>
    </section>
  );
}
