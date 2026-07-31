import { SmartLink } from "@/components/SmartLink";
import type { Global } from "@/types/cms";

/**
 * Navigation is editorial content, not a hardcoded list, so it arrives from
 * the Global single type. When Global has no published entry the site still
 * renders with a name and no navigation rather than failing.
 */
export function SiteHeader({ global }: { global: Global | null }) {
  const siteName = global?.siteName ?? "ContentForge Studio";
  const navigation = global?.navigation ?? [];

  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-6 px-6 py-5">
        <SmartLink
          href="/"
          className="text-sm font-semibold tracking-tight text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
        >
          {siteName}
        </SmartLink>

        {navigation.length > 0 ? (
          <nav aria-label="Main">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {navigation.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <SmartLink
                    href={link.href}
                    isExternal={link.isExternal}
                    className="text-neutral-600 hover:text-neutral-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                  >
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
