import { WORLD, FOUNDATIONS, type FoundationId } from "./canon";
import { BIOMES, type BiomeId } from "./biomes";
import { generateHeightField, type HeightField } from "./heightmap";
import { scatterNodes, type HarvestNode } from "./nodes";
import { scatterFoliage, type ScatterInstance } from "./foliage";
import { SECTORS } from "./sectors";
import { hashSeed } from "./seed";

export interface IslandSpec {
  family: "home-island";
  seed: number;
  seedKey: string;
  biome: BiomeId;
  foundation: FoundationId;
  sectorId: string | null;
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
}): IslandWorld {
  const { seed, seedKey } = parseSeedKey(opts.seedKey);
  const sector = opts.sectorId ? SECTORS.find((s) => s.id === opts.sectorId) : undefined;
  const biome = opts.biome ?? sector?.biome ?? "beach";
  const foundation = BIOMES[biome].foundation;
  const spec: IslandSpec = {
    family: "home-island",
    seed,
    seedKey,
    biome,
    foundation,
    sectorId: sector?.id ?? null,
    diameterM: WORLD.diameterM,
    playDiameterM: WORLD.playDiameterM,
    characterM: WORLD.characterM,
    generatedAt: new Date().toISOString(),
  };
  const field = generateHeightField({ seed, biome });
  const nodes = scatterNodes({ seed, biome, field });
  const foliage = scatterFoliage({ seed, biome, field });
  return { spec, field, nodes, foliage };
}

export function islandApiPayload(world: IslandWorld) {
  return {
    spec: world.spec,
    foundation: FOUNDATIONS[world.spec.foundation],
    biome: BIOMES[world.spec.biome],
    nodeCount: world.nodes.length,
    foliageCount: world.foliage.length,
    nodes: world.nodes,
    foliage: world.foliage,
  };
}
