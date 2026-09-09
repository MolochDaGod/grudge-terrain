import { FLEET } from "../lib/canon";

/**
 * Account Warlord kits from Character Studio bake.
 * Golden: Toon RTS GLB ★ used by https://character.grudge-studio.com/viewer
 * Compare: models/grudge6/{race}.glb
 * Mixamo fallback: models/characters/{kit}.glb
 *
 * Controller contract (grudge-studio-animation skill):
 * one mixer, in-place clips, Rapier CCT owns translation, fleet scale 2.0 m.
 */
const A = FLEET.assets;
const TOON = `${A}/asset-packs/toon-rts-characters/glb/characters`;
const VIEWER = "https://character.grudge-studio.com/viewer";

function kit(
  id: string,
  label: string,
  race: string,
  role: string,
  scale: number,
  extra?: { mixamo?: string },
) {
  return {
    id,
    label,
    race,
    role,
    model: `${TOON}/${race}.glb`,
    fallback: `${A}/models/grudge6/${race}.glb`,
    mixamo: extra?.mixamo ?? `${A}/models/characters/${id === "berserker" ? "berserker" : race}.glb`,
    viewer: `${VIEWER}?race=${race}`,
    scale,
    bones: "bip001" as const,
    bake: "toon-rts" as const,
  };
}

export const WARLORD_KITS = {
  human: kit("human", "Warlord", "human", "warrior", 1),
  berserker: kit("berserker", "Berserker", "barbarian", "warrior", 1.05, {
    mixamo: `${A}/models/characters/berserker.glb`,
  }),
  knight: {
    id: "knight",
    label: "Knight",
    race: "human",
    role: "warrior",
    model: `${TOON}/human.glb`,
    fallback: `${A}/models/characters/knight.glb`,
    mixamo: `${A}/models/characters/knight.glb`,
    viewer: `${VIEWER}?race=human&kit=knight`,
    scale: 1,
    bones: "bip001" as const,
    bake: "toon-rts" as const,
  },
  elf: kit("elf", "Elf", "elf", "ranger", 0.98),
  dwarf: kit("dwarf", "Dwarf", "dwarf", "warrior", 0.88),
  orc: kit("orc", "Orc", "orc", "warrior", 1.08),
  undead: kit("undead", "Undead", "undead", "mage", 1),
} as const;

export type WarlordKitId = keyof typeof WARLORD_KITS;

export function resolveWarlordKit(search = window.location.search): WarlordKitId {
  const q = new URLSearchParams(search);
  const raw = (q.get("kit") || q.get("warlord") || q.get("character") || q.get("race") || "human").toLowerCase();
  if (raw === "barbarian") return "berserker";
  if (raw in WARLORD_KITS) return raw as WarlordKitId;
  return "human";
}

export function kitPreloadUrls(id: WarlordKitId): string[] {
  const k = WARLORD_KITS[id];
  return [k.model, k.fallback];
}
