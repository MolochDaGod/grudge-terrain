export default async function handler(req: { query?: Record<string, string>; method?: string }, res: {
  setHeader: (k: string, v: string) => void;
  status: (n: number) => { json: (b: unknown) => unknown; end: () => unknown };
}) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  const seedKey = String(req.query?.seed ?? "driftwood-01");
  const biome = String(req.query?.biome ?? "beach");
  const sector = req.query?.sector ?? null;
  const reliefQ = String(req.query?.relief ?? "").toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < seedKey.length; i++) {
    h ^= seedKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const seed = h >>> 0;
  const peaks: Record<string, number> = {
    beach: 16, tropical: 18, plains: 20, forest: 24, storm: 22, desert: 22,
    winter: 26, frozen: 28, ethereal: 24, nexus: 26, abyssal: 24, volcanic: 30,
  };
  const defaults: Record<string, string> = {
    beach: "atoll", tropical: "atoll", plains: "highland", forest: "ridge",
    storm: "ridge", desert: "highland", winter: "mountain", frozen: "mountain",
    ethereal: "mountain", nexus: "highland", abyssal: "cavern", volcanic: "caldera",
  };
  const allowed = ["atoll", "ridge", "mountain", "caldera", "cavern", "highland"];
  const relief = allowed.includes(reliefQ) ? reliefQ : (defaults[biome] ?? "highland");
  const playPeakM = biome === "volcanic" ? 30 : (peaks[biome] ?? 20);
  return res.status(200).json({
    spec: {
      family: "home-island",
      seed,
      seedKey,
      biome,
      sectorId: sector,
      relief,
      playPeakM,
      diameterM: 1024,
      playDiameterM: 256,
      characterM: 2,
      mountainPeakM: 30,
      playUrl: `https://terrain.grudge-studio.com/?seed=${encodeURIComponent(seedKey)}&biome=${encodeURIComponent(biome)}&relief=${relief}${sector ? `&sector=${sector}` : ""}`,
    },
    peaks,
    defaultRelief: defaults,
    reliefs: allowed,
    hint: "Client rebuilds heightfield + caves + nodes from this seed. Same key+biome+relief always same island.",
  });
}
