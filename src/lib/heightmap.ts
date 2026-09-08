import { WORLD } from "./canon";
import { BIOMES, type BiomeId, foundationOf } from "./biomes";
import { SimplexNoise2D } from "./seed";

export interface HeightField {
  resolution: number; size: number; heights: Float32Array; colors: Float32Array;
  maxHeight: number; waterY: number;
}

export function generateHeightField(opts: { seed: number; biome: BiomeId; resolution?: number; size?: number }): HeightField {
  const biome = BIOMES[opts.biome];
  const foundation = foundationOf(opts.biome);
  const resolution = opts.resolution ?? 96;
  const size = opts.size ?? WORLD.playDiameterM;
  const maxHeight = foundation.playPeakM;
  const noise = new SimplexNoise2D(opts.seed);
  const n = resolution + 1;
  const heights = new Float32Array(n * n);
  const colors = new Float32Array(n * n * 3);
  const half = size / 2;
  const beach = foundation.beachBandM / (WORLD.diameterM / size);
  for (let z = 0; z < n; z++) {
    for (let x = 0; x < n; x++) {
      const wx = (x / resolution) * size - half;
      const wz = (z / resolution) * size - half;
      const dx = wx / half, dz = wz / half;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const falloff = Math.max(0, 1 - Math.pow(dist, 1.65));
      const hNoise = noise.fbm((wx / size) * 4.2, (wz / size) * 4.2, 5, 2.05, 0.52);
      const ridge = Math.abs(noise.fbm((wx / size) * 2.1 + 8, (wz / size) * 2.1, 3, 2.2, 0.45));
      let h = (hNoise * 0.72 + ridge * 0.28) * falloff * falloff * maxHeight;
      if (dist > 0.92) h = Math.min(h, WORLD.waterY - 0.8);
      heights[z * n + x] = h;
      const sandLine = beach * 0.08;
      let r: number, g: number, b: number;
      if (h < WORLD.waterY + 0.15) [r, g, b] = biome.sand;
      else if (h < WORLD.waterY + sandLine + 1.2) {
        const t = (h - WORLD.waterY) / (sandLine + 1.2);
        r = biome.sand[0] * (1 - t) + biome.grass[0] * t;
        g = biome.sand[1] * (1 - t) + biome.grass[1] * t;
        b = biome.sand[2] * (1 - t) + biome.grass[2] * t;
      } else if (h < maxHeight * 0.62) [r, g, b] = biome.grass;
      else {
        const t = (h - maxHeight * 0.62) / (maxHeight * 0.38);
        r = biome.grass[0] * (1 - t) + biome.rock[0] * t;
        g = biome.grass[1] * (1 - t) + biome.rock[1] * t;
        b = biome.grass[2] * (1 - t) + biome.rock[2] * t;
      }
      const ci = (z * n + x) * 3;
      colors[ci] = r; colors[ci + 1] = g; colors[ci + 2] = b;
    }
  }
  return { resolution, size, heights, colors, maxHeight, waterY: WORLD.waterY };
}

export function sampleHeight(field: HeightField, x: number, z: number): number {
  const n = field.resolution + 1;
  const half = field.size / 2;
  const u = ((x + half) / field.size) * field.resolution;
  const v = ((z + half) / field.size) * field.resolution;
  const x0 = Math.max(0, Math.min(field.resolution - 1, Math.floor(u)));
  const z0 = Math.max(0, Math.min(field.resolution - 1, Math.floor(v)));
  const tx = u - x0, tz = v - z0;
  const h00 = field.heights[z0 * n + x0];
  const h10 = field.heights[z0 * n + x0 + 1];
  const h01 = field.heights[(z0 + 1) * n + x0];
  const h11 = field.heights[(z0 + 1) * n + x0 + 1];
  return h00 * (1 - tx) * (1 - tz) + h10 * tx * (1 - tz) + h01 * (1 - tx) * tz + h11 * tx * tz;
}

export function sculpt(field: HeightField, x: number, z: number, mode: "raise" | "lower" | "flatten", radius = 6, strength = 0.55) {
  const n = field.resolution + 1;
  const half = field.size / 2;
  const cx = ((x + half) / field.size) * field.resolution;
  const cz = ((z + half) / field.size) * field.resolution;
  const rCells = (radius / field.size) * field.resolution;
  const target = sampleHeight(field, x, z);
  for (let zi = 0; zi < n; zi++) {
    for (let xi = 0; xi < n; xi++) {
      const dx = xi - cx, dz = zi - cz;
      const d = Math.sqrt(dx * dx + dz * dz);
      if (d > rCells) continue;
      const w = Math.pow(1 - d / rCells, 2);
      const i = zi * n + xi;
      if (mode === "raise") field.heights[i] += strength * w;
      else if (mode === "lower") field.heights[i] -= strength * w;
      else field.heights[i] += (target - field.heights[i]) * 0.45 * w;
    }
  }
}
