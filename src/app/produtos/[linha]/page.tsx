import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { families, familyById, isFamilyId } from "@/data/families";
import { glassColors } from "@/data/colors";
import { company } from "@/data/company";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { ScrollExperience } from "@/components/glass/ScrollExperience";

export const dynamicParams = false;
export const generateStaticParams = () => families.map((f) => ({ linha: f.id }));

export async function generateMetadata({ params }: { params: Promise<{ linha: string }> }): Promise<Metadata> {
  const { linha } = await params;
  if (!isFamilyId(linha)) return {};
  const f = familyById[linha];
  return { title: f.name, description: `${f.singular} Glassmaxi: ${f.description}`, alternates: { canonical: `/produtos/${f.id}/` } };
}

export default async function Page({ params }: { params: Promise<{ linha: string }> }) {
  const { linha } = await params;
  if (!isFamilyId(linha)) notFound();
  const f = familyById[linha];
  const i = families.indexOf(f);
  const next = families[(i + 1) % families.length];
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Início", "/"], ["Produtos", "/produtos/"], [f.name, `/produtos/${f.id}/`]].map(([name, path], k) => ({ "@type": "ListItem", position: k + 1, name, item: `${company.siteUrl}${path}` })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <PageHero title={f.tagline} lede={f.description} crumbs={[{ href: "/produtos/", label: "Produtos" }, { label: f.name }]}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          <Link className="btn btn-primary" href="/orcamento/">Solicitar orçamento</Link>
          <Link className="btn btn-ghost-light" href={`/experiencia-3d/?linha=${f.id}`}>Configurar em 3D</Link>
        </div>
      </PageHero>

      <ScrollExperience line={f.id} />

      <section className="section section-ice">
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)", alignItems: "start" }}>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <h2>{f.singular}</h2>
            <p className="lede">{f.structure}</p>
            {f.image && <div className="photo leaf-alt" style={{ aspectRatio: "4 / 3" }}><img src={f.image} alt={`Amostra de ${f.singular.toLowerCase()} Glassmaxi`} loading="lazy" /></div>}
          </div>
          <div style={{ display: "grid", gap: "var(--s-5)" }}>
            <div>
              <h3>Características</h3>
              <ul className="fact-list" style={{ marginTop: "var(--s-3)" }}>{f.features.map((x) => <li key={x}><span>{x}</span></li>)}</ul>
            </div>
            <div>
              <h3>Composição no modelo</h3>
              <ul className="tags" style={{ marginTop: "var(--s-3)", color: "var(--navy)" }}>{f.compositions.map((c) => <li key={c.id} className="tag">{c.label}</li>)}</ul>
            </div>
            <div>
              <h3>Cores</h3>
              <ul className="tags" style={{ marginTop: "var(--s-3)", color: "var(--navy)" }}>{f.colors.map((c) => <li key={c} className="tag">{glassColors[c].name}</li>)}</ul>
            </div>
            <div>
              <h3>Aplicações</h3>
              <ul className="tags" style={{ marginTop: "var(--s-3)", color: "var(--navy)" }}>{f.applications.map((x) => <li key={x} className="tag">{x}</li>)}</ul>
            </div>
            <p className="source">{f.notice}</p>
          </div>
        </div>
      </section>

      {f.process && (
        <section className="section section-navy">
          <div className="wrap">
            <div className="head"><h2>Como é fabricado.</h2></div>
            <ol className="fact-list">{f.process.map((p, k) => <li key={p.title}><b>{k + 1}. {p.title}</b><span>{p.text}</span></li>)}</ol>
          </div>
        </section>
      )}

      <section className="section" style={{ background: "#fff" }}>
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-4)", justifyContent: "space-between", alignItems: "center" }}>
          <p className="lede">Próxima linha: <strong>{next.name}</strong></p>
          <Link className="btn btn-ghost" href={`/produtos/${next.id}/`}>Ver {next.name}</Link>
        </div>
      </section>
      <CtaBand title={`Vai usar ${f.singular.toLowerCase()} no projeto?`} />
    </>
  );
}
