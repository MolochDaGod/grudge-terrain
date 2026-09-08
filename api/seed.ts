export default async function handler(req: { query?: Record<string, string>; method?: string }, res: {
  setHeader: (k: string, v: string) => void;
  status: (n: number) => { json: (b: unknown) => unknown; end: () => unknown };
}) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(204).end();
  const seed = String(req.query?.seed ?? "driftwood-01");
  const biome = String(req.query?.biome ?? "beach");
  const sector = req.query?.sector ?? null;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return res.status(200).json({
    spec: {
      family: "home-island",
      seed: h >>> 0,
      seedKey: seed,
      biome,
      sectorId: sector,
      diameterM: 1024,
      playDiameterM: 256,
      characterM: 2,
      playUrl: `https://terrain.grudge-studio.com/?seed=${encodeURIComponent(seed)}&biome=${encodeURIComponent(biome)}${sector ? `&sector=${sector}` : ""}`,
    },
    hint: "Client rebuilds heightfield + nodes from this seed. Same key always same island.",
  });
}
