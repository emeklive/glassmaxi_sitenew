"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { families } from "@/data/families";
import { glassColors } from "@/data/colors";
import { buildMessage, emptyPiece, fmt, pieceArea, pieceTotalArea, pieceWeight, quoteWhatsappUrl, totals, validateCustomer, validatePiece, type QuotePiece } from "@/lib/quote";
import { useQuote } from "@/store/quote-store";

const UF = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

type Draft = Omit<QuotePiece, "id">;

/** Desenho em escala da peça em edição. */
function ScaleDraw({ w, h }: { w: number; h: number }) {
  if (!(w > 0 && h > 0)) return <p className="ctrl-note">Informe largura e altura para ver a peça em escala.</p>;
  const max = Math.max(w, h, 2100);
  const s = 120 / max;
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label={`Peça de ${w} por ${h} milímetros, ao lado de uma porta de 2,10 m para comparação`}>
      <line x1="10" y1="140" x2="310" y2="140" stroke="#c9cfe2" strokeWidth="2" />
      <rect x={70} y={140 - h * s} width={w * s} height={h * s} fill="rgb(127 199 180 / 0.35)" stroke="#122366" strokeWidth="2" />
      <rect x={30} y={140 - 2100 * s} width={820 * s} height={2100 * s} fill="none" stroke="#FF6E27" strokeWidth="2" strokeDasharray="5 4" />
      <text x={30} y={140 - 2100 * s - 5} fontSize="9" fill="#4a5578">porta 2,10 m</text>
      <text x={70 + (w * s) / 2} y={140 - h * s - 5} fontSize="10" fill="#122366" textAnchor="middle" fontWeight="600">{w} × {h} mm</text>
    </svg>
  );
}

export function QuoteBuilder() {
  const q = useQuote();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyPiece());
  const [editing, setEditing] = useState<string | null>(null);
  const [pieceError, setPieceError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Evita divergência de hidratação: a lista vem do localStorage.
  useEffect(() => setReady(true), []);
  // Peças vindas do configurador 3D chegam sem medidas: abre a primeira para edição.
  useEffect(() => {
    if (!ready) return;
    const missing = useQuote.getState().pieces.find((p) => !(p.width > 0 && p.height > 0));
    if (missing && new URLSearchParams(window.location.search).get("origem") === "3d") edit(missing);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const edit = (p: QuotePiece) => {
    const { id, ...rest } = p;
    setDraft(rest);
    setEditing(id);
    setPieceError(null);
    formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  const savePiece = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePiece(draft);
    setPieceError(err);
    if (err) return;
    if (editing) q.update(editing, draft);
    else q.add(draft);
    setDraft({ ...emptyPiece(), line: draft.line, color: draft.color });
    setEditing(null);
    setStatus(editing ? "Peça atualizada." : "Peça adicionada à lista.");
  };
  const family = families.find((f) => f.name === draft.line) ?? families[1];
  const t = totals(ready ? q.pieces : []);
  const pieces = ready ? q.pieces : [];
  const incomplete = pieces.filter((p) => !(p.width > 0 && p.height > 0));

  const check = () => {
    if (!pieces.length) return "Adicione pelo menos uma peça à lista.";
    if (incomplete.length) return "Há peças sem medidas. Edite cada uma e informe largura e altura.";
    const err = validateCustomer(q.customer);
    if (err) return err;
    if (!consent) return "Marque a autorização de uso dos dados para enviar o pedido.";
    return null;
  };
  const message = () => buildMessage(q.customer, pieces, files);

  const send = async () => {
    const err = check();
    setSendError(err);
    if (err) return;
    if (ENDPOINT) {
      // Integração opcional (CRM/automação), definida por variável de ambiente.
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "orcamento", customer: q.customer, pieces, totals: t }) }).catch(() => {});
    }
    window.open(quoteWhatsappUrl(message()), "_blank", "noopener");
    setStatus("Abrimos o WhatsApp com o pedido preenchido. Confira e toque em enviar.");
  };
  const copy = async () => {
    const err = check();
    setSendError(err);
    if (err) return;
    try {
      await navigator.clipboard.writeText(message());
      setStatus("Pedido copiado. Cole na conversa ou no e-mail.");
    } catch {
      setStatus("Não foi possível copiar automaticamente. Use o envio pelo WhatsApp.");
    }
  };

  return (
    <div className="quote" data-quote>
      <div style={{ display: "grid", gap: "var(--s-5)" }}>
        <form className="panel form" onSubmit={savePiece} ref={formRef} noValidate data-piece-form>
          <h2>{editing ? "Editar peça" : "Adicionar peça"}</h2>
          <div className="form-row">
            <label className="field">Linha de produto
              <select name="line" value={draft.line} onChange={(e) => set("line", e.target.value)}>
                {families.map((f) => <option key={f.id}>{f.name}</option>)}
              </select>
            </label>
            <label className="field">Cor
              <select name="color" value={draft.color} onChange={(e) => set("color", e.target.value)}>
                {family.colors.map((c) => <option key={c}>{glassColors[c].name}</option>)}
                {!family.colors.some((c) => glassColors[c].name === draft.color) && <option>{draft.color}</option>}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label className="field">Composição <small>ex.: 4 + 4 mm, 6 | câmara 12 | 6</small>
              <input name="composition" value={draft.composition} onChange={(e) => set("composition", e.target.value)} />
            </label>
            <label className="field">Espessura do vidro em mm <small>some as lâminas: 8 ou 4+4</small>
              <input name="thickness" inputMode="text" value={draft.thickness} onChange={(e) => set("thickness", e.target.value)} />
            </label>
          </div>
          <div className="form-row">
            <label className="field">Largura (mm)
              <input name="width" type="number" inputMode="numeric" min={1} value={draft.width || ""} onChange={(e) => set("width", Math.max(0, +e.target.value))} required />
            </label>
            <label className="field">Altura (mm)
              <input name="height" type="number" inputMode="numeric" min={1} value={draft.height || ""} onChange={(e) => set("height", Math.max(0, +e.target.value))} required />
            </label>
            <label className="field">Quantidade (un.)
              <input name="quantity" type="number" inputMode="numeric" min={1} value={draft.quantity || ""} onChange={(e) => set("quantity", Math.max(0, Math.round(+e.target.value)))} required />
            </label>
          </div>
          <div className="form-row">
            <label className="field">Acabamentos <small>opcional</small>
              <input name="finishes" value={draft.finishes} onChange={(e) => set("finishes", e.target.value)} placeholder="ex.: lapidação reta" />
            </label>
            <label className="field">Furos <small>opcional</small>
              <input name="holes" value={draft.holes} onChange={(e) => set("holes", e.target.value)} placeholder="quantidade e diâmetro" />
            </label>
            <label className="field">Recortes <small>opcional</small>
              <input name="cutouts" value={draft.cutouts} onChange={(e) => set("cutouts", e.target.value)} />
            </label>
          </div>
          <label className="field">Observações da peça <small>opcional</small>
            <textarea name="notes" value={draft.notes} onChange={(e) => set("notes", e.target.value)} />
          </label>
          <div className="scale-draw"><ScaleDraw w={draft.width} h={draft.height} /></div>
          {draft.width > 0 && draft.height > 0 && (
            <p className="ctrl-note" data-testid="draft-area">Área desta peça: {fmt(pieceArea(draft))} m² · total da linha: {fmt(pieceArea(draft) * (draft.quantity || 0))} m²</p>
          )}
          {pieceError && <p className="form-error" role="alert">{pieceError}</p>}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn btn-navy" type="submit" data-action="salvar-peca">{editing ? "Salvar alterações" : "Adicionar peça à lista"}</button>
            {editing && <button className="btn btn-ghost" type="button" onClick={() => { setEditing(null); setDraft(emptyPiece()); }}>Cancelar edição</button>}
          </div>
        </form>

        <div className="panel form" data-customer-form>
          <h2>Seus dados</h2>
          <div className="form-row">
            <label className="field">Nome
              <input name="name" autoComplete="name" value={q.customer.name} onChange={(e) => q.setCustomer({ name: e.target.value })} />
            </label>
            <label className="field">Empresa <small>opcional</small>
              <input name="company" autoComplete="organization" value={q.customer.company} onChange={(e) => q.setCustomer({ company: e.target.value })} />
            </label>
            <label className="field">CNPJ <small>opcional</small>
              <input name="cnpj" inputMode="numeric" value={q.customer.cnpj} onChange={(e) => q.setCustomer({ cnpj: e.target.value })} />
            </label>
          </div>
          <div className="form-row">
            <label className="field">WhatsApp com DDD
              <input name="whatsapp" type="tel" autoComplete="tel" value={q.customer.whatsapp} onChange={(e) => q.setCustomer({ whatsapp: e.target.value })} />
            </label>
            <label className="field">E-mail <small>opcional</small>
              <input name="email" type="email" autoComplete="email" value={q.customer.email} onChange={(e) => q.setCustomer({ email: e.target.value })} />
            </label>
          </div>
          <div className="form-row">
            <label className="field">Cidade
              <input name="city" autoComplete="address-level2" value={q.customer.city} onChange={(e) => q.setCustomer({ city: e.target.value })} />
            </label>
            <label className="field">Estado
              <select name="state" value={q.customer.state} onChange={(e) => q.setCustomer({ state: e.target.value })}>
                <option value="">Selecione</option>
                {UF.map((u) => <option key={u}>{u}</option>)}
              </select>
            </label>
          </div>
          <label className="field">Observações gerais <small>opcional</small>
            <textarea name="generalNotes" value={q.customer.notes} onChange={(e) => q.setCustomer({ notes: e.target.value })} />
          </label>
          <label className="field">Anexos técnicos <small>projetos, desenhos ou fotos. Eles não saem do seu aparelho: o pedido lista os nomes e você envia os arquivos na conversa do WhatsApp.</small>
            <input name="files" type="file" multiple accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.webp" onChange={(e) => setFiles([...(e.target.files ?? [])].map((f) => f.name))} />
          </label>
          <label className="check">
            <input type="checkbox" name="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>Autorizo o uso destes dados para a Glassmaxi responder ao meu pedido de orçamento, conforme a <Link className="link" href="/politica-de-privacidade/">política de privacidade</Link>.</span>
          </label>
        </div>
      </div>

      <aside className="quote-side" aria-label="Resumo do orçamento">
        <div className="panel" data-quote-summary>
          <h2>Resumo do pedido</h2>
          <dl className="totals">
            <div><dt>Peças</dt><dd data-total="count">{t.count}</dd></div>
            <div><dt>Área total</dt><dd data-total="area">{fmt(t.area)} m²</dd></div>
            <div><dt>Peso estimado</dt><dd data-total="weight">{t.weight > 0 ? `${fmt(t.weight, 1)} kg` : "—"}</dd></div>
          </dl>
          <p className="ctrl-note">Peso estimado em 2,5 kg por m² para cada milímetro de vidro; espaço de ar não entra na conta. A equipe técnica confirma espessuras e composições. Preços e prazos são informados pela equipe comercial.</p>
          {pieces.length === 0 ? (
            <p className="empty">Sua lista está vazia. Adicione a primeira peça ao lado ou traga uma configuração do <Link className="link" href="/experiencia-3d/">visualizador 3D</Link>.</p>
          ) : (
            <ul className="piece-list">
              {pieces.map((p, i) => {
                const inc = !(p.width > 0 && p.height > 0);
                return (
                  <li key={p.id} className="piece" data-piece data-incomplete={inc}>
                    <h3><span>{i + 1}. {p.line}</span><span>{p.quantity} un.</span></h3>
                    <p>
                      {[p.composition, p.color, p.thickness && `${p.thickness} mm de vidro`].filter(Boolean).join(" · ")}
                      <br />
                      {inc ? <strong style={{ color: "#8a1c14" }}>Faltam as medidas desta peça.</strong> : <>{p.width} × {p.height} mm · {fmt(pieceTotalArea(p))} m²{pieceWeight(p) > 0 && ` · ${fmt(pieceWeight(p), 1)} kg est.`}</>}
                    </p>
                    <div className="piece-actions">
                      <button type="button" data-action="editar" onClick={() => edit(p)}>Editar</button>
                      <button type="button" data-action="duplicar" onClick={() => q.duplicate(p.id)}>Duplicar</button>
                      <button type="button" data-action="remover" onClick={() => q.remove(p.id)}>Remover</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {sendError && <p className="form-error" role="alert" data-send-error>{sendError}</p>}
          {status && <p className="form-ok" role="status">{status}</p>}
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <button type="button" className="btn btn-primary" data-action="enviar" onClick={send}>Enviar orçamento pelo WhatsApp</button>
            <button type="button" className="btn btn-ghost" data-action="copiar" onClick={copy}>Copiar o pedido</button>
            {pieces.length > 0 && <button type="button" className="btn btn-ghost" data-action="limpar" onClick={() => { q.clear(); setStatus("Lista limpa."); }}>Limpar lista</button>}
          </div>
        </div>
      </aside>
    </div>
  );
}
