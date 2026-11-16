import type { Metadata } from "next";
import { company } from "@/data/company";
import { PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Política de privacidade", description: "Como a Glassmaxi trata os dados pessoais enviados pelo site, conforme a LGPD.", alternates: { canonical: "/politica-de-privacidade/" } };

export default function Page() {
  return (
    <>
      <PageHero title="Política de privacidade." lede="Como tratamos os dados que você envia por este site, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018)." crumbs={[{ label: "Privacidade" }]} />
      <section className="section section-ice">
        <div className="wrap prose" style={{ marginInline: "auto" }}>
          <h2 style={{ marginTop: 0 }}>Quem trata os dados</h2>
          <p>{company.fullName}, {company.address.street}, {company.address.district}, {company.address.city} - {company.address.state}. Contato para assuntos de privacidade: {company.email}.</p>
          <h2>Quais dados coletamos</h2>
          <ul>
            <li>Orçamento: nome, empresa, CNPJ (opcional), WhatsApp, e-mail (opcional), cidade, estado e as peças informadas.</li>
            <li>Contato: nome, telefone ou e-mail e a mensagem.</li>
            <li>Trabalhe conosco: nome, telefone, e-mail, área de interesse e o currículo que você anexar ao e-mail.</li>
          </ul>
          <h2>Como os dados chegam até nós</h2>
          <p>Os formulários deste site não gravam seus dados em um servidor da Glassmaxi. Eles montam uma mensagem que você mesmo envia pelo WhatsApp ou pelo seu e-mail. A lista de peças do orçamento fica guardada apenas no seu navegador, para você não perder o que digitou, e pode ser apagada no botão “Limpar lista”.</p>
          <h2>Para que usamos</h2>
          <p>Para responder ao seu pedido de orçamento ou contato e, no caso de currículos, para processos seletivos. A base legal é o seu consentimento e a execução de procedimentos preliminares a um contrato, a seu pedido.</p>
          <h2>Compartilhamento</h2>
          <p>As mensagens trafegam pelos serviços que você usa para enviá-las (WhatsApp ou provedor de e-mail), sujeitos às políticas desses serviços. Não vendemos dados pessoais.</p>
          <h2>Seus direitos</h2>
          <p>Você pode pedir confirmação do tratamento, acesso, correção, eliminação e revogação do consentimento. Escreva para {company.email}.</p>
          <h2>Medição de acesso</h2>
          <p>Se você aceitar no aviso de cookies, usamos o Google Analytics para medir visitas de forma agregada. Veja a política de cookies.</p>
        </div>
      </section>
    </>
  );
}
