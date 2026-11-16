import type { Family } from "../types";

export const insulados: Family = {
  id: "insulados",
  name: "Insulados",
  singular: "Vidro insulado",
  tagline: "Dois vidros e uma câmara entre eles.",
  description:
    "Vidro duplo formado por duas lâminas separadas por uma câmara selada, pensado para conforto ambiental.",
  structure: "Dois vidros mantidos afastados por um espaçador. A câmara entre eles é selada em todo o perímetro.",
  confirmation: "briefing",
  colors: ["incolor", "verde", "fume"],
  compositions: [
    { id: "6-12-6", label: "6 | câmara 12 | 6 mm", glass: [6, 6], cavity: 12, status: "demonstracao" },
    { id: "8-12-6", label: "8 | câmara 12 | 6 mm", glass: [8, 6], cavity: 12, status: "demonstracao" },
    { id: "6-16-6", label: "6 | câmara 16 | 6 mm", glass: [6, 6], cavity: 16, status: "demonstracao" },
  ],
  features: ["Composição dupla", "Câmara intermediária selada", "Vedação em todo o perímetro"],
  applications: ["Fachadas", "Janelas", "Edifícios", "Ambientes comerciais"],
  beats: [
    { id: "montado", title: "Vidro duplo", text: "Dois vidros trabalhando como uma unidade.", exploded: 0, yaw: -0.6, pitch: 0.14, zoom: 1 },
    { id: "externo", title: "Vidro externo", text: "A face voltada para fora.", exploded: 0.45, focus: "vidro-externo", yaw: -0.9, pitch: 0.16, zoom: 1.05 },
    { id: "espacador", title: "Espaçador", text: "O perfil que mantém as duas lâminas na distância certa.", exploded: 0.8, focus: "espacador", yaw: -1.05, pitch: 0.22, zoom: 1.15 },
    { id: "camara", title: "Câmara intermediária", text: "O espaço entre os vidros. Ele não é vidro e não entra no peso da peça.", exploded: 0.8, focus: "camara", yaw: -1.2, pitch: 0.18, zoom: 1.1 },
    { id: "vedacao", title: "Vedação periférica", text: "Sela a câmara em toda a volta.", exploded: 0.9, focus: "vedacao", yaw: -1.0, pitch: 0.26, zoom: 1.1 },
    { id: "interno", title: "Vidro interno", text: "A face voltada para o ambiente.", exploded: 1, focus: "vidro-interno", yaw: -0.8, pitch: 0.18, zoom: 0.95 },
    { id: "reconstruido", title: "Unidade reconstruída", text: "Tudo de volta ao lugar.", exploded: 0, focus: null, yaw: -0.5, pitch: 0.12, zoom: 1 },
  ],
  shape: "plano",
  controls: { explode: true },
  build: (c) => [
    { id: "vidro-externo", kind: "glass", label: "Vidro externo", description: "Lâmina voltada para o exterior.", thickness: c.glass[0], visual: c.glass[0] },
    { id: "vedacao", kind: "sealant", label: "Vedação periférica", description: "Selagem que fecha a câmara em todo o perímetro.", thickness: null, visual: c.cavity ?? 12 },
    { id: "espacador", kind: "spacer", label: "Espaçador", description: "Perfil que mantém o afastamento entre os vidros. O tipo de espaçador depende da especificação técnica.", thickness: null, visual: c.cavity ?? 12 },
    { id: "camara", kind: "cavity", label: "Câmara intermediária", description: "Espaço selado entre as duas lâminas. O preenchimento depende da especificação técnica.", thickness: c.cavity ?? 12, visual: c.cavity ?? 12 },
    { id: "vidro-interno", kind: "glass", label: "Vidro interno", description: "Lâmina voltada para o ambiente interno.", thickness: c.glass[1], visual: c.glass[1] },
  ],
  notice: "Linha sob consulta. Composições de demonstração: lâminas, câmara, espaçador e preenchimento são definidos pela equipe técnica Glassmaxi.",
};
