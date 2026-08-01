import Image from "next/image";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { RichText } from "@/components/RichText";
import { mediaUrl } from "@/lib/media";
import { metadataFromSeo } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { getArticleBySlug, getArticles } from "@/lib/strapi";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getArticles();

  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return metadataFromSeo(article.seo, article.title);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="py-16">
      <JsonLd data={articleSchema(article)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: article.title, path: `/journal/${article.slug}` },
        ])}
      />

      <div className="mx-auto max-w-2xl px-6">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
          {article.title}
        </h1>

        <p className="mt-4 text-sm text-neutral-500">
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          {article.author
            ? ` \u00b7 ${article.author.name}${
                article.author.role ? `, ${article.author.role}` : ""
              }`
            : ""}
        </p>

        {article.coverImage ? (
          <Image
            src={mediaUrl(article.coverImage.url)}
            alt={article.coverImage.alternativeText ?? ""}
            width={article.coverImage.width}
            height={article.coverImage.height}
            priority
            className="mt-10 h-auto w-full rounded"
          />
        ) : null}

        {article.body ? (
          <div className="mt-8">
            <RichText nodes={article.body} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
