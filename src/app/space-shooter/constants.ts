import { GameState, ShooterInputAction } from "./types";

export const ASSETS_PATH = "space-shooter/";
export const SHOT_COOLDOWN = 0.5;

export const CONSTANT_SIZES = {
    player: {
        width: 105,
        height: 70.5,
    },
    shot: {
        width: 96,
        height: 36,
    },
};

export const INITIAL_GAME_STATE: GameState = {
    player: {
        pos: { x: 0, y: 0 },
        moveSpeed: 600,
        moveDirection: {
            vertical: "IDLE",
            horizontal: "IDLE",
        },
        currentShotCooldown: 0,
    },
    shots: [],
} as const;

export const INITIAL_INPUT_ACTIONS: ShooterInputAction = {
    down: false,
    up: false,
    left: false,
    right: false,
    shoot: false,
} as const;

export const ALL_SPRITES = {
    background: `${ASSETS_PATH}background.png`,
    player: `${ASSETS_PATH}player.png`,
    shot: `${ASSETS_PATH}shot.png`,
};
