import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useGameStore } from "@/store/gameStore";
import { LEVEL_WIDTH, SEAGULL_FIRST_DELAY, SEAGULL_SWEEP_INTERVAL } from "@/lib/constants";

export function Seagull() {
  const meshRef = useRef<Group>(null);
  const { crabX, registerHit, gameState } = useGameStore();
  const [mode, setMode] = useState<"patrol" | "swoop" | "climb">("patrol");
  const [timer, setTimer] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [cooldown, setCooldown] = useState(SEAGULL_FIRST_DELAY);

  useEffect(() => {
    if (gameState === "playing") {
      requestAnimationFrame(() => {
        setMode("patrol");
        setTimer(0);
        setCooldown(SEAGULL_FIRST_DELAY);
        setTargetX(0);
        if (meshRef.current) {
          meshRef.current.position.set(0, 2.5, 0);
        }
      });
    }
  }, [gameState]);

  useFrame((_, delta) => {
    if (gameState !== "playing") return;
    setTimer((prev) => prev + delta * 1000);

    if (mode === "patrol" && timer >= cooldown) {
      setMode("swoop");
      setTimer(0);
      setTargetX(crabX);
    }

    const mesh = meshRef.current;
    if (!mesh) return;

    if (mode === "patrol") {
      mesh.position.y = 2.5;
      mesh.position.x = Math.sin(Date.now() * 0.0005) * (LEVEL_WIDTH / 2 - 1);
    } else if (mode === "swoop") {
      mesh.position.y -= delta * 4;
      mesh.position.x += (targetX - mesh.position.x) * delta * 2;
    } else if (mode === "climb") {
      mesh.position.y += delta * 3;
      mesh.position.x += (0 - mesh.position.x) * delta;
      if (mesh.position.y >= 2.5) {
        mesh.position.y = 2.5;
        setMode("patrol");
        setCooldown(
          SEAGULL_SWEEP_INTERVAL[0] + Math.random() * (SEAGULL_SWEEP_INTERVAL[1] - SEAGULL_SWEEP_INTERVAL[0])
        );
      }
    }

    const crabY = -2.5;
    const distance = Math.hypot(mesh.position.x - crabX, mesh.position.y - crabY);
    if (distance < 0.8) {
      const lostAll = registerHit();
      if (lostAll) {
        return;
      }
      mesh.position.set(0, 2.5, 0);
      setMode("patrol");
      setTimer(0);
      setCooldown(
        SEAGULL_SWEEP_INTERVAL[0] + Math.random() * (SEAGULL_SWEEP_INTERVAL[1] - SEAGULL_SWEEP_INTERVAL[0])
      );
      return;
    }

    if (mode === "swoop" && mesh.position.y <= -2.4) {
      setMode("climb");
    }
  });

  return (
    <group ref={meshRef} position={[0, 2.5, 0]}>
      {/* Body */}
      <mesh scale={[1, 0.65, 0.8]} castShadow receiveShadow>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#f5f1e3" flatShading metalness={0.05} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0.55, 0.2, 0]} scale={[0.75, 0.75, 0.75]} castShadow>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#fff7dc" flatShading metalness={0.05} roughness={0.7} />
      </mesh>

      {/* Beak */}
      <mesh position={[0.95, 0.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.12, 0.42, 6]} />
        <meshStandardMaterial color="#f6a01a" flatShading roughness={0.6} />
      </mesh>

      {/* Wings */}
      <mesh position={[-0.1, 0.05, 0]} rotation={[0, 0, 0.4]} scale={[1.3, 0.12, 0.6]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#dfe7ff" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, 0.05, 0]} rotation={[0, 0, -0.4]} scale={[1.3, 0.12, 0.6]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d5e1ff" flatShading roughness={0.9} />
      </mesh>

      {/* Tail */}
      <mesh position={[-0.65, -0.05, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.7, 0.7, 0.7]}>
        <coneGeometry args={[0.15, 0.5, 5]} />
        <meshStandardMaterial color="#b5c8ff" flatShading />
      </mesh>

      {/* Legs */}
      <mesh position={[0.25, -0.55, 0.12]} rotation={[0, 0, 0.05]} scale={[1, 0.9, 1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
        <meshStandardMaterial color="#f6a01a" flatShading />
      </mesh>
      <mesh position={[0.25, -0.55, -0.12]} rotation={[0, 0, -0.05]} scale={[1, 0.9, 1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
        <meshStandardMaterial color="#f6a01a" flatShading />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.62, 0.25, 0.17]} scale={[0.08, 0.08, 0.08]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#1c1b29" />
      </mesh>
      <mesh position={[0.62, 0.25, -0.17]} scale={[0.08, 0.08, 0.08]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#1c1b29" />
      </mesh>
    </group>
  );
}
