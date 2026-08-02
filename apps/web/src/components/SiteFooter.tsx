import type { Global } from "@/types/cms";

export function SiteFooter({ global }: { global: Global | null }) {
  const siteName = global?.siteName ?? "ContentForge Studio";

  return (
    <footer className="border-t border-neutral-200 py-10">
      <div className="mx-auto max-w-5xl px-6">
        {global?.footerText ? (
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-600">
            {global.footerText}
          </p>
        ) : null}

        <p className="mt-4 text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} {siteName}
        </p>
      </div>
    </footer>
  );
}
