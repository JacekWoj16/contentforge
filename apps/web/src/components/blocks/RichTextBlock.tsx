import { RichText } from "@/components/RichText";
import type { RichTextBlockData } from "@/types/cms";

export function RichTextBlock({ body }: RichTextBlockData) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-6">
        <RichText nodes={body} />
      </div>
    </section>
  );
}
