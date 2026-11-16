import type { Family } from "../types";

export const jumbos: Family = {
  id: "jumbos",
  name: "Jumbos",
  singular: "Vidro jumbo",
  tagline: "Grandes chapas para grandes vãos.",
  description: "Peças em grandes dimensões para fachadas e superfícies amplas, com menos emendas e mais continuidade visual.",
  structure: "Jumbo é uma categoria de formato: o que define a linha é a dimensão da chapa, não uma composição de camadas.",
  confirmation: "briefing",
  colors: ["incolor", "verde", "fume"],
  compositions: [
    { id: "8", label: "8 mm", glass: [8], status: "demonstracao" },
    { id: "10", label: "10 mm", glass: [10], status: "demonstracao" },
    { id: "12", label: "12 mm", glass: [12], status: "demonstracao" },
  ],
  features: ["Grandes superfícies", "Menos emendas na fachada", "Escala comparativa no modelo"],
  applications: ["Fachadas", "Edifícios", "Ambientes comerciais", "Vitrines"],
  beats: [
    { id: "chapa", title: "Uma chapa", text: "Compare com a altura de uma pessoa.", exploded: 0, yaw: -0.45, pitch: 0.1, zoom: 1, view: "perspectiva" },
    { id: "frente", title: "De frente", text: "Largura e altura em proporção real.", exploded: 0, yaw: 0, pitch: 0.02, zoom: 1.05, view: "frente" },
    { id: "lateral", title: "De lado", text: "Uma lâmina fina cobrindo um vão inteiro.", exploded: 0, yaw: -1.35, pitch: 0.06, zoom: 1.1, view: "lateral" },
    { id: "fachada", title: "Na fachada", text: "Chapas grandes reduzem as emendas da pele de vidro.", exploded: 0, yaw: -0.5, pitch: 0.16, zoom: 0.62, view: "arquitetura" },
    { id: "volta", title: "Sob medida", text: "As dimensões de cada projeto são definidas com a engenharia comercial.", exploded: 0, yaw: -0.4, pitch: 0.1, zoom: 1, view: "perspectiva" },
  ],
  shape: "plano",
  controls: { explode: false, dimensions: true },
  build: (c) => [
    { id: "chapa", kind: "glass", label: "Chapa em grande formato", description: "Lâmina única em grande dimensão.", thickness: c.glass[0], visual: c.glass[0] },
  ],
  notice: "Linha sob consulta. O controle de largura e altura é uma escala visual: as dimensões máximas de produção são informadas pela engenharia comercial Glassmaxi.",
};
