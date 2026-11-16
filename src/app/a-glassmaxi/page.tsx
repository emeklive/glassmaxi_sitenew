import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/data/company";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { MapBlock } from "@/components/site/Forms";

export const metadata: Metadata = { title: "A Glassmaxi", description: "História, estrutura e compromisso da Glassmaxi Indústria, em Fortaleza desde 2008.", alternates: { canonical: "/a-glassmaxi/" } };

export default function Page() {
  const a = company.address;
  return (
    <>
      <PageHero title="Uma indústria de vidro feita em Fortaleza." lede="Corte, lapidação, têmpera e laminação com equipamentos próprios, para obras em todo o Nordeste." crumbs={[{ label: "A Glassmaxi" }]} />
      <section className="section section-ice">
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)", alignItems: "start" }}>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Apresentação</h2>
            <p>A Glassmaxi Indústria atua no setor vidreiro em Fortaleza, Ceará, com tecnologia em corte, lapidação, têmpera e produção de vidros especiais.</p>
            <p>A fábrica começou a operar no Ceará em outubro de 2008. Desde então atende vidraceiros, construtoras, arquitetos e clientes finais com vidros temperados, laminados e soluções para fachadas e estruturas.</p>
            <h2>Compromisso</h2>
            <p>Segurança e qualidade em todos os projetos: é isso que a certificação Inmetro dos vidros temperados representa para quem compra e para quem instala.</p>
            <p>As sobras de corte e lapidação também têm destino. A empresa mantém parcerias com quem transforma esse vidro em peças de arte e utensílios.</p>
            <p className="source">Fontes: glassmaxi.com.br; cadastro de associada da Abravidro.</p>
          </div>
          <div style={{ display: "grid", gap: "var(--s-5)" }}>
            <div className="photo leaf" style={{ aspectRatio: "4 / 5" }}><img src="/media/brand/obra-d.webp" alt="Edifício residencial em Fortaleza com guarda-corpos de vidro" loading="lazy" /></div>
          </div>
        </div>
      </section>
      <section className="section section-navy">
        <div className="wrap">
          <div className="head head-split"><h2>Estrutura e tecnologia.</h2><p className="lede">O que existe dentro da fábrica.</p></div>
          <ul className="fact-list">{company.structure.map((s) => <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>)}</ul>
          <p style={{ marginTop: "var(--s-5)" }}><Link className="link" href="/tecnologia-e-processos/">Ver os processos industriais</Link></p>
        </div>
      </section>
      <section className="section section-ice">
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)" }}>
          <div><h2>Cronologia.</h2><p className="lede" style={{ marginTop: "var(--s-4)" }}>Os marcos com registro público.</p></div>
          <ol className="timeline-years">
            {company.timeline.map((t) => (
              <li key={t.year}><b>{t.year}</b><h3>{t.title}</h3><p>{t.text}</p><p className="source">Fonte: {t.source}.</p></li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section" style={{ background: "#fff" }}>
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)", alignItems: "center" }}>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <h2>Equipe e localização.</h2>
            <p className="lede">O atendimento é feito direto com a equipe da fábrica.</p>
            <p>{a.street}<br />{a.district}, {a.city} - {a.state}, CEP {a.zip}</p>
            <p>{company.hours.label}</p>
            <Link className="btn btn-navy" href="/contato/" style={{ justifySelf: "start" }}>Falar com a equipe</Link>
          </div>
          <MapBlock />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
