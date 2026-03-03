import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { STAR_TARGET } from "@/lib/constants";
import styles from "./GameUI.module.css";

type Props = {
  state: "playing" | "won" | "lost";
};

export function GameUI({ state }: Props) {
  const { starsCollected, setInputDirection, reset } = useGameStore();

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

  return (
    <div className={styles.hud}>
      <div className={styles.counter}>⭐ {starsCollected} / {STAR_TARGET}</div>
      {state !== "playing" && (
        <div className={styles.banner}>
          <h2>{state === "won" ? "LEVEL COMPLETE" : "GAME OVER"}</h2>
          {state === "lost" && <p>You lost all collected stars.</p>}
          <button type="button" onClick={reset}>Restart</button>
        </div>
      )}
    </div>
  );
}
