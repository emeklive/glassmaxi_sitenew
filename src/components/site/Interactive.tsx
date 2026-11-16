"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { applications, processes, slides } from "@/data/site";
import { familyById } from "@/data/families";
import { company } from "@/data/company";

/* ------------------------------------------------------------------ Hero ---- */
export function Hero() {
  const art = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = art.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      el.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      el.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <section className="hero tex">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1>
            Engenharia, tecnologia e <em>precisão em cada detalhe.</em>
          </h1>
          <p className="lede">{company.subSlogan}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/produtos/">Explorar nossos produtos</Link>
            <Link className="btn btn-ghost-light" href="/orcamento/">Solicitar orçamento</Link>
          </div>
        </div>
        <div className="hero-art" ref={art} aria-hidden="true">
          <div className="hero-disc" />
          <div className="hero-photo"><img src="/media/brand/obra-a.webp" alt="" fetchPriority="high" /></div>
          <div className="hero-panes">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="hero-pane" style={{ ["--i" as string]: i }} />
            ))}
          </div>
        </div>
      </div>
      <div className="wrap hero-strip">
        <p>Vá direto para uma linha</p>
        <ul className="hero-lines">
          {Object.values(familyById).map((f) => (
            <li key={f.id}><Link href={`/produtos/${f.id}/`}>{f.name}</Link></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Carrossel ---- */
export function ProductCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const drag = useRef({ on: false, x: 0, left: 0, moved: false });

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(slides.length - 1, i));
    const child = el.children[n] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const kids = [...el.children] as HTMLElement[];
      const x = el.scrollLeft + el.offsetLeft;
      let best = 0;
      kids.forEach((k, i) => Math.abs(k.offsetLeft - x) < Math.abs(kids[best].offsetLeft - x) && (best = i));
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = kids.length - 1;
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Arraste com mouse. No toque, a rolagem nativa com snap já resolve.
  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { on: true, x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      track.current.classList.add("is-dragging");
    }
    track.current.scrollLeft = d.left - dx;
  };
  const up = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on || !track.current) return;
    d.on = false;
    track.current.classList.remove("is-dragging");
    if (d.moved) {
      const dx = e.clientX - d.x;
      go(index + (dx < -40 ? 1 : dx > 40 ? -1 : 0));
    }
  };

  return (
    <div className="carousel" role="region" aria-roledescription="carrossel" aria-label="Linhas e versões Glassmaxi" data-carousel data-index={index}>
      <div
        className="carousel-track"
        ref={track}
        tabIndex={0}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), go(index + 1));
          if (e.key === "ArrowLeft") (e.preventDefault(), go(index - 1));
        }}
      >
        {slides.map((s, i) => (
          <article key={s.title} className="slide" data-tone={s.tone} aria-roledescription="slide" aria-label={`${i + 1} de ${slides.length}: ${s.kicker} ${s.title}`}>
            <div className="slide-in">
              <span className="slide-num" aria-hidden="true">{i + 1}/{slides.length}</span>
              <div className="slide-photo">{s.image && <img src={s.image} alt="" loading="lazy" draggable={false} />}</div>
              <div className="slide-body">
                <div className="slide-block">
                  <small>{s.kicker}</small>
                  <strong>{s.title}</strong>
                  <em>{s.subtitle}</em>
                </div>
                <p className="slide-text">{s.text}</p>
              </div>
              <div className="slide-foot">
                <ul className="tags">{s.tags.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
                <Link className={s.tone === "navy" || s.tone === "orange" ? "btn btn-ghost-light btn-sm" : "btn btn-ghost btn-sm"} href={s.href} draggable={false}>Ver detalhes</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="carousel-bar">
        <span className="carousel-count" aria-live="polite">{index + 1}/{slides.length}</span>
        <div className="carousel-dots">
          {slides.map((s, i) => (
            <button key={s.title} type="button" aria-label={`Ir para ${s.title}`} aria-current={i === index} onClick={() => go(i)} />
          ))}
        </div>
        <div className="carousel-arrows">
          <button type="button" aria-label="Anterior" data-prev disabled={index === 0} onClick={() => go(index - 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Próximo" data-next disabled={index === slides.length - 1} onClick={() => go(index + 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Processos ---- */
function ProcessArt({ id }: { id: string }) {
  const g = "#9fe0d2";
  const o = "#FF6E27";
  const p = { fill: "none", strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label="Ilustração técnica da etapa">
      <rect x="60" y="30" width="200" height="90" rx="3" {...p} stroke={g} opacity={id === "materia-prima" ? 1 : 0.9} fill="rgb(159 224 210 / 0.12)" />
      {id === "materia-prima" && (<><rect x="72" y="22" width="200" height="90" rx="3" {...p} stroke={g} opacity="0.5" /><rect x="84" y="14" width="200" height="90" rx="3" {...p} stroke={g} opacity="0.3" /></>)}
      {id === "corte" && (<><path {...p} stroke={o} strokeDasharray="8 6" d="M150 20v110M60 80h200" /><circle cx="150" cy="80" r="7" fill={o} /></>)}
      {id === "lapidacao" && <rect x="60" y="30" width="200" height="90" rx="3" {...p} stroke={o} strokeWidth="6" />}
      {id === "usinagem" && (<><circle cx="90" cy="55" r="9" {...p} stroke={o} /><circle cx="230" cy="55" r="9" {...p} stroke={o} /><path {...p} stroke={o} d="M260 95h-28v25" /></>)}
      {id === "tempera" && (<>{[80, 120, 160, 200, 240].map((x) => <path key={x} {...p} stroke={o} d={`M${x} 14c-6 6 6 8 0 14M${x} 122c-6 6 6 8 0 14`} />)}<rect x="60" y="30" width="200" height="90" rx="3" fill="rgb(255 110 39 / 0.25)" /></>)}
      {id === "laminacao" && (<><path {...p} stroke={o} strokeWidth="5" d="M52 75h216" /><rect x="68" y="38" width="200" height="90" rx="3" {...p} stroke={g} opacity="0.55" /></>)}
      {id === "insulacao" && (<><rect x="86" y="14" width="200" height="90" rx="3" {...p} stroke={g} opacity="0.55" /><path {...p} stroke={o} strokeDasharray="4 5" d="M60 30l26-16M260 30l26-16M260 120l26-16" /></>)}
      {id === "conferencia" && <path {...p} stroke={o} strokeWidth="6" d="M125 78l24 22 46-50" />}
      {id === "expedicao" && (<><path {...p} stroke={o} d="M30 132h260M90 132a12 12 0 1 0 .100 0M230 132a12 12 0 1 0 .100 0" /></>)}
    </svg>
  );
}

export function ProcessTimeline({ compact = false }: { compact?: boolean }) {
  const list = compact ? processes.filter((p) => p.status === "confirmado") : processes;
  const [sel, setSel] = useState(0);
  const cur = list[sel];
  return (
    <div className="timeline" data-process>
      <ol className="timeline-list" role="tablist" aria-label="Etapas do processo">
        {list.map((p, i) => (
          <li key={p.id}>
            <button type="button" role="tab" aria-selected={i === sel} data-process-step={p.id} onClick={() => setSel(i)}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              {p.title}
              {p.status === "consulta" && <small>conforme o projeto</small>}
            </button>
          </li>
        ))}
      </ol>
      <div className="timeline-panel" role="tabpanel" aria-live="polite">
        <ProcessArt id={cur.id} />
        <h3>{cur.title}</h3>
        <p>{cur.text}</p>
        {cur.status === "consulta" && <p className="source">Etapa aplicada conforme o projeto. Consulte a equipe Glassmaxi sobre a sua peça.</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Simulador de quebra ---- */
type GlassKind = "comum" | "temperado" | "laminado";
const SIM: Record<GlassKind, { title: string; text: string }> = {
  comum: { title: "Vidro comum", text: "Rompe em pedaços grandes e pontiagudos." },
  temperado: { title: "Vidro temperado", text: "Fragmenta-se em muitos pedaços pequenos." },
  laminado: { title: "Vidro laminado", text: "Trinca, e a película interna segura os fragmentos." },
};

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function shards(kind: GlassKind) {
  const r = rng(kind === "comum" ? 7 : kind === "temperado" ? 19 : 31);
  const W = 300, H = 400, cx = 150, cy = 170;
  const out: { d: string; tx: number; ty: number; rot: number }[] = [];
  if (kind === "temperado") {
    const nx = 14, ny = 18;
    const px = (i: number, j: number) => [(i / nx) * W + (i > 0 && i < nx ? (r() - 0.5) * 14 : 0), (j / ny) * H + (j > 0 && j < ny ? (r() - 0.5) * 14 : 0)];
    const grid = Array.from({ length: nx + 1 }, (_, i) => Array.from({ length: ny + 1 }, (_, j) => px(i, j)));
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < ny; j++) {
        const q = [grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]];
        out.push({ d: `M${q.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L")}Z`, tx: (r() - 0.5) * 60, ty: 420 - j * 6 + r() * 120, rot: (r() - 0.5) * 220 });
      }
    return out;
  }
  const rays = kind === "comum" ? 9 : 16;
  const edge = (a: number) => {
    const dx = Math.cos(a), dy = Math.sin(a);
    const t = Math.min(dx > 0 ? (W - cx) / dx : dx < 0 ? -cx / dx : 1e9, dy > 0 ? (H - cy) / dy : dy < 0 ? -cy / dy : 1e9);
    return [cx + dx * t, cy + dy * t];
  };
  const angles = Array.from({ length: rays }, (_, i) => (i / rays) * Math.PI * 2 + (r() - 0.5) * 0.3);
  const rings = kind === "comum" ? [1] : [0.18, 0.4, 0.68, 1];
  for (let i = 0; i < rays; i++) {
    const a0 = angles[i], a1 = angles[(i + 1) % rays] + (i === rays - 1 ? Math.PI * 2 : 0);
    const e0 = edge(a0), e1 = edge(a1);
    let prev = [[cx, cy], [cx, cy]];
    rings.forEach((f) => {
      const p0 = [cx + (e0[0] - cx) * f, cy + (e0[1] - cy) * f];
      const p1 = [cx + (e1[0] - cx) * f, cy + (e1[1] - cy) * f];
      const corner = f === 1 ? cornerBetween(e0, e1, W, H) : null;
      const pts = [prev[0], p0, ...(corner ? [corner] : []), p1, prev[1]];
      const am = (a0 + a1) / 2;
      out.push({
        d: `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join("L")}Z`,
        tx: kind === "comum" ? Math.cos(am) * 26 + (r() - 0.5) * 20 : Math.cos(am) * 1.5,
        ty: kind === "comum" ? 380 + r() * 80 : 2.5 + Math.sin(am) * 1.5,
        rot: kind === "comum" ? (r() - 0.5) * 70 : (r() - 0.5) * 1.5,
      });
      prev = [p0, p1];
    });
  }
  return out;
}
function cornerBetween(a: number[], b: number[], W: number, H: number) {
  const onX = (p: number[]) => p[0] < 0.5 || p[0] > W - 0.5;
  if (onX(a) !== onX(b)) return [onX(a) ? a[0] : b[0], onX(a) ? b[1] : a[1]];
  return null;
}

export function BreakSimulator() {
  const kinds: GlassKind[] = ["comum", "temperado", "laminado"];
  const [broken, setBroken] = useState<Record<GlassKind, boolean>>({ comum: false, temperado: false, laminado: false });
  const data = useMemo(() => Object.fromEntries(kinds.map((k) => [k, shards(k)])) as Record<GlassKind, ReturnType<typeof shards>>, []); // eslint-disable-line react-hooks/exhaustive-deps
  const all = (v: boolean) => setBroken({ comum: v, temperado: v, laminado: v });
  return (
    <div data-sim>
      <div className="sim-grid">
        {kinds.map((k) => (
          <div key={k} className="sim-panel">
            <button type="button" className="sim-glass" data-sim-glass={k} data-broken={broken[k]} aria-pressed={broken[k]} aria-label={`${SIM[k].title}: ${broken[k] ? "restaurar" : "simular quebra"}`} onClick={() => setBroken((b) => ({ ...b, [k]: !b[k] }))}>
              <svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
                {k === "laminado" && <rect width="300" height="400" fill="#FF6E27" opacity={broken[k] ? 0.28 : 0} style={{ transition: "opacity .6s" }} />}
                {data[k].map((s, i) => (
                  <path key={i} className="shard" d={s.d} fill="rgb(191 227 220 / 0.55)" stroke="rgb(255 255 255 / 0.9)" strokeWidth={broken[k] ? (k === "temperado" ? 0.7 : 1.3) : 0}
                    style={{ transform: broken[k] ? `translate(${s.tx}px, ${s.ty}px) rotate(${s.rot}deg)` : "none", opacity: broken[k] && k !== "laminado" ? 0.0 : 1, transitionDelay: broken[k] && k !== "laminado" ? `${(i % 12) * 18}ms` : "0ms" }} />
                ))}
              </svg>
            </button>
            <h3>{SIM[k].title}</h3>
            <p>{broken[k] ? SIM[k].text : "Toque no painel para simular a quebra."}</p>
          </div>
        ))}
      </div>
      <div className="sim-actions">
        <button type="button" className="btn btn-primary" data-sim-break onClick={() => all(true)}>Simular quebra</button>
        <button type="button" className="btn btn-ghost" data-sim-reset onClick={() => all(false)}>Restaurar os vidros</button>
      </div>
      <p className="sim-caption">Simulação visual educativa. O comportamento real depende da composição, fabricação, instalação e condições de impacto.</p>
    </div>
  );
}

/* -------------------------------------------------------------- Aplicações ---- */
export function ApplicationGallery() {
  const [sel, setSel] = useState(applications[0].id);
  const cur = applications.find((a) => a.id === sel)!;
  return (
    <div className="apps" data-apps>
      <ul className="apps-list" role="tablist" aria-label="Aplicações">
        {applications.map((a) => (
          <li key={a.id}>
            <button type="button" role="tab" aria-selected={sel === a.id} data-app={a.id} className={sel === a.id ? "chip is-active" : "chip"} onClick={() => setSel(a.id)}>{a.title}</button>
          </li>
        ))}
      </ul>
      <div className="apps-panel" role="tabpanel" aria-live="polite">
        <h3 style={{ fontSize: "var(--t-xl)", color: "var(--navy)" }}>{cur.title}</h3>
        <p className="lede">{cur.text}</p>
        <div>
          <p className="source" style={{ marginBottom: "0.5rem" }}>Linhas que costumam atender esta aplicação. A especificação final é sempre do projeto.</p>
          <div className="apps-lines">
            {cur.lines.map((id) => (
              <Link key={id} className="btn btn-ghost btn-sm" href={`/produtos/${id}/`}>{familyById[id].name}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
