import { GameState, InputAction } from "./types";

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

export const CACTUS_TYPES = {
    short: {
        single: {
            width: 30,
            height: 66,
            url: "dinosaur/short_cactus.png",
        },
        small_group: {
            width: 64,
            height: 66,
            url: "dinosaur/small_short_cactus_group.png",
        },
        large_group: {
            width: 98,
            height: 66,
            url: "dinosaur/large_short_cactus_group.png",
        },
    },
    tall: {
        single: {
            width: 46,
            height: 96,
            url: "dinosaur/tall_cactus.png",
        },
        small_group: {
            width: 96,
            height: 96,
            url: "dinosaur/small_tall_cactus_group.png",
        },
        large_group: {
            width: 146,
            height: 96,
            url: "dinosaur/large_tall_cactus_group.png",
        },
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
} as const;

export const INITIAL_INPUT_ACTIONS: InputAction = {
    down: false,
    up: false,
    left: false,
    right: false,
} as const;

export const GRAVITY = 3000;
export const FAST_FALL_MULTIPLIER = 5;
