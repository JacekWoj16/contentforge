import Link from "next/link";
import type { Metadata } from "next";

import { getArticles } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes on user research, performance and accessibility from the ContentForge Studio team.",
};

/**
 * Articles have their own content type rather than being CMS pages, so this
 * route is a file. A page with the slug "journal" would be shadowed by it,
 * because Next resolves static segments before dynamic ones.
 */
export default async function JournalPage() {
  const articles = await getArticles();

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          Journal
        </h1>

        {articles.length === 0 ? (
          <p className="mt-6 text-neutral-600">Nothing published yet.</p>
        ) : (
          <ul className="mt-12 space-y-12">
            {articles.map((article) => (
              <li key={article.documentId}>
                <article>
                  <h2 className="text-xl font-medium text-neutral-900">
                    <Link
                      href={`/journal/${article.slug}`}
                      className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                    >
                      {article.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-sm text-neutral-500">
                    <time dateTime={(article.publishedAt ?? article.updatedAt)}>
                      {new Date((article.publishedAt ?? article.updatedAt)).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    {article.author ? ` \u00b7 ${article.author.name}` : ""}
                  </p>

                  {article.excerpt ? (
                    <p className="mt-3 leading-relaxed text-neutral-600">
                      {article.excerpt}
                    </p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
