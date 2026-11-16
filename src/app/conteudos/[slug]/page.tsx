import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { company } from "@/data/company";
import { CtaBand, PageHero } from "@/components/site/Blocks";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.summary, alternates: { canonical: `/conteudos/${a.slug}/` } } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.summary, inLanguage: "pt-BR", publisher: { "@type": "Organization", name: company.fullName }, mainEntityOfPage: `${company.siteUrl}/conteudos/${a.slug}/` };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero title={a.title} lede={a.summary} crumbs={[{ href: "/conteudos/", label: "Conteúdos" }, { label: a.topic }]} />
      <section className="section section-ice">
        <article className="wrap prose" style={{ marginInline: "auto" }}>
          {a.body.map((b, i) => (
            <div key={i} style={{ display: "grid", gap: "var(--s-3)" }}>
              {b.h && <h2>{b.h}</h2>}
              {b.p.map((p) => <p key={p}>{p}</p>)}
            </div>
          ))}
          <p><Link className="link" href="/conteudos/">Voltar aos conteúdos</Link></p>
        </article>
      </section>
      <CtaBand />
    </>
  );
}
