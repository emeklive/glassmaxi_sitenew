import type { Family, LayerSpec } from "../types";

export const INTERLAYER_TEXT =
  "Película interna que une as lâminas. O material e a espessura são definidos pela especificação técnica de cada pedido.";

export function laminatedStack(glass: number[]): LayerSpec[] {
  const out: LayerSpec[] = [];
  glass.forEach((t, i) => {
    out.push({
      id: `vidro-${i + 1}`,
      kind: "glass",
      label: glass.length === 2 ? (i === 0 ? "Primeira lâmina de vidro" : "Segunda lâmina de vidro") : `Lâmina de vidro ${i + 1}`,
      description: "Lâmina de vidro da composição.",
      thickness: t,
      visual: t,
    });
    if (i < glass.length - 1) {
      out.push({ id: `pelicula-${i + 1}`, kind: "interlayer", label: glass.length === 2 ? "Película interna" : `Película interna ${i + 1}`, description: INTERLAYER_TEXT, thickness: null, visual: 1.4 });
    }
  });
  return out;
}

export const laminados: Family = {
  id: "laminados",
  name: "Laminados",
  singular: "Vidro laminado",
  tagline: "Duas ou mais lâminas unidas por uma película.",
  description:
    "Segurança reforçada com película interna, proteção acústica e controle solar. Se quebrar, a película segura os fragmentos no lugar.",
  structure: "São duas ou mais lâminas de vidro unidas por uma película interna.",
  confirmation: "site-oficial",
  colors: ["incolor", "verde", "fume", "prata", "champagne"],
  compositions: [
    { id: "3+3", label: "3 + 3 mm", glass: [3, 3], status: "demonstracao" },
    { id: "4+4", label: "4 + 4 mm", glass: [4, 4], status: "demonstracao" },
    { id: "5+5", label: "5 + 5 mm", glass: [5, 5], status: "demonstracao" },
  ],
  features: ["Segurança reforçada", "Proteção acústica", "Controle solar", "Versões Incolor, Refletivo Prata e Refletivo Champagne"],
  applications: ["Fachadas", "Guarda-corpos", "Coberturas", "Divisórias", "Vitrines", "Janelas", "Portas", "Esquadrias"],
  beats: [
    { id: "montado", title: "Laminado montado", text: "Por fora, parece uma lâmina só.", exploded: 0, yaw: -0.55, pitch: 0.14, zoom: 1 },
    { id: "primeira", title: "Primeira lâmina", text: "A face externa da composição.", exploded: 0.4, focus: "vidro-1", yaw: -0.85, pitch: 0.16, zoom: 1.05 },
    { id: "pelicula", title: "Película interna", text: "É ela que une as lâminas e segura os fragmentos se o vidro quebrar.", exploded: 0.8, focus: "pelicula-1", yaw: -1.0, pitch: 0.2, zoom: 1.15 },
    { id: "segunda", title: "Segunda lâmina", text: "Fecha o conjunto do outro lado.", exploded: 0.8, focus: "vidro-2", yaw: -1.15, pitch: 0.16, zoom: 1.05 },
    { id: "explodida", title: "Vista explodida", text: "Todas as peças lado a lado.", exploded: 1, focus: null, yaw: -0.95, pitch: 0.24, zoom: 0.92 },
    { id: "reconstruida", title: "Composição reconstruída", text: "As lâminas voltam a ser um vidro só.", exploded: 0, focus: null, yaw: -0.45, pitch: 0.12, zoom: 1 },
  ],
  shape: "plano",
  controls: { explode: true },
  build: (c) => laminatedStack(c.glass),
  image: "/media/brand/amostra-incolor.webp",
  notice: "Composições de demonstração. Lâminas, película e espessuras finais são confirmadas pela equipe técnica Glassmaxi.",
};
