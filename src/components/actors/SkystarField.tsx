import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { Group } from "three";
import { useGameStore } from "@/store/gameStore";
import { STAR_FALL_BASE_SPEED, STAR_SPAWN_INTERVAL, LEVEL_WIDTH } from "@/lib/constants";
import { Star } from "@/lib/types";

let starId = 0;

export function SkystarField() {
  const { crabX, collectStar, gameState, sessionId } = useGameStore();
  const groupRef = useRef<Group>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (gameState === "playing") {
      setStars([]);
      setTimer(0);
    }
  }, [gameState, sessionId]);

  useFrame((_, delta) => {
    if (gameState !== "playing") return;
    setTimer((prev) => prev + delta * 1000);

    if (timer >= STAR_SPAWN_INTERVAL && stars.length < 3) {
      const newStar: Star = {
        id: starId++,
        x: (Math.random() - 0.5) * (LEVEL_WIDTH - 2),
        y: 6,
        speed: STAR_FALL_BASE_SPEED + Math.random() * 0.2,
      };
      setStars((prev) => [...prev, newStar]);
      setTimer(0);
    }

    setStars((prev) => {
      const updated = prev
        .map((star) => ({ ...star, y: star.y - star.speed * delta }))
        .filter((star) => star.y > -2.5);

      const crabRadius = 0.6;
      const starRadius = 0.3;

      updated.forEach((star, idx) => {
        const dx = Math.abs(star.x - crabX);
        const distance = Math.sqrt(dx * dx + Math.pow(star.y + 2.5, 2));
        if (distance < crabRadius + starRadius) {
          collectStar();
          updated.splice(idx, 1);
        }
      });

      return updated;
    });
  });

  return (
    <group ref={groupRef}>
      {stars.map((star) => (
        <mesh key={star.id} position={[star.x, star.y, -1]}>
          <icosahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color="#ffd966" emissive="#ffeb84" emissiveIntensity={0.7} />
        </mesh>
      ))}
    </group>
  );
}
