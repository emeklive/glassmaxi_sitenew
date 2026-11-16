"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGlass } from "@/store/glass-store";
import { GlassModel } from "./GlassModel";

/** Canvas WebGL. Carregado sob demanda (import dinâmico), só quando o visualizador entra na tela. */
export default function GlassCanvas({ reducedMotion, lowPower }: { reducedMotion: boolean; lowPower: boolean }) {
  const setStatus = useGlass((s) => s.setStatus);
  const [key, setKey] = useState(0);
  const lost = useGlass((s) => s.modelStatus === "lost");

  useEffect(() => {
    setStatus("loading");
    return () => setStatus("idle");
  }, [setStatus, key]);

  return (
    <>
      <Canvas
        key={key}
        frameloop="demand"
        dpr={[1, lowPower ? 1.5 : 2]}
        camera={{ fov: 28, near: 0.1, far: 100, position: [0, 0, 5] }}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          const el = gl.domElement;
          el.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setStatus("lost");
          });
          el.addEventListener("webglcontextrestored", () => setStatus("ready"));
          setStatus("ready");
        }}
      >
        <Suspense fallback={null}>
          <GlassModel reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
      {lost && (
        <div className="viewer-lost">
          <p>A visualização 3D foi interrompida pelo navegador.</p>
          <button type="button" className="btn btn-primary" onClick={() => setKey((k) => k + 1)}>
            Recarregar o modelo
          </button>
        </div>
      )}
    </>
  );
}
