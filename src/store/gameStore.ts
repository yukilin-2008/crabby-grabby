import { create } from "zustand";
import { GameState } from "@/lib/types";
import { STAR_TARGET } from "@/lib/constants";

type Direction = -1 | 0 | 1;

type GameStore = {
  crabX: number;
  inputDirection: Direction;
  starsCollected: number;
  lives: number;
  gameState: GameState;
  setInputDirection: (dir: Direction) => void;
  setCrabPosition: (x: number) => void;
  collectStar: () => void;
  triggerGameOver: () => void;
  setGameState: (state: GameState) => void;
  reset: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  crabX: 0,
  inputDirection: 0,
  starsCollected: 0,
  lives: 3,
  gameState: "playing",
  setInputDirection: (dir) => set({ inputDirection: dir }),
  setCrabPosition: (x) => set({ crabX: x }),
  collectStar: () =>
    set((state) => {
      if (state.gameState !== "playing") return state;
      const total = state.starsCollected + 1;
      return {
        ...state,
        starsCollected: total,
        gameState: total >= STAR_TARGET ? "won" : "playing",
      };
    }),
  triggerGameOver: () => set({ gameState: "lost", starsCollected: 0 }),
  setGameState: (gameState) => set({ gameState }),
  reset: () =>
    set({ crabX: 0, inputDirection: 0, starsCollected: 0, lives: 3, gameState: "playing" }),
}));
