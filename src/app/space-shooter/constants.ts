import { GameState, ShooterInputAction } from "./types";

export const ASSETS_PATH = "space-shooter/";
export const SHOT_COOLDOWN = 0.5;

export const ENEMY_SPAWN_TIME_RANGE = {
    min: 0.5,
    max: 2.5,
};

export const CONSTANT_SIZES = {
    player: {
        width: 105,
        height: 70.5,
    },
    shot: {
        width: 96,
        height: 36,
    },
    enemies: {
        extraSmall: {
            width: 59,
            height: 29,
        },
        small: {
            width: 77,
            height: 34,
        },
        medium: {
            width: 86,
            height: 39,
        },
        large: {
            width: 96,
            height: 46,
        },
        extraLarge: {
            width: 105,
            height: 61,
        },
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
    enemies: [],
    enemySpawnTimer: 0,
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
    enemies: {
        extraSmall: `${ASSETS_PATH}extraSmallEnemy.png`,
        small: `${ASSETS_PATH}smallEnemy.png`,
        medium: `${ASSETS_PATH}mediumEnemy.png`,
        large: `${ASSETS_PATH}largeEnemy.png`,
        extraLarge: `${ASSETS_PATH}extraLargeEnemy.png`,
    },
};
