import type { Metadata } from "next";
import Link from "next/link";
import { company, whatsappLink } from "@/data/company";
import { CtaBand, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Qualidade", description: "Certificação Inmetro dos vidros temperados Glassmaxi e cuidados de qualidade e segurança.", alternates: { canonical: "/qualidade/" } };

export default function Page() {
  const c = company.certification;
  return (
    <>
      <PageHero title="Segurança que se comprova." lede="A qualidade do vidro aparece na norma, no processo e no documento." crumbs={[{ label: "Qualidade" }]} />
      <section className="section section-ice">
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)" }}>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>{c.title}</h2>
            <p>{c.text}</p>
            <p className="source">Fonte: <a className="link" href={c.sourceUrl} target="_blank" rel="noopener noreferrer">{c.source}</a>.</p>
            <h2>Documentos</h2>
            <p>O certificado e as fichas técnicas dos produtos são enviados pela equipe Glassmaxi a pedido, com o escopo e a validade vigentes.</p>
            <p><a className="btn btn-navy" href={whatsappLink("Olá! Gostaria de receber a cópia do certificado Inmetro dos vidros temperados.")} target="_blank" rel="noopener noreferrer">Solicitar cópia do certificado</a></p>
          </div>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Processo e controle</h2>
            <ul>
              <li>Corte em mesas automatizadas, na medida do projeto.</li>
              <li>Lapidação com precisão milimétrica.</li>
              <li>Têmpera e laminação em fornos próprios.</li>
              <li>Conferência das peças antes da expedição.</li>
            </ul>
            <h2>Segurança no uso</h2>
            <p>Vidro de segurança é o que reduz o risco de ferimento quando quebra. O temperado se fragmenta em pedaços pequenos; no laminado, a película interna segura os fragmentos.</p>
            <p>A escolha do vidro certo para cada aplicação segue as normas técnicas e o projeto. <Link className="link" href="/tecnologia-e-processos/">Veja a simulação de quebra</Link>.</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
