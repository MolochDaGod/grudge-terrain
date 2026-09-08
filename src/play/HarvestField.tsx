import { useMemo } from "react";
import type { HarvestNode } from "../lib/nodes";
import * as THREE from "three";

export function HarvestField({ nodes, highlightId }: { nodes: HarvestNode[]; highlightId: string | null }) {
  const groups = useMemo(() => {
    const by = new Map<string, HarvestNode[]>();
    for (const n of nodes) {
      const list = by.get(n.kind) ?? [];
      list.push(n);
      by.set(n.kind, list);
    }
    return by;
  }, [nodes]);

  return (
    <group>
      {[...groups.entries()].map(([kind, list]) => (
        <group key={kind}>
          {list.map((n) => {
            const dead = n.hp <= 0;
            const hot = n.id === highlightId;
            return (
              <mesh key={n.id} position={[n.x, n.y + 0.2, n.z]} castShadow>
                {kind === "wood" ? (
                  <cylinderGeometry args={[0.18, 0.28, 2.2, 7]} />
                ) : kind === "fishing" ? (
                  <torusGeometry args={[0.7, 0.08, 8, 16]} />
                ) : kind === "animal" ? (
                  <capsuleGeometry args={[0.28, 0.5, 4, 8]} />
                ) : kind === "monster" ? (
                  <dodecahedronGeometry args={[0.7, 0]} />
                ) : (
                  <icosahedronGeometry args={[0.45, 0]} />
                )}
                <meshStandardMaterial
                  color={dead ? "#2a2a2a" : n.color}
                  emissive={hot ? new THREE.Color(n.color) : new THREE.Color("#000")}
                  emissiveIntensity={hot ? 0.55 : 0}
                  roughness={0.7}
                  transparent={dead}
                  opacity={dead ? 0.35 : 1}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}
