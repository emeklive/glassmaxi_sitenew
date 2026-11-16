"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { company, whatsappLink } from "@/data/company";
import { catalog } from "@/data/site";
import { families, familyById } from "@/data/families";
import { glassColors } from "@/data/colors";
import type { GlassColorId } from "@/data/types";
import { useQuote } from "@/store/quote-store";
import { LineIcon } from "./Blocks";

const CAREERS = process.env.NEXT_PUBLIC_CAREERS_EMAIL || company.email;

export function ContactForm() {
  const [f, setF] = useState({ name: "", contact: "", subject: "Orçamento", message: "", consent: false });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const text = () => `Olá! Sou ${f.name}.\nAssunto: ${f.subject}\nContato: ${f.contact}\n\n${f.message}`;
  const valid = () => {
    if (f.name.trim().length < 2) return "Informe seu nome.";
    if (f.contact.trim().length < 6) return "Informe um telefone ou e-mail para retorno.";
    if (f.message.trim().length < 5) return "Escreva sua mensagem.";
    if (!f.consent) return "Marque a autorização de uso dos dados.";
    return null;
  };
  const go = (via: "whatsapp" | "email") => {
    const err = valid();
    setError(err);
    if (err) return;
    if (via === "whatsapp") window.open(whatsappLink(text()), "_blank", "noopener");
    else window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`${f.subject} - ${f.name}`)}&body=${encodeURIComponent(text())}`;
    setOk(via === "whatsapp" ? "Abrimos o WhatsApp com a sua mensagem. Confira e envie." : "Abrimos o seu aplicativo de e-mail com a mensagem pronta.");
  };
  return (
    <form className="panel form" onSubmit={(e) => (e.preventDefault(), go("whatsapp"))} noValidate data-contact-form>
      <h2>Envie uma mensagem</h2>
      <div className="form-row">
        <label className="field">Nome<input name="name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="field">Telefone ou e-mail<input name="contact" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></label>
      </div>
      <label className="field">Assunto
        <select name="subject" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}>
          {["Orçamento", "Dúvida técnica", "Pedido em andamento", "Outro assunto"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
      <label className="field">Mensagem<textarea name="message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
      <label className="check">
        <input type="checkbox" name="consent" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
        <span>Autorizo o uso destes dados para a Glassmaxi responder ao meu contato, conforme a <Link className="link" href="/politica-de-privacidade/">política de privacidade</Link>.</span>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {ok && <p className="form-ok" role="status">{ok}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button className="btn btn-primary" type="submit" data-action="contato-whatsapp">Enviar pelo WhatsApp</button>
        <button className="btn btn-ghost" type="button" data-action="contato-email" onClick={() => go("email")}>Enviar por e-mail</button>
      </div>
    </form>
  );
}

export function CareersForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", area: "Produção", message: "", consent: false });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = f.name.trim().length < 2 ? "Informe seu nome." : f.phone.replace(/\D/g, "").length < 10 ? "Informe um telefone com DDD." : !f.consent ? "Marque a autorização de uso dos dados." : null;
    setError(err);
    if (err) return;
    const body = `Nome: ${f.name}\nTelefone: ${f.phone}\nE-mail: ${f.email}\nÁrea de interesse: ${f.area}\n\n${f.message}\n\n(Anexe seu currículo a este e-mail antes de enviar.)`;
    window.location.href = `mailto:${CAREERS}?subject=${encodeURIComponent(`Currículo - ${f.area} - ${f.name}`)}&body=${encodeURIComponent(body)}`;
    setOk("Abrimos o seu aplicativo de e-mail com os dados preenchidos. Anexe o currículo e envie.");
  };
  return (
    <form className="panel form" onSubmit={submit} noValidate data-careers-form>
      <h2>Envie seu currículo</h2>
      <div className="form-row">
        <label className="field">Nome<input name="name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="field">Telefone com DDD<input name="phone" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
      </div>
      <div className="form-row">
        <label className="field">E-mail <small>opcional</small><input name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="field">Área de interesse
          <select name="area" value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })}>
            {["Produção", "Comercial", "Logística", "Administrativo", "Manutenção", "Outra"].map((o) => <option key={o}>{o}</option>)}
          </select>
        </label>
      </div>
      <label className="field">Conte um pouco da sua experiência <small>opcional</small><textarea name="message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
      <label className="check">
        <input type="checkbox" name="consent" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
        <span>Autorizo o uso destes dados para processos seletivos da Glassmaxi, conforme a <Link className="link" href="/politica-de-privacidade/">política de privacidade</Link>.</span>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      {ok && <p className="form-ok" role="status">{ok}</p>}
      <button className="btn btn-primary" type="submit" data-action="enviar-curriculo" style={{ justifySelf: "start" }}>Preparar e-mail com meus dados</button>
      <p className="ctrl-note">O envio é feito pelo seu aplicativo de e-mail para {CAREERS}, com o currículo em anexo.</p>
    </form>
  );
}

export function MapBlock() {
  const [show, setShow] = useState(false);
  const a = company.address;
  return (
    <div className="map" data-map>
      {show ? (
        <iframe title="Mapa: localização da Glassmaxi" src={a.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <>
          <p><strong>{a.street}</strong><br />{a.district}, {a.city} - {a.state}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            <button type="button" className="btn btn-navy btn-sm" data-action="carregar-mapa" onClick={() => setShow(true)}>Carregar o mapa</button>
            <a className="btn btn-ghost btn-sm" href={a.mapsUrl} target="_blank" rel="noopener noreferrer" data-maps-link>Abrir no Google Maps</a>
          </div>
          <p className="source">O mapa é carregado do Google somente quando você pede.</p>
        </>
      )}
    </div>
  );
}

export function Catalog() {
  const [q, setQ] = useState("");
  const [line, setLine] = useState("");
  const [use, setUse] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const add = useQuote((s) => s.add);
  const uses = useMemo(() => [...new Set(catalog.flatMap((c) => c.uses))].sort((a, b) => a.localeCompare(b, "pt-BR")), []);
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const list = catalog.filter((c) => (!line || c.line === line) && (!use || c.uses.includes(use)) && (!q || norm(`${c.name} ${c.text} ${c.uses.join(" ")}`).includes(norm(q))));

  const share = async (id: string, name: string) => {
    const url = `${window.location.origin}/catalogo/#${id}`;
    try {
      if (navigator.share) await navigator.share({ title: `${name} | Glassmaxi`, url });
      else {
        await navigator.clipboard.writeText(url);
        setMsg(`Link de “${name}” copiado.`);
      }
    } catch { /* compartilhamento cancelado */ }
  };

  return (
    <div data-catalog>
      <div className="filters">
        <label className="field">Buscar<input type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ex.: fachada, laminado" /></label>
        <label className="field">Linha
          <select name="line" value={line} onChange={(e) => setLine(e.target.value)}>
            <option value="">Todas as linhas</option>
            {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <label className="field">Aplicação
          <select name="use" value={use} onChange={(e) => setUse(e.target.value)}>
            <option value="">Todas as aplicações</option>
            {uses.map((u) => <option key={u}>{u}</option>)}
          </select>
        </label>
      </div>
      <p className="source" aria-live="polite" data-catalog-count>{list.length} {list.length === 1 ? "produto encontrado" : "produtos encontrados"}{msg ? ` · ${msg}` : ""}</p>
      {list.length === 0 ? (
        <p className="empty" style={{ marginTop: "1rem" }}>Nenhum produto com esses filtros. Limpe a busca ou <Link className="link" href="/contato/">fale com a equipe</Link> sobre o que você procura.</p>
      ) : (
        <div className="grid grid-3" style={{ marginTop: "1rem" }}>
          {list.map((c) => (
            <article key={c.id} id={c.id} className="cat-card" data-catalog-item={c.id}>
              <div className="photo">{c.image ? <img src={c.image} alt="" loading="lazy" /> : <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--navy)" }}><div style={{ width: "5rem" }}><LineIcon id={c.line} /></div></div>}</div>
              <div className="cat-body">
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <ul className="tags" style={{ color: "var(--navy)" }}>{c.uses.map((u) => <li key={u} className="tag">{u}</li>)}</ul>
                <div className="cat-actions">
                  <Link className="btn btn-navy btn-sm" href={`/produtos/${c.line}/${c.color ? `?cor=${c.color}` : ""}`}>Ver a linha</Link>
                  <button type="button" className="btn btn-ghost btn-sm" data-action="catalogo-orcar" onClick={() => { add({ line: familyById[c.line].name, composition: "", color: c.color ? glassColors[c.color as GlassColorId].name : "Incolor", thickness: "", width: 0, height: 0, quantity: 1, finishes: "", holes: "", cutouts: "", notes: c.name }); setMsg(`“${c.name}” entrou na lista de orçamento.`); }}>Adicionar ao orçamento</button>
                  <button type="button" className="btn btn-ghost btn-sm" data-action="compartilhar" onClick={() => share(c.id, c.name)}>Compartilhar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
