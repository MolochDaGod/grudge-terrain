export default function handler(_req: unknown, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (b: unknown) => unknown } }) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    product: "grudge-terrain",
    origin: "https://terrain.grudge-studio.com",
    contract: { family: "home-island", diameterM: 1024, playDiameterM: 256, characterM: 2, mountainPeakM: 30, volcanicPeakM: 30, harvestRegenHours: 4 },
    catalogs: {
      terrain: "https://info.grudge-studio.com/api/v1/terrain.json",
      biomes: "https://info.grudge-studio.com/api/v1/biome-ecosystems.json",
      maps: "https://info.grudge-studio.com/api/v1/map-registry.json",
      nature: "https://info.grudge-studio.com/api/v1/organized-nature-manifest.json",
      zones: "https://info.grudge-studio.com/api/v1/warlords-zones.json",
    },
  });
}
