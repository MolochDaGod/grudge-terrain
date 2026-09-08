import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayWorld, type PlayTool } from "./play/PlayWorld";
import { Hud } from "./ui/Hud";
import { UnitFrames } from "./ui/UnitFrames";
import { buildIsland, type IslandWorld } from "./lib/world";
import { sculpt, sampleHeight } from "./lib/heightmap";
import { strikeNode, harvestTick, nearestLiveNode, type HarvestNode } from "./lib/nodes";
import type { BiomeId } from "./lib/biomes";
import { SECTOR_BY_ID } from "./lib/sectors";
import { BUILD_CATALOG, type BuildKind, type PlacedBuild } from "./play/RtsGhost";
import { assertLegalFoliagePath } from "./lib/foliage";
import { input0, type PlaySnapshot } from "./play/input";
import { resolveWarlordKit } from "./play/warlord";
import { WEAPON_SKILLS, type WeaponSkillId } from "./play/weaponSkill";

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
  const [bag, setBag] = useState<Record<string, number>>({});
  const [log, setLog] = useState("Enter the island. Harvest, shovel, or RTS-build.");
  const [playing, setPlaying] = useState(true);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Array<{ name: string; url: string; ok: boolean }>>([]);
  const [kitId] = useState(() => resolveWarlordKit());
  const [hudTick, setHudTick] = useState(0);
  const input = useRef(input0());
  const playerPos = useRef({ x: 0, y: 0, z: 8 });
  const snapshot = useRef<PlaySnapshot>({
    grounded: true,
    speed: 0,
    clip: "Idle",
    hp: 100,
    mana: 100,
    stamina: 100,
    skill: "",
    kit: "Warlord",
    target: null,
  });

  const rebuild = useCallback(
    (next?: { seedKey?: string; biome?: BiomeId; sectorId?: string | null }) => {
      const w = buildIsland({
        seedKey: next?.seedKey ?? seedKey,
        biome: next?.biome ?? biome,
        sectorId: next?.sectorId ?? sectorId,
      });
      setWorld(w);
      setNodes(w.nodes);
      setBuilds([]);
      setFieldVersion((v) => v + 1);
      setLog(`Seed ${w.spec.seedKey} · ${w.spec.biome} · ${w.spec.foundation}`);
      const q = new URLSearchParams({
        seed: w.spec.seedKey,
        biome: w.spec.biome,
        kit: kitId,
        ...(w.spec.sectorId ? { sector: w.spec.sectorId } : {}),
      });
      history.replaceState(null, "", `?${q.toString()}`);
    },
    [seedKey, biome, sectorId],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const down = e.type === "keydown";
      if (e.code === "KeyW") input.current.f = down;
      if (e.code === "KeyS") input.current.b = down;
      if (e.code === "KeyA") input.current.l = down;
      if (e.code === "KeyD") input.current.r = down;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") input.current.sprint = down;
      if (e.code === "Space") {
        input.current.jump = down;
        if (down) e.preventDefault();
      }
      if (e.code === "KeyQ") input.current.skillQ = down;
      if (tool === "explore" && e.code === "KeyE") input.current.skillE = down;
      if (down && e.code === "Digit1") setTool("explore");
      if (down && e.code === "Digit2") setTool("harvest");
      if (down && e.code === "Digit3") setTool("shovel");
      if (down && e.code === "Digit4") setTool("rts");
      if (down && e.code === "KeyE" && tool !== "explore") {
        const live = nodes.map((n) => harvestTick(n));
        const n = nearestLiveNode(live, playerPos.current);
        if (!n) {
          setLog("Nothing in harvest range (6.5 m). Walk to a tree, rock, flower, animal, or fish.");
          return;
        }
        const hit = strikeNode(n);
        setNodes(live.map((x) => (x.id === n.id ? hit.node : x)));
        setHighlightId(n.id);
        if (hit.loot.length) {
          setBag((b) => {
            const next = { ...b };
            for (const l of hit.loot) next[l.item] = (next[l.item] ?? 0) + l.qty;
            return next;
          });
          setLog(`Harvested ${n.label}: ${hit.loot.map((l) => `${l.qty} ${l.item}`).join(", ")}`);
        } else setLog(`${n.hostile ? "Fighting" : "Striking"} ${n.label} (${hit.node.hp}/${n.maxHp})`);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [nodes, tool]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        input.current.lock = true;
        input.current.lookDx += e.movementX;
        input.current.lookDy += e.movementY;
      } else {
        input.current.lock = false;
      }
    };
    const onDown = (e: MouseEvent) => {
      if (e.button === 0 && tool === "explore") input.current.attack = true;
      if (e.button === 2 && tool === "explore") input.current.heavy = true;
    };
    const onUp = (e: MouseEvent) => {
      if (e.button === 0) input.current.attack = false;
      if (e.button === 2) input.current.heavy = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [tool]);

  useEffect(() => {
    const t = setInterval(() => {
      snapshot.current.mana = Math.min(100, snapshot.current.mana + 2);
      snapshot.current.stamina = Math.min(
        100,
        snapshot.current.stamina + (snapshot.current.grounded ? 3 : 0.4),
      );
      const marked = highlightId ? nodes.find((n) => n.id === highlightId) : null;
      const near = nearestLiveNode(nodes.map((n) => harvestTick(n)), playerPos.current, 14);
      const tnode = marked && marked.hp > 0 ? marked : near;
      snapshot.current.target = tnode
        ? {
            id: tnode.id,
            name: tnode.label,
            kind: tnode.kind,
            hp: tnode.hp,
            maxHp: tnode.maxHp,
            hostile: tnode.hostile,
          }
        : null;
      setHudTick((n) => n + 1);
    }, 400);
    return () => clearInterval(t);
  }, [highlightId, nodes]);

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
      if (e.type === "mousemove") {
        setGhost({ id: "ghost", kind: build, x, y, z, rotY: 0 });
        return;
      }
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
      await fetch("/api/assets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, type: file.type, banned: !ok }),
      });
    } catch {
      /* local catalog still records */
    }
    setLog(ok ? `Queued ${file.name} for R2 / assets.grudge-studio.com` : `Rejected banned nature path ${file.name}`);
  };

  return (
    <div className="shell" onMouseMove={onPointer} onClick={onPointer}>
      {playing && (
        <PlayWorld
          world={world}
          fieldVersion={fieldVersion}
          nodes={nodes}
          builds={builds}
          ghost={ghost}
          highlightId={highlightId}
          tool={tool}
          input={input}
          pos={playerPos}
          kitId={kitId}
          snapshot={snapshot}
        />
      )}
      {playing && (
        <UnitFrames
          key={hudTick}
          snap={{ ...snapshot.current }}
          onSlot={(skill) => {
            if (skill === "Harvest") {
              setTool("harvest");
              return;
            }
            snapshot.current.skill = WEAPON_SKILLS[skill as WeaponSkillId]?.label ?? skill;
            if (skill === "AttackLight01") input.current.attack = true;
            if (skill === "AttackHeavy01") input.current.heavy = true;
            if (skill === "SkillQ") input.current.skillQ = true;
            if (skill === "SkillE") input.current.skillE = true;
            setTimeout(() => {
              input.current.attack = false;
              input.current.heavy = false;
              input.current.skillQ = false;
              input.current.skillE = false;
            }, 80);
          }}
        />
      )}
      <Hud
        spec={world.spec}
        tool={tool}
        shovel={shovel}
        build={build}
        seedKey={seedKey}
        biome={biome}
        bag={bag}
        log={`${log}${uploads.length ? ` · uploads ${uploads.length}` : ""}`}
        playing={playing}
        onTool={setTool}
        onShovel={setShovel}
        onBuild={setBuild}
        onSeed={setSeedKey}
        onBiome={(b) => {
          setBiome(b);
          rebuild({ biome: b });
        }}
        onSector={(id) => {
          const s = SECTOR_BY_ID[id];
          setSectorId(id);
          setBiome(s.biome);
          rebuild({ sectorId: id, biome: s.biome });
        }}
        onEnter={() => {
          setPlaying(true);
          rebuild();
        }}
        onRebuild={() => rebuild()}
        onUpload={onUpload}
      />
    </div>
  );
}
