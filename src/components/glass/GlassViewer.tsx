"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { familyById } from "@/data/families";
import { currentLayers, useGlass } from "@/store/glass-store";
import { LayerDiagram } from "./LayerDiagram";
import { rig } from "./rig";

const GlassCanvas = dynamic(() => import("./GlassCanvas"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Visualizador único das sete famílias. Gira com mouse, toque e teclado, amplia por botões ou pinça
 * e nunca captura a roda do mouse: a rolagem da página continua natural.
 */
export function GlassViewer({ className = "", hint = true }: { className?: string; hint?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduced, setReduced] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [touched, setTouched] = useState(false);

  const s = useGlass();
  const family = familyById[s.productLine];
  const layers = useMemo(() => currentLayers(s), [s.productLine, s.composition, s.layerCount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const ok = webglAvailable();
    setWebgl(ok);
    if (!ok) useGlass.getState().setStatus("fallback");
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const nav = navigator as Navigator & { deviceMemory?: number };
    setLowPower((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || window.matchMedia("(max-width: 820px)").matches);
    (window as unknown as { __glass: unknown }).__glass = { store: useGlass, rig };
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && (setMounted(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Arraste para girar; dois dedos para ampliar.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const pts = new Map<number, { x: number; y: number }>();
    let pinch = 0;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("button,input,a")) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
      }
      setTouched(true);
      el.classList.add("is-dragging");
    };
    const move = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const st = useGlass.getState();
      if (pts.size === 2) {
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch > 0) st.setZoom(st.zoom * (d / pinch));
        pinch = d;
        return;
      }
      st.rotate((e.clientX - p.x) * 0.009, (e.clientY - p.y) * 0.006);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };
    const up = (e: PointerEvent) => {
      pts.delete(e.pointerId);
      pinch = 0;
      if (pts.size === 0) el.classList.remove("is-dragging");
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return;
    const st = useGlass.getState();
    const ids = layers.filter((l) => !st.hiddenLayers.includes(l.id)).map((l) => l.id);
    const idx = st.selectedLayer ? ids.indexOf(st.selectedLayer) : -1;
    const map: Record<string, () => void> = {
      ArrowLeft: () => st.rotate(-0.16, 0),
      ArrowRight: () => st.rotate(0.16, 0),
      ArrowUp: () => st.rotate(0, -0.1),
      ArrowDown: () => st.rotate(0, 0.1),
      "+": () => st.setZoom(st.zoom + 0.15),
      "=": () => st.setZoom(st.zoom + 0.15),
      "-": () => st.setZoom(st.zoom - 0.15),
      Home: () => st.resetView(),
      r: () => st.resetView(),
      e: () => family.controls.explode && st.setExploded(st.explodedProgress > 0.5 ? 0 : 1),
      "]": () => ids.length && st.apply({ selectedLayer: ids[(idx + 1) % ids.length] }),
      "[": () => ids.length && st.apply({ selectedLayer: ids[(idx - 1 + ids.length) % ids.length] }),
      Escape: () => st.apply({ selectedLayer: null }),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const selectedLabel = layers.find((l) => l.id === s.selectedLayer)?.label;

  return (
    <div
      ref={wrap}
      className={`viewer ${className}`}
      tabIndex={0}
      role="application"
      aria-roledescription="visualizador 3D"
      aria-label={`Modelo 3D: ${family.singular}. Setas giram, mais e menos ampliam, colchetes percorrem as camadas, R restaura a vista.`}
      onKeyDown={onKey}
      data-viewer
      data-family={s.productLine}
      data-composition={s.composition}
      data-color={s.glassColor}
      data-layer-count={layers.length}
      data-selected-layer={s.selectedLayer ?? ""}
      data-exploded={s.explodedProgress.toFixed(3)}
      data-yaw={s.cameraRotation.yaw.toFixed(3)}
      data-pitch={s.cameraRotation.pitch.toFixed(3)}
      data-zoom={s.zoom.toFixed(3)}
      data-step={s.processStep}
      data-view={s.view}
      data-model-status={s.modelStatus}
    >
      {webgl && mounted ? (
        <GlassCanvas reducedMotion={reduced} lowPower={lowPower} />
      ) : (
        <div className="viewer-fallback">
          <LayerDiagram layers={layers} exploded={s.explodedProgress} color={s.glassColor} selected={s.selectedLayer} hidden={s.hiddenLayers} onSelect={s.selectLayer} />
          {webgl === false && <p className="viewer-note">Seu navegador não liberou o 3D. Este diagrama mostra a mesma composição.</p>}
        </div>
      )}

      {webgl && s.modelStatus !== "ready" && s.modelStatus !== "lost" && <div className="viewer-loading" aria-hidden="true"><span /></div>}

      <div className="viewer-tools">
        <button type="button" aria-label="Ampliar" onClick={() => s.setZoom(s.zoom + 0.2)}>+</button>
        <button type="button" aria-label="Reduzir" onClick={() => s.setZoom(s.zoom - 0.2)}>−</button>
        <button type="button" aria-label="Restaurar a vista" onClick={s.resetView} className="viewer-reset">Restaurar vista</button>
      </div>

      {hint && webgl && !touched && <p className="viewer-hint">Arraste para girar o vidro</p>}
      <p className="viewer-selected" aria-live="polite">{selectedLabel ? `Em destaque: ${selectedLabel}` : ""}</p>
    </div>
  );
}
