import { FLEET } from "../lib/canon";

/**
 * Account Warlord kits.
 * Preferred mesh: grudge6 one-kit + child visibility (Bip001, 2.0 m fleet).
 * Fallback: Mixamo characters/*.glb which are still live on R2.
 */
const A = FLEET.assets;

export const WARLORD_KITS = {
  human: {
    id: "human",
    label: "Warlord",
    race: "human",
    role: "warrior",
    model: `${A}/models/grudge6/human.glb`,
    fallback: `${A}/models/characters/human.glb`,
    scale: 1,
    bones: "bip001",
  },
  berserker: {
    id: "berserker",
    label: "Berserker",
    race: "barbarian",
    role: "warrior",
    model: `${A}/models/grudge6/barbarian.glb`,
    fallback: `${A}/models/characters/berserker.glb`,
    scale: 1.05,
    bones: "bip001",
  },
  knight: {
    id: "knight",
    label: "Knight",
    race: "human",
    role: "warrior",
    model: `${A}/models/characters/knight.glb`,
    fallback: `${A}/models/grudge6/human.glb`,
    scale: 1,
    bones: "mixamo",
  },
  elf: {
    id: "elf",
    label: "Elf",
    race: "elf",
    role: "ranger",
    model: `${A}/models/grudge6/elf.glb`,
    fallback: `${A}/models/races/elf.glb`,
    scale: 0.98,
    bones: "bip001",
  },
  dwarf: {
    id: "dwarf",
    label: "Dwarf",
    race: "dwarf",
    role: "warrior",
    model: `${A}/models/grudge6/dwarf.glb`,
    fallback: `${A}/models/races/dwarf.glb`,
    scale: 0.88,
    bones: "bip001",
  },
  orc: {
    id: "orc",
    label: "Orc",
    race: "orc",
    role: "warrior",
    model: `${A}/models/grudge6/orc.glb`,
    fallback: `${A}/models/races/orc.glb`,
    scale: 1.08,
    bones: "bip001",
  },
  undead: {
    id: "undead",
    label: "Undead",
    race: "undead",
    role: "mage",
    model: `${A}/models/grudge6/undead.glb`,
    fallback: `${A}/models/races/undead.glb`,
    scale: 1,
    bones: "bip001",
  },
} as const;

export type WarlordKitId = keyof typeof WARLORD_KITS;

export function resolveWarlordKit(search = window.location.search): WarlordKitId {
  const q = new URLSearchParams(search);
  const raw = (q.get("kit") || q.get("warlord") || q.get("character") || q.get("race") || "human").toLowerCase();
  if (raw === "barbarian") return "berserker";
  if (raw in WARLORD_KITS) return raw as WarlordKitId;
  return "human";
}
