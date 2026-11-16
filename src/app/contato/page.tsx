import type { Metadata } from "next";
import { ContactList, PageHero } from "@/components/site/Blocks";
import { ContactForm, MapBlock } from "@/components/site/Forms";

export const metadata: Metadata = { title: "Contato", description: "WhatsApp, telefone, e-mail, endereço e horário de atendimento da Glassmaxi em Fortaleza.", alternates: { canonical: "/contato/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Fale com a Glassmaxi." lede="Atendimento direto com a equipe, em Fortaleza." crumbs={[{ label: "Contato" }]} />
      <section className="section section-ice">
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)", alignItems: "start" }}>
          <div style={{ display: "grid", gap: "var(--s-6)" }}>
            <ContactList />
            <MapBlock />
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
