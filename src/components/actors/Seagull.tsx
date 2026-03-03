import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";
import { useGameStore } from "@/store/gameStore";
import { LEVEL_WIDTH, SEAGULL_FIRST_DELAY, SEAGULL_SWEEP_INTERVAL } from "@/lib/constants";

export function Seagull() {
  const meshRef = useRef<Mesh>(null);
  const { crabX, setGameState, gameState } = useGameStore();
  const [mode, setMode] = useState<"patrol" | "swoop">("patrol");
  const [timer, setTimer] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [cooldown, setCooldown] = useState(SEAGULL_FIRST_DELAY);

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
    } else {
      mesh.position.y -= delta * 4;
      mesh.position.x += (targetX - mesh.position.x) * delta * 2;
      if (mesh.position.y <= -1.5) {
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
      setGameState("lost");
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 2.5, 0]}>
      <coneGeometry args={[0.6, 1, 16]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}
