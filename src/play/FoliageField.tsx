import { useMemo } from "react";
import type { ScatterInstance } from "../lib/foliage";
import { FOLIAGE_CATALOG } from "../lib/foliage";
import * as THREE from "three";

export function FoliageField({ instances }: { instances: ScatterInstance[] }) {
  const byDef = useMemo(() => {
    const m = new Map<string, ScatterInstance[]>();
    for (const i of instances) {
      const list = m.get(i.defId) ?? [];
      list.push(i);
      m.set(i.defId, list);
    }
    return m;
  }, [instances]);

  return (
    <group>
      {[...byDef.entries()].map(([id, list]) => {
        const def = FOLIAGE_CATALOG.find((d) => d.id === id);
        if (!def) return null;
        const color = new THREE.Color(...def.instancedColor);
        return (
          <group key={id}>
            {list.map((p, idx) =>
              def.kind === "rock" ? (
                <mesh key={idx} position={[p.x, p.y + 0.25 * p.scale, p.z]} rotation={[0, p.rotY, 0]} castShadow>
                  <dodecahedronGeometry args={[0.45 * p.scale, 0]} />
                  <meshStandardMaterial color={color} roughness={0.95} />
                </mesh>
              ) : (
                <group key={idx} position={[p.x, p.y, p.z]} rotation={[0, p.rotY, 0]}>
                  <mesh position={[0, p.scale * 0.7, 0]} castShadow>
                    <cylinderGeometry args={[0.12 * p.scale, 0.2 * p.scale, p.scale * 1.4, 6]} />
                    <meshStandardMaterial color="#4a3020" />
                  </mesh>
                  <mesh position={[0, p.scale * 1.55, 0]} castShadow>
                    <coneGeometry args={[0.7 * p.scale, p.scale * 1.6, 7]} />
                    <meshStandardMaterial color={color} />
                  </mesh>
                </group>
              ),
            )}
          </group>
        );
      })}
    </group>
  );
}
