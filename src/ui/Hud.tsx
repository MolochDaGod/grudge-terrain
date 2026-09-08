import { BIOME_LIST, type BiomeId } from "../lib/biomes";
import { SECTORS } from "../lib/sectors";
import { BUILD_CATALOG, type BuildKind } from "../play/RtsGhost";
import type { PlayTool } from "../play/PlayWorld";
import type { IslandSpec } from "../lib/world";
import { NODE_META, type NodeKind } from "../lib/nodes";

export function Hud(props: {
  spec: IslandSpec; tool: PlayTool; shovel: "raise" | "lower" | "flatten"; build: BuildKind;
  seedKey: string; biome: BiomeId; bag: Partial<Record<NodeKind, number>>; log: string; playing: boolean;
  onTool: (t: PlayTool) => void; onShovel: (s: "raise" | "lower" | "flatten") => void; onBuild: (b: BuildKind) => void;
  onSeed: (s: string) => void; onBiome: (b: BiomeId) => void; onSector: (id: string) => void;
  onEnter: () => void; onRebuild: () => void; onUpload: (file: File) => void;
}) {
  return (
    <div className="hud">
      <header className="top">
        <div>
          <div className="mark">GRUDGE TERRAIN</div>
          <div className="sub">terrain.grudge-studio.com · 1024 m contract · Rapier / R3F</div>
        </div>
        <div className="seedrow">
          <input value={props.seedKey} onChange={(e) => props.onSeed(e.target.value)} placeholder="seed key" />
          <select value={props.biome} onChange={(e) => props.onBiome(e.target.value as BiomeId)}>
            {BIOME_LIST.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
          <button onClick={props.onRebuild}>Rebuild island</button>
          <button className="enter" onClick={props.onEnter}>{props.playing ? "Reset play" : "Enter world"}</button>
        </div>
      </header>
      <aside className="tools">
        {(["explore", "harvest", "shovel", "rts"] as PlayTool[]).map((t) => (
          <button key={t} className={props.tool === t ? "on" : ""} onClick={() => props.onTool(t)}>{t}</button>
        ))}
        {props.tool === "shovel" && (
          <div className="mini">
            {(["raise", "lower", "flatten"] as const).map((s) => (
              <button key={s} className={props.shovel === s ? "on" : ""} onClick={() => props.onShovel(s)}>{s}</button>
            ))}
          </div>
        )}
        {props.tool === "rts" && (
          <div className="mini">
            {(Object.keys(BUILD_CATALOG) as BuildKind[]).map((k) => (
              <button key={k} className={props.build === k ? "on" : ""} onClick={() => props.onBuild(k)}>{BUILD_CATALOG[k].label}</button>
            ))}
          </div>
        )}
        <label className="upload">
          Upload GLB / PNG
          <input type="file" accept=".glb,.gltf,.png,.webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) props.onUpload(f); }} />
        </label>
      </aside>
      <aside className="map">
        <div className="mark">World map · era 9</div>
        <div className="grid">
          {SECTORS.map((s) => (
            <button key={s.id} className={props.spec.sectorId === s.id ? "on" : ""} style={{ gridColumn: s.col + 1, gridRow: s.row + 1 }} onClick={() => props.onSector(s.id)} title={s.neighbors.join(", ")}>
              {s.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </aside>
      <footer className="bag">
        <span>{props.log}</span>
        <span className="loot">
          {(Object.keys(NODE_META) as NodeKind[]).map((k) => (
            <em key={k}>{NODE_META[k].label} {props.bag[k] ?? 0}</em>
          ))}
        </span>
        <span className="hint">WASD move · Shift sprint · E harvest · LMB shovel/build · seed maps via /api/seed</span>
      </footer>
    </div>
  );
}
