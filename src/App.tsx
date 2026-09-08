import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayWorld, type PlayTool } from "./play/PlayWorld";
import { Hud } from "./ui/Hud";
import { buildIsland, type IslandWorld } from "./lib/world";
import { sculpt, sampleHeight } from "./lib/heightmap";
import { strikeNode, harvestTick, type HarvestNode } from "./lib/nodes";
import type { BiomeId, NodeKind } from "./lib/biomes";
import { SECTOR_BY_ID } from "./lib/sectors";
import { BUILD_CATALOG, type BuildKind, type PlacedBuild } from "./play/RtsGhost";
import { assertLegalFoliagePath } from "./lib/foliage";

const input0 = { f: false, b: false, l: false, r: false, sprint: false };

export default function App() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [seedKey, setSeedKey] = useState(params.get("seed") || "driftwood-01");
  const [biome, setBiome] = useState<BiomeId>((params.get("biome") as BiomeId) || "beach");
  const [sectorId, setSectorId] = useState<string | null>(params.get("sector"));
  const [world, setWorld] = useState<IslandWorld>(() => buildIsland({ seedKey, biome, sectorId }));
  const [fieldVersion, setFieldVersion] = useState(0);
  const [nodes, setNodes] = useState<HarvestNode[]>(world.nodes);
  const [builds, setBuilds] = useState<PlacedBuild[]>([]);
  const [ghost, setGhost] = useState<PlacedBuild | null>(null);
  const [tool, setTool] = useState<PlayTool>("explore");
  const [shovel, setShovel] = useState<"raise" | "lower" | "flatten">("raise");
  const [build, setBuild] = useState<BuildKind>("hall");
  const [bag, setBag] = useState<Partial<Record<NodeKind, number>>>({});
  const [log, setLog] = useState("Enter the island. Harvest, shovel, or RTS-build.");
  const [playing, setPlaying] = useState(true);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Array<{ name: string; url: string; ok: boolean }>>([]);
  const input = useRef({ ...input0 });

  const rebuild = useCallback((next?: { seedKey?: string; biome?: BiomeId; sectorId?: string | null }) => {
    const w = buildIsland({ seedKey: next?.seedKey ?? seedKey, biome: next?.biome ?? biome, sectorId: next?.sectorId ?? sectorId });
    setWorld(w); setNodes(w.nodes); setBuilds([]); setFieldVersion((v) => v + 1);
    setLog(`Seed ${w.spec.seedKey} · ${w.spec.biome} · ${w.spec.foundation}`);
    const q = new URLSearchParams({ seed: w.spec.seedKey, biome: w.spec.biome, ...(w.spec.sectorId ? { sector: w.spec.sectorId } : {}) });
    history.replaceState(null, "", `?${q.toString()}`);
  }, [seedKey, biome, sectorId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const down = e.type === "keydown";
      if (e.code === "KeyW") input.current.f = down;
      if (e.code === "KeyS") input.current.b = down;
      if (e.code === "KeyA") input.current.l = down;
      if (e.code === "KeyD") input.current.r = down;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") input.current.sprint = down;
      if (down && e.code === "Digit1") setTool("explore");
      if (down && e.code === "Digit2") setTool("harvest");
      if (down && e.code === "Digit3") setTool("shovel");
      if (down && e.code === "Digit4") setTool("rts");
      if (down && e.code === "KeyE") {
        const live = nodes.map((n) => harvestTick(n));
        const n = live.find((x) => x.hp > 0);
        if (!n) return;
        const hit = strikeNode(n);
        setNodes(live.map((x) => (x.id === n.id ? hit.node : x)));
        setHighlightId(n.id);
        if (hit.loot) {
          setBag((b) => ({ ...b, [n.kind]: (b[n.kind] ?? 0) + hit.loot }));
          setLog(`Harvested ${hit.loot} ${n.label}`);
        } else setLog(`Striking ${n.label} (${hit.node.hp}/${n.maxHp})`);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [nodes]);

  useEffect(() => {
    const t = setInterval(() => setNodes((ns) => ns.map((n) => harvestTick(n))), 15000);
    return () => clearInterval(t);
  }, []);

  const onPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool !== "shovel" && tool !== "rts") return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const nz = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    const x = nx * world.field.size * 0.38;
    const z = nz * world.field.size * 0.38;
    const y = sampleHeight(world.field, x, z);
    if (tool === "rts") {
      if (e.type === "mousemove") { setGhost({ id: "ghost", kind: build, x, y, z, rotY: 0 }); return; }
      if (e.type === "click") {
        setBuilds((b) => [...b, { id: `b-${b.length}`, kind: build, x, y, z, rotY: 0 }]);
        setLog(`Placed ${BUILD_CATALOG[build].label}`);
      }
    }
    if (tool === "shovel" && e.type === "click") {
      sculpt(world.field, x, z, shovel);
      setFieldVersion((v) => v + 1);
      setLog(`Shovel ${shovel} @ ${x.toFixed(1)}, ${z.toFixed(1)}`);
    }
  };

  const onUpload = async (file: File) => {
    const ok = assertLegalFoliagePath(file.name);
    const url = URL.createObjectURL(file);
    setUploads((u) => [...u, { name: file.name, url, ok }]);
    try {
      await fetch("/api/assets", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: file.name, size: file.size, type: file.type, banned: !ok }) });
    } catch { /* local catalog */ }
    setLog(ok ? `Queued ${file.name} for R2 / assets.grudge-studio.com` : `Rejected banned nature path ${file.name}`);
  };

  return (
    <div className="shell" onMouseMove={onPointer} onClick={onPointer}>
      {playing && (
        <PlayWorld world={world} fieldVersion={fieldVersion} nodes={nodes} builds={builds} ghost={ghost} highlightId={highlightId} tool={tool} input={input} />
      )}
      <Hud
        spec={world.spec} tool={tool} shovel={shovel} build={build} seedKey={seedKey} biome={biome} bag={bag}
        log={`${log}${uploads.length ? ` · uploads ${uploads.length}` : ""}`} playing={playing}
        onTool={setTool} onShovel={setShovel} onBuild={setBuild} onSeed={setSeedKey}
        onBiome={(b) => { setBiome(b); rebuild({ biome: b }); }}
        onSector={(id) => { const s = SECTOR_BY_ID[id]; setSectorId(id); setBiome(s.biome); rebuild({ sectorId: id, biome: s.biome }); }}
        onEnter={() => { setPlaying(true); rebuild(); }}
        onRebuild={() => rebuild()} onUpload={onUpload}
      />
    </div>
  );
}
