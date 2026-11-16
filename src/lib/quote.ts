import { company } from "@/data/company";

/**
 * Parâmetros técnicos do cálculo. O peso é uma ESTIMATIVA:
 * 2,5 kg por m² para cada milímetro de vidro (densidade aproximada do vidro, 2.500 kg/m³).
 */
export const TECH = { kgPerM2PerMm: 2.5 };

export interface QuotePiece {
  id: string;
  line: string;
  composition: string;
  color: string;
  /** Espessuras das lâminas de vidro em mm, ex.: "8" ou "4+4". Espaço de ar não entra. */
  thickness: string;
  width: number; // mm
  height: number; // mm
  quantity: number;
  finishes: string;
  holes: string;
  cutouts: string;
  notes: string;
}

export interface QuoteCustomer {
  name: string;
  company: string;
  cnpj: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  notes: string;
}

export const emptyCustomer: QuoteCustomer = { name: "", company: "", cnpj: "", whatsapp: "", email: "", city: "", state: "", notes: "" };

export const emptyPiece = (): Omit<QuotePiece, "id"> => ({
  line: "Laminados", composition: "", color: "Incolor", thickness: "", width: 0, height: 0, quantity: 1, finishes: "", holes: "", cutouts: "", notes: "",
});

/** Soma as lâminas informadas ("4+4" → 8). Ignora texto que não seja número. */
export function parseGlassThickness(text: string): number {
  return (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => parseFloat(n.replace(",", "."))).reduce((a, b) => a + b, 0);
}

export const pieceArea = (p: Pick<QuotePiece, "width" | "height">) => (p.width / 1000) * (p.height / 1000);
export const pieceTotalArea = (p: QuotePiece) => pieceArea(p) * p.quantity;
export const pieceWeight = (p: QuotePiece) => pieceTotalArea(p) * parseGlassThickness(p.thickness) * TECH.kgPerM2PerMm;

export function totals(pieces: QuotePiece[]) {
  return {
    count: pieces.reduce((a, p) => a + p.quantity, 0),
    area: pieces.reduce((a, p) => a + pieceTotalArea(p), 0),
    weight: pieces.reduce((a, p) => a + pieceWeight(p), 0),
  };
}

export const fmt = (n: number, d = 2) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function validatePiece(p: Omit<QuotePiece, "id">): string | null {
  if (!p.line) return "Escolha a linha de produto.";
  if (!(p.width > 0) || !(p.height > 0)) return "Informe largura e altura em milímetros.";
  if (!(p.quantity >= 1)) return "A quantidade mínima é 1.";
  return null;
}

export function validateCustomer(c: QuoteCustomer): string | null {
  if (c.name.trim().length < 2) return "Informe seu nome.";
  if (c.whatsapp.replace(/\D/g, "").length < 10) return "Informe um WhatsApp com DDD.";
  if (c.email && !/^\S+@\S+\.\S+$/.test(c.email)) return "Confira o e-mail informado.";
  if (!c.city.trim() || !c.state.trim()) return "Informe cidade e estado.";
  return null;
}

/** Mensagem formatada para o WhatsApp oficial. Não inclui preço nem prazo. */
export function buildMessage(c: QuoteCustomer, pieces: QuotePiece[], attachments: string[] = []) {
  const t = totals(pieces);
  const lines: string[] = ["*Pedido de orçamento — site Glassmaxi*", ""];
  lines.push(`*Cliente:* ${c.name}`);
  if (c.company) lines.push(`*Empresa:* ${c.company}`);
  if (c.cnpj) lines.push(`*CNPJ:* ${c.cnpj}`);
  lines.push(`*WhatsApp:* ${c.whatsapp}`);
  if (c.email) lines.push(`*E-mail:* ${c.email}`);
  lines.push(`*Cidade:* ${c.city} - ${c.state}`, "", `*Peças (${pieces.length} ${pieces.length === 1 ? "item" : "itens"})*`);
  pieces.forEach((p, i) => {
    lines.push("", `*${i + 1}. ${p.line}*`);
    if (p.composition) lines.push(`Composição: ${p.composition}`);
    lines.push(`Cor: ${p.color}`);
    if (p.thickness) lines.push(`Espessura (vidro): ${p.thickness} mm`);
    lines.push(`Medidas: ${p.width} x ${p.height} mm (L x A)`, `Quantidade: ${p.quantity} un.`, `Área: ${fmt(pieceTotalArea(p))} m²`);
    if (p.finishes) lines.push(`Acabamentos: ${p.finishes}`);
    if (p.holes) lines.push(`Furos: ${p.holes}`);
    if (p.cutouts) lines.push(`Recortes: ${p.cutouts}`);
    if (p.notes) lines.push(`Obs.: ${p.notes}`);
  });
  lines.push("", `*Área total:* ${fmt(t.area)} m²`, `*Quantidade total:* ${t.count} un.`);
  if (t.weight > 0) lines.push(`*Peso estimado:* ${fmt(t.weight, 1)} kg (estimativa)`);
  if (c.notes) lines.push("", `*Observações:* ${c.notes}`);
  if (attachments.length) lines.push("", `*Anexos técnicos:* vou enviar nesta conversa ${attachments.length} arquivo(s): ${attachments.join(", ")}`);
  return lines.join("\n");
}

export const quoteWhatsappUrl = (msg: string) => `https://wa.me/${company.whatsapp.number}?text=${encodeURIComponent(msg)}`;
