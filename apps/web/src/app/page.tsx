type Article = { documentId: string; title: string; excerpt: string };

async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${process.env.STRAPI_URL}/api/articles`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Strapi responded ${res.status}`);
  return (await res.json()).data;
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">ContentForge</h1>
      <ul className="mt-8 space-y-6">
        {articles.map((a) => (
          <li key={a.documentId}>
            <h2 className="text-xl font-semibold">{a.title}</h2>
            <p className="mt-1 text-gray-600">{a.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
