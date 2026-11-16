import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/articles";
import { PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Conteúdos", description: "Artigos sobre vidro, arquitetura, processamento e aplicações.", alternates: { canonical: "/conteudos/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Para entender de vidro." lede="Vidro, arquitetura, processamento e aplicações, em linguagem direta." crumbs={[{ label: "Conteúdos" }]} />
      <section className="section section-ice">
        <div className="wrap grid grid-2">
          {articles.map((a) => (
            <article key={a.slug} className="card">
              <span className="tag" style={{ color: "var(--navy)", justifySelf: "start" }}>{a.topic}</span>
              <h2 style={{ fontSize: "var(--t-lg)", color: "var(--navy)" }}>{a.title}</h2>
              <p>{a.summary}</p>
              <Link className="link" href={`/conteudos/${a.slug}/`}>Ler o artigo<span className="sr-only">: {a.title}</span></Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
