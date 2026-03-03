import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { useGameStore } from "@/store/gameStore";
import { CRAB_MOVE_SPEED, LEVEL_WIDTH } from "@/lib/constants";

export function Crab() {
  const meshRef = useRef<Mesh>(null);
  const { crabX, setCrabPosition, gameState } = useGameStore();

  useFrame((_, delta) => {
    if (gameState !== "playing") return;

    const max = LEVEL_WIDTH / 2 - 1;
    if (meshRef.current) {
      meshRef.current.position.x = crabX;
    }

    const move = useGameStore.getState().inputDirection;
    if (move !== 0) {
      const next = Math.min(max, Math.max(-max, crabX + move * CRAB_MOVE_SPEED * delta));
      setCrabPosition(next);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2.5, 0]} castShadow>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#ff5d5d" metalness={0.2} roughness={0.4} />
      {/* Claws */}
      <mesh position={[-0.5, 0, 0.4]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#ff8989" />
      </mesh>
      <mesh position={[0.5, 0, 0.4]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#ff8989" />
      </mesh>
    </mesh>
  );
}
