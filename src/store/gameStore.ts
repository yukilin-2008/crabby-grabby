import { create } from "zustand";
import { GameState } from "@/lib/types";
import { STAR_TARGET, MAX_LIVES } from "@/lib/constants";

type Direction = -1 | 0 | 1;

type GameStore = {
  crabX: number;
  inputDirection: Direction;
  starsCollected: number;
  lives: number;
  gameState: GameState;
  sessionId: number;
  setInputDirection: (dir: Direction) => void;
  setCrabPosition: (x: number) => void;
  collectStar: () => void;
  triggerGameOver: () => void;
  registerHit: () => boolean;
  setGameState: (state: GameState) => void;
  reset: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  crabX: 0,
  inputDirection: 0,
  starsCollected: 0,
  lives: MAX_LIVES,
  gameState: "playing",
  sessionId: 0,
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
  triggerGameOver: () => set({ gameState: "lost", starsCollected: 0, lives: 0 }),
  registerHit: () => {
    let didLose = false;
    set((state) => {
      if (state.gameState !== "playing") return state;
      const remaining = state.lives - 1;
      didLose = remaining <= 0;
      return {
        ...state,
        lives: Math.max(0, remaining),
        starsCollected: 0,
        gameState: didLose ? "lost" : state.gameState,
      };
    });
    return didLose;
  },
  setGameState: (gameState) => set({ gameState }),
  reset: () =>
    set((state) => ({
      crabX: 0,
      inputDirection: 0,
      starsCollected: 0,
      lives: MAX_LIVES,
      gameState: "playing",
      sessionId: state.sessionId + 1,
    })),
}));
