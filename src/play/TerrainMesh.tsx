import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import type { HeightField } from "../lib/heightmap";
import { WORLD } from "../lib/canon";
import { BIOMES, type BiomeId } from "../lib/biomes";

export function TerrainMesh({
  field, biome, version,
}: {
  field: HeightField;
  biome: BiomeId;
  version: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(field.size, field.size, field.resolution, field.resolution);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const n = field.resolution + 1;
    for (let i = 0; i < pos.count; i++) {
      const col = i % n;
      const row = Math.floor(i / n);
      pos.setY(i, field.heights[row * n + col]);
    }
    g.setAttribute("color", new THREE.BufferAttribute(field.colors.slice(), 3));
    g.computeVertexNormals();
    return g;
  }, [field, version]);

  useEffect(() => () => geo.dispose(), [geo]);
  const water = BIOMES[biome].water;
  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh" friction={1.1}>
        <mesh ref={meshRef} geometry={geo} receiveShadow castShadow>
          <meshStandardMaterial vertexColors roughness={0.92} metalness={0.02} />
        </mesh>
      </RigidBody>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WORLD.waterY, 0]} receiveShadow>
        <planeGeometry args={[field.size * 1.6, field.size * 1.6]} />
        <meshStandardMaterial color={new THREE.Color(water[0], water[1], water[2])} transparent opacity={0.72} roughness={0.12} metalness={0.35} />
      </mesh>
    </group>
  );
}
