import { FOUNDATIONS, type FoundationId } from "./canon";

export type BiomeId =
  | "beach" | "tropical" | "forest" | "plains" | "winter" | "frozen"
  | "desert" | "volcanic" | "storm" | "ethereal" | "abyssal" | "nexus";

export type NodeKind = "wood" | "stone" | "ore" | "herbs" | "gems" | "fishing" | "animal" | "monster";

export interface BiomeDef {
  id: BiomeId; label: string; foundation: FoundationId; treePolicy: string;
  animals: string[]; monsters: string[]; nodes: NodeKind[];
  grass: [number, number, number]; sand: [number, number, number];
  rock: [number, number, number]; water: [number, number, number];
  fog: string; sky: string;
}

export const BIOMES: Record<BiomeId, BiomeDef> = {
  beach: { id: "beach", label: "Haven Strand", foundation: "driftwood_bay", treePolicy: "palm", animals: ["deer", "crab", "boar"], monsters: ["coast_raider"], nodes: ["wood", "stone", "fishing", "herbs", "animal"], grass: [0.28, 0.48, 0.26], sand: [0.76, 0.68, 0.46], rock: [0.48, 0.46, 0.42], water: [0.12, 0.32, 0.52], fog: "#9ec8d4", sky: "#7eb8d4" },
  tropical: { id: "tropical", label: "Palm Atoll", foundation: "driftwood_bay", treePolicy: "palm", animals: ["deer", "boar", "crab"], monsters: ["jungle_stalker"], nodes: ["wood", "herbs", "fishing", "gems", "animal"], grass: [0.18, 0.52, 0.22], sand: [0.82, 0.72, 0.42], rock: [0.42, 0.4, 0.34], water: [0.05, 0.38, 0.48], fog: "#8fd4c4", sky: "#5ec4d8" },
  forest: { id: "forest", label: "Thornwood", foundation: "driftwood_bay", treePolicy: "pine_stylized", animals: ["deer", "wolf", "fox"], monsters: ["dire_wolf"], nodes: ["wood", "herbs", "stone", "animal", "monster"], grass: [0.2, 0.42, 0.18], sand: [0.42, 0.36, 0.24], rock: [0.38, 0.36, 0.34], water: [0.1, 0.22, 0.28], fog: "#6a8a6c", sky: "#6a9ab0" },
  plains: { id: "plains", label: "Open March", foundation: "driftwood_bay", treePolicy: "pine_stylized", animals: ["horse", "cow", "buffalo"], monsters: ["bandit"], nodes: ["herbs", "stone", "wood", "animal"], grass: [0.38, 0.55, 0.22], sand: [0.62, 0.54, 0.32], rock: [0.5, 0.46, 0.4], water: [0.16, 0.3, 0.42], fog: "#c8d4a0", sky: "#8ec4e0" },
  winter: { id: "winter", label: "Frostbite Shelf", foundation: "ironfang_spire", treePolicy: "snow_pine", animals: ["husky", "wolf", "deer"], monsters: ["ice_wight"], nodes: ["wood", "ore", "gems", "animal", "monster"], grass: [0.72, 0.8, 0.84], sand: [0.7, 0.74, 0.78], rock: [0.55, 0.58, 0.62], water: [0.2, 0.32, 0.42], fog: "#c8d8e8", sky: "#a8c0d8" },
  frozen: { id: "frozen", label: "Ironfang Glacier", foundation: "ironfang_spire", treePolicy: "snow_pine", animals: ["wolf", "bear", "rabbit"], monsters: ["frost_troll"], nodes: ["ore", "gems", "stone", "monster", "animal"], grass: [0.78, 0.84, 0.9], sand: [0.62, 0.66, 0.72], rock: [0.48, 0.5, 0.56], water: [0.18, 0.28, 0.4], fog: "#d0e0f0", sky: "#90a8c4" },
  desert: { id: "desert", label: "Ashen Dunes", foundation: "ironfang_spire", treePolicy: "palm_stylized", animals: ["horned_lizard", "boar"], monsters: ["sand_drake"], nodes: ["stone", "ore", "gems", "herbs", "monster"], grass: [0.62, 0.48, 0.22], sand: [0.82, 0.68, 0.36], rock: [0.55, 0.42, 0.3], water: [0.2, 0.38, 0.42], fog: "#e0c898", sky: "#e8c070" },
  volcanic: { id: "volcanic", label: "Ember Depths", foundation: "ironfang_spire", treePolicy: "stylized_pine", animals: ["fire_beetle"], monsters: ["lava_golem", "ifrit", "drake"], nodes: ["ore", "gems", "stone", "monster"], grass: [0.28, 0.18, 0.12], sand: [0.42, 0.22, 0.12], rock: [0.28, 0.26, 0.26], water: [0.35, 0.12, 0.06], fog: "#4a2820", sky: "#3a2018" },
  storm: { id: "storm", label: "Stormbreak Reef", foundation: "driftwood_bay", treePolicy: "pine_stylized", animals: ["boar", "crab"], monsters: ["tempest_wraith"], nodes: ["wood", "fishing", "stone", "ore", "monster"], grass: [0.22, 0.36, 0.28], sand: [0.5, 0.5, 0.46], rock: [0.36, 0.38, 0.4], water: [0.08, 0.16, 0.28], fog: "#5a6a78", sky: "#4a5a68" },
  ethereal: { id: "ethereal", label: "Ethereal Falls", foundation: "ironfang_spire", treePolicy: "stylized_pine", animals: ["deer"], monsters: ["monsters_x"], nodes: ["herbs", "gems", "wood", "monster"], grass: [0.32, 0.42, 0.48], sand: [0.55, 0.5, 0.62], rock: [0.4, 0.38, 0.52], water: [0.22, 0.28, 0.55], fog: "#b8a8d8", sky: "#7868b0" },
  abyssal: { id: "abyssal", label: "Abyssal Trench", foundation: "ironfang_spire", treePolicy: "stylized_pine", animals: ["crab"], monsters: ["monsters_x", "drake"], nodes: ["ore", "gems", "fishing", "monster"], grass: [0.16, 0.2, 0.28], sand: [0.22, 0.24, 0.32], rock: [0.2, 0.22, 0.3], water: [0.04, 0.08, 0.18], fog: "#1a2030", sky: "#10141c" },
  nexus: { id: "nexus", label: "Convergence Nexus", foundation: "ironfang_spire", treePolicy: "pine_stylized", animals: ["deer", "buffalo", "bear"], monsters: ["nexus_sentinel"], nodes: ["wood", "stone", "ore", "gems", "herbs", "animal", "monster"], grass: [0.26, 0.4, 0.32], sand: [0.48, 0.44, 0.4], rock: [0.42, 0.4, 0.46], water: [0.14, 0.24, 0.38], fog: "#88a0b8", sky: "#6080a0" },
};

export const BIOME_LIST = Object.values(BIOMES);

export function biomeForSector(sectorId: string): BiomeId {
  const map: Record<string, BiomeId> = {
    haven_shore: "beach", stormbreak_reef: "storm", thornwood_wilds: "forest",
    frostbite_expanse: "winter", ashen_wastes: "desert", ember_depths: "volcanic",
    ethereal_falls: "ethereal", abyssal_trench: "abyssal", convergence_nexus: "nexus",
  };
  return map[sectorId] ?? "plains";
}

export function foundationOf(biome: BiomeId) {
  return FOUNDATIONS[BIOMES[biome].foundation];
}
