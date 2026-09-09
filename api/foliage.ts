export default function handler(_req: unknown, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (b: unknown) => unknown } }) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const A = "https://assets.grudge-studio.com";
  res.status(200).json({
    cdn: A,
    banned: ["CommonTree", "TwistedTree", "DeadTree", "Rock_Medium", "Pine_1", "Bush_Common", "nature-megakit", "/models/lowpoly/"],
    catalog: [
      { id: "palm", policy: "palm", glb: `${A}/models/nature/realistic/trees/palm/palm_a.glb` },
      { id: "palm_stylized", policy: "palm_stylized", glb: `${A}/models/nature/realistic/trees/palm/palm_b.glb` },
      { id: "pine_stylized", policy: "pine_stylized", glb: `${A}/models/nature/realistic/trees/pine/pine_a.glb` },
      { id: "snow_pine", policy: "snow_pine", glb: `${A}/models/nature/realistic/trees/snow/snow_pine_a.glb` },
      { id: "stylized_pine", policy: "stylized_pine", glb: `${A}/models/nature/realistic/trees/pine/pine_b.glb` },
      { id: "fern", policy: "*", glb: `${A}/models/nature/Fern_1.glb` },
      { id: "plant", policy: "*", glb: `${A}/models/nature/Plant_1.glb` },
      { id: "rock_real", policy: "*", glb: `${A}/models/nature/realistic/rocks/boulder_a.glb` },
    ],
  });
}
