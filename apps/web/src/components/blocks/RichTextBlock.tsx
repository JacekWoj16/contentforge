import { RichText } from "@/components/RichText";
import type { RichTextBlockData } from "@/types/cms";

export function RichTextBlock({ body }: RichTextBlockData) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* The container matches the rest of the page so the left edge does
            not shift, while the prose stays narrow enough to read. */}
        <div className="max-w-2xl">
          <RichText nodes={body} />
        </div>
      </div>
    </section>
  );
}
