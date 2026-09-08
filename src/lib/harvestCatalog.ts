import { cdn } from "./canon";
import type { BiomeId } from "./biomes";

export type HarvestFamily = "tree" | "rock" | "ore" | "gem" | "flower" | "animal" | "monster" | "bird" | "fish";
export type HarvestTool = "axe" | "pick" | "knife" | "bow" | "rod" | "hand";

export interface HarvestPrefab {
  id: string; family: HarvestFamily; species: string; label: string;
  hostile: boolean; tool: HarvestTool; hp: number;
  yields: Array<{ item: string; min: number; max: number }>;
  glb: string | null; glbLive: boolean; glbNote?: string;
  scale: number; color: string; layer: "land" | "water" | "air";
  biomes: BiomeId[]; heavy?: boolean; animated?: boolean;
}

const T = (p: string) => cdn(p);
const ALL: BiomeId[] = ["beach","tropical","forest","plains","winter","frozen","desert","volcanic","storm","ethereal","abyssal","nexus"];
const COAST: BiomeId[] = ["beach","tropical","storm"];
const WOODS: BiomeId[] = ["forest","plains","ethereal","nexus","storm"];
const DEEP: BiomeId[] = ["abyssal","ethereal","nexus"];

function P(p: Partial<HarvestPrefab> & Pick<HarvestPrefab,"id"|"family"|"species"|"label"|"tool"|"hp"|"yields"|"color"|"layer"|"biomes">): HarvestPrefab {
  return { hostile: false, glb: null, glbLive: false, scale: 1, ...p };
}

export const HARVEST_PREFABS: HarvestPrefab[] = [
  P({ id:"tree_pine", family:"tree", species:"pine", label:"Pine", tool:"axe", hp:55, yields:[{item:"wood",min:3,max:6},{item:"resin",min:0,max:2}], glb:T("models/nature/organized/trees/pine2_14.glb"), glbLive:true, heavy:true, scale:1.6, color:"#2d4a28", layer:"land", biomes:["forest","plains","storm","nexus","ethereal"] }),
  P({ id:"tree_pine_tall", family:"tree", species:"pine_tall", label:"Tall Pine", tool:"axe", hp:70, yields:[{item:"wood",min:4,max:8},{item:"resin",min:1,max:2}], glb:T("models/nature/organized/trees/pine9_15.glb"), glbLive:true, heavy:true, scale:1.8, color:"#243e24", layer:"land", biomes:["forest","winter","nexus"] }),
  P({ id:"tree_birch", family:"tree", species:"birch", label:"Birch", tool:"axe", hp:42, yields:[{item:"wood",min:2,max:5}], glb:T("models/nature/organized/trees/birch2_4.glb"), glbLive:true, heavy:true, scale:1.5, color:"#3a5c32", layer:"land", biomes:["forest","plains","winter"] }),
  P({ id:"tree_birch_old", family:"tree", species:"birch_old", label:"Old Birch", tool:"axe", hp:48, yields:[{item:"wood",min:3,max:6}], glb:T("models/nature/organized/trees/birch6_5.glb"), glbLive:true, heavy:true, scale:1.55, color:"#4a6a3a", layer:"land", biomes:["forest","plains","ethereal"] }),
  P({ id:"tree_palm", family:"tree", species:"palm", label:"Palm", tool:"axe", hp:38, yields:[{item:"wood",min:2,max:4},{item:"coconut",min:0,max:2}], glb:T("models/nature/organized/trees/palm2_13.glb"), glbLive:true, heavy:true, scale:1.7, color:"#1f6a28", layer:"land", biomes:COAST }),
  P({ id:"tree_coconut", family:"tree", species:"coconut", label:"Coconut Palm", tool:"axe", hp:40, yields:[{item:"wood",min:2,max:4},{item:"coconut",min:1,max:3}], glb:T("models/nature/organized/trees/coconut2_9.glb"), glbLive:true, heavy:true, scale:1.7, color:"#246b2c", layer:"land", biomes:["beach","tropical"] }),
  P({ id:"tree_banana", family:"tree", species:"banana", label:"Banana Tree", tool:"axe", hp:32, yields:[{item:"wood",min:1,max:3},{item:"fiber",min:1,max:2}], glb:T("models/nature/organized/trees/banana2_3.glb"), glbLive:true, heavy:true, scale:1.3, color:"#3a8a28", layer:"land", biomes:["beach","tropical"] }),
  P({ id:"tree_ancient", family:"tree", species:"ancient", label:"Ancient Tree", tool:"axe", hp:90, yields:[{item:"wood",min:5,max:9},{item:"resin",min:1,max:3}], glb:T("models/nature/organized/trees/ancient_tree_2_0.glb"), glbLive:true, heavy:true, scale:2, color:"#2a3a22", layer:"land", biomes:["forest","ethereal","abyssal","nexus"] }),
  P({ id:"tree_creepy", family:"tree", species:"creepy", label:"Twilight Tree", tool:"axe", hp:62, yields:[{item:"wood",min:3,max:6}], glb:T("models/nature/organized/trees/creepy_tree1_10.glb"), glbLive:true, heavy:true, scale:1.7, color:"#3a2a40", layer:"land", biomes:["ethereal","abyssal","storm","nexus"] }),
  P({ id:"tree_garden_pink", family:"tree", species:"garden_pink", label:"Bloom Tree", tool:"axe", hp:36, yields:[{item:"wood",min:2,max:4},{item:"potion_petal",min:0,max:2}], glb:T("models/nature/organized/trees/garden_tree_pink_11.glb"), glbLive:true, heavy:true, scale:1.4, color:"#c06090", layer:"land", biomes:["ethereal","plains","nexus"] }),
  P({ id:"tree_snow_pine", family:"tree", species:"snow_pine", label:"Snow Pine", tool:"axe", hp:60, yields:[{item:"wood",min:3,max:6}], glb:T("models/nature/organized/trees/pine2_14.glb"), glbLive:true, heavy:true, glbNote:"Uses pine2_14 until a dedicated snow canopy lands.", scale:1.7, color:"#6a7a72", layer:"land", biomes:["winter","frozen"] }),
  P({ id:"rock_1", family:"rock", species:"boulder", label:"Boulder", tool:"pick", hp:70, yields:[{item:"stone",min:3,max:6}], glb:T("models/nature/organized/rocks/rock_1.glb"), glbLive:true, heavy:true, scale:0.55, color:"#8a8680", layer:"land", biomes:ALL }),
  P({ id:"rock_2", family:"rock", species:"outcrop", label:"Stone Outcrop", tool:"pick", hp:80, yields:[{item:"stone",min:4,max:7},{item:"flint",min:0,max:2}], glb:T("models/nature/organized/rocks/rock_2.glb"), glbLive:true, heavy:true, scale:0.5, color:"#7a7670", layer:"land", biomes:["frozen","winter","volcanic","desert"] }),
  P({ id:"rock_4", family:"rock", species:"cliff_chunk", label:"Cliff Chunk", tool:"pick", hp:88, yields:[{item:"stone",min:4,max:8},{item:"flint",min:0,max:2}], glb:T("models/nature/organized/rocks/rock_4.glb"), glbLive:true, heavy:true, scale:0.42, color:"#6e6a64", layer:"land", biomes:["volcanic","desert","frozen","abyssal"] }),
  P({ id:"ore_vein", family:"ore", species:"iron", label:"Ore Vein", tool:"pick", hp:90, yields:[{item:"ore",min:1,max:3},{item:"stone",min:1,max:2}], glb:T("models/nature/organized/rocks/rock_3.glb"), glbLive:true, heavy:true, scale:0.48, color:"#c46a2b", layer:"land", biomes:["winter","frozen","volcanic","desert","nexus","abyssal","storm"] }),
  P({ id:"gem_cluster", family:"gem", species:"gems", label:"Gem Cluster", tool:"pick", hp:95, yields:[{item:"gems",min:1,max:2}], glb:T("models/environment/gem_cluster.glb"), glbLive:true, heavy:true, scale:0.8, color:"#7ec8ff", layer:"land", biomes:["volcanic","ethereal","abyssal","frozen","nexus","desert"] }),
  P({ id:"flower_hemp", family:"flower", species:"hemp", label:"Hemp", tool:"hand", hp:8, yields:[{item:"hemp",min:1,max:3},{item:"fiber",min:1,max:2}], glbNote:"Need models/nature/organized/flowers/hemp.glb", scale:0.9, color:"#4a7a32", layer:"land", biomes:["plains","forest","beach","tropical","nexus"] }),
  P({ id:"flower_herb", family:"flower", species:"herb", label:"Wild Herb", tool:"hand", hp:6, yields:[{item:"herbs",min:1,max:3}], glbNote:"Need models/nature/organized/flowers/herb.glb", scale:0.7, color:"#4caf6a", layer:"land", biomes:["forest","plains","ethereal","beach","tropical","nexus"] }),
  P({ id:"flower_potion", family:"flower", species:"potion_bloom", label:"Potion Bloom", tool:"hand", hp:10, yields:[{item:"potion_petal",min:1,max:2},{item:"herbs",min:0,max:1}], glbNote:"Need models/nature/organized/flowers/potion_bloom.glb", scale:0.75, color:"#c060d0", layer:"land", biomes:["ethereal","nexus","forest","abyssal"] }),
  P({ id:"animal_deer", family:"animal", species:"deer", label:"Deer", tool:"bow", hp:28, yields:[{item:"meat",min:1,max:3},{item:"hide",min:1,max:2}], glb:T("models/creatures/deer.glb"), glbLive:true, glbNote:"44 KB stub on R2 — replace with animated deer rig.", scale:1.1, color:"#c4a06a", layer:"land", biomes:["forest","plains","beach","tropical","winter","ethereal","nexus"] }),
  P({ id:"animal_goat", family:"animal", species:"goat", label:"Goat", tool:"bow", hp:22, yields:[{item:"meat",min:1,max:2},{item:"hide",min:1,max:1}], glbNote:"Need models/creatures/goat.glb", scale:0.95, color:"#d0c4b0", layer:"land", biomes:["plains","winter","frozen","desert","volcanic"] }),
  P({ id:"animal_rabbit", family:"animal", species:"rabbit", label:"Rabbit", tool:"bow", hp:10, yields:[{item:"meat",min:1,max:1},{item:"hide",min:0,max:1}], glb:T("models/creatures/rabbit.glb"), glbLive:true, glbNote:"44 KB stub — replace with animated rabbit.", scale:0.55, color:"#d2c0a8", layer:"land", biomes:["plains","forest","frozen","winter"] }),
  P({ id:"animal_buffalo", family:"animal", species:"buffalo", label:"Buffalo", tool:"bow", hp:70, yields:[{item:"meat",min:3,max:6},{item:"hide",min:2,max:4}], glb:T("models/creatures/buffalo.glb"), glbLive:true, glbNote:"44 KB stub — replace with animated buffalo.", scale:1.35, color:"#5a4030", layer:"land", biomes:["plains","frozen","nexus"] }),
  P({ id:"monster_wolf", family:"monster", species:"wolf", label:"Wolf", hostile:true, tool:"knife", hp:45, yields:[{item:"meat",min:1,max:2},{item:"fang",min:0,max:2}], glb:T("models/creatures/wolf.glb"), glbLive:true, glbNote:"44 KB stub — need animated wolf rig.", scale:1.05, color:"#6a6a72", layer:"land", biomes:["forest","winter","frozen","storm","ethereal","abyssal","nexus"] }),
  P({ id:"monster_bear", family:"monster", species:"bear", label:"Bear", hostile:true, tool:"knife", hp:90, yields:[{item:"meat",min:3,max:5},{item:"hide",min:2,max:3}], glb:T("models/creatures/bear.glb"), glbLive:true, glbNote:"44 KB stub — need animated bear.", scale:1.4, color:"#4a3020", layer:"land", biomes:["frozen","forest","winter","nexus"] }),
  P({ id:"monster_boar", family:"monster", species:"boar", label:"Boar", hostile:true, tool:"knife", hp:40, yields:[{item:"meat",min:2,max:3},{item:"tusk",min:0,max:2}], glb:T("models/creatures/boar.glb"), glbLive:true, glbNote:"44 KB stub — need animated boar.", scale:1, color:"#6a4a32", layer:"land", biomes:["beach","tropical","forest","desert","storm","ethereal","abyssal","nexus"] }),
  P({ id:"bird_raven", family:"bird", species:"raven", label:"Raven", tool:"bow", hp:8, yields:[{item:"feather",min:1,max:3}], glbNote:"Need models/creatures/air/raven.glb", scale:0.45, color:"#1a1a1e", layer:"air", biomes:["forest","winter","frozen","ethereal","abyssal","nexus"] }),
  P({ id:"bird_seagull", family:"bird", species:"seagull", label:"Seagull", tool:"bow", hp:8, yields:[{item:"feather",min:1,max:2}], glbNote:"Need models/creatures/air/seagull.glb", scale:0.5, color:"#e8e8e0", layer:"air", biomes:COAST }),
  P({ id:"bird_duck", family:"bird", species:"duck", label:"Duck", tool:"bow", hp:10, yields:[{item:"meat",min:1,max:1},{item:"feather",min:1,max:2}], glb:T("models/creatures/duck.glb"), glbLive:true, animated:true, heavy:true, glbNote:"4.4 MB animated duck — clone only a few nodes.", scale:0.35, color:"#c8a050", layer:"air", biomes:["beach","plains","forest","storm"] }),
];

export const FAMILY_SCATTER: Record<HarvestFamily, number> = { tree:26, rock:14, ore:5, gem:3, flower:14, animal:6, monster:4, fish:20, bird:8 };
export const HARVEST_RANGE_M = 6.5;
export const MISSING_PREFABS = HARVEST_PREFABS.filter((p) => !p.glbLive);
export const STUB_PREFABS = HARVEST_PREFABS.filter((p) => p.glbLive && p.glbNote?.includes("44 KB"));
export const LIVE_FISH = HARVEST_PREFABS.filter((p) => p.family === "fish" && p.glbLive).map((p) => p.species);
export function prefabsForBiome(biome: BiomeId) { return HARVEST_PREFABS.filter((p) => p.biomes.includes(biome)); }
export function prefabById(id: string) { return HARVEST_PREFABS.find((p) => p.id === id); }
export function prefabsOfFamily(biome: BiomeId, family: HarvestFamily) { return prefabsForBiome(biome).filter((p) => p.family === family); }
