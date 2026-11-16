import type { Family } from "../types";

export const espelhos: Family = {
  id: "espelhos",
  name: "Espelhos",
  singular: "Espelho",
  tagline: "Vidro, reflexo e proteção.",
  description: "Espelhos sob medida, com acabamento de borda para cada projeto.",
  structure: "Um vidro que recebe, na face de trás, a camada que reflete e a proteção que a preserva.",
  confirmation: "briefing",
  colors: ["incolor"],
  compositions: [
    { id: "4", label: "4 mm", glass: [4], status: "demonstracao" },
    { id: "6", label: "6 mm", glass: [6], status: "demonstracao" },
  ],
  features: ["Corte sob medida", "Acabamento de borda", "Vista frontal e traseira no modelo"],
  applications: ["Ambientes comerciais", "Projetos arquitetônicos", "Interiores"],
  beats: [
    { id: "frente", title: "A face que reflete", text: "De frente, só se vê o reflexo.", exploded: 0, yaw: -0.35, pitch: 0.1, zoom: 1, view: "frente" },
    { id: "vidro", title: "O vidro", text: "A base de tudo: uma lâmina de vidro.", exploded: 0.6, focus: "substrato", yaw: -0.95, pitch: 0.16, zoom: 1.05 },
    { id: "reflexo", title: "Camada refletiva", text: "Aplicada na face de trás do vidro, é ela que devolve a imagem.", exploded: 1, focus: "refletiva", yaw: -1.15, pitch: 0.2, zoom: 1.1 },
    { id: "protecao", title: "Proteção posterior", text: "Cobre a camada refletiva e a protege.", exploded: 1, focus: "protecao", yaw: -2.2, pitch: 0.16, zoom: 1.05 },
    { id: "verso", title: "O verso", text: "Visto por trás, o espelho mostra o acabamento de proteção.", exploded: 0, focus: null, yaw: -2.75, pitch: 0.1, zoom: 1, view: "verso" },
    { id: "pronto", title: "Espelho pronto", text: "De volta à frente.", exploded: 0, focus: null, yaw: -0.4, pitch: 0.1, zoom: 1 },
  ],
  shape: "plano",
  controls: { explode: true, backView: true },
  build: (c) => [
    { id: "substrato", kind: "glass", label: "Vidro (substrato)", description: "Lâmina de vidro que serve de base ao espelho.", thickness: c.glass[0], visual: c.glass[0] },
    { id: "refletiva", kind: "reflective", label: "Camada refletiva", description: "Camada aplicada na face posterior do vidro, responsável pelo reflexo.", thickness: null, visual: 0.9 },
    { id: "protecao", kind: "backing", label: "Proteção posterior", description: "Acabamento que cobre e protege a camada refletiva. A quantidade e o tipo de camadas seguem o processo do fabricante.", thickness: null, visual: 1.3 },
  ],
  notice: "Linha sob consulta. O modelo mostra a estrutura geral de um espelho; composição e espessuras são confirmadas pela equipe técnica Glassmaxi.",
};
