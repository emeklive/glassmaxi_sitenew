"use client";
import type { LayerSpec } from "@/data/types";
import { glassColors } from "@/data/colors";
import type { GlassColorId } from "@/data/types";

const FILL: Record<LayerSpec["kind"], string> = {
  glass: "#bfe3dc",
  interlayer: "#FF6E27",
  spacer: "#c9ced6",
  cavity: "#dbe7ff",
  sealant: "#1b2030",
  reflective: "#eef1f6",
  backing: "#59606d",
};

interface Props {
  layers: LayerSpec[];
  exploded: number;
  color: GlassColorId;
  selected?: string | null;
  hidden?: string[];
  onSelect?: (id: string) => void;
  compact?: boolean;
  title?: string;
}

/**
 * Diagrama 2D da composição, gerado dos mesmos dados do modelo 3D.
 * É a alternativa quando o WebGL não está disponível e o desenho exibido enquanto o 3D carrega.
 */
export function LayerDiagram({ layers, exploded, color, selected, hidden = [], onSelect, compact, title }: Props) {
  const shown = layers.filter((l) => !hidden.includes(l.id));
  const faceW = 150;
  const faceH = 236;
  const skew = 46;
  let x = 0;
  const items = shown.map((l) => {
    const t = Math.max(4, l.visual * 1.7);
    const item = { l, x, t };
    x += t + exploded * 30;
    return item;
  });
  const total = x - exploded * 30;
  const width = faceW + total + 40;
  const height = faceH + skew + 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={compact ? "diagram diagram-compact" : "diagram"} role="group" aria-label={title ?? "Diagrama da composição do vidro"}>
      {items.map(({ l, x: lx, t }) => {
        const fill = l.kind === "glass" ? glassColors[color].tint : FILL[l.kind];
        const x0 = 20 + lx;
        const isSel = selected === l.id;
        const op = selected && !isSel ? 0.35 : l.kind === "glass" ? 0.78 : l.kind === "cavity" ? 0.45 : 0.95;
        const face = `${x0},${15 + skew} ${x0 + faceW},15 ${x0 + faceW},${15 + faceH} ${x0},${15 + skew + faceH}`;
        const side = `${x0 + faceW},15 ${x0 + faceW + t},15 ${x0 + faceW + t},${15 + faceH} ${x0 + faceW},${15 + faceH}`;
        const top = `${x0},${15 + skew} ${x0 + t},${15 + skew} ${x0 + faceW + t},15 ${x0 + faceW},15`;
        return (
          <g
            key={l.id}
            opacity={op}
            tabIndex={onSelect ? 0 : undefined}
            role={onSelect ? "button" : undefined}
            aria-label={onSelect ? l.label : undefined}
            aria-pressed={onSelect ? isSel : undefined}
            onClick={onSelect ? () => onSelect(l.id) : undefined}
            onKeyDown={onSelect ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(l.id)) : undefined}
            style={{ cursor: onSelect ? "pointer" : "default" }}
          >
            <title>{l.label}</title>
            <polygon points={top} fill={fill} stroke={isSel ? "#FF6E27" : "#122366"} strokeWidth={isSel ? 2.5 : 0.8} />
            <polygon points={side} fill={fill} stroke={isSel ? "#FF6E27" : "#122366"} strokeWidth={isSel ? 2.5 : 0.8} />
            <polygon points={face} fill={fill} stroke={isSel ? "#FF6E27" : "#122366"} strokeWidth={isSel ? 2.5 : 0.8} />
          </g>
        );
      })}
    </svg>
  );
}
