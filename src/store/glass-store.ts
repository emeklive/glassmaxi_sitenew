"use client";
import { create } from "zustand";
import type { Composition, FamilyId, GlassColorId, LayerSpec, ViewId } from "@/data/types";
import { familyById } from "@/data/families";
import type { CurveShapeId } from "@/data/families/modelados";

/**
 * Estado central de produto. As sete famílias compartilham este único estado:
 * o 3D, o diagrama 2D, os seletores, a narrativa de scroll e o orçamento leem daqui.
 */
export interface GlassState {
  productLine: FamilyId;
  composition: string;
  glassColor: GlassColorId;
  layerCount: number;
  dimensions: { width: number; height: number }; // mm
  curvature: number; // 0..1
  curveShape: CurveShapeId;
  quantity: number;
  selectedLayer: string | null;
  hiddenLayers: string[];
  explodedProgress: number; // 0..1
  cameraRotation: { yaw: number; pitch: number };
  zoom: number;
  view: ViewId;
  processStep: number; // -1 = nenhum
  section: boolean;
  modelStatus: "idle" | "loading" | "ready" | "fallback" | "lost";

  setLine: (id: FamilyId) => void;
  setComposition: (id: string) => void;
  setColor: (id: GlassColorId) => void;
  setLayerCount: (n: number) => void;
  setDimensions: (d: Partial<{ width: number; height: number }>) => void;
  setCurvature: (v: number) => void;
  setCurveShape: (v: CurveShapeId) => void;
  selectLayer: (id: string | null) => void;
  toggleHidden: (id: string) => void;
  setExploded: (v: number) => void;
  rotate: (dyaw: number, dpitch: number) => void;
  setZoom: (z: number) => void;
  setView: (v: ViewId) => void;
  setProcessStep: (n: number) => void;
  setSection: (v: boolean) => void;
  setStatus: (s: GlassState["modelStatus"]) => void;
  resetView: () => void;
  restoreModel: () => void;
  apply: (p: Partial<GlassState>) => void;
}

const DEFAULT_ROT = { yaw: -0.55, pitch: 0.14 };
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const PITCH_LIMIT = 1.1;
export const ZOOM_LIMIT = { min: 0.5, max: 2.2 };

const VIEW_ROT: Record<ViewId, { yaw: number; pitch: number; zoom: number }> = {
  perspectiva: { ...DEFAULT_ROT, zoom: 1 },
  frente: { yaw: 0, pitch: 0.02, zoom: 1.05 },
  verso: { yaw: Math.PI, pitch: 0.02, zoom: 1.05 },
  lateral: { yaw: -1.4, pitch: 0.06, zoom: 1.1 },
  arquitetura: { yaw: -0.5, pitch: 0.16, zoom: 0.62 },
};

function defaultsFor(id: FamilyId) {
  const f = familyById[id];
  const mid = f.compositions[Math.min(1, f.compositions.length - 1)];
  return {
    productLine: id,
    composition: mid.id,
    glassColor: "incolor" as GlassColorId,
    layerCount: f.controls.layerCount?.min ?? mid.glass.length,
    dimensions: id === "jumbos" ? { width: 3000, height: 2400 } : { width: 1000, height: 1350 },
    curvature: 0.55,
    curveShape: "arco" as CurveShapeId,
    selectedLayer: null,
    hiddenLayers: [] as string[],
    explodedProgress: 0,
    cameraRotation: { ...DEFAULT_ROT },
    zoom: 1,
    view: "perspectiva" as ViewId,
    processStep: -1,
    section: false,
  };
}

export const useGlass = create<GlassState>((set, get) => ({
  ...defaultsFor("laminados"),
  quantity: 1,
  modelStatus: "idle",

  setLine: (id) => set((s) => ({ ...defaultsFor(id), glassColor: familyById[id].colors.includes(s.glassColor) ? s.glassColor : "incolor" })),
  setComposition: (id) => set({ composition: id, selectedLayer: null, hiddenLayers: [] }),
  setColor: (id) => {
    if (familyById[get().productLine].colors.includes(id)) set({ glassColor: id });
  },
  setLayerCount: (n) => {
    const lim = familyById[get().productLine].controls.layerCount;
    if (!lim) return;
    set({ layerCount: clamp(Math.round(n), lim.min, lim.max), selectedLayer: null, hiddenLayers: [] });
  },
  setDimensions: (d) =>
    set((s) => ({
      dimensions: {
        width: clamp(d.width ?? s.dimensions.width, 300, 6000),
        height: clamp(d.height ?? s.dimensions.height, 300, 3300),
      },
    })),
  setCurvature: (v) => set({ curvature: clamp(v, 0.1, 1) }),
  setCurveShape: (v) => set({ curveShape: v }),
  selectLayer: (id) => set((s) => ({ selectedLayer: s.selectedLayer === id ? null : id })),
  toggleHidden: (id) =>
    set((s) => ({
      hiddenLayers: s.hiddenLayers.includes(id) ? s.hiddenLayers.filter((x) => x !== id) : [...s.hiddenLayers, id],
      selectedLayer: s.selectedLayer === id ? null : s.selectedLayer,
    })),
  setExploded: (v) => set({ explodedProgress: clamp(v, 0, 1) }),
  rotate: (dyaw, dpitch) =>
    set((s) => ({
      view: "perspectiva",
      cameraRotation: { yaw: s.cameraRotation.yaw + dyaw, pitch: clamp(s.cameraRotation.pitch + dpitch, -PITCH_LIMIT, PITCH_LIMIT) },
    })),
  setZoom: (z) => set({ zoom: clamp(z, ZOOM_LIMIT.min, ZOOM_LIMIT.max) }),
  setView: (v) => set({ view: v, cameraRotation: { yaw: VIEW_ROT[v].yaw, pitch: VIEW_ROT[v].pitch }, zoom: VIEW_ROT[v].zoom }),
  setProcessStep: (n) => set({ processStep: n }),
  setSection: (v) => set({ section: v }),
  setStatus: (s) => set({ modelStatus: s }),
  resetView: () => set({ cameraRotation: { ...DEFAULT_ROT }, zoom: 1, view: "perspectiva" }),
  restoreModel: () => set((s) => ({ ...defaultsFor(s.productLine), glassColor: s.glassColor, composition: s.composition, layerCount: s.layerCount })),
  apply: (p) => set(p),
}));

export function currentComposition(s: Pick<GlassState, "productLine" | "composition">): Composition {
  const f = familyById[s.productLine];
  return f.compositions.find((c) => c.id === s.composition) ?? f.compositions[0];
}

export function currentLayers(s: Pick<GlassState, "productLine" | "composition" | "layerCount">): LayerSpec[] {
  return familyById[s.productLine].build(currentComposition(s), { layerCount: s.layerCount });
}

/** Soma das espessuras de vidro (mm). A câmara de ar e as películas não entram. */
export function glassThickness(layers: LayerSpec[]) {
  return layers.filter((l) => l.kind === "glass").reduce((a, l) => a + (l.thickness ?? 0), 0);
}

export function compositionText(s: Pick<GlassState, "productLine" | "composition" | "layerCount">) {
  const c = currentComposition(s);
  if (s.productLine === "multilaminados") return `${s.layerCount} lâminas de ${c.glass[0]} mm`;
  return c.label;
}
