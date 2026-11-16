import type { Family } from "../types";

export const modelados: Family = {
  id: "modelados",
  name: "Modelados",
  singular: "Vidro modelado",
  tagline: "O vidro acompanha a curva do projeto.",
  description: "Vidros com geometria curva para fachadas, guarda-corpos e elementos arquitetônicos.",
  structure: "Uma lâmina conformada em curva. A geometria possível depende da análise técnica de cada peça.",
  confirmation: "briefing",
  colors: ["incolor", "verde", "fume"],
  compositions: [
    { id: "6", label: "6 mm", glass: [6], status: "demonstracao" },
    { id: "8", label: "8 mm", glass: [8], status: "demonstracao" },
    { id: "10", label: "10 mm", glass: [10], status: "demonstracao" },
  ],
  features: ["Geometria curva", "Ajuste visual da curvatura", "Vistas frontal e lateral"],
  applications: ["Fachadas", "Guarda-corpos", "Projetos arquitetônicos", "Ambientes comerciais"],
  beats: [
    { id: "curva", title: "Uma lâmina em curva", text: "O vidro deixa de ser plano para seguir o desenho.", exploded: 0, yaw: -0.6, pitch: 0.2, zoom: 1 },
    { id: "topo", title: "A curvatura", text: "Vista de cima, a curva aparece inteira.", exploded: 0, yaw: -0.3, pitch: 0.95, zoom: 1.05 },
    { id: "frente", title: "De frente", text: "A altura da peça se mantém; o que muda é o raio.", exploded: 0, yaw: 0, pitch: 0.05, zoom: 1.05, view: "frente" },
    { id: "lateral", title: "De lado", text: "A espessura acompanha toda a curva.", exploded: 0, yaw: -1.4, pitch: 0.1, zoom: 1.1, view: "lateral" },
    { id: "volta", title: "Do desenho à peça", text: "Cada geometria passa por análise técnica antes da produção.", exploded: 0, yaw: -0.55, pitch: 0.2, zoom: 1 },
  ],
  shape: "curvo",
  controls: { explode: false, curvature: true },
  build: (c) => [
    { id: "lamina", kind: "glass", label: "Lâmina curva", description: "Peça única de vidro conformada em curva.", thickness: c.glass[0], visual: c.glass[0] },
  ],
  notice: "Linha sob consulta. Os formatos do modelo são de demonstração: raios e geometrias viáveis são confirmados pela equipe técnica Glassmaxi.",
};

export const curveShapes = [
  { id: "arco", name: "Curva simples" },
  { id: "s", name: "Curva em S" },
  { id: "canto", name: "Canto curvo" },
] as const;
export type CurveShapeId = (typeof curveShapes)[number]["id"];
