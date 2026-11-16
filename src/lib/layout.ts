import type { LayerSpec } from "@/data/types";

/** Ampliação visual da espessura: um vidro de 8 mm seria quase invisível em escala real. */
export const THICKNESS_SCALE = 5;
const mm = (v: number) => (v * THICKNESS_SCALE) / 1000;

export interface PlacedLayer extends LayerSpec {
  /** Centro em Z com o conjunto montado (unidades de cena). */
  baseZ: number;
  /** Espessura desenhada (unidades de cena). */
  depth: number;
  /** Posição ordinal usada para afastar as peças na vista explodida. */
  slot: number;
  count: number;
}

const FRAME = new Set(["spacer", "cavity", "sealant"]);

/** Distribui as camadas ao longo do eixo Z. Espaçador, câmara e vedação dividem o mesmo intervalo. */
export function placeLayers(layers: LayerSpec[]): PlacedLayer[] {
  const out: PlacedLayer[] = [];
  let z = 0;
  let i = 0;
  while (i < layers.length) {
    const l = layers[i];
    if (FRAME.has(l.kind)) {
      const group: LayerSpec[] = [];
      while (i < layers.length && FRAME.has(layers[i].kind)) group.push(layers[i++]);
      const d = mm(Math.max(...group.map((g) => g.visual)));
      group.forEach((g) => out.push({ ...g, baseZ: z + d / 2, depth: d, slot: 0, count: 0 }));
      z += d;
    } else {
      const d = mm(l.visual);
      out.push({ ...l, baseZ: z + d / 2, depth: d, slot: 0, count: 0 });
      z += d;
      i++;
    }
  }
  const total = z;
  return out.map((l, idx) => ({ ...l, baseZ: l.baseZ - total / 2, slot: idx, count: out.length }));
}

/** Z final de uma camada para um dado progresso de explosão (0 = montado, 1 = explodido). */
export function layerZ(l: PlacedLayer, exploded: number, gap: number) {
  return l.baseZ + (l.slot - (l.count - 1) / 2) * gap * exploded;
}

export const totalDepth = (layers: PlacedLayer[]) => layers.reduce((a, l, i, arr) => (i === 0 || l.baseZ !== arr[i - 1].baseZ ? a + l.depth : a), 0);
