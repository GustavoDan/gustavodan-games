import { GameState, SimonColor } from "./types";

export const LOCALSTORAGE_HS_VAR = "simon_hs";

export const SIMON_COLORS: SimonColor[] = ["green", "red", "yellow", "blue"];

// Timing settings (in seconds)
export const TIMING = {
    SHOW_COLOR_DURATION: 0.5, // Duration that the color stays lit
    PAUSE_BETWEEN_COLORS: 0.2, // Pause between colors in the sequence
    PAUSE_BEFORE_INPUT: 0.5, // Pause after showing sequence before accepting input
    PAUSE_BEFORE_NEXT_LEVEL: 0.5, // Pause after player completes sequence before showing next level
    FLASH_DURATION: 0.3, // Flash duration when player clicks
    SPEED_INCREASE_PER_LEVEL: 0.05, // Speed multiplier increment per level
    MIN_SHOW_DURATION: 0.15, // Minimum display duration
};

export const COLOR_CONFIG: Record<
    SimonColor,
    { base: string; active: string; glow: string }
> = {
    green: {
        base: "bg-emerald-700",
        active: "bg-emerald-400",
        glow: "shadow-[0_0_40px_10px_rgba(52,211,153,0.8),inset_0_0_30px_rgba(255,255,255,0.4)]",
    },
    red: {
        base: "bg-red-700",
        active: "bg-red-400",
        glow: "shadow-[0_0_40px_10px_rgba(248,113,113,0.8),inset_0_0_30px_rgba(255,255,255,0.4)]",
    },
    yellow: {
        base: "bg-yellow-600",
        active: "bg-yellow-300",
        glow: "shadow-[0_0_40px_10px_rgba(253,224,71,0.8),inset_0_0_30px_rgba(255,255,255,0.4)]",
    },
    blue: {
        base: "bg-blue-700",
        active: "bg-blue-400",
        glow: "shadow-[0_0_40px_10px_rgba(96,165,250,0.8),inset_0_0_30px_rgba(255,255,255,0.4)]",
    },
};

export const INITIAL_GAME_STATE: GameState = {
    sequence: [],
    playerIndex: 0,
    phase: "IDLE",
    showingIndex: 0,
    showTimer: 0,
    activeColor: null,
    highScore: 0,
    speedMultiplier: 1,
    flashTimer: 0,
    flashColor: null,
};
