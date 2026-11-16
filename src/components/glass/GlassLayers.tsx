"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import type { GlassColor } from "@/data/colors";
import type { CurveShapeId } from "@/data/families/modelados";
import { layerZ, type PlacedLayer } from "@/lib/layout";
import { curvedGeometry, frameGeometry } from "./geometry";
import { rig } from "./rig";

const ORANGE = "#FF6E27";

interface Props {
  layers: PlacedLayer[];
  width: number;
  height: number;
  color: GlassColor;
  selected: string | null;
  hidden: string[];
  gap: number;
  curved?: { shape: CurveShapeId; curvature: number };
  heatable?: boolean;
  edgeGlow?: boolean;
  onSelect: (id: string) => void;
}

/** Renderiza qualquer composição a partir dos descritores de camada. As sete famílias passam por aqui. */
export function GlassLayers(p: Props) {
  return (
    <group>
      {p.layers
        .filter((l) => !p.hidden.includes(l.id))
        .map((l) => (
          <LayerMesh key={`${l.id}-${l.depth.toFixed(4)}`} layer={l} {...p} />
        ))}
    </group>
  );
}

function LayerMesh({ layer, width: W, height: H, color, selected, gap, curved, heatable, edgeGlow, onSelect }: Props & { layer: PlacedLayer }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const isSel = selected === layer.id;
  const dimmed = selected !== null && !isSel;
  const size = Math.max(W, H);
  const seal = 0.022 * size;
  const band = 0.026 * size;

  const geometry = useMemo(() => {
    if (curved) return curvedGeometry(curved.shape, W, H, layer.depth, curved.curvature);
    switch (layer.kind) {
      case "sealant":
        return frameGeometry(W, H, seal, layer.depth);
      case "spacer":
        return frameGeometry(W - seal * 2, H - seal * 2, band, layer.depth * 0.96);
      case "cavity":
        return new THREE.BoxGeometry(W - (seal + band) * 2, H - (seal + band) * 2, layer.depth * 0.9);
      default:
        return new THREE.BoxGeometry(W, H, layer.depth);
    }
  }, [W, H, layer.depth, layer.kind, curved?.shape, curved?.curvature, seal, band]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    if (ref.current) ref.current.position.z = layerZ(layer, rig.exploded, gap);
    if (mat.current && heatable) mat.current.emissiveIntensity = isSel ? 0.35 : rig.heat * 1.4;
  });

  const { edge, ...m } = materialFor(layer.kind, color, isSel, dimmed);
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 6) return; // foi um arraste para girar, não um clique
    onSelect(layer.id);
  };

  return (
    <mesh ref={ref} geometry={geometry} onClick={click} renderOrder={layer.slot} userData={{ layerId: layer.id }}>
      <meshPhysicalMaterial ref={mat} {...m} emissive={isSel || heatable ? ORANGE : "#000000"} emissiveIntensity={isSel ? 0.35 : 0} />
      {!curved && (
        <Edges threshold={20} color={isSel || edgeGlow ? ORANGE : edge} lineWidth={isSel || edgeGlow ? 2.4 : 1} transparent opacity={dimmed ? 0.25 : 0.9} />
      )}
    </mesh>
  );
}

function materialFor(kind: PlacedLayer["kind"], c: GlassColor, selected: boolean, dimmed: boolean) {
  const fade = dimmed ? 0.45 : 1;
  switch (kind) {
    case "glass":
      return {
        color: c.tint, edge: c.edge, transparent: true, opacity: Math.min(0.95, c.opacity + (selected ? 0.2 : 0)) * fade, depthWrite: false,
        roughness: c.reflective ? 0.06 : 0.04, metalness: c.reflective ? 0.75 : 0, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: c.reflective ? 1.6 : 1.3, side: THREE.DoubleSide,
      };
    case "interlayer":
      return { color: selected ? ORANGE : "#ff9a63", edge: "#f37032", transparent: true, opacity: (selected ? 0.9 : 0.34) * fade, depthWrite: false, roughness: 0.35, metalness: 0, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 0.6, side: THREE.DoubleSide };
    case "spacer":
      return { color: "#c9ced6", edge: "#8a909b", transparent: dimmed, opacity: fade, depthWrite: true, roughness: 0.34, metalness: 0.9, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 1.1, side: THREE.FrontSide };
    case "sealant":
      return { color: "#1b2030", edge: "#0c1020", transparent: dimmed, opacity: fade, depthWrite: true, roughness: 0.85, metalness: 0, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 0.3, side: THREE.FrontSide };
    case "cavity":
      return { color: "#9fc3ff", edge: "#6f8fd0", transparent: true, opacity: (selected ? 0.4 : 0.09) * fade, depthWrite: false, roughness: 0.9, metalness: 0, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 0, side: THREE.DoubleSide };
    case "reflective":
      return { color: "#f4f6fa", edge: "#aab2bf", transparent: dimmed, opacity: fade, depthWrite: true, roughness: 0.03, metalness: 1, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 2, side: THREE.DoubleSide };
    case "backing":
    default:
      return { color: "#59606d", edge: "#2f3440", transparent: dimmed, opacity: fade, depthWrite: true, roughness: 0.9, metalness: 0, clearcoat: 0, clearcoatRoughness: 0, envMapIntensity: 0.2, side: THREE.DoubleSide };
  }
}
