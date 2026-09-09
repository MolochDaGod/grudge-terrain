import type { BiomeId } from "./biomes";
import { hashSeed, SeededRandom } from "./seed";

/** Seed-deployed island silhouette. Heightfield only — no overhangs. */
export type ReliefId = "atoll" | "ridge" | "mountain" | "caldera" | "cavern" | "highland";

export interface ReliefProfile {
  id: ReliefId;
  label: string;
  playPeakM: number;
  caveCount: number;
  caveDepthM: number;
  ridgeStrength: number;
  peakOffset: number;
  crater: number;
}

/** Per-biome play peaks. Volcanic is 30 m; others sit above the old 14–20 m cap. */
export const BIOME_PEAK_M: Record<BiomeId, number> = {
  beach: 16,
  tropical: 18,
  plains: 20,
  forest: 24,
  storm: 22,
  desert: 22,
  winter: 26,
  frozen: 28,
  ethereal: 24,
  nexus: 26,
  abyssal: 24,
  volcanic: 30,
};

export const BIOME_RELIEF: Record<BiomeId, ReliefId> = {
  beach: "atoll",
  tropical: "atoll",
  plains: "highland",
  forest: "ridge",
  storm: "ridge",
  desert: "highland",
  winter: "mountain",
  frozen: "mountain",
  ethereal: "mountain",
  nexus: "highland",
  abyssal: "cavern",
  volcanic: "caldera",
};

const RELIEF_LABEL: Record<ReliefId, string> = {
  atoll: "Atoll shelf",
  ridge: "Spine ridge",
  mountain: "Mountain massif",
  caldera: "Volcanic caldera",
  cavern: "Sink / cave field",
  highland: "Highland plateau",
};

const ALL_RELIEF: ReliefId[] = ["atoll", "ridge", "mountain", "caldera", "cavern", "highland"];

export function parseRelief(raw?: string | null): ReliefId | null {
  if (!raw) return null;
  const id = raw.toLowerCase().trim() as ReliefId;
  return ALL_RELIEF.includes(id) ? id : null;
}

/**
 * Deterministic relief for a seed + biome.
 * URL `relief=` wins. Otherwise biome default, with a 22% seed roll into a
 * taller / cave-leaning variant so deployments are not identical silhouettes.
 */
export function resolveRelief(opts: {
  seed: number;
  seedKey?: string;
  biome: BiomeId;
  reliefOverride?: ReliefId | null;
}): ReliefProfile {
  const peak = BIOME_PEAK_M[opts.biome];
  let id = opts.reliefOverride ?? BIOME_RELIEF[opts.biome];
  if (!opts.reliefOverride) {
    const rng = new SeededRandom((opts.seed ^ hashSeed(`${opts.seedKey ?? ""}:${opts.biome}:relief`)) >>> 0);
    if (rng.next() < 0.22) {
      if (opts.biome === "volcanic") id = rng.pick(["caldera", "mountain", "cavern"]);
      else if (opts.biome === "abyssal") id = rng.pick(["cavern", "ridge", "mountain"]);
      else if (opts.biome === "beach" || opts.biome === "tropical") id = rng.pick(["atoll", "ridge", "highland"]);
      else id = rng.pick(ALL_RELIEF);
    }
  }

  const tall = id === "mountain" || id === "caldera" ? 1 : id === "ridge" || id === "cavern" ? 0.92 : 0.82;
  const playPeakM = Math.round(peak * tall * 10) / 10;
  return {
    id,
    label: RELIEF_LABEL[id],
    playPeakM: opts.biome === "volcanic" ? Math.max(30, playPeakM) : playPeakM,
    caveCount: id === "cavern" ? 5 : id === "caldera" ? 2 : id === "mountain" ? 2 : 1,
    caveDepthM: id === "cavern" ? playPeakM * 0.55 : id === "caldera" ? playPeakM * 0.42 : playPeakM * 0.28,
    ridgeStrength: id === "ridge" ? 0.72 : id === "mountain" ? 0.48 : id === "caldera" ? 0.38 : 0.22,
    peakOffset: id === "atoll" ? 0.08 : 0.22,
    crater: id === "caldera" ? 0.78 : id === "cavern" ? 0.35 : 0,
  };
}

export const RELIEF_LIST = ALL_RELIEF;
