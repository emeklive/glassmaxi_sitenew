import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";
import { CareersForm } from "@/components/site/Forms";

export const metadata: Metadata = { title: "Trabalhe conosco", description: "Envie seu currículo para a Glassmaxi Indústria, em Fortaleza.", alternates: { canonical: "/trabalhe-conosco/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Trabalhe na Glassmaxi." lede="Deixe seus dados e seu currículo. A equipe entra em contato quando houver uma oportunidade na sua área." crumbs={[{ label: "Trabalhe conosco" }]} />
      <section className="section section-ice">
        <div className="wrap" style={{ maxWidth: "48rem" }}><CareersForm /></div>
      </section>
    </>
  );
}
