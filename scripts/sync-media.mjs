#!/usr/bin/env node
/**
 * Baixa as fotos de obras do site oficial (glassmaxi.com.br) para public/media/official
 * e atualiza src/data/media.generated.json. Rode uma vez, com internet: `npm run sync:media`.
 * O logotipo já está no projeto, em public/brand.
 */
import fs from "node:fs/promises";
import path from "node:path";

const BASE = process.env.GLASSMAXI_MEDIA_BASE || "https://glassmaxi.com.br/";
const FILES = ["obra_0.jpeg", "obra_1.jpeg", "obra_2.jpeg", "obra_3.png", "obra_4.png", "obra_5.png", "obra_6.png", "obra_7.png"];
const out = path.resolve("public/media/official");
await fs.mkdir(out, { recursive: true });

const manifest = { obras: [] };
for (const f of FILES) {
  try {
    const res = await fetch(new URL(f, BASE));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await fs.writeFile(path.join(out, f), Buffer.from(await res.arrayBuffer()));
    manifest.obras.push(f);
    console.log("ok   ", f);
  } catch (e) {
    console.log("falha", f, "-", e.message);
  }
}
await fs.writeFile("src/data/media.generated.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nManifesto atualizado: obras=${manifest.obras.length}. Rode "npm run build" de novo.`);
