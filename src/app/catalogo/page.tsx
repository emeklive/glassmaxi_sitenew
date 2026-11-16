import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { Catalog } from "@/components/site/Forms";

export const metadata: Metadata = { title: "Catálogo", description: "Catálogo de vidros Glassmaxi com busca e filtros por linha e aplicação.", alternates: { canonical: "/catalogo/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Catálogo." lede="Busque por nome ou uso, filtre por linha e leve os itens para o orçamento." crumbs={[{ href: "/produtos/", label: "Produtos" }, { label: "Catálogo" }]} />
      <section className="section section-ice" style={{ paddingTop: "var(--s-6)" }}>
        <div className="wrap"><Catalog /></div>
      </section>
    </>
  );
}
