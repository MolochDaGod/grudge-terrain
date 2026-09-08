export default function handler(_req: unknown, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (b: unknown) => unknown } }) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    cdn: "https://assets.grudge-studio.com",
    banned: ["CommonTree", "TwistedTree", "DeadTree", "Rock_Medium", "Pine_1", "nature-megakit", "/models/lowpoly/"],
    catalog: [
      { id: "palm", policy: "palm", glb: "https://assets.grudge-studio.com/models/nature/realistic/trees/palm.glb" },
      { id: "pine_stylized", policy: "pine_stylized", glb: "https://assets.grudge-studio.com/models/nature/organized/trees/pine_stylized.glb" },
      { id: "snow_pine", policy: "snow_pine", glb: "https://assets.grudge-studio.com/models/nature/organized/trees/snow_pine.glb" },
      { id: "rock_real", policy: "*", glb: "https://assets.grudge-studio.com/models/nature/realistic/rocks/boulder.glb" },
    ],
  });
}
