import type { HeightField } from "./heightmap";
import { sampleHeight } from "./heightmap";
import { BIOMES, type BiomeId, type NodeKind } from "./biomes";
import { SeededRandom } from "./seed";
import { WORLD } from "./canon";

export interface HarvestNode {
  id: string; kind: NodeKind; label: string;
  x: number; y: number; z: number;
  hp: number; maxHp: number; yieldMin: number; yieldMax: number;
  regenMs: number; depletedAt: number | null; color: string;
}

export const NODE_META: Record<NodeKind, { label: string; color: string; hp: number; yield: [number, number] }> = {
  wood: { label: "Timber", color: "#6b4226", hp: 40, yield: [2, 5] },
  stone: { label: "Stone", color: "#8a8680", hp: 55, yield: [2, 4] },
  ore: { label: "Ore Vein", color: "#c46a2b", hp: 70, yield: [1, 3] },
  herbs: { label: "Herbs", color: "#4caf6a", hp: 18, yield: [1, 4] },
  gems: { label: "Gem Node", color: "#7ec8ff", hp: 80, yield: [1, 2] },
  fishing: { label: "Fishing Hole", color: "#3aa0d8", hp: 24, yield: [1, 3] },
  animal: { label: "Wildlife", color: "#d2a06a", hp: 30, yield: [1, 2] },
  monster: { label: "Monster Den", color: "#c04040", hp: 90, yield: [1, 3] },
};

const REGEN = WORLD.harvestRegenHours * 3600 * 1000;

export function scatterNodes(opts: { seed: number; biome: BiomeId; field: HeightField; count?: number }): HarvestNode[] {
  const biome = BIOMES[opts.biome];
  const rng = new SeededRandom(opts.seed ^ 0x91a2);
  const half = opts.field.size * 0.42;
  const want = opts.count ?? 48;
  const nodes: HarvestNode[] = [];
  let tries = 0;
  while (nodes.length < want && tries < want * 12) {
    tries++;
    const ang = rng.next() * Math.PI * 2;
    const rad = Math.sqrt(rng.next()) * half;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    const y = sampleHeight(opts.field, x, z);
    const kind = rng.pick(biome.nodes);
    if (kind === "fishing" && y > WORLD.waterY + 1.4) continue;
    if (kind !== "fishing" && y < WORLD.waterY + 0.35) continue;
    const meta = NODE_META[kind];
    nodes.push({
      id: `node-${nodes.length}`, kind, label: meta.label, x,
      y: kind === "fishing" ? WORLD.waterY + 0.2 : y + 0.4, z,
      hp: meta.hp, maxHp: meta.hp, yieldMin: meta.yield[0], yieldMax: meta.yield[1],
      regenMs: REGEN, depletedAt: null, color: meta.color,
    });
  }
  return nodes;
}

export function harvestTick(node: HarvestNode, now = Date.now()): HarvestNode {
  if (node.depletedAt && now - node.depletedAt >= node.regenMs) {
    return { ...node, hp: node.maxHp, depletedAt: null };
  }
  return node;
}

export function strikeNode(node: HarvestNode, dmg = 12, rng = Math.random): { node: HarvestNode; loot: number } {
  if (node.hp <= 0) return { node, loot: 0 };
  const hp = Math.max(0, node.hp - dmg);
  const loot = hp <= 0 ? node.yieldMin + Math.floor(rng() * (node.yieldMax - node.yieldMin + 1)) : 0;
  return { node: { ...node, hp, depletedAt: hp <= 0 ? Date.now() : null }, loot };
}
