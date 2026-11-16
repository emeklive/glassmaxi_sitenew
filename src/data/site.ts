import officialMedia from "./media.generated.json";
import type { FamilyId } from "./types";

export const nav = [
  { href: "/", label: "Início" },
  { href: "/a-glassmaxi/", label: "A Glassmaxi" },
  { href: "/produtos/", label: "Produtos" },
  { href: "/tecnologia-e-processos/", label: "Tecnologia e processos" },
  { href: "/obras/", label: "Obras" },
  { href: "/qualidade/", label: "Qualidade" },
  { href: "/aplicacoes/", label: "Aplicações" },
  { href: "/orcamento/", label: "Orçamento" },
  { href: "/contato/", label: "Contato" },
];

export const footerNav = [
  { href: "/experiencia-3d/", label: "Experiência 3D" },
  { href: "/catalogo/", label: "Catálogo" },
  { href: "/conteudos/", label: "Conteúdos" },
  { href: "/app/", label: "Aplicativo" },
  { href: "/trabalhe-conosco/", label: "Trabalhe conosco" },
  { href: "/politica-de-privacidade/", label: "Privacidade" },
  { href: "/politica-de-cookies/", label: "Cookies" },
];

/** `confirmado`: divulgado pela própria empresa (site oficial ou artes). `consulta`: depende de confirmação. */
export interface ProcessItem {
  id: string;
  title: string;
  text: string;
  status: "confirmado" | "consulta";
  source?: string;
}

export const processes: ProcessItem[] = [
  { id: "materia-prima", title: "Recebimento da matéria-prima", text: "As chapas de vidro chegam, são conferidas e seguem para o estoque até entrarem em produção.", status: "consulta" },
  { id: "corte", title: "Corte", text: "Mesas de corte automatizadas dividem a chapa na medida de cada peça do projeto.", status: "confirmado", source: "glassmaxi.com.br" },
  { id: "lapidacao", title: "Lapidação", text: "As bordas recebem acabamento com precisão milimétrica.", status: "confirmado", source: "glassmaxi.com.br" },
  { id: "usinagem", title: "Usinagem, furos e recortes", text: "Quando o projeto pede, furos e recortes são feitos antes do tratamento térmico.", status: "consulta" },
  { id: "tempera", title: "Têmpera", text: "Nos fornos próprios, o vidro é aquecido e resfriado de forma controlada para ganhar resistência térmica e mecânica.", status: "confirmado", source: "glassmaxi.com.br" },
  { id: "laminacao", title: "Laminação", text: "No forno de laminado sob medida, as lâminas são unidas pela película interna.", status: "confirmado", source: "glassmaxi.com.br" },
  { id: "insulacao", title: "Insulação", text: "Montagem de unidades duplas com câmara selada.", status: "consulta" },
  { id: "conferencia", title: "Conferência", text: "Cada peça é conferida antes de sair da fábrica.", status: "consulta" },
  { id: "expedicao", title: "Expedição", text: "As peças são preparadas para o transporte até a obra ou o cliente.", status: "consulta" },
];

export interface ApplicationItem {
  id: string;
  title: string;
  text: string;
  lines: FamilyId[];
}

export const applications: ApplicationItem[] = [
  { id: "fachadas", title: "Fachadas", text: "Peles de vidro e fechamentos de edifícios.", lines: ["laminados", "temperados", "insulados", "jumbos"] },
  { id: "edificios", title: "Edifícios", text: "Do térreo à cobertura, em obras residenciais e comerciais.", lines: ["laminados", "temperados", "jumbos"] },
  { id: "portas", title: "Portas", text: "Portas de vidro para entradas e ambientes internos.", lines: ["temperados", "laminados"] },
  { id: "janelas", title: "Janelas", text: "Vidros para esquadrias de todos os tamanhos.", lines: ["temperados", "laminados", "insulados"] },
  { id: "boxes", title: "Boxes", text: "Boxes de banheiro sob medida.", lines: ["temperados"] },
  { id: "divisorias", title: "Divisórias", text: "Separação de ambientes sem perder a luz.", lines: ["laminados", "temperados", "multilaminados"] },
  { id: "guarda-corpos", title: "Guarda-corpos", text: "Proteção em sacadas, escadas e mezaninos.", lines: ["laminados", "multilaminados", "modelados"] },
  { id: "coberturas", title: "Coberturas", text: "Coberturas e claraboias em vidro.", lines: ["laminados"] },
  { id: "comerciais", title: "Ambientes comerciais", text: "Vitrines, lojas e escritórios.", lines: ["laminados", "temperados", "espelhos", "jumbos"] },
  { id: "arquitetonicos", title: "Projetos arquitetônicos", text: "Peças especiais para desenhos fora do padrão.", lines: ["modelados", "multilaminados", "jumbos", "espelhos"] },
];

export interface Work {
  id: string;
  src: string;
  alt: string;
  origin: "site-oficial" | "material-da-empresa";
}

const brandWorks: Work[] = ["a", "b", "c", "d"].map((k, i) => ({
  id: `material-${k}`,
  src: `/media/brand/obra-${k}.webp`,
  alt: `Edifício com vidros Glassmaxi em Fortaleza, fotografia ${i + 1} do material institucional`,
  origin: "material-da-empresa" as const,
}));

/** Fotos do site oficial entram aqui depois de `npm run sync:media` (ver scripts/sync-media.mjs). */
const officialWorks: Work[] = (officialMedia.obras as string[]).map((file, i) => ({
  id: `oficial-${i}`,
  src: `/media/official/${file}`,
  alt: `Obra realizada pela Glassmaxi, fotografia ${i + 1} do site oficial`,
  origin: "site-oficial" as const,
}));

export const works: Work[] = [...officialWorks, ...brandWorks];

export interface Slide {
  kicker: string;
  title: string;
  subtitle: string;
  text: string;
  tags: string[];
  image?: string;
  tone: "navy" | "ice" | "orange" | "champagne";
  href: string;
  source: string;
}

/** Carrossel editorial. Só entram linhas e versões divulgadas pela própria empresa. */
export const slides: Slide[] = [
  { kicker: "Vidro", title: "Laminado", subtitle: "Três versões para o seu projeto.", text: "Prata, Incolor e Champagne: a segurança do laminado com o visual certo para cada obra.", tags: ["Segurança reforçada", "Proteção acústica", "Controle solar"], image: "/media/brand/amostra-laminado.webp", tone: "navy", href: "/produtos/laminados/", source: "Arte oficial “Vidro Laminado” 1/6" },
  { kicker: "Vidro", title: "Temperado", subtitle: "Resistência que nasce no forno.", text: "Alta resistência térmica e mecânica para portas, fachadas, boxes e áreas externas.", tags: ["Portas", "Fachadas", "Boxes", "Áreas externas"], tone: "ice", href: "/produtos/temperados/", source: "glassmaxi.com.br e arte “Por trás do vidro” 3/6" },
  { kicker: "Laminado", title: "Incolor", subtitle: "O clássico que combina com tudo.", text: "Transparência máxima e muita luz natural, com toda a segurança do laminado.", tags: ["Guarda-corpos", "Coberturas", "Divisórias", "Vitrines"], image: "/media/brand/amostra-incolor.webp", tone: "orange", href: "/produtos/laminados/?cor=incolor", source: "Arte oficial “Vidro Laminado” 3/6" },
  { kicker: "Laminado refletivo", title: "Prata", subtitle: "Elegância espelhada.", text: "Efeito espelhado por fora: mais privacidade durante o dia e controle solar.", tags: ["Fachadas", "Janelas", "Portas"], image: "/media/brand/amostra-prata.webp", tone: "ice", href: "/produtos/laminados/?cor=prata", source: "Arte oficial “Vidro Laminado” 4/6" },
  { kicker: "Laminado refletivo", title: "Champagne", subtitle: "Sofisticação em tom dourado.", text: "Tom elegante que valoriza a fachada e ajuda no controle solar.", tags: ["Fachadas", "Esquadrias", "Projetos de alto padrão"], image: "/media/brand/amostra-champagne.webp", tone: "champagne", href: "/produtos/laminados/?cor=champagne", source: "Arte oficial “Vidro Laminado” 5/6" },
  { kicker: "Do projeto à fachada", title: "Fachadas", subtitle: "Obras que assinam a cidade.", text: "Projetos para edifícios, com design arquitetônico e durabilidade.", tags: ["Edifícios", "Estruturas", "Alto padrão"], image: "/media/brand/obra-b.webp", tone: "navy", href: "/obras/", source: "glassmaxi.com.br e arte “Por trás do vidro” 5/6" },
];

export interface CatalogItem {
  id: string;
  name: string;
  line: FamilyId;
  color?: string;
  text: string;
  uses: string[];
  image?: string;
  source: string;
}

export const catalog: CatalogItem[] = [
  { id: "temperado", name: "Vidro temperado", line: "temperados", text: "Alta resistência térmica e mecânica. Temperados de 4, 6, 8 e 10 mm com certificação Inmetro registrada em 2020.", uses: ["Portas", "Fachadas", "Boxes", "Áreas externas"], source: "Site oficial; Abravidro 2020" },
  { id: "laminado-incolor", name: "Laminado Incolor", line: "laminados", color: "incolor", text: "Transparência máxima e muita luz natural, com a segurança do laminado.", uses: ["Guarda-corpos", "Coberturas", "Divisórias", "Vitrines"], image: "/media/brand/amostra-incolor.webp", source: "Arte oficial" },
  { id: "laminado-prata", name: "Laminado Refletivo Prata", line: "laminados", color: "prata", text: "Efeito espelhado por fora: mais privacidade durante o dia e controle solar.", uses: ["Fachadas", "Janelas", "Portas"], image: "/media/brand/amostra-prata.webp", source: "Arte oficial" },
  { id: "laminado-champagne", name: "Laminado Refletivo Champagne", line: "laminados", color: "champagne", text: "Tom elegante que valoriza a fachada e ajuda no controle solar.", uses: ["Fachadas", "Esquadrias", "Projetos de alto padrão"], image: "/media/brand/amostra-champagne.webp", source: "Arte oficial" },
  { id: "insulado", name: "Vidro insulado", line: "insulados", text: "Vidro duplo com câmara selada. Especificações sob consulta.", uses: ["Fachadas", "Janelas"], source: "Linha indicada pela empresa" },
  { id: "multilaminado", name: "Vidro multilaminado", line: "multilaminados", text: "Múltiplas lâminas e películas. Especificações sob consulta.", uses: ["Projetos arquitetônicos", "Divisórias"], source: "Linha indicada pela empresa" },
  { id: "espelho", name: "Espelho", line: "espelhos", text: "Espelhos sob medida. Especificações sob consulta.", uses: ["Ambientes comerciais", "Interiores"], source: "Linha indicada pela empresa" },
  { id: "jumbo", name: "Vidro jumbo", line: "jumbos", text: "Peças em grandes dimensões. Medidas máximas sob consulta.", uses: ["Fachadas", "Vitrines"], source: "Linha indicada pela empresa" },
  { id: "modelado", name: "Vidro modelado", line: "modelados", text: "Vidros curvos. Geometrias sob consulta.", uses: ["Guarda-corpos", "Fachadas"], source: "Linha indicada pela empresa" },
];

/**
 * Categorias vistas em diretórios de terceiros (quemfornece.com). São pistas de catálogo,
 * NÃO disponibilidade confirmada. Não aparecem no site até a empresa validar.
 */
export const catalogLeads = ["Vidros decorados e ornamentais", "Vidros impressos", "Vidros float", "Vidros jateados", "Vidros esmaltados", "Tampos de vidro para mesas"];
