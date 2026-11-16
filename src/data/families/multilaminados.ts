import type { Family } from "../types";
import { laminatedStack } from "./laminados";

export const multilaminados: Family = {
  id: "multilaminados",
  name: "Multilaminados",
  singular: "Vidro multilaminado",
  tagline: "Várias lâminas, várias películas, um único vidro.",
  description: "Composição com múltiplas lâminas de vidro intercaladas por películas internas.",
  structure: "Três ou mais lâminas de vidro, sempre com uma película entre cada par.",
  confirmation: "briefing",
  colors: ["incolor", "verde", "fume"],
  compositions: [
    { id: "4", label: "Lâminas de 4 mm", glass: [4], status: "demonstracao" },
    { id: "6", label: "Lâminas de 6 mm", glass: [6], status: "demonstracao" },
    { id: "8", label: "Lâminas de 8 mm", glass: [8], status: "demonstracao" },
  ],
  features: ["Múltiplas lâminas", "Películas intercaladas", "Composição ajustável ao projeto"],
  applications: ["Projetos arquitetônicos", "Ambientes comerciais", "Divisórias", "Guarda-corpos"],
  beats: [
    { id: "montado", title: "Um bloco de vidro", text: "Montado, o multilaminado se comporta como uma peça única.", exploded: 0, yaw: -0.6, pitch: 0.14, zoom: 1 },
    { id: "abre", title: "As lâminas se separam", text: "Cada lâmina de vidro tem uma película de cada lado.", exploded: 0.5, focus: null, yaw: -0.95, pitch: 0.18, zoom: 0.98 },
    { id: "pelicula", title: "As películas", text: "Entre cada par de lâminas, uma película interna.", exploded: 0.85, focus: "pelicula-1", yaw: -1.1, pitch: 0.22, zoom: 1.05 },
    { id: "explodida", title: "Vista explodida", text: "A composição completa, peça por peça.", exploded: 1, focus: null, yaw: -0.9, pitch: 0.26, zoom: 0.85 },
    { id: "reconstruida", title: "Composição reconstruída", text: "Lâminas e películas de volta ao conjunto.", exploded: 0, focus: null, yaw: -0.45, pitch: 0.12, zoom: 1 },
  ],
  shape: "plano",
  controls: { explode: true, layerCount: { min: 3, max: 5, status: "demonstracao" } },
  build: (c, o) => laminatedStack(Array.from({ length: o.layerCount }, () => c.glass[0])),
  notice:
    "Linha sob consulta. Quantidade de lâminas e espessuras são de demonstração. Desempenho de segurança só é informado com documentação técnica do produto.",
};
