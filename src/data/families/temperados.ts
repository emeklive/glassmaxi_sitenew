import type { Family } from "../types";

const SOURCE = "Abravidro, 27/01/2020: certificação Inmetro dos temperados de 4, 6, 8 e 10 mm";

export const temperados: Family = {
  id: "temperados",
  name: "Temperados",
  singular: "Vidro temperado",
  tagline: "Uma única lâmina, transformada pelo calor.",
  description:
    "Vidro de segurança com alta resistência térmica e mecânica, indicado para portas, fachadas, boxes e áreas externas.",
  structure:
    "O temperado é monolítico: uma lâmina só. O que muda é a tensão interna criada pelo aquecimento e pelo resfriamento controlado, não a quantidade de camadas.",
  confirmation: "site-oficial",
  colors: ["incolor", "verde", "fume"],
  compositions: [4, 6, 8, 10].map((t) => ({ id: `${t}`, label: `${t} mm`, glass: [t], status: "publico" as const, source: SOURCE })),
  features: ["Alta resistência térmica e mecânica", "Corte, furos e recortes feitos antes da têmpera", "Fornos próprios de têmpera"],
  applications: ["Portas", "Fachadas", "Boxes", "Áreas externas"],
  process: [
    { title: "Corte", text: "A chapa é cortada na medida do projeto em mesa automatizada." },
    { title: "Lapidação", text: "As bordas recebem acabamento, o que também prepara a peça para o forno." },
    { title: "Usinagem", text: "Furos e recortes, quando o projeto pede, são feitos nesta etapa. Depois de temperado, o vidro não pode mais ser cortado." },
    { title: "Aquecimento", text: "A peça percorre o forno até a temperatura de têmpera." },
    { title: "Resfriamento controlado", text: "Jatos de ar resfriam as superfícies rapidamente. Elas ficam comprimidas e o núcleo, tracionado: é isso que dá a resistência." },
    { title: "Inspeção", text: "A peça é conferida antes de seguir para a expedição." },
  ],
  beats: [
    { id: "inteiro", title: "Uma lâmina só", text: "O temperado não tem camadas coladas. Tudo acontece dentro da própria lâmina.", exploded: 0, yaw: -0.5, pitch: 0.12, zoom: 1, step: -1 },
    { id: "corte", title: "Corte", text: "A chapa é cortada na medida exata do projeto.", exploded: 0, yaw: -0.2, pitch: 0.1, zoom: 1.05, step: 0 },
    { id: "lapidacao", title: "Lapidação", text: "As bordas ganham acabamento.", exploded: 0, yaw: 0.35, pitch: 0.18, zoom: 1.25, step: 1 },
    { id: "usinagem", title: "Usinagem", text: "Furos e recortes entram agora, antes do forno.", exploded: 0, yaw: 0.1, pitch: 0.05, zoom: 1.15, step: 2 },
    { id: "aquecimento", title: "Aquecimento", text: "A peça é aquecida por inteiro no forno de têmpera.", exploded: 0, yaw: -0.45, pitch: 0.2, zoom: 1.1, step: 3 },
    { id: "resfriamento", title: "Resfriamento controlado", text: "O ar resfria as faces e cria a tensão que protege o vidro.", exploded: 0, yaw: -0.9, pitch: 0.12, zoom: 1.1, step: 4 },
    { id: "secao", title: "Por dentro da lâmina", text: "Em corte: superfícies comprimidas, núcleo tracionado. Representação ilustrativa.", exploded: 0, yaw: -1.0, pitch: 0.16, zoom: 1.5, step: -1, section: true },
    { id: "inspecao", title: "Inspeção", text: "Conferida, a peça está pronta para a obra.", exploded: 0, yaw: -0.4, pitch: 0.1, zoom: 1, step: 5 },
  ],
  shape: "plano",
  controls: { explode: false },
  build: (c) => [
    {
      id: "lamina",
      kind: "glass",
      label: "Lâmina temperada",
      description: "Peça única de vidro. Faces e bordas ficam sob compressão depois do resfriamento controlado.",
      thickness: c.glass[0],
      visual: c.glass[0],
    },
  ],
  image: "/media/brand/amostra-laminado.webp",
  notice: "Espessuras de 4, 6, 8 e 10 mm constam no registro público de certificação de 2020. Confirme a disponibilidade atual com a equipe técnica.",
};
