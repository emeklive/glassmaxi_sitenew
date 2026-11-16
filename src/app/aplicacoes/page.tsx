import type { Metadata } from "next";
import Link from "next/link";
import { applications } from "@/data/site";
import { familyById } from "@/data/families";
import { CtaBand, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Aplicações", description: "Fachadas, portas, janelas, boxes, divisórias, guarda-corpos e projetos especiais em vidro.", alternates: { canonical: "/aplicacoes/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Onde o vidro entra na obra." lede="Para cada uso, as linhas que costumam atender. A especificação final é sempre a do projeto." crumbs={[{ label: "Aplicações" }]} />
      <section className="section section-ice">
        <div className="wrap grid grid-3">
          {applications.map((a) => (
            <article key={a.id} id={a.id} className="card">
              <h2 style={{ fontSize: "var(--t-lg)", color: "var(--navy)" }}>{a.title}</h2>
              <p>{a.text}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {a.lines.map((id) => <Link key={id} className="btn btn-ghost btn-sm" href={`/produtos/${id}/`}>{familyById[id].name}</Link>)}
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
