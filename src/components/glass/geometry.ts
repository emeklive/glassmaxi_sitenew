import * as THREE from "three";
import type { CurveShapeId } from "@/data/families/modelados";

/** Moldura retangular (espaçador, vedação): retângulo externo com furo, extrudado na espessura. */
export function frameGeometry(w: number, h: number, band: number, depth: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2);
  shape.lineTo(w / 2, -h / 2);
  shape.lineTo(w / 2, h / 2);
  shape.lineTo(-w / 2, h / 2);
  shape.closePath();
  const hole = new THREE.Path();
  const iw = w / 2 - band;
  const ih = h / 2 - band;
  hole.moveTo(-iw, -ih);
  hole.lineTo(-iw, ih);
  hole.lineTo(iw, ih);
  hole.lineTo(iw, -ih);
  hole.closePath();
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** Perfil da curva visto de cima: retorna pontos [x, z]. */
export function curveProfile(shape: CurveShapeId, w: number, curvature: number, segments = 56): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments - 0.5;
    let x = 0;
    let z = 0;
    if (shape === "arco") {
      const theta = Math.max(0.05, curvature * 1.9);
      const r = w / theta;
      x = r * Math.sin(u * theta);
      z = r * (1 - Math.cos(u * theta));
    } else if (shape === "s") {
      x = u * w;
      z = Math.sin(u * Math.PI * 2) * curvature * 0.13 * w;
    } else {
      const theta = Math.max(0.05, curvature * (Math.PI / 2));
      if (u < 0) {
        x = u * w;
      } else {
        const r = (0.5 * w) / theta;
        const a = (u / 0.5) * theta;
        x = r * Math.sin(a);
        z = r * (1 - Math.cos(a));
      }
    }
    pts.push([x, z]);
  }
  const cx = (Math.min(...pts.map((p) => p[0])) + Math.max(...pts.map((p) => p[0]))) / 2;
  const cz = (Math.min(...pts.map((p) => p[1])) + Math.max(...pts.map((p) => p[1]))) / 2;
  return pts.map(([x, z]) => [x - cx, z - cz]);
}

/** Lâmina curva: fita com espessura constante ao longo do perfil, extrudada na altura. */
export function curvedGeometry(shape: CurveShapeId, w: number, h: number, depth: number, curvature: number) {
  const pts = curveProfile(shape, w, curvature);
  const outer: THREE.Vector2[] = [];
  const inner: THREE.Vector2[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const tx = b[0] - a[0];
    const tz = b[1] - a[1];
    const len = Math.hypot(tx, tz) || 1;
    const nx = -tz / len;
    const nz = tx / len;
    outer.push(new THREE.Vector2(p[0] + (nx * depth) / 2, p[1] + (nz * depth) / 2));
    inner.push(new THREE.Vector2(p[0] - (nx * depth) / 2, p[1] - (nz * depth) / 2));
  });
  const s = new THREE.Shape([...outer, ...inner.reverse()]);
  const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false });
  g.rotateX(-Math.PI / 2);
  g.translate(0, -h / 2, 0);
  g.computeVertexNormals();
  return g;
}

/** Textura ilustrativa do perfil de tensões do temperado: compressão nas faces, tração no núcleo. */
export function stressTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 4;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 64, 0);
  g.addColorStop(0, "#1C2F7A");
  g.addColorStop(0.22, "#5f78d6");
  g.addColorStop(0.5, "#FF6E27");
  g.addColorStop(0.78, "#5f78d6");
  g.addColorStop(1, "#1C2F7A");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 4);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
