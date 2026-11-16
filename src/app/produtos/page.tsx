import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, LineGrid, PageHero } from "@/components/site/Blocks";
import { ProductCarousel } from "@/components/site/Interactive";

export const metadata: Metadata = { title: "Produtos", description: "Temperados, laminados, insulados, multilaminados, espelhos, jumbos e modelados: as sete linhas de vidro da Glassmaxi.", alternates: { canonical: "/produtos/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Sete linhas de vidro." lede="Do temperado monolítico às composições com várias lâminas. Cada linha tem página própria, com modelo 3D." crumbs={[{ label: "Produtos" }]} />
      <section className="section section-navy" style={{ paddingTop: "var(--s-5)" }}>
        <div className="wrap"><LineGrid /></div>
      </section>
      <section className="section section-ice">
        <div className="wrap">
          <div className="head head-split"><h2>Destaques.</h2><p className="lede">Versões divulgadas pela Glassmaxi. <Link className="link" href="/catalogo/">Ver o catálogo com busca e filtros</Link>.</p></div>
          <ProductCarousel />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
