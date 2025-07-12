import { GameState, Vector2D } from "./types";

export const FLOOR = { heigth: 24 };

export const DINOSAUR_SIZE = {
    run: {
        width: 80,
        height: 86,
    },
    duck: {
        width: 110,
        height: 52,
    },
};

export const INITIAL_GAME_STATE: GameState = {
    dinosaur: {
        pos: { x: 0, y: -FLOOR.heigth },
        vel: { x: 0, y: 0 },
        isJumping: false,
        isDucking: false,
        isFastFalling: false,
        jumpStrength: 1200,
        moveSpeed: 750,
        moveDirection: "IDLE",
    },
    worldSpeed: 50,
};

export const GRAVITY = 3000;
export const FAST_FALL_MULTIPLIER = 5;
