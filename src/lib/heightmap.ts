import { WORLD } from "./canon";
import { BIOMES, type BiomeId } from "./biomes";
import { SimplexNoise2D, SeededRandom } from "./seed";
import { resolveRelief, type ReliefId, type ReliefProfile } from "./terrainProfile";

export interface HeightField {
  resolution: number;
  size: number;
  heights: Float32Array;
  colors: Float32Array;
  maxHeight: number;
  waterY: number;
  relief: ReliefId;
  caves: Array<{ x: number; z: number; radius: number; depth: number }>;
}

export function generateHeightField(opts: {
  seed: number;
  biome: BiomeId;
  seedKey?: string;
  relief?: ReliefId | null;
  resolution?: number;
  size?: number;
}): HeightField {
  const biome = BIOMES[opts.biome];
  const profile = resolveRelief({
    seed: opts.seed,
    seedKey: opts.seedKey,
    biome: opts.biome,
    reliefOverride: opts.relief ?? null,
  });
  const resolution = opts.resolution ?? 96;
  const size = opts.size ?? WORLD.playDiameterM;
  const maxHeight = profile.playPeakM;
  const noise = new SimplexNoise2D(opts.seed);
  const rng = new SeededRandom(opts.seed ^ 0xca7e);
  const n = resolution + 1;
  const heights = new Float32Array(n * n);
  const colors = new Float32Array(n * n * 3);
  const half = size / 2;

  const peakAng = rng.range(0, Math.PI * 2);
  const peakRad = profile.peakOffset * half;
  const px = Math.cos(peakAng) * peakRad;
  const pz = Math.sin(peakAng) * peakRad;
  const ridgeAng = rng.range(0, Math.PI);

  const caves: HeightField["caves"] = [];
  for (let c = 0; c < profile.caveCount; c++) {
    const ang = rng.range(0, Math.PI * 2);
    const rad = rng.range(half * 0.12, half * 0.55);
    caves.push({
      x: Math.cos(ang) * rad,
      z: Math.sin(ang) * rad,
      radius: rng.range(6, profile.id === "cavern" ? 18 : 12),
      depth: rng.range(profile.caveDepthM * 0.55, profile.caveDepthM),
    });
  }

  for (let z = 0; z < n; z++) {
    for (let x = 0; x < n; x++) {
      const wx = (x / resolution) * size - half;
      const wz = (z / resolution) * size - half;
      const dist = Math.hypot(wx, wz) / half;
      const falloff = Math.max(0, 1 - Math.pow(Math.min(1, dist), 1.55));

      const warpX = wx + noise.fbm(wx / size * 3.1, wz / size * 3.1, 3, 2.1, 0.5) * size * 0.09;
      const warpZ = wz + noise.fbm(wx / size * 3.1 + 19, wz / size * 3.1 + 7, 3, 2.1, 0.5) * size * 0.09;

      const rolling = noise.fbm(warpX / size * 4.4, warpZ / size * 4.4, 5, 2.05, 0.52);
      const ridged = 1 - Math.abs(noise.fbm(warpX / size * 2.4 + 8, warpZ / size * 2.4, 4, 2.15, 0.48));
      const detail = noise.fbm(warpX / size * 10.5, warpZ / size * 10.5, 3, 2.3, 0.45);

      const along = wx * Math.cos(ridgeAng) + wz * Math.sin(ridgeAng);
      const ridgeLine = Math.exp(-(along * along) / (2 * (half * 0.22) * (half * 0.22)));
      const dPeak = Math.hypot(wx - px, wz - pz) / half;
      const peakBell = Math.exp(-(dPeak * dPeak) / (2 * 0.18 * 0.18));

      let shape = 0.55 * ((rolling + 1) * 0.5) + 0.25 * ridged + 0.08 * detail;
      shape = applyRelief(profile, shape, dist, ridgeLine, peakBell, ridged);

      let h = shape * falloff * falloff * maxHeight;

      for (const cave of caves) {
        const cd = Math.hypot(wx - cave.x, wz - cave.z);
        if (cd < cave.radius) {
          const w = Math.pow(1 - cd / cave.radius, 2);
          h -= cave.depth * w;
        }
      }

      if (profile.id === "caldera") {
        const ring = Math.abs(dist - 0.34);
        const wall = Math.exp(-(ring * ring) / (2 * 0.07 * 0.07));
        const bowl = dist < 0.28 ? (0.28 - dist) / 0.28 : 0;
        h += wall * maxHeight * 0.42;
        h -= bowl * profile.crater * maxHeight * 0.55;
      }

      if (dist > 0.92) h = Math.min(h, WORLD.waterY - 0.8);
      heights[z * n + x] = h;

      const sandLine = 1.4;
      let r: number, g: number, b: number;
      if (h < WORLD.waterY + 0.15) {
        [r, g, b] = biome.sand;
      } else if (h < WORLD.waterY + sandLine) {
        const t = (h - WORLD.waterY) / sandLine;
        r = biome.sand[0] * (1 - t) + biome.grass[0] * t;
        g = biome.sand[1] * (1 - t) + biome.grass[1] * t;
        b = biome.sand[2] * (1 - t) + biome.grass[2] * t;
      } else if (h < maxHeight * 0.55) {
        [r, g, b] = biome.grass;
      } else {
        const t = Math.min(1, (h - maxHeight * 0.55) / (maxHeight * 0.45));
        r = biome.grass[0] * (1 - t) + biome.rock[0] * t;
        g = biome.grass[1] * (1 - t) + biome.rock[1] * t;
        b = biome.grass[2] * (1 - t) + biome.rock[2] * t;
      }
      const ci = (z * n + x) * 3;
      colors[ci] = r;
      colors[ci + 1] = g;
      colors[ci + 2] = b;
    }
  }

  return { resolution, size, heights, colors, maxHeight, waterY: WORLD.waterY, relief: profile.id, caves };
}

function applyRelief(
  profile: ReliefProfile,
  shape: number,
  dist: number,
  ridgeLine: number,
  peakBell: number,
  ridged: number,
): number {
  switch (profile.id) {
    case "atoll":
      return shape * 0.55 + (dist > 0.22 && dist < 0.62 ? 0.28 : 0.08);
    case "ridge":
      return shape * 0.42 + ridgeLine * profile.ridgeStrength + ridged * 0.18;
    case "mountain":
      return shape * 0.32 + peakBell * 0.58 + ridged * 0.18;
    case "caldera":
      return shape * 0.38 + ridged * 0.22 + peakBell * 0.12;
    case "cavern":
      return shape * 0.62 + ridged * 0.22 + peakBell * 0.16;
    case "highland":
      return 0.42 + shape * 0.38 + ridged * 0.14;
  }
}

export function sampleHeight(field: HeightField, x: number, z: number): number {
  const n = field.resolution + 1;
  const half = field.size / 2;
  const u = ((x + half) / field.size) * field.resolution;
  const v = ((z + half) / field.size) * field.resolution;
  const x0 = Math.max(0, Math.min(field.resolution - 1, Math.floor(u)));
  const z0 = Math.max(0, Math.min(field.resolution - 1, Math.floor(v)));
  const tx = u - x0;
  const tz = v - z0;
  const h00 = field.heights[z0 * n + x0];
  const h10 = field.heights[z0 * n + x0 + 1];
  const h01 = field.heights[(z0 + 1) * n + x0];
  const h11 = field.heights[(z0 + 1) * n + x0 + 1];
  return h00 * (1 - tx) * (1 - tz) + h10 * tx * (1 - tz) + h01 * (1 - tx) * tz + h11 * tx * tz;
}

/** Baked heightfield normal — used by feet IK and slope-aware CCT. */
export function sampleNormal(field: HeightField, x: number, z: number, span = 0.55): { x: number; y: number; z: number } {
  const hl = sampleHeight(field, x - span, z);
  const hr = sampleHeight(field, x + span, z);
  const hd = sampleHeight(field, x, z - span);
  const hu = sampleHeight(field, x, z + span);
  const nx = hl - hr;
  const nz = hd - hu;
  const ny = span * 2;
  const len = Math.hypot(nx, ny, nz) || 1;
  return { x: nx / len, y: ny / len, z: nz / len };
}

export function sculpt(
  field: HeightField,
  x: number,
  z: number,
  mode: "raise" | "lower" | "flatten",
  radius = 6,
  strength = 0.55,
) {
  const n = field.resolution + 1;
  const half = field.size / 2;
  const cx = ((x + half) / field.size) * field.resolution;
  const cz = ((z + half) / field.size) * field.resolution;
  const rCells = (radius / field.size) * field.resolution;
  const target = sampleHeight(field, x, z);
  for (let zi = 0; zi < n; zi++) {
    for (let xi = 0; xi < n; xi++) {
      const dx = xi - cx;
      const dz = zi - cz;
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
