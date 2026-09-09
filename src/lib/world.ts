import { WORLD, FOUNDATIONS, type FoundationId } from "./canon";
import { BIOMES, type BiomeId } from "./biomes";
import { generateHeightField, type HeightField } from "./heightmap";
import { scatterNodes, type HarvestNode } from "./nodes";
import { scatterFoliage, type ScatterInstance } from "./foliage";
import { SECTORS } from "./sectors";
import { hashSeed } from "./seed";
import { parseRelief, resolveRelief, type ReliefId } from "./terrainProfile";

export interface IslandSpec {
  family: "home-island";
  seed: number;
  seedKey: string;
  biome: BiomeId;
  foundation: FoundationId;
  sectorId: string | null;
  relief: ReliefId;
  playPeakM: number;
  diameterM: number;
  playDiameterM: number;
  characterM: number;
  generatedAt: string;
}

export interface IslandWorld {
  spec: IslandSpec;
  field: HeightField;
  nodes: HarvestNode[];
  foliage: ScatterInstance[];
}

export function parseSeedKey(raw?: string | null): { seed: number; seedKey: string } {
  const seedKey = (raw && raw.trim()) || `isle-${Date.now().toString(36)}`;
  return { seed: hashSeed(seedKey), seedKey };
}

export function buildIsland(opts: {
  seedKey?: string;
  biome?: BiomeId;
  sectorId?: string | null;
  relief?: ReliefId | string | null;
}): IslandWorld {
  const { seed, seedKey } = parseSeedKey(opts.seedKey);
  const sector = opts.sectorId ? SECTORS.find((s) => s.id === opts.sectorId) : undefined;
  const biome = opts.biome ?? sector?.biome ?? "beach";
  const foundation = BIOMES[biome].foundation;
  const reliefOverride = parseRelief(typeof opts.relief === "string" ? opts.relief : opts.relief ?? null);
  const profile = resolveRelief({ seed, seedKey, biome, reliefOverride });
  const spec: IslandSpec = {
    family: "home-island",
    seed,
    seedKey,
    biome,
    foundation,
    sectorId: sector?.id ?? null,
    relief: profile.id,
    playPeakM: profile.playPeakM,
    diameterM: WORLD.diameterM,
    playDiameterM: WORLD.playDiameterM,
    characterM: WORLD.characterM,
    generatedAt: new Date().toISOString(),
  };
  const field = generateHeightField({ seed, biome, seedKey, relief: reliefOverride });
  const nodes = scatterNodes({ seed, biome, field });
  const foliage = scatterFoliage({ seed, biome, field });
  return { spec, field, nodes, foliage };
}

export function islandApiPayload(world: IslandWorld) {
  return {
    spec: world.spec,
    foundation: FOUNDATIONS[world.spec.foundation],
    biome: BIOMES[world.spec.biome],
    relief: world.spec.relief,
    playPeakM: world.spec.playPeakM,
    caves: world.field.caves,
    nodeCount: world.nodes.length,
    foliageCount: world.foliage.length,
    nodes: world.nodes,
    foliage: world.foliage,
  };
}
