"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { familyById } from "@/data/families";
import type { Beat, FamilyId } from "@/data/types";
import { useGlass } from "@/store/glass-store";
import { GlassViewer } from "./GlassViewer";
import { CompositionSelector, GlassColorSelector } from "./Controls";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

/** Estado do modelo como função pura do progresso: rolar para trás desfaz exatamente o que rolar para frente fez. */
function stateAt(beats: Beat[], progress: number) {
  const f = Math.min(beats.length - 1, Math.max(0, progress * (beats.length - 1)));
  const i = Math.min(beats.length - 2, Math.floor(f));
  const a = beats[i];
  const b = beats[i + 1] ?? a;
  // Cada etapa "segura" por metade do trecho antes de fazer a transição para a próxima.
  const t = ease(Math.min(1, Math.max(0, (f - i - 0.3) / 0.55)));
  const active = f - i > 0.58 ? Math.min(beats.length - 1, i + 1) : i;
  const cur = beats[active];
  return {
    active,
    patch: {
      explodedProgress: lerp(a.exploded, b.exploded, t),
      cameraRotation: { yaw: lerp(a.yaw, b.yaw, t), pitch: lerp(a.pitch, b.pitch, t) },
      zoom: lerp(a.zoom, b.zoom, t),
      selectedLayer: cur.focus ?? null,
      processStep: cur.step ?? -1,
      section: !!cur.section,
      view: cur.view ?? "perspectiva",
    },
  };
}

/** Narrativa da linha controlada pela rolagem da página. Usa `position: sticky`: nada de sequestro da roda do mouse. */
export function ScrollExperience({ line }: { line: FamilyId }) {
  const family = familyById[line];
  const beats = family.beats;
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const st = useGlass.getState();
    if (st.productLine !== line) st.setLine(line);
    const q = new URLSearchParams(window.location.search).get("cor");
    if (q && (family.colors as string[]).includes(q)) useGlass.getState().setColor(q as never);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (mq.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const s = stateAt(beats, self.progress);
        useGlass.getState().apply(s.patch);
        setActive(s.active);
      },
    });
    return () => trigger.kill();
  }, [line, beats, family.colors]);

  const goTo = (i: number) => {
    if (reduced || !root.current) {
      const s = stateAt(beats, i / (beats.length - 1));
      useGlass.getState().apply(s.patch);
      setActive(i);
      return;
    }
    const el = root.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * i) / (beats.length - 1), behavior: "smooth" });
  };

  const beat = beats[active];
  return (
    <section
      ref={root}
      className={`story ${reduced ? "story-static" : ""}`}
      style={reduced ? undefined : { height: `${beats.length * 85 + 40}vh` }}
      data-story
      data-beat={active}
      aria-label={`Como é feito: ${family.singular}`}
    >
      <div className="story-stage">
        <div className="story-canvas">
          <GlassViewer hint={false} />
        </div>
        <div className="story-copy">
          <p className="story-count" aria-hidden="true">
            {String(active + 1).padStart(2, "0")}<span>/{String(beats.length).padStart(2, "0")}</span>
          </p>
          <div aria-live="polite">
            <h2>{beat.title}</h2>
            <p>{beat.text}</p>
          </div>
          <ol className="story-rail" aria-label="Etapas da demonstração">
            {beats.map((b, i) => (
              <li key={b.id}>
                <button type="button" aria-current={i === active ? "step" : undefined} aria-label={`Etapa ${i + 1}: ${b.title}`} onClick={() => goTo(i)} />
              </li>
            ))}
          </ol>
          <div className="story-config">
            <GlassColorSelector />
            <CompositionSelector />
          </div>
          <div className="story-cta" data-visible={active === beats.length - 1}>
            <Link className="btn btn-primary" href="/orcamento/">Solicitar orçamento</Link>
            <Link className="btn btn-ghost-light" href={`/experiencia-3d/?linha=${line}`}>Configurar em 3D</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
