export default function handler(_req: unknown, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (b: unknown) => unknown } }) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    regenHours: 4,
    kinds: ["wood", "stone", "ore", "herbs", "gems", "fishing", "animal", "monster"],
  });
}
