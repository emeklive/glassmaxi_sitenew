"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { company, whatsappLink } from "@/data/company";
import { footerNav, nav } from "@/data/site";
import { families } from "@/data/families";

/**
 * Logotipo oficial da Glassmaxi, sempre a partir dos arquivos originais (sem redesenho nem distorção).
 * `azul`: sobre fundos claros. `branca`: sobre o azul da marca.
 */
export function Brand({ tone = "azul" }: { tone?: "azul" | "branca" }) {
  return (
    <Link href="/" className="brand" aria-label="Glassmaxi, página inicial" data-brand={tone}>
      <img src={`/brand/glassmaxi-logo-${tone}.png`} alt="Glassmaxi conceito" width={1024} height={329} />
    </Link>
  );
}

const isCurrent = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, "")));

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#conteudo">Ir para o conteúdo</a>
      <header className="header">
        <div className="wrap header-in">
          <Brand />
          <nav className="nav" aria-label="Principal">
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isCurrent(path, n.href) ? "page" : undefined}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-cta">
            <Link className="btn btn-primary btn-sm" href="/experiencia-3d/">Configurador 3D</Link>
          </div>
          <button type="button" className="menu-btn" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((o) => !o)}>
            <i aria-hidden="true" />
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu" id="menu-mobile">
          <img className="mobile-menu-mark" src="/brand/glassmaxi-simbolo-branco.png" alt="" aria-hidden="true" />
          <nav aria-label="Menu">
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} aria-current={isCurrent(path, n.href) ? "page" : undefined} onClick={() => setOpen(false)}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link className="btn btn-primary" href="/experiencia-3d/" onClick={() => setOpen(false)}>Abrir o configurador 3D</Link>
          <a className="btn btn-ghost-light" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const a = company.address;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
            <Brand tone="branca" />
            <p>{company.slogan}</p>
          </div>
          <div>
            <h2>Produtos</h2>
            <ul>
              {families.map((f) => (
                <li key={f.id}><Link href={`/produtos/${f.id}/`}>{f.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Glassmaxi</h2>
            <ul>
              {[...nav.slice(1), ...footerNav].map((n) => (
                <li key={n.href}><Link href={n.href}>{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Contato</h2>
            <ul>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {company.whatsapp.display}</a></li>
              <li><a href={`tel:${company.phone.number}`}>{company.phone.display}</a></li>
              <li><a href={`mailto:${company.email}`}>{company.email}</a></li>
              <li><a href={company.instagram.url} target="_blank" rel="noopener noreferrer">Instagram {company.instagram.handle}</a></li>
            </ul>
            <address style={{ fontStyle: "normal", marginTop: "0.75rem" }}>
              {a.street}<br />{a.district}, {a.city} - {a.state}<br />CEP {a.zip}
            </address>
          </div>
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} Glassmaxi Indústria</span>
          <span>{company.city} - {company.state}</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  const path = usePathname();
  if (path.startsWith("/orcamento")) return null;
  return (
    <a className="wa-float" href={whatsappLink("Olá! Vim pelo site da Glassmaxi.")} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Glassmaxi no WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.300-1.200l-.300-.200-3 .800.800-2.900-.200-.300A8.200 8.200 0 1 1 12 20.200Zm4.500-6.100c-.200-.100-1.500-.700-1.700-.800s-.400-.100-.600.100-.700.800-.800 1-.300.200-.500.100a6.700 6.700 0 0 1-3.300-2.900c-.300-.400.300-.400.700-1.300.100-.200 0-.300 0-.500l-.800-1.800c-.200-.500-.400-.400-.600-.400h-.500a1 1 0 0 0-.700.300 2.900 2.900 0 0 0-.900 2.200c0 1.300.900 2.500 1 2.700s1.900 2.900 4.600 4c1.700.700 2.300.700 3.100.600.500-.100 1.500-.600 1.700-1.200s.200-1.100.100-1.200-.200-.200-.500-.300Z"/></svg>
    </a>
  );
}

const GA = process.env.NEXT_PUBLIC_GA_ID;

/** Consentimento LGPD. O Google Analytics só é carregado depois do aceite. */
export function CookieConsent() {
  const [choice, setChoice] = useState<string | null>("pending");
  useEffect(() => {
    try { setChoice(localStorage.getItem("glassmaxi-cookies")); } catch { setChoice(null); }
  }, []);
  useEffect(() => {
    if (choice !== "aceito" || !GA || document.getElementById("ga")) return;
    const s = document.createElement("script");
    s.id = "ga";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
    document.head.appendChild(s);
    const w = window as unknown as { dataLayer: unknown[] };
    w.dataLayer = w.dataLayer || [];
    const gtag = (...args: unknown[]) => w.dataLayer.push(args);
    gtag("js", new Date());
    gtag("config", GA, { anonymize_ip: true });
  }, [choice]);
  const save = (v: string) => {
    try { localStorage.setItem("glassmaxi-cookies", v); } catch {}
    setChoice(v);
  };
  if (choice !== null) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Cookies">
      <p>Usamos armazenamento local para guardar sua lista de orçamento neste aparelho e, se você aceitar, cookies de medição de acesso. <Link className="link" href="/politica-de-cookies/">Saiba mais</Link>.</p>
      <div>
        <button type="button" className="btn btn-navy btn-sm" onClick={() => save("aceito")}>Aceitar</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => save("essenciais")}>Só o essencial</button>
      </div>
    </div>
  );
}
