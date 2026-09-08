const SECTORS = [
  ["ethereal_falls", "Ethereal Falls", 0, 0, "ethereal"],
  ["frostbite_expanse", "Frostbite Expanse", 1, 0, "winter"],
  ["thornwood_wilds", "Thornwood Wilds", 2, 0, "forest"],
  ["stormbreak_reef", "Stormbreak Reef", 0, 1, "storm"],
  ["convergence_nexus", "Convergence Nexus", 1, 1, "nexus"],
  ["ashen_wastes", "Ashen Wastes", 2, 1, "desert"],
  ["abyssal_trench", "Abyssal Trench", 0, 2, "abyssal"],
  ["haven_shore", "Haven Shore", 1, 2, "beach"],
  ["ember_depths", "Ember Depths", 2, 2, "volcanic"],
];

export default function handler(_req: unknown, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (b: unknown) => unknown } }) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const sectors = SECTORS.map(([id, label, col, row, biome]) => ({
    id, label, col, row, biome,
    neighbors: SECTORS.filter(([, , c, r]) => Math.abs(Number(c) - Number(col)) + Math.abs(Number(r) - Number(row)) === 1).map((x) => x[0]),
  }));
  res.status(200).json({ family: "warlords-era", note: "Not home-block 3x3.", sectors });
}
