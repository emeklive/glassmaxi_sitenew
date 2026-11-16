"use client";
import { useEffect } from "react";
import { isFamilyId, familyById } from "@/data/families";
import type { GlassColorId } from "@/data/types";
import { useGlass } from "@/store/glass-store";
import { GlassViewer } from "./GlassViewer";
import { CompositionCompare, CompositionSelector, ConfigSummary, FamilyBlurb, GlassColorSelector, LayerInspector, ProductSelector, ViewControls } from "./Controls";

/** Aplica ?linha= e ?cor= da URL ao estado central (links do catálogo e do carrossel). */
export function useUrlPreset(fixedLine?: string) {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const line = fixedLine ?? q.get("linha");
    const st = useGlass.getState();
    if (isFamilyId(line) && st.productLine !== line) st.setLine(line);
    const cor = q.get("cor") as GlassColorId | null;
    if (cor && familyById[useGlass.getState().productLine].colors.includes(cor)) useGlass.getState().setColor(cor);
  }, [fixedLine]);
}

/** Configurador completo: seletor de linha + visualizador + painel sincronizado. */
export function Configurator({ compact = false }: { compact?: boolean }) {
  useUrlPreset();
  return (
    <div className={`configurator ${compact ? "configurator-compact" : ""}`}>
      <ProductSelector />
      <div className="configurator-body">
        <div className="configurator-stage">
          <GlassViewer />
          <FamilyBlurb />
        </div>
        <div className="configurator-panel">
          <CompositionSelector />
          <GlassColorSelector />
          {!compact && <ViewControls />}
          <LayerInspector />
          {!compact && <CompositionCompare />}
          <ConfigSummary />
        </div>
      </div>
    </div>
  );
}
