"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { STAR_TARGET } from "@/lib/constants";
import styles from "./GameUI.module.css";

export function GameUI() {
  const starsCollected = useGameStore((state) => state.starsCollected);
  const lives = useGameStore((state) => state.lives);
  const gameState = useGameStore((state) => state.gameState);
  const reset = useGameStore((state) => state.reset);
  const setInputDirection = useGameStore((state) => state.setInputDirection);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        setInputDirection(-1);
      } else if (event.key === "ArrowRight" || event.key === "d") {
        setInputDirection(1);
      } else if (event.key === "r") {
        reset();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (["ArrowLeft", "a", "ArrowRight", "d"].includes(event.key)) {
        setInputDirection(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [reset, setInputDirection]);

  const showBanner = gameState === "won" || (gameState === "lost" && lives === 0);

  return (
    <div className={styles.hud} style={{ pointerEvents: showBanner ? "auto" : "none" }}>
      <div className={styles.topRow}>
        <div className={styles.counter}>⭐ {starsCollected} / {STAR_TARGET}</div>
        <div className={styles.lives}>
          {Array.from({ length: lives }).map((_, idx) => (
            <span key={idx}>🦀</span>
          ))}
        </div>
      </div>
      {showBanner && (
        <div className={styles.banner}>
          <h2>{gameState === "won" ? "LEVEL COMPLETE" : "GAME OVER"}</h2>
          {gameState === "lost" && <p>You lost all collected stars.</p>}
          <button type="button" onClick={reset}>Restart</button>
        </div>
      )}
    </div>
  );
}
