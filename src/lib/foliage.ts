import { cdn, BANNED_NATURE, WORLD } from "./canon";
import { BIOMES, type BiomeId } from "./biomes";
import type { HeightField } from "./heightmap";
import { sampleHeight } from "./heightmap";
import { SeededRandom } from "./seed";

export interface FoliageDef {
  id: string; kind: "tree" | "rock" | "bush" | "grass"; policy: string;
  glb: string; instancedColor: [number, number, number]; scale: [number, number];
}

export const FOLIAGE_CATALOG: FoliageDef[] = [
  { id: "palm", kind: "tree", policy: "palm", glb: cdn("models/nature/realistic/trees/palm.glb"), instancedColor: [0.18, 0.42, 0.16], scale: [1.6, 2.4] },
  { id: "palm_stylized", kind: "tree", policy: "palm_stylized", glb: cdn("models/nature/organized/trees/palm_stylized.glb"), instancedColor: [0.22, 0.46, 0.18], scale: [1.4, 2.2] },
  { id: "pine_stylized", kind: "tree", policy: "pine_stylized", glb: cdn("models/nature/organized/trees/pine_stylized.glb"), instancedColor: [0.12, 0.32, 0.16], scale: [1.8, 3.2] },
  { id: "snow_pine", kind: "tree", policy: "snow_pine", glb: cdn("models/nature/organized/trees/snow_pine.glb"), instancedColor: [0.55, 0.62, 0.58], scale: [1.8, 3.0] },
  { id: "stylized_pine", kind: "tree", policy: "stylized_pine", glb: cdn("models/nature/organized/trees/stylized_pine.glb"), instancedColor: [0.16, 0.28, 0.18], scale: [1.6, 2.8] },
  { id: "rock_real", kind: "rock", policy: "*", glb: cdn("models/nature/realistic/rocks/boulder.glb"), instancedColor: [0.42, 0.4, 0.38], scale: [0.6, 1.6] },
];

export function foliageForBiome(biome: BiomeId): FoliageDef[] {
  const policy = BIOMES[biome].treePolicy;
  return FOLIAGE_CATALOG.filter((f) => f.policy === policy || f.policy === "*");
}

export function assertLegalFoliagePath(path: string): boolean {
  return !BANNED_NATURE.some((b) => path.includes(b));
}

export interface ScatterInstance {
  defId: string; x: number; y: number; z: number; rotY: number; scale: number;
}

export function scatterFoliage(opts: { seed: number; biome: BiomeId; field: HeightField; count?: number }): ScatterInstance[] {
  const defs = foliageForBiome(opts.biome);
  const rng = new SeededRandom(opts.seed ^ 0x33f1);
  const half = opts.field.size * 0.4;
  const out: ScatterInstance[] = [];
  const want = opts.count ?? 80;
  let tries = 0;
  while (out.length < want && tries < want * 10) {
    tries++;
    const ang = rng.next() * Math.PI * 2;
    const rad = Math.sqrt(rng.next()) * half;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    const y = sampleHeight(opts.field, x, z);
    if (y < WORLD.waterY + 0.8) continue;
    const def = rng.pick(defs);
    out.push({ defId: def.id, x, y, z, rotY: rng.range(0, Math.PI * 2), scale: rng.range(def.scale[0], def.scale[1]) });
  }
  return out;
}
