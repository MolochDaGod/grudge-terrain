export default function handler(_req: unknown, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { json: (b: unknown) => unknown } }) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    regenHours: 4,
    style: "valheim-nodes",
    harvestRangeM: 6.5,
    families: ["tree", "rock", "ore", "gem", "flower", "animal", "monster", "bird", "fish"],
    scatter: { tree: 26, rock: 14, ore: 5, gem: 3, flower: 14, animal: 6, monster: 4, fish: 20, bird: 8 },
    peacefulAnimals: ["deer", "goat", "rabbit", "buffalo"],
    hostileAnimals: ["wolf", "bear", "boar"],
    birds: ["raven", "seagull", "duck"],
    flowers: ["hemp", "herb", "potion_bloom"],
    treesLiveOnR2: [
      "pine2_14", "pine9_15", "birch2_4", "birch6_5", "palm2_13", "coconut2_9",
      "banana2_3", "ancient_tree_2_0", "creepy_tree1_10", "garden_tree_pink_11",
    ],
    rocksLiveOnR2: ["rock_1", "rock_2", "rock_3", "rock_4", "gem_cluster"],
    fishLiveOnR2: [
      "clownfish", "lionfish", "goldfish", "puffer", "betta", "tetra", "koi",
      "blue-tang", "yellow-tang", "mandarin-fish", "parrot-fish", "cardinal-fish",
      "tuna", "swordfish", "piranha", "anglerfish", "shark", "red-snapper", "goblin-shark",
    ],
    fishCdn: "https://assets.grudge-studio.com/models/creatures/fish/{species}.glb",
    duckLive: { path: "models/creatures/duck.glb", bytes: 4436352, animated: true },
    missingUploads: [
      { id: "goat", want: "models/creatures/goat.glb", family: "animal" },
      { id: "raven", want: "models/creatures/air/raven.glb", family: "bird" },
      { id: "seagull", want: "models/creatures/air/seagull.glb", family: "bird" },
      { id: "hemp", want: "models/nature/organized/flowers/hemp.glb", family: "flower" },
      { id: "herb", want: "models/nature/organized/flowers/herb.glb", family: "flower" },
      { id: "potion_bloom", want: "models/nature/organized/flowers/potion_bloom.glb", family: "flower" },
    ],
    stubReplace44kb: [
      "models/creatures/deer.glb",
      "models/creatures/wolf.glb",
      "models/creatures/bear.glb",
      "models/creatures/boar.glb",
      "models/creatures/buffalo.glb",
      "models/creatures/rabbit.glb",
    ],
  });
}
