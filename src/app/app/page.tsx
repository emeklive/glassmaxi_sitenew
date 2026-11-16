import type { Metadata } from "next";
import { company, whatsappLink } from "@/data/company";
import { PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Aplicativo Glassmaxi", description: "O aplicativo da Glassmaxi na Google Play.", alternates: { canonical: "/app/" } };

export default function Page() {
  const a = company.app;
  return (
    <>
      <PageHero title="Glassmaxi no celular." lede={`${a.name}: ${a.storeDescription}`} crumbs={[{ label: "Aplicativo" }]} />
      <section className="section section-ice">
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)" }}>
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>{a.name}</h2>
            <p>O aplicativo é publicado pela Glassmaxi na {a.store}. O acesso e os recursos disponíveis para cada cliente são informados pela equipe comercial.</p>
            <p><a className="btn btn-navy" href={a.url} target="_blank" rel="noopener noreferrer" data-app-link>Abrir na {a.store}</a></p>
          </div>
          <div className="panel">
            <h2>Quer usar o aplicativo?</h2>
            <p>Fale com a equipe para saber como liberar o seu acesso.</p>
            <a className="btn btn-primary" style={{ justifySelf: "start" }} href={whatsappLink("Olá! Quero saber como acessar o aplicativo Glassmaxi.")} target="_blank" rel="noopener noreferrer">Perguntar no WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
