import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Sky, PointerLockControls, Environment } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { TerrainMesh } from "./TerrainMesh";
import { Player } from "./Player";
import { HarvestField } from "./HarvestField";
import { FoliageField } from "./FoliageField";
import { RtsGhost, type PlacedBuild } from "./RtsGhost";
import type { IslandWorld } from "../lib/world";
import { BIOMES } from "../lib/biomes";
import type { HarvestNode } from "../lib/nodes";

export type PlayTool = "explore" | "harvest" | "shovel" | "rts";

export function PlayWorld({
  world, fieldVersion, nodes, builds, ghost, highlightId, tool, input,
}: {
  world: IslandWorld;
  fieldVersion: number;
  nodes: HarvestNode[];
  builds: PlacedBuild[];
  ghost: PlacedBuild | null;
  highlightId: string | null;
  tool: PlayTool;
  input: React.MutableRefObject<{ f: boolean; b: boolean; l: boolean; r: boolean; sprint: boolean }>;
}) {
  const biome = BIOMES[world.spec.biome];
  const fog = useMemo(() => biome.fog, [biome]);
  return (
    <Canvas
      shadows
      camera={{ position: [28, 22, 28], fov: 55, near: 0.2, far: 1200 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerDown={(e) => {
        if (tool === "explore" && e.button === 2) (e.target as HTMLElement).requestPointerLock?.();
      }}
    >
      <color attach="background" args={[biome.sky]} />
      <fog attach="fog" args={[fog, 80, 320]} />
      <ambientLight intensity={0.42} />
      <directionalLight castShadow position={[48, 72, 22]} intensity={1.35} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-far={220} shadow-camera-left={-90} shadow-camera-right={90} shadow-camera-top={90} shadow-camera-bottom={-90} />
      <Sky sunPosition={[40, 28, 12]} turbidity={6} rayleigh={1.4} />
      <Environment preset="forest" />
      <Suspense fallback={null}>
        <Physics gravity={[0, -22, 0]} interpolate>
          <TerrainMesh field={world.field} biome={world.spec.biome} version={fieldVersion} />
          <Player input={input} spawn={[0, world.spec.characterM + 6, 8]} />
        </Physics>
        <FoliageField instances={world.foliage} />
        <HarvestField nodes={nodes} highlightId={highlightId} />
        <RtsGhost builds={builds} ghost={ghost} />
      </Suspense>
      {tool === "explore" && <PointerLockControls />}
    </Canvas>
  );
}
