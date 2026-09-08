/**
 * Fleet contracts — do not mix map families.
 * SSOT: info.grudge-studio.com/api/v1/map-registry.json
 */
export const FLEET = {
  origin: "https://terrain.grudge-studio.com",
  info: "https://info.grudge-studio.com/api/v1",
  assets: "https://assets.grudge-studio.com",
  id: "https://id.grudge-studio.com",
  client: "https://client.grudge-studio.com",
  forge: "https://forge.grudge-studio.com",
  open: "https://open.grudge-studio.com",
} as const;

export const WORLD = {
  family: "home-island" as const,
  diameterM: 1024,
  playDiameterM: 256,
  characterM: 2.0,
  mountainPeakM: 20,
  rtsCoreM: 200,
  harvestRegenHours: 4,
  waterY: -0.4,
};

export const FOUNDATIONS = {
  driftwood_bay: {
    id: "driftwood_bay",
    label: "Driftwood Bay",
    tone: "coastal",
    maxElevationM: 48,
    beachBandM: 28,
    playPeakM: 14,
  },
  ironfang_spire: {
    id: "ironfang_spire",
    label: "Ironfang Spire",
    tone: "highland",
    maxElevationM: 80,
    beachBandM: 14,
    playPeakM: 20,
  },
} as const;

export type FoundationId = keyof typeof FOUNDATIONS;

export const BANNED_NATURE = [
  "CommonTree", "TwistedTree", "DeadTree", "Rock_Medium",
  "Pine_1", "Pine_2", "Pine_3", "Pine_4", "Pine_5",
  "Bush_Common", "nature-megakit", "/models/lowpoly/",
] as const;

export function cdn(path: string): string {
  if (path.startsWith("http")) return path;
  const p = path.replace(/^\/+/, "");
  return `${FLEET.assets}/${p}`;
}

export function assertFamily(id: string, family: string) {
  if (family === "warlords-era" && id.includes("home")) {
    throw new Error(`map family mismatch: ${id} is not a warlords-era sector`);
  }
}
