export type BuildKind = "hall" | "tower" | "wall" | "camp";

export const BUILD_CATALOG: Record<BuildKind, { label: string; color: string; size: [number, number, number] }> = {
  hall: { label: "War Hall", color: "#8b5a2b", size: [6, 3.2, 6] },
  tower: { label: "Watch Tower", color: "#6a6e74", size: [2.2, 6, 2.2] },
  wall: { label: "Palisade", color: "#5a3a22", size: [6, 2.2, 0.7] },
  camp: { label: "Harvest Camp", color: "#3d6b3a", size: [3.4, 2, 3.4] },
};

export interface PlacedBuild {
  id: string;
  kind: BuildKind;
  x: number;
  y: number;
  z: number;
  rotY: number;
}

export function RtsGhost({
  builds,
  ghost,
}: {
  builds: PlacedBuild[];
  ghost: PlacedBuild | null;
}) {
  return (
    <group>
      {builds.map((b) => {
        const c = BUILD_CATALOG[b.kind];
        return (
          <mesh key={b.id} position={[b.x, b.y + c.size[1] / 2, b.z]} rotation={[0, b.rotY, 0]} castShadow>
            <boxGeometry args={c.size} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
        );
      })}
      {ghost && (
        <mesh position={[ghost.x, ghost.y + BUILD_CATALOG[ghost.kind].size[1] / 2, ghost.z]} rotation={[0, ghost.rotY, 0]}>
          <boxGeometry args={BUILD_CATALOG[ghost.kind].size} />
          <meshStandardMaterial color="#7ec8ff" transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  );
}
