import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { Configurator } from "@/components/glass/Configurator";

export const metadata: Metadata = { title: "Experiência 3D", description: "Gire, separe as camadas e configure as sete linhas de vidro da Glassmaxi em um visualizador 3D.", alternates: { canonical: "/experiencia-3d/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Sete linhas, um só visualizador." lede="Troque a linha, a composição e a cor. O modelo, as camadas e o resumo acompanham cada escolha." crumbs={[{ label: "Experiência 3D" }]} />
      <section className="section section-ice" style={{ paddingTop: "var(--s-6)" }}>
        <div className="wrap">
          <Configurator />
          <p className="source" style={{ marginTop: "var(--s-5)" }}>No modelo, a espessura do vidro é ampliada para ficar visível. Teclado: setas giram, + e − ampliam, [ e ] percorrem as camadas, E separa ou reúne, R restaura a vista.</p>
        </div>
      </section>
    </>
  );
}
