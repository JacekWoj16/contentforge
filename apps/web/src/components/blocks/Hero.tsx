import Image from "next/image";

import { SmartLink } from "@/components/SmartLink";
import { mediaUrl } from "@/lib/media";
import type { HeroBlock } from "@/types/cms";

export function Hero({ heading, subheading, image, cta }: HeroBlock) {
  return (
    <section className="border-b border-neutral-200 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {heading}
        </h1>

        {subheading ? (
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            {subheading}
          </p>
        ) : null}

        {cta ? (
          <SmartLink
            href={cta.href}
            isExternal={cta.isExternal}
            className="mt-8 inline-block rounded bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
          >
            {cta.label}
          </SmartLink>
        ) : null}

        {image ? (
          <Image
            src={mediaUrl(image.url)}
            alt={image.alternativeText ?? ""}
            width={image.width}
            height={image.height}
            priority
            className="mt-12 h-auto w-full rounded"
          />
        ) : null}
      </div>
    </section>
  );
}
