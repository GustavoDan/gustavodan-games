export type SimonColor = "green" | "red" | "yellow" | "blue";

export type GamePhase =
    | "IDLE"
    | "SHOWING_SEQUENCE"
    | "PAUSE_AFTER_SHOW"
    | "WAITING_INPUT"
    | "PLAYER_FLASH"
    | "GAME_OVER";

export interface GameState {
    sequence: SimonColor[];
    playerIndex: number;
    phase: GamePhase;
    showingIndex: number;
    showTimer: number;
    activeColor: SimonColor | null;
    highScore: number;
    speedMultiplier: number;
    flashTimer: number;
    flashColor: SimonColor | null;
}

export interface InputActions {
    pressedColor: SimonColor | null;
}
