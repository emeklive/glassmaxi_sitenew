import Link from "next/link";
import type { ReactNode } from "react";
import { families } from "@/data/families";
import type { FamilyId } from "@/data/types";
import { works } from "@/data/site";
import { company, whatsappLink } from "@/data/company";

export function PageHero({ title, lede, crumbs = [], children }: { title: string; lede?: string; crumbs?: { href?: string; label: string }[]; children?: ReactNode }) {
  return (
    <section className="page-hero tex">
      <div className="wrap">
        <ol className="crumbs" aria-label="Você está em">
          <li><Link href="/">Início</Link></li>
          {crumbs.map((c) => (
            <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
          ))}
        </ol>
        <h1>{title}</h1>
        {lede && <p className="lede" style={{ color: "#d5dbf5" }}>{lede}</p>}
        {children}
      </div>
    </section>
  );
}

/** Ícone técnico de cada linha: um corte esquemático da composição. */
export function LineIcon({ id }: { id: FamilyId }) {
  const g = "#9fe0d2";
  const o = "#FF6E27";
  const common = { fill: "none", strokeWidth: 2.2, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      {id === "temperados" && <path {...common} stroke={g} d="M14 12l22-6v38l-22 6z M36 6l6 2v38l-6-2" />}
      {id === "laminados" && (<><path {...common} stroke={g} d="M8 14l18-5v36l-18 5z" /><path {...common} stroke={o} d="M19 14l18-5v36l-18 5z" /><path {...common} stroke={g} d="M30 14l18-5v36l-18 5z" /></>)}
      {id === "insulados" && (<><path {...common} stroke={g} d="M6 14l16-5v36l-16 5z M34 14l16-5v36l-16 5z" /><path {...common} stroke={o} strokeDasharray="3 3" d="M22 12h12M22 44h12" /></>)}
      {id === "multilaminados" && [0, 1, 2, 3, 4].map((i) => <path key={i} {...common} stroke={i % 2 ? o : g} d={`M${6 + i * 8} 15l12-4v34l-12 4z`} />)}
      {id === "espelhos" && (<><path {...common} stroke={g} d="M12 12l26-6v38l-26 6z" /><path {...common} stroke={o} d="M19 22l10-9M19 34l14-13" /></>)}
      {id === "jumbos" && (<><path {...common} stroke={g} d="M6 10h44v36H6z" /><path {...common} stroke={o} d="M12 46v-9m0-2.500a2 2 0 1 0 0-.100" /></>)}
      {id === "modelados" && (<><path {...common} stroke={g} d="M10 10c14 4 26 4 36 14v24C36 38 24 38 10 34z" /><path {...common} stroke={o} d="M10 34c14 4 26 4 36 14" /></>)}
    </svg>
  );
}

export function LineGrid() {
  return (
    <div className="line-grid">
      {families.map((f) => (
        <Link key={f.id} href={`/produtos/${f.id}/`} className="line-card" data-line-card={f.id}>
          <LineIcon id={f.id} />
          <h3>{f.name}</h3>
          <p>{f.tagline}</p>
          <span className="line-go">Conhecer a linha</span>
        </Link>
      ))}
      <Link href="/experiencia-3d/" className="line-card line-card-cta">
        <h3>Sete linhas, um só visualizador</h3>
        <p>Gire, separe as camadas e monte a composição em 3D.</p>
        <span className="line-go">Abrir o configurador</span>
      </Link>
    </div>
  );
}

export function WorksGallery({ limit }: { limit?: number }) {
  const list = limit ? works.slice(0, limit) : works;
  return (
    <div className="works" data-works>
      {list.map((w) => (
        <figure key={w.id}>
          <img src={w.src} alt={w.alt} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}

export function CtaBand({ title = "Seu projeto com vidro começa por aqui.", text = "Monte a lista de peças e envie para a nossa equipe pelo WhatsApp." }: { title?: string; text?: string }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="cta-band tex">
          <div style={{ display: "grid", gap: "0.75rem" }}>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            <Link className="btn btn-navy" href="/orcamento/">Solicitar orçamento</Link>
            <a className="btn btn-ghost-light" href={whatsappLink("Olá! Gostaria de falar sobre um projeto.")} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactList() {
  const a = company.address;
  return (
    <ul className="contact-list">
      <li><small>WhatsApp</small><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" data-whatsapp>{company.whatsapp.display}</a></li>
      <li><small>Telefone</small><a href={`tel:${company.phone.number}`}>{company.phone.display}</a></li>
      <li><small>E-mail</small><a href={`mailto:${company.email}`}>{company.email}</a></li>
      <li><small>Instagram</small><a href={company.instagram.url} target="_blank" rel="noopener noreferrer">{company.instagram.handle}</a></li>
      <li><small>Endereço</small><span>{a.street}, {a.district}, {a.city} - {a.state}, {a.zip}</span></li>
      <li><small>Atendimento</small><span>{company.hours.label}</span></li>
    </ul>
  );
}
