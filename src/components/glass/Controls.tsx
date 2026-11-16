"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { glassColors } from "@/data/colors";
import { families, familyById } from "@/data/families";
import { curveShapes } from "@/data/families/modelados";
import type { ViewId } from "@/data/types";
import { compositionText, currentComposition, currentLayers, glassThickness, useGlass } from "@/store/glass-store";
import { useQuote } from "@/store/quote-store";
import { fmt, TECH } from "@/lib/quote";
import { LayerDiagram } from "./LayerDiagram";

/** [TEMPERADOS] [LAMINADOS] … troca modelo, composição, textos e opções de uma vez. */
export function ProductSelector({ compact = false }: { compact?: boolean }) {
  const line = useGlass((s) => s.productLine);
  const setLine = useGlass((s) => s.setLine);
  return (
    <div className={`line-tabs ${compact ? "line-tabs-compact" : ""}`} role="tablist" aria-label="Linhas de produto">
      {families.map((f) => (
        <button key={f.id} type="button" role="tab" aria-selected={line === f.id} data-line={f.id} className={line === f.id ? "is-active" : ""} onClick={() => setLine(f.id)}>
          {f.name}
        </button>
      ))}
    </div>
  );
}

export function CompositionSelector() {
  const s = useGlass();
  const f = familyById[s.productLine];
  const demo = f.compositions.some((c) => c.status === "demonstracao");
  return (
    <fieldset className="ctrl">
      <legend>{s.productLine === "multilaminados" ? "Lâminas" : f.compositions[0].glass.length > 1 ? "Composição" : "Espessura"}</legend>
      <div className="chips" role="radiogroup" aria-label="Composição">
        {f.compositions.map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={s.composition === c.id} data-composition={c.id} className={s.composition === c.id ? "chip is-active" : "chip"} onClick={() => s.setComposition(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      {f.controls.layerCount && (
        <div className="stepper">
          <span>Quantidade de lâminas</span>
          <button type="button" aria-label="Remover lâmina" disabled={s.layerCount <= f.controls.layerCount.min} onClick={() => s.setLayerCount(s.layerCount - 1)}>−</button>
          <output data-testid="layer-count">{s.layerCount}</output>
          <button type="button" aria-label="Adicionar lâmina" disabled={s.layerCount >= f.controls.layerCount.max} onClick={() => s.setLayerCount(s.layerCount + 1)}>+</button>
        </div>
      )}
      {f.controls.dimensions && (
        <div className="sliders">
          <label>
            <span>Largura <b>{s.dimensions.width} mm</b></span>
            <input type="range" min={1000} max={6000} step={100} value={s.dimensions.width} aria-label="Largura em milímetros" onChange={(e) => s.setDimensions({ width: +e.target.value })} />
          </label>
          <label>
            <span>Altura <b>{s.dimensions.height} mm</b></span>
            <input type="range" min={1000} max={3200} step={100} value={s.dimensions.height} aria-label="Altura em milímetros" onChange={(e) => s.setDimensions({ height: +e.target.value })} />
          </label>
        </div>
      )}
      {f.controls.curvature && (
        <div className="sliders">
          <div className="chips" role="radiogroup" aria-label="Formato da curva">
            {curveShapes.map((c) => (
              <button key={c.id} type="button" role="radio" aria-checked={s.curveShape === c.id} data-curve={c.id} className={s.curveShape === c.id ? "chip is-active" : "chip"} onClick={() => s.setCurveShape(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
          <label>
            <span>Curvatura</span>
            <input type="range" min={10} max={100} value={Math.round(s.curvature * 100)} aria-label="Curvatura" onChange={(e) => s.setCurvature(+e.target.value / 100)} />
          </label>
        </div>
      )}
      {demo && <p className="ctrl-note">Opções de demonstração.</p>}
    </fieldset>
  );
}

export function GlassColorSelector() {
  const s = useGlass();
  const f = familyById[s.productLine];
  return (
    <fieldset className="ctrl">
      <legend>Cor do vidro</legend>
      <div className="swatches" role="radiogroup" aria-label="Cor do vidro">
        {f.colors.map((id) => {
          const c = glassColors[id];
          return (
            <button key={id} type="button" role="radio" aria-checked={s.glassColor === id} data-color={id} className={s.glassColor === id ? "swatch is-active" : "swatch"} onClick={() => s.setColor(id)}>
              <i style={{ background: c.swatch }} />
              {c.name}
            </button>
          );
        })}
      </div>
      {glassColors[s.glassColor].note && <p className="ctrl-note">{glassColors[s.glassColor].note}</p>}
    </fieldset>
  );
}

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "perspectiva", label: "Perspectiva" },
  { id: "frente", label: "Frente" },
  { id: "verso", label: "Verso" },
  { id: "lateral", label: "Lateral" },
  { id: "arquitetura", label: "Na fachada" },
];

export function ViewControls() {
  const s = useGlass();
  const f = familyById[s.productLine];
  const views = VIEWS.filter((v) => (v.id === "arquitetura" ? s.productLine === "jumbos" : v.id === "verso" ? !!f.controls.backView : true));
  return (
    <fieldset className="ctrl">
      <legend>Vista</legend>
      <div className="chips">
        {views.map((v) => (
          <button key={v.id} type="button" data-view={v.id} aria-pressed={s.view === v.id} className={s.view === v.id ? "chip is-active" : "chip"} onClick={() => s.setView(v.id)}>
            {v.label}
          </button>
        ))}
        {s.productLine === "temperados" && (
          <button type="button" data-section aria-pressed={s.section} className={s.section ? "chip is-active" : "chip"} onClick={() => s.apply(s.section ? { section: false } : { section: true, processStep: -1, cameraRotation: { yaw: -1.0, pitch: 0.16 }, zoom: 1.4 })}>
            Seção transversal
          </button>
        )}
      </div>
      {f.process && (
        <ol className="process-steps" aria-label="Etapas de fabricação">
          {f.process.map((p, i) => (
            <li key={p.title}>
              <button type="button" data-step={i} aria-pressed={s.processStep === i} className={s.processStep === i ? "is-active" : ""} onClick={() => s.apply({ processStep: s.processStep === i ? -1 : i, section: false })}>
                <b>{i + 1}</b>
                {p.title}
              </button>
            </li>
          ))}
        </ol>
      )}
      {f.process && s.processStep >= 0 && <p className="ctrl-note" aria-live="polite">{f.process[s.processStep].text}</p>}
      {s.section && <p className="ctrl-note">Corte ilustrativo: faces em compressão (azul) e núcleo em tração (laranja).</p>}
    </fieldset>
  );
}

export function LayerInspector() {
  const s = useGlass();
  const f = familyById[s.productLine];
  const layers = useMemo(() => currentLayers(s), [s.productLine, s.composition, s.layerCount]); // eslint-disable-line react-hooks/exhaustive-deps
  const sel = layers.find((l) => l.id === s.selectedLayer);
  return (
    <fieldset className="ctrl">
      <legend>Camadas</legend>
      {f.controls.explode && (
        <div className="explode">
          <label>
            <span>Separar as camadas</span>
            <input type="range" min={0} max={100} value={Math.round(s.explodedProgress * 100)} aria-label="Separação das camadas" data-explode onChange={(e) => s.setExploded(+e.target.value / 100)} />
          </label>
          <div className="chips">
            <button type="button" className="chip" data-action="explodir" onClick={() => s.setExploded(1)}>Explodir</button>
            <button type="button" className="chip" data-action="reunir" onClick={() => s.setExploded(0)}>Reunir</button>
            <button type="button" className="chip" data-action="restaurar" onClick={s.restoreModel}>Restaurar modelo</button>
          </div>
        </div>
      )}
      <ul className="layer-list">
        {layers.map((l) => {
          const hidden = s.hiddenLayers.includes(l.id);
          return (
            <li key={l.id} className={s.selectedLayer === l.id ? "is-active" : ""}>
              <button type="button" className="layer-pick" data-layer={l.id} aria-pressed={s.selectedLayer === l.id} disabled={hidden} onClick={() => s.selectLayer(l.id)}>
                <i data-kind={l.kind} />
                <span>{l.label}</span>
                {l.thickness !== null && <em>{l.thickness} mm</em>}
              </button>
              {layers.length > 1 && (
                <button type="button" className="layer-hide" aria-label={hidden ? `Mostrar ${l.label}` : `Ocultar ${l.label}`} aria-pressed={hidden} onClick={() => s.toggleHidden(l.id)}>
                  {hidden ? "Mostrar" : "Ocultar"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="layer-desc" aria-live="polite" data-testid="layer-desc">
        {sel ? sel.description : layers.length > 1 ? "Toque em uma camada, no modelo ou na lista, para destacá-la." : f.structure}
      </p>
    </fieldset>
  );
}

/** Resumo técnico + envio da configuração para o orçamento. */
export function ConfigSummary() {
  const s = useGlass();
  const add = useQuote((q) => q.add);
  const router = useRouter();
  const f = familyById[s.productLine];
  const layers = currentLayers(s);
  const glass = glassThickness(layers);
  const comp = currentComposition(s);
  const area = (s.dimensions.width / 1000) * (s.dimensions.height / 1000);
  const [added, setAdded] = useState(false);

  const send = () => {
    add({
      line: f.name,
      composition: compositionText(s) + (s.productLine === "modelados" ? `, ${curveShapes.find((c) => c.id === s.curveShape)?.name.toLowerCase()}` : ""),
      color: glassColors[s.glassColor].name,
      thickness: layers.filter((l) => l.kind === "glass").map((l) => l.thickness).join("+"),
      width: f.controls.dimensions ? s.dimensions.width : 0,
      height: f.controls.dimensions ? s.dimensions.height : 0,
      quantity: 1,
      finishes: "",
      holes: "",
      cutouts: "",
      notes: "",
    });
    setAdded(true);
    router.push("/orcamento/?origem=3d");
  };

  return (
    <div className="summary" data-testid="config-summary">
      <dl>
        <div><dt>Linha</dt><dd>{f.name}</dd></div>
        <div><dt>Composição</dt><dd>{compositionText(s)}</dd></div>
        <div><dt>Cor</dt><dd>{glassColors[s.glassColor].name}</dd></div>
        <div><dt>Vidro (soma das lâminas)</dt><dd>{glass} mm</dd></div>
        {comp.cavity && <div><dt>Câmara</dt><dd>{comp.cavity} mm (não entra no peso)</dd></div>}
        {f.controls.dimensions && <div><dt>Peso estimado da peça</dt><dd>{fmt(area * glass * TECH.kgPerM2PerMm, 1)} kg</dd></div>}
      </dl>
      <p className="ctrl-note">{f.notice}</p>
      <button type="button" className="btn btn-primary" data-action="orcar" onClick={send} disabled={added}>
        Levar esta configuração ao orçamento
      </button>
    </div>
  );
}

/** Compara duas composições lado a lado (multilaminados e laminados). */
export function CompositionCompare() {
  const s = useGlass();
  const f = familyById[s.productLine];
  const [other, setOther] = useState(f.controls.layerCount ? f.controls.layerCount.max : 0);
  if (!f.controls.layerCount) return null;
  const a = currentLayers(s);
  const b = f.build(currentComposition(s), { layerCount: other });
  return (
    <div className="compare">
      <h3>Comparar composições</h3>
      <div className="compare-grid">
        <figure>
          <LayerDiagram layers={a} exploded={0.25} color={s.glassColor} compact title="Composição atual" />
          <figcaption>Atual: {s.layerCount} lâminas, {glassThickness(a)} mm de vidro</figcaption>
        </figure>
        <figure>
          <LayerDiagram layers={b} exploded={0.25} color={s.glassColor} compact title="Composição comparada" />
          <figcaption>
            <label>
              Comparar com{" "}
              <select value={other} onChange={(e) => setOther(+e.target.value)} aria-label="Quantidade de lâminas da composição comparada">
                {Array.from({ length: f.controls.layerCount.max - f.controls.layerCount.min + 1 }, (_, i) => f.controls.layerCount!.min + i).map((n) => (
                  <option key={n} value={n}>{n} lâminas</option>
                ))}
              </select>
            </label>
            : {glassThickness(b)} mm de vidro
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export function FamilyBlurb() {
  const line = useGlass((s) => s.productLine);
  const f = familyById[line];
  return (
    <div className="blurb" aria-live="polite">
      <h3>{f.singular}</h3>
      <p>{f.structure}</p>
      <Link className="link" href={`/produtos/${f.id}/`}>Ver a página da linha</Link>
    </div>
  );
}
