"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Edges, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { glassColors } from "@/data/colors";
import { placeLayers } from "@/lib/layout";
import { currentLayers, useGlass } from "@/store/glass-store";
import { GlassLayers } from "./GlassLayers";
import { stressTexture } from "./geometry";
import { damp, rig } from "./rig";

const ORANGE = "#FF6E27";
const NAVY = "#122366";

/** Cena completa: câmera, luzes, ambiente e o modelo da linha ativa. */
export function GlassModel({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { camera, invalidate } = useThree();

  const line = useGlass((s) => s.productLine);
  const composition = useGlass((s) => s.composition);
  const layerCount = useGlass((s) => s.layerCount);
  const colorId = useGlass((s) => s.glassColor);
  const dims = useGlass((s) => s.dimensions);
  const curvature = useGlass((s) => s.curvature);
  const curveShape = useGlass((s) => s.curveShape);
  const selected = useGlass((s) => s.selectedLayer);
  const hidden = useGlass((s) => s.hiddenLayers);
  const section = useGlass((s) => s.section);
  const step = useGlass((s) => s.processStep);
  const view = useGlass((s) => s.view);
  const selectLayer = useGlass((s) => s.selectLayer);

  const layers = useMemo(() => placeLayers(currentLayers({ productLine: line, composition, layerCount })), [line, composition, layerCount]);

  const W = (dims.width / 1000) * (section ? 0.5 : 1);
  const H = dims.height / 1000;
  const size = Math.max(dims.width / 1000, H);
  const gap = layers.length > 1 ? Math.min(0.3 * size, (1.1 * size) / (layers.length - 1)) : 0;
  const animated = line === "temperados" && (step === 0 || step === 4 || step === 5);

  // Qualquer mudança de estado pede um novo quadro (o canvas só desenha sob demanda).
  useEffect(() => useGlass.subscribe(() => invalidate()), [invalidate]);
  useEffect(() => invalidate());

  useFrame((state, delta) => {
    const s = useGlass.getState();
    const dt = Math.min(delta, 0.05);
    const k = reducedMotion ? 60 : 7;
    const g = group.current;
    if (!g) return;
    const heatTarget = s.productLine === "temperados" ? (s.processStep === 3 ? 1 : s.processStep === 4 ? 0.3 : 0) : 0;
    const dist = (size * 3.05 + 0.6) / s.zoom;

    g.rotation.y = damp(g.rotation.y, s.cameraRotation.yaw, k, dt);
    g.rotation.x = damp(g.rotation.x, s.cameraRotation.pitch, k, dt);
    camera.position.z = damp(camera.position.z, dist, k, dt);
    rig.exploded = damp(rig.exploded, s.explodedProgress, k, dt);
    rig.heat = damp(rig.heat, heatTarget, 4, dt);
    rig.time += dt;
    rig.frames++;

    const moving =
      Math.abs(g.rotation.y - s.cameraRotation.yaw) > 0.0008 ||
      Math.abs(g.rotation.x - s.cameraRotation.pitch) > 0.0008 ||
      Math.abs(camera.position.z - dist) > 0.002 ||
      Math.abs(rig.exploded - s.explodedProgress) > 0.0008 ||
      Math.abs(rig.heat - heatTarget) > 0.004;
    if (moving || (animated && !reducedMotion)) state.invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 5]} intensity={1.5} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#9fb4ff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#0d1a4d"]} />
        <Lightformer form="rect" intensity={5} position={[0, 4, 3]} scale={[8, 2.5, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.4} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#dfe8ff" />
        <Lightformer form="rect" intensity={2} position={[5, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[5, 2, 1]} color="#ffb08a" />
        <Lightformer form="rect" intensity={1.2} position={[0, -3, 2]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} color="#f6f6f5" />
        <Lightformer form="ring" intensity={3} position={[2, 2, -5]} scale={3} color="#ffffff" />
      </Environment>

      <group ref={group} rotation={[0.14, -0.55, 0]}>
        <group position={[section ? -W / 2 : 0, 0, 0]}>
          <GlassLayers
            layers={layers}
            width={W}
            height={H}
            color={glassColors[colorId]}
            selected={selected}
            hidden={hidden}
            gap={gap}
            curved={line === "modelados" ? { shape: curveShape, curvature } : undefined}
            heatable={line === "temperados"}
            edgeGlow={line === "temperados" && step === 1}
            onSelect={selectLayer}
          />
          {line === "temperados" && section && <StressSection height={H} depth={layers[0].depth} x={W / 2} />}
        </group>
        {line === "temperados" && !section && <TemperExtras w={W} h={H} step={step} />}
        {line === "jumbos" && <JumboExtras w={W} h={H} facade={view === "arquitetura"} />}
        {line === "modelados" && <FloorArc w={W} h={H} />}
      </group>
    </>
  );
}

/** Face de corte do temperado com o perfil de tensões (ilustrativo). */
function StressSection({ height, depth, x }: { height: number; depth: number; x: number }) {
  const tex = useMemo(() => stressTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[x + 0.0015, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[depth, height]} />
      <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}

/** Demonstração das etapas de fabricação do temperado sobre a lâmina monolítica. */
function TemperExtras({ w, h, step }: { w: number; h: number; step: number }) {
  const cut = useRef<THREE.Mesh>(null);
  const scan = useRef<THREE.Mesh>(null);
  const jets = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = rig.time;
    if (cut.current) cut.current.position.y = ((t * 0.5) % 1) * h * 1.3 - h * 0.65;
    if (scan.current) scan.current.position.y = Math.sin(t * 1.6) * h * 0.46;
    if (jets.current) jets.current.children.forEach((c, i) => (c.scale.y = 0.7 + 0.3 * Math.sin(t * 6 + i)));
  });
  const jetPositions = useMemo(() => {
    const out: [number, number, number, number][] = [];
    for (let ix = 0; ix < 4; ix++)
      for (let iy = 0; iy < 5; iy++)
        for (const side of [-1, 1]) out.push([(ix / 3 - 0.5) * w * 0.78, (iy / 4 - 0.5) * h * 0.8, side * 0.26, side]);
    return out;
  }, [w, h]);

  return (
    <>
      {step === 0 && (
        <>
          <mesh position={[w * 0.18, h * 0.08, 0]}>
            <planeGeometry args={[w * 1.5, h * 1.28]} />
            <meshBasicMaterial color="#9fc3ff" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
            <Edges color="#8fa5e8" />
          </mesh>
          <mesh ref={cut} position={[w / 2 + 0.004, 0, 0.03]}>
            <boxGeometry args={[0.012, 0.16, 0.012]} />
            <meshBasicMaterial color={ORANGE} toneMapped={false} />
          </mesh>
          <mesh position={[w / 2 + 0.004, h * 0.08, 0]}>
            <boxGeometry args={[0.004, h * 1.28, 0.004]} />
            <meshBasicMaterial color={ORANGE} toneMapped={false} />
          </mesh>
        </>
      )}
      {step === 2 &&
        [-1, 1].map((s) => (
          <mesh key={s} position={[s * w * 0.32, h * 0.36, 0]}>
            <torusGeometry args={[0.035, 0.007, 12, 40]} />
            <meshBasicMaterial color={ORANGE} toneMapped={false} />
          </mesh>
        ))}
      {step === 2 && (
        <mesh position={[w / 2 - 0.05, -h * 0.3, 0]}>
          <boxGeometry args={[0.1, 0.16, 0.06]} />
          <meshBasicMaterial color={ORANGE} wireframe toneMapped={false} />
        </mesh>
      )}
      {step === 4 && (
        <group ref={jets}>
          {jetPositions.map(([x, y, z, side], i) => (
            <mesh key={i} position={[x, y, z]} rotation={[side > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.022, 0.2, 10]} />
              <meshBasicMaterial color="#8fb6ff" transparent opacity={0.75} toneMapped={false} />
            </mesh>
          ))}
        </group>
      )}
      {step === 5 && (
        <mesh ref={scan}>
          <boxGeometry args={[w * 1.08, 0.012, 0.09]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.85} toneMapped={false} />
        </mesh>
      )}
    </>
  );
}

/** Escala humana e referência de fachada para a linha Jumbos. */
function JumboExtras({ w, h, facade }: { w: number; h: number; facade: boolean }) {
  const floor = -h / 2;
  const modules = useMemo(() => {
    const out: [number, number][] = [];
    for (let ix = -1; ix <= 1; ix++) for (let iy = 0; iy <= 2; iy++) if (!(ix === 0 && iy === 0)) out.push([ix * (w + 0.06), iy * (h + 0.06)]);
    return out;
  }, [w, h]);
  return (
    <>
      {/* Pessoa com 1,75 m de altura */}
      <group position={[-w / 2 - 0.55, floor, 0.25]}>
        <mesh position={[0, 0.78, 0]}>
          <capsuleGeometry args={[0.17, 1.2, 6, 14]} />
          <meshStandardMaterial color={NAVY} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.13, 20, 16]} />
          <meshStandardMaterial color={NAVY} roughness={0.7} />
        </mesh>
      </group>
      <mesh position={[0, floor - 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 3.4 + 2, 3]} />
        <meshBasicMaterial color="#1C2F7A" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      {facade &&
        modules.map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <boxGeometry args={[w, h, 0.04]} />
            <meshPhysicalMaterial color="#bcd6ea" transparent opacity={0.22} roughness={0.05} metalness={0.2} depthWrite={false} envMapIntensity={1.2} />
            <Edges color="#c9ced6" />
          </mesh>
        ))}
    </>
  );
}

/** Base de apoio que deixa a curvatura legível. */
function FloorArc({ w, h }: { w: number; h: number }) {
  return (
    <mesh position={[0, -h / 2 - 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[w * 0.85, 64]} />
      <meshBasicMaterial color="#1C2F7A" transparent opacity={0.08} depthWrite={false} />
    </mesh>
  );
}
