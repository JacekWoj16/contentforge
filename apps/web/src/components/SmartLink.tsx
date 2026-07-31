import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders a link whose target comes from the CMS.
 *
 * Editors type hrefs by hand, so a link can point inside the site or out of
 * it. Internal links go through next/link for client-side navigation and
 * prefetching; anything else stays a plain anchor, because next/link cannot
 * route to another origin or to a mailto and tel scheme.
 *
 * The isExternal flag is the editor's intent. The protocol check is the
 * safety net for when that flag and the actual href disagree.
 */
function isExternalHref(href: string, flag?: boolean): boolean {
  return flag === true || /^(https?:|mailto:|tel:)/i.test(href);
}

export function SmartLink({
  href,
  isExternal,
  className,
  children,
}: {
  href: string;
  isExternal?: boolean;
  className?: string;
  children: ReactNode;
}) {
  if (isExternalHref(href, isExternal)) {
    return (
      <a
        href={href}
        className={className}
        {...(/^https?:/i.test(href) && {
          target: "_blank",
          rel: "noreferrer",
        })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
