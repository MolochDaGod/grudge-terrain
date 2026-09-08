import { biomeForSector, type BiomeId } from "./biomes";

export interface Sector {
  id: string;
  label: string;
  col: number;
  row: number;
  biome: BiomeId;
  neighbors: string[];
}

const RAW: Array<[string, string, number, number]> = [
  ["ethereal_falls", "Ethereal Falls", 0, 0],
  ["frostbite_expanse", "Frostbite Expanse", 1, 0],
  ["thornwood_wilds", "Thornwood Wilds", 2, 0],
  ["stormbreak_reef", "Stormbreak Reef", 0, 1],
  ["convergence_nexus", "Convergence Nexus", 1, 1],
  ["ashen_wastes", "Ashen Wastes", 2, 1],
  ["abyssal_trench", "Abyssal Trench", 0, 2],
  ["haven_shore", "Haven Shore", 1, 2],
  ["ember_depths", "Ember Depths", 2, 2],
];

function neighbors(col: number, row: number): string[] {
  const out: string[] = [];
  for (const [id, , c, r] of RAW) {
    if (Math.abs(c - col) + Math.abs(r - row) === 1) out.push(id);
  }
  return out;
}

export const SECTORS: Sector[] = RAW.map(([id, label, col, row]) => ({
  id, label, col, row,
  biome: biomeForSector(id),
  neighbors: neighbors(col, row),
}));

export const SECTOR_BY_ID = Object.fromEntries(SECTORS.map((s) => [s.id, s]));

export function graphEdges(): Array<[string, string]> {
  const edges: Array<[string, string]> = [];
  for (const s of SECTORS) {
    for (const n of s.neighbors) {
      if (s.id < n) edges.push([s.id, n]);
    }
  }
  return edges;
}
