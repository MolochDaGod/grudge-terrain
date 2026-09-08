import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { WORLD } from "../lib/canon";

const SPEED = 14;
const SPRINT = 22;

export function Player({
  spawn = [0, 8, 0] as [number, number, number],
  input,
}: {
  spawn?: [number, number, number];
  input: React.MutableRefObject<{ f: boolean; b: boolean; l: boolean; r: boolean; sprint: boolean }>;
}) {
  const body = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Group>(null);
  const yaw = useRef(0);

  useFrame((state, dt) => {
    const rb = body.current;
    if (!rb) return;
    const i = input.current;
    const dir = new THREE.Vector3();
    if (i.f) dir.z -= 1;
    if (i.b) dir.z += 1;
    if (i.l) dir.x -= 1;
    if (i.r) dir.x += 1;
    const cam = state.camera;
    const forward = new THREE.Vector3();
    cam.getWorldDirection(forward);
    forward.y = 0; forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const move = new THREE.Vector3();
    move.addScaledVector(forward, -dir.z);
    move.addScaledVector(right, dir.x);
    if (move.lengthSq() > 0) {
      move.normalize();
      yaw.current = Math.atan2(move.x, move.z);
    }
    const speed = i.sprint ? SPRINT : SPEED;
    const lv = rb.linvel();
    rb.setLinvel({ x: move.x * speed, y: lv.y, z: move.z * speed }, true);
    const t = rb.translation();
    if (mesh.current) {
      mesh.current.position.set(t.x, t.y - 0.15, t.z);
      mesh.current.rotation.y = yaw.current;
    }
    cam.position.lerp(new THREE.Vector3(t.x - forward.x * 10, t.y + 6.5, t.z - forward.z * 10), Math.min(1, dt * 4));
    cam.lookAt(t.x, t.y + 1.4, t.z);
  });

  const h = WORLD.characterM;
  return (
    <>
      <RigidBody ref={body} position={spawn} colliders={false} mass={8} lockRotations friction={0.8} linearDamping={0.4}>
        <CapsuleCollider args={[h * 0.28, 0.42]} position={[0, h * 0.28 + 0.42, 0]} />
      </RigidBody>
      <group ref={mesh}>
        <mesh castShadow position={[0, 1.1, 0]}>
          <capsuleGeometry args={[0.42, 0.9, 6, 12]} />
          <meshStandardMaterial color="#c45a3a" roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 1.95, 0.12]}>
          <sphereGeometry args={[0.28, 12, 12]} />
          <meshStandardMaterial color="#e8c8a8" />
        </mesh>
      </group>
    </>
  );
}
