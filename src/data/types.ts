export type FamilyId =
  | "temperados"
  | "laminados"
  | "insulados"
  | "multilaminados"
  | "espelhos"
  | "jumbos"
  | "modelados";

export type GlassColorId = "incolor" | "verde" | "fume" | "prata" | "champagne";

export type LayerKind = "glass" | "interlayer" | "spacer" | "cavity" | "sealant" | "reflective" | "backing";

/** Uma peça física do modelo. O mesmo descritor alimenta o 3D, o diagrama 2D e o inspetor. */
export interface LayerSpec {
  id: string;
  kind: LayerKind;
  label: string;
  description: string;
  /** Espessura real em mm. `null` quando a medida depende de ficha técnica ainda não confirmada. */
  thickness: number | null;
  /** Espessura usada só para desenhar (películas e revestimentos são ampliados para ficarem visíveis). */
  visual: number;
}

/**
 * `publico`: dado encontrado em fonte pública citada em `source`.
 * `demonstracao`: valor usado apenas para o visualizador funcionar; precisa ser trocado pelo catálogo técnico.
 */
export type DataStatus = "publico" | "demonstracao";

export interface Composition {
  id: string;
  label: string;
  /** Espessuras das lâminas de vidro, em mm, da face externa para a interna. */
  glass: number[];
  /** Câmara intermediária em mm (insulados). Não entra no cálculo de peso. */
  cavity?: number;
  status: DataStatus;
  source?: string;
}

export interface Beat {
  id: string;
  title: string;
  text: string;
  exploded: number;
  focus?: string | null;
  yaw: number;
  pitch: number;
  zoom: number;
  step?: number;
  section?: boolean;
  view?: ViewId;
}

export type ViewId = "perspectiva" | "frente" | "verso" | "lateral" | "arquitetura";

export interface ProcessStep {
  title: string;
  text: string;
}

export interface BuildOptions {
  layerCount: number;
}

export interface Family {
  id: FamilyId;
  name: string;
  singular: string;
  tagline: string;
  description: string;
  /** Explica a estrutura física real da linha (evita representar o produto de forma enganosa). */
  structure: string;
  /** `site-oficial`: linha divulgada em glassmaxi.com.br. `briefing`: linha indicada pela empresa, a detalhar. */
  confirmation: "site-oficial" | "briefing";
  colors: GlassColorId[];
  compositions: Composition[];
  features: string[];
  applications: string[];
  process?: ProcessStep[];
  beats: Beat[];
  shape: "plano" | "curvo";
  controls: {
    layerCount?: { min: number; max: number; status: DataStatus };
    dimensions?: boolean;
    curvature?: boolean;
    backView?: boolean;
    explode: boolean;
  };
  build: (composition: Composition, options: BuildOptions) => LayerSpec[];
  /** Fotografia de material fornecido pela empresa, quando existe. */
  image?: string;
  /** Aviso técnico exibido junto ao configurador. */
  notice: string;
}
