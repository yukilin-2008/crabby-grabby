"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars as DreiStars } from "@react-three/drei";
import { useMemo } from "react";
import { GameUI } from "@/components/GameUI";
import { Crab } from "@/components/actors/Crab";
import { SkystarField } from "@/components/actors/SkystarField";
import { Seagull } from "@/components/actors/Seagull";
import { OceanPlane } from "@/components/environment/OceanPlane";
import { SkyBackdrop } from "@/components/environment/SkyBackdrop";
import { useGameStore } from "@/store/gameStore";
import styles from "./page.module.css";

export default function Home() {
  const { gameState } = useGameStore();

  const cameraPosition = useMemo(() => [0, 3, 14] as [number, number, number], []);

  return (
    <div className={styles.wrapper}>
      <Canvas camera={{ position: cameraPosition, fov: 55 }} shadows>
        <color attach="background" args={["#78c1ff"]} />
        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[10, 15, 5]}
          intensity={1.4}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <SkyBackdrop />
        <DreiStars depth={30} count={2000} factor={4} fade speed={2} />
        <OceanPlane />
        <SkystarField />
        <Crab />
        <Seagull />

        {process.env.NODE_ENV === "development" && <OrbitControls enableZoom={false} />}
      </Canvas>

      <GameUI state={gameState} />
    </div>
  );
}
