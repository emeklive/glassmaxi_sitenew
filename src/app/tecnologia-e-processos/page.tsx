import type { Metadata } from "next";
import { company } from "@/data/company";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { BreakSimulator, ProcessTimeline } from "@/components/site/Interactive";

export const metadata: Metadata = { title: "Tecnologia e processos", description: "Corte, lapidação, têmpera e laminação: como o vidro é beneficiado na fábrica da Glassmaxi.", alternates: { canonical: "/tecnologia-e-processos/" } };

export default function Page() {
  return (
    <>
      <PageHero title="O que existe por trás do vidro." lede="Da chapa à peça pronta para a obra, etapa por etapa." crumbs={[{ label: "Tecnologia e processos" }]} />
      <section className="section section-navy" style={{ paddingTop: "var(--s-5)" }}>
        <div className="wrap">
          <ProcessTimeline />
          <p className="source" style={{ marginTop: "var(--s-5)" }}>Corte, lapidação, têmpera e laminação são feitos na fábrica, conforme divulgado em glassmaxi.com.br. As etapas marcadas “conforme o projeto” dependem da peça: consulte a equipe.</p>
        </div>
      </section>
      <section className="section section-ice">
        <div className="wrap">
          <div className="head head-split"><h2>Equipamentos.</h2><p className="lede">A estrutura que a fábrica divulga.</p></div>
          <ul className="fact-list">{company.structure.map((s) => <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>)}</ul>
        </div>
      </section>
      <section className="section" style={{ background: "#fff" }}>
        <div className="wrap">
          <div className="head head-split"><h2>Como cada vidro se comporta na quebra.</h2><p className="lede">O processo define o que acontece quando o vidro rompe.</p></div>
          <BreakSimulator />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
