import type { Metadata } from "next";
import { works } from "@/data/site";
import { company } from "@/data/company";
import { CtaBand, PageHero, WorksGallery } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Obras", description: "Obras com vidros Glassmaxi em Fortaleza.", alternates: { canonical: "/obras/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Do projeto à fachada." lede="Prédios de alto padrão em Fortaleza já contam com vidros Glassmaxi." crumbs={[{ label: "Obras" }]} />
      <section className="section section-ice">
        <div className="wrap">
          <WorksGallery />
          <p className="source" style={{ marginTop: "var(--s-4)" }}>{works.length} fotografias do site oficial e do material institucional da Glassmaxi. Nome e localização de cada obra são informados pela equipe comercial.</p>
          <p style={{ marginTop: "var(--s-4)" }}><a className="link" href={company.instagram.url} target="_blank" rel="noopener noreferrer">Ver mais projetos no Instagram {company.instagram.handle}</a></p>
        </div>
      </section>
      <CtaBand title="Sua obra pode ser a próxima." />
    </>
  );
}
