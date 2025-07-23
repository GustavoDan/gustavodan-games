import { GameState, ShooterInputAction } from "./types";

export const ASSETS_PATH = "space-shooter/";
const PLAYER_SCALE = 0.75;

export const PLAYER_SIZE = {
    width: 140 * PLAYER_SCALE,
    height: 94 * PLAYER_SCALE,
};

export const INITIAL_GAME_STATE: GameState = {
    player: {
        pos: { x: 0, y: 0 },
        moveSpeed: 600,
        moveDirection: {
            vertical: "IDLE",
            horizontal: "IDLE",
        },
    },
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
};
