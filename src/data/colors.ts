import type { GlassColorId } from "./types";

export interface GlassColor {
  id: GlassColorId;
  name: string;
  /** Cor do material no 3D. */
  tint: string;
  /** Cor mais densa vista pela borda. */
  edge: string;
  opacity: number;
  reflective: boolean;
  swatch: string;
  note?: string;
}

export const glassColors: Record<GlassColorId, GlassColor> = {
  incolor: { id: "incolor", name: "Incolor", tint: "#c4ece4", edge: "#4fb8a4", opacity: 0.24, reflective: false, swatch: "linear-gradient(135deg,#f4fbfa,#bfe3dc)" },
  verde: { id: "verde", name: "Verde", tint: "#7fc7a0", edge: "#2f8f66", opacity: 0.5, reflective: false, swatch: "linear-gradient(135deg,#bfe6cf,#4fa67c)" },
  fume: { id: "fume", name: "Fumê", tint: "#5d6470", edge: "#2c313a", opacity: 0.62, reflective: false, swatch: "linear-gradient(135deg,#9aa0aa,#3b404a)" },
  prata: {
    id: "prata", name: "Prata", tint: "#c9ced6", edge: "#8d949e", opacity: 0.78, reflective: true,
    swatch: "linear-gradient(135deg,#f1f3f6,#9aa1ab)",
    note: "Laminado refletivo. Efeitos de privacidade e controle solar dependem da ficha técnica do produto.",
  },
  champagne: {
    id: "champagne", name: "Champagne", tint: "#d9c4a3", edge: "#a98d62", opacity: 0.74, reflective: true,
    swatch: "linear-gradient(135deg,#efe3cf,#b89a6c)",
    note: "Laminado refletivo. Efeitos de controle solar dependem da ficha técnica do produto.",
  },
};

export const baseColors: GlassColorId[] = ["incolor", "verde", "fume"];
