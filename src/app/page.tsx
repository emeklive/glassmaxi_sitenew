import Link from "next/link";
import { company } from "@/data/company";
import { ContactList, CtaBand, LineGrid, WorksGallery } from "@/components/site/Blocks";
import { ApplicationGallery, BreakSimulator, Hero, ProcessTimeline, ProductCarousel } from "@/components/site/Interactive";
import { Configurator } from "@/components/glass/Configurator";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section section-ice" id="apresentacao">
        <div className="wrap grid grid-2" style={{ alignItems: "center", gap: "var(--s-7)" }}>
          <div className="intro-art" aria-hidden="true">
            <div className="photo p1"><img src="/media/brand/obra-c.webp" alt="" loading="lazy" /></div>
            <div className="photo p2"><img src="/media/brand/amostra-laminado.webp" alt="" loading="lazy" /></div>
            <span className="dot" />
          </div>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <span className="rule" />
            <h2>Indústria de vidro em Fortaleza desde 2008.</h2>
            <p className="lede">A Glassmaxi corta, lapida, tempera e lamina vidros para obras residenciais, comerciais e de alto padrão.</p>
            <ul className="fact-list">
              {company.structure.map((s) => (
                <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>
              ))}
            </ul>
            <Link className="link" href="/a-glassmaxi/">Conhecer a Glassmaxi</Link>
          </div>
        </div>
      </section>

      <section className="section section-navy" id="linhas">
        <div className="wrap">
          <div className="head head-split">
            <h2>Sete linhas de vidro.</h2>
            <p className="lede">Cada uma com a sua estrutura. Entre em uma linha para ver como o vidro é feito, por dentro.</p>
          </div>
          <LineGrid />
        </div>
      </section>

      <section className="section section-ice" id="experiencia-3d">
        <div className="wrap">
          <div className="head head-split">
            <h2>Veja o vidro por dentro.</h2>
            <p className="lede">Escolha a linha, gire o modelo, separe as camadas e toque em cada uma para saber o que ela faz.</p>
          </div>
          <Configurator compact />
          <p style={{ marginTop: "var(--s-5)" }}><Link className="link" href="/experiencia-3d/">Abrir a experiência 3D completa</Link></p>
        </div>
      </section>

      <section className="section section-navy" id="processos">
        <div className="wrap">
          <div className="head head-split">
            <h2>Do corte ao acabamento.</h2>
            <p className="lede">As etapas que acontecem dentro da fábrica, com equipamentos próprios.</p>
          </div>
          <ProcessTimeline compact />
          <p style={{ marginTop: "var(--s-5)" }}><Link className="link" href="/tecnologia-e-processos/">Ver todos os processos</Link></p>
        </div>
      </section>

      <section className="section section-ice" id="versoes">
        <div className="wrap">
          <div className="head head-split">
            <h2>Linhas e versões em destaque.</h2>
            <p className="lede">Arraste, use as setas ou o teclado para passar pelos seis destaques.</p>
          </div>
          <ProductCarousel />
        </div>
      </section>

      <section className="section" id="quebra" style={{ background: "#fff" }}>
        <div className="wrap">
          <div className="head head-split">
            <h2>Como cada vidro se comporta na quebra.</h2>
            <p className="lede">A diferença entre o vidro comum, o temperado e o laminado aparece quando eles quebram.</p>
          </div>
          <BreakSimulator />
        </div>
      </section>

      <section className="section section-ice" id="obras">
        <div className="wrap">
          <div className="head head-split">
            <h2>Obras que assinam a cidade.</h2>
            <p className="lede">Prédios de alto padrão em Fortaleza já contam com vidros Glassmaxi.</p>
          </div>
          <WorksGallery limit={8} />
          <p style={{ marginTop: "var(--s-4)" }}><Link className="link" href="/obras/">Ver as obras</Link></p>
        </div>
      </section>

      <section className="section section-navy" id="qualidade">
        <div className="wrap grid grid-2" style={{ alignItems: "center", gap: "var(--s-7)" }}>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <span className="rule" />
            <h2>Certificada pelo Inmetro.</h2>
            <p className="lede">{company.certification.text}</p>
            <p className="source">Fonte: {company.certification.source}.</p>
            <Link className="link" href="/qualidade/">Ver qualidade e certificação</Link>
          </div>
          <ul className="fact-list">
            {company.services.map((s) => (
              <li key={s.title}><b>{s.title}</b><span>{s.text}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-ice" id="aplicacoes">
        <div className="wrap">
          <div className="head head-split">
            <h2>Onde o vidro entra na obra.</h2>
            <p className="lede">Escolha uma aplicação para ver as linhas que costumam atendê-la.</p>
          </div>
          <ApplicationGallery />
        </div>
      </section>

      <CtaBand />

      <section className="section" id="contato" style={{ background: "#fff" }}>
        <div className="wrap grid grid-2" style={{ gap: "var(--s-7)" }}>
          <div style={{ display: "grid", gap: "var(--s-4)", alignContent: "start" }}>
            <h2>Fale com a Glassmaxi.</h2>
            <p className="lede">Atendimento direto com a nossa equipe, em Fortaleza.</p>
            <Link className="btn btn-navy" href="/contato/" style={{ justifySelf: "start" }}>Ver todos os canais</Link>
          </div>
          <ContactList />
        </div>
      </section>
    </>
  );
}
