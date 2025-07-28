import { GameState, ShooterInputAction } from "./types";

export const ASSETS_PATH = "space-shooter/";
export const SHOT_COOLDOWN = 0.5;
export const INVULNERABILITY_DURATION = 1.5;
export const MAX_PLAYER_LIFE = 3;

export const ENEMY_SPAWN_TIME_RANGE = {
    min: 0.5,
    max: 2.5,
};

export const EMPTY_MARKED_FOR_DELETION = {
    shots: new Set<string>(),
    enemies: new Set<string>(),
} as const;

export const CONSTANT_SIZES = {
    player: {
        width: 105,
        height: 70.5,
        spriteScale: 0.75,
    },
    shot: {
        width: 96,
        height: 36,
        spriteScale: { x: 2, y: 3 },
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
    heartContainer: {
        width: 40,
        height: 40,
    },
};

export const INITIAL_GAME_STATE: GameState = {
    player: {
        life: MAX_PLAYER_LIFE,
        pos: { x: 0, y: 0 },
        moveSpeed: 600,
        moveDirection: {
            vertical: "IDLE",
            horizontal: "IDLE",
        },
        currentShotCooldown: 0,
        invulnerabilityTimer: 0,
    },
    shots: [],
    enemies: [],
    enemySpawnTimer: 0,
    markedForDeletion: EMPTY_MARKED_FOR_DELETION,
    score: 0,
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
    extraSmallEnemy: `${ASSETS_PATH}extraSmallEnemy.png`,
    smallEnemy: `${ASSETS_PATH}smallEnemy.png`,
    mediumEnemy: `${ASSETS_PATH}mediumEnemy.png`,
    largeEnemy: `${ASSETS_PATH}largeEnemy.png`,
    extraLargeEnemy: `${ASSETS_PATH}extraLargeEnemy.png`,
    HeartContainer: `${ASSETS_PATH}heartContainer.png`,
};
