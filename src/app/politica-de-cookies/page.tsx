import type { Metadata } from "next";
import { PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Política de cookies", description: "Cookies e armazenamento local usados no site da Glassmaxi.", alternates: { canonical: "/politica-de-cookies/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Política de cookies." lede="O que este site guarda no seu navegador e por quê." crumbs={[{ label: "Cookies" }]} />
      <section className="section section-ice">
        <div className="wrap prose" style={{ marginInline: "auto" }}>
          <h2 style={{ marginTop: 0 }}>Armazenamento essencial</h2>
          <ul>
            <li><strong>glassmaxi-orcamento</strong>: guarda a sua lista de peças e os dados do pedido neste aparelho, para você continuar de onde parou.</li>
            <li><strong>glassmaxi-cookies</strong>: guarda a sua escolha neste aviso.</li>
          </ul>
          <h2>Medição de acesso (opcional)</h2>
          <p>Só é ativada se você escolher “Aceitar”. Usa o Google Analytics para contar visitas de forma agregada.</p>
          <h2>Conteúdo de terceiros</h2>
          <p>O mapa do Google só é carregado quando você toca em “Carregar o mapa”. Links para WhatsApp, Instagram e Google Play abrem os serviços desses terceiros.</p>
          <h2>Como mudar sua escolha</h2>
          <p>Apague os dados de navegação deste site no seu navegador. O aviso aparece de novo na próxima visita.</p>
        </div>
      </section>
    </>
  );
}
