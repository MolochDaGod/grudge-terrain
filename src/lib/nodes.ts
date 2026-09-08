import type { HeightField } from "./heightmap";
import { sampleHeight } from "./heightmap";
import type { BiomeId } from "./biomes";
import { SeededRandom } from "./seed";
import { WORLD } from "./canon";
import {
  FAMILY_SCATTER,
  HARVEST_RANGE_M,
  prefabById,
  prefabsOfFamily,
  type HarvestFamily,
  type HarvestPrefab,
} from "./harvestCatalog";

export type NodeKind = HarvestFamily;

export interface HarvestNode {
  id: string;
  prefabId: string;
  kind: NodeKind;
  species: string;
  label: string;
  x: number;
  y: number;
  z: number;
  hp: number;
  maxHp: number;
  hostile: boolean;
  color: string;
  scale: number;
  layer: "land" | "water" | "air";
  regenMs: number;
  depletedAt: number | null;
}

const REGEN = WORLD.harvestRegenHours * 3600 * 1000;

export function scatterNodes(opts: {
  seed: number;
  biome: BiomeId;
  field: HeightField;
  count?: number;
}): HarvestNode[] {
  const rng = new SeededRandom(opts.seed ^ 0x91a2);
  const half = opts.field.size * 0.42;
  const nodes: HarvestNode[] = [];

  const place = (prefab: HarvestPrefab, layer: HarvestNode["layer"]) => {
    const ang = rng.next() * Math.PI * 2;
    const rad = Math.sqrt(rng.next()) * half * (layer === "water" ? 1.15 : 1);
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    const ground = sampleHeight(opts.field, x, z);
    if (layer === "water" && ground > WORLD.waterY + 0.6) return false;
    if (layer === "land" && ground < WORLD.waterY + 0.35) return false;
    const y =
      layer === "water"
        ? WORLD.waterY - 0.8 - rng.range(0, 1.6)
        : layer === "air"
          ? ground + rng.range(6, 14)
          : ground;
    nodes.push({
      id: `node-${nodes.length}`,
      prefabId: prefab.id,
      kind: prefab.family,
      species: prefab.species,
      label: prefab.label,
      x,
      y,
      z,
      hp: prefab.hp,
      maxHp: prefab.hp,
      hostile: prefab.hostile,
      color: prefab.color,
      scale: prefab.scale,
      layer,
      regenMs: REGEN,
      depletedAt: null,
    });
    return true;
  };

  const families = Object.keys(FAMILY_SCATTER) as HarvestFamily[];
  for (const family of families) {
    const pool = prefabsOfFamily(opts.biome, family);
    if (!pool.length) continue;
    const want = FAMILY_SCATTER[family];
    let placed = 0;
    let tries = 0;
    while (placed < want && tries < want * 16) {
      tries++;
      const prefab = rng.pick(pool);
      if (place(prefab, prefab.layer)) placed++;
    }
  }
  return nodes;
}

export function harvestTick(node: HarvestNode, now = Date.now()): HarvestNode {
  if (node.depletedAt && now - node.depletedAt >= node.regenMs) {
    return { ...node, hp: node.maxHp, depletedAt: null };
  }
  return node;
}

export function strikeNode(
  node: HarvestNode,
  dmg = 14,
  rng = Math.random,
): { node: HarvestNode; loot: Array<{ item: string; qty: number }> } {
  if (node.hp <= 0) return { node, loot: [] };
  const hp = Math.max(0, node.hp - dmg);
  const prefab = prefabById(node.prefabId);
  const loot =
    hp <= 0 && prefab
      ? prefab.yields.map((y) => ({
          item: y.item,
          qty: y.min + Math.floor(rng() * (y.max - y.min + 1)),
        }))
      : [];
  return {
    node: { ...node, hp, depletedAt: hp <= 0 ? Date.now() : null },
    loot,
  };
}

export function nearestLiveNode(
  nodes: HarvestNode[],
  pos: { x: number; z: number },
  range = HARVEST_RANGE_M,
): HarvestNode | null {
  let best: HarvestNode | null = null;
  let bestD = range * range;
  for (const n of nodes) {
    if (n.hp <= 0) continue;
    const dx = n.x - pos.x;
    const dz = n.z - pos.z;
    const d = dx * dx + dz * dz;
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return best;
}

export const NODE_META: Record<string, { label: string; color: string }> = {
  wood: { label: "Wood", color: "#6b4226" },
  stone: { label: "Stone", color: "#8a8680" },
  ore: { label: "Ore", color: "#c46a2b" },
  gems: { label: "Gems", color: "#7ec8ff" },
  herbs: { label: "Herbs", color: "#4caf6a" },
  hemp: { label: "Hemp", color: "#4a7a32" },
  fiber: { label: "Fiber", color: "#8aa060" },
  potion_petal: { label: "Potion petal", color: "#c060d0" },
  meat: { label: "Meat", color: "#c45a3a" },
  hide: { label: "Hide", color: "#a08050" },
  fish: { label: "Fish", color: "#3aa0d8" },
  feather: { label: "Feather", color: "#e8e0c8" },
  fang: { label: "Fang", color: "#d0d0d0" },
  tusk: { label: "Tusk", color: "#e8d8b0" },
  resin: { label: "Resin", color: "#c8a040" },
  coconut: { label: "Coconut", color: "#8a6230" },
  flint: { label: "Flint", color: "#5a5a58" },
};
