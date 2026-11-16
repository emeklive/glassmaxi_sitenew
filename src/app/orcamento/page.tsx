import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";

export const metadata: Metadata = { title: "Orçamento", description: "Monte a lista de peças, veja área e peso estimado e envie o pedido de orçamento à Glassmaxi pelo WhatsApp.", alternates: { canonical: "/orcamento/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Monte seu pedido de orçamento." lede="Adicione quantas peças precisar. Medidas em milímetros, área em metros quadrados." crumbs={[{ label: "Orçamento" }]} />
      <section className="section section-ice" style={{ paddingTop: "var(--s-6)" }}>
        <div className="wrap"><QuoteBuilder /></div>
      </section>
    </>
  );
}
