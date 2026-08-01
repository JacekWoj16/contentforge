/**
 * Renders a JSON-LD block.
 *
 * Structured data has to reach the crawler in the initial HTML, so this is a
 * server component writing a script tag rather than anything injected later.
 * Escaping the opening angle bracket is what stops CMS-authored text from
 * breaking out of the script element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
