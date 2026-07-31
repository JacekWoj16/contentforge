import { Fragment, type ReactNode } from "react";

import { SmartLink } from "@/components/SmartLink";
import type { RichTextNode } from "@/types/cms";

/**
 * Renders the Blocks rich text format by mapping node types to elements.
 *
 * The CMS returns structured nodes rather than markup, so nothing here has
 * to parse or sanitise HTML.
 */
function renderLeaf(node: RichTextNode, key: number): ReactNode {
  let content: ReactNode = node.text ?? "";

  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.code) {
    content = (
      <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">{content}</code>
    );
  }

  return <Fragment key={key}>{content}</Fragment>;
}

const HEADING_CLASS: Record<number, string> = {
  2: "mt-10 text-2xl font-semibold tracking-tight text-neutral-900",
  3: "mt-8 text-xl font-semibold text-neutral-900",
  4: "mt-6 text-lg font-semibold text-neutral-900",
};

function renderNode(node: RichTextNode, key: number): ReactNode {
  const children = node.children?.map(renderChild);

  switch (node.type) {
    case "text":
      return renderLeaf(node, key);

    case "heading": {
      const level = Math.min(Math.max(node.level ?? 2, 2), 6);
      const Heading = `h${level}` as "h2";

      return (
        <Heading key={key} className={HEADING_CLASS[level] ?? HEADING_CLASS[4]}>
          {children}
        </Heading>
      );
    }

    case "paragraph":
      return (
        <p key={key} className="mt-4 leading-relaxed text-neutral-700">
          {children}
        </p>
      );

    case "list":
      return node.format === "ordered" ? (
        <ol
          key={key}
          className="mt-4 list-decimal space-y-2 pl-6 text-neutral-700"
        >
          {children}
        </ol>
      ) : (
        <ul key={key} className="mt-4 list-disc space-y-2 pl-6 text-neutral-700">
          {children}
        </ul>
      );

    case "list-item":
      return <li key={key}>{children}</li>;

    case "quote":
      return (
        <blockquote
          key={key}
          className="mt-6 border-l-2 border-neutral-300 pl-4 italic text-neutral-600"
        >
          {children}
        </blockquote>
      );

    case "link":
      return (
        <SmartLink
          key={key}
          href={node.url ?? "#"}
          className="underline hover:no-underline"
        >
          {children}
        </SmartLink>
      );

    default:
      // An unknown node means the CMS gained a feature the site has not
      // implemented yet. Skipping it keeps the rest of the page rendering.
      return null;
  }
}

function renderChild(node: RichTextNode, index: number): ReactNode {
  return renderNode(node, index);
}

export function RichText({ nodes }: { nodes: RichTextNode[] }) {
  return <>{nodes.map(renderChild)}</>;
}
