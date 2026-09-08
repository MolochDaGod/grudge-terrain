import { FLEET } from "../lib/canon";

/** Account Warlord kits — GLB on assets CDN, Mixamo-25 / fleet humanoid @ 2 m. */
export const WARLORD_KITS = {
  human: {
    id: "human",
    label: "Warlord",
    race: "human",
    role: "warrior",
    model: `${FLEET.assets}/models/characters/human.glb`,
    scale: 1,
  },
  berserker: {
    id: "berserker",
    label: "Berserker",
    race: "barbarian",
    role: "warrior",
    model: `${FLEET.assets}/models/characters/berserker.glb`,
    scale: 1.05,
  },
  knight: {
    id: "knight",
    label: "Knight",
    race: "human",
    role: "warrior",
    model: `${FLEET.assets}/models/characters/knight.glb`,
    scale: 1,
  },
} as const;

export type WarlordKitId = keyof typeof WARLORD_KITS;

export function resolveWarlordKit(search = window.location.search): WarlordKitId {
  const q = new URLSearchParams(search);
  const raw = (q.get("kit") || q.get("warlord") || q.get("character") || "human").toLowerCase();
  if (raw in WARLORD_KITS) return raw as WarlordKitId;
  return "human";
}
