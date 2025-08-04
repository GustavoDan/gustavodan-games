import { ShooterInputAction } from "@/types";
import { GameState } from "./types";

export const ASSETS_PATH = "rescue/";
export const LOCALSTORAGE_HS_VAR = "rescue_hs";
export const MAX_PLAYER_LIFE = 3;
export const SHOT_COOLDOWN = 0.5;
export const FLOOR_HEIGHT = 140;
export const INVULNERABILITY_DURATION = 1.5;
export const INITIAL_ENEMY_SPEED_MULTIPLIER = 1;
export const DIFFICULTY_SCALING_FACTOR = 0.0003;

export const SCORE_GAIN = {
    kill: {
        enemy: 100,
        ally: -200,
    },
    rescue: {
        ally: 200,
    },
};

export const SPAWN_TIMERS_RANGE = {
    truck: {
        min: 3,
        max: 6,
    },
    ally: {
        min: 2,
        max: 8,
    },
};

export const MOVE_SPEEDS = {
    player: 600,
    enemies: 450,
    shot: 1500,
    ally: 300,
};

export const CONSTANT_SIZES = {
    background: {
        width: 2200,
        height: 630,
    },
    player: {
        width: 256,
        height: 66,
    },
    shot: {
        width: 50,
        height: 8,
    },
    enemies: {
        helicopter: {
            width: 246,
            height: 63,
        },
        truck: {
            width: 154,
            height: 70,
        },
    },
    ally: {
        width: 34,
        height: 40,
    },
    allyDeath: {
        width: 41,
        height: 51,
    },
    explosion: {
        width: 80,
        height: 80,
    },
    life: {
        width: 35,
        height: 25,
    },
};

export const INITIAL_MARKED_FOR_DELETION = {
    shots: new Set<string>(),
    ally: false,
};

export const INITIAL_GAME_STATE: GameState = {
    player: {
        life: MAX_PLAYER_LIFE,
        pos: { x: 0, y: 0 },
        moveDirection: {
            vertical: "IDLE",
            horizontal: "IDLE",
        },
        currentShotCooldown: 0,
        invulnerabilityTimer: 0,
    },
    shots: [],
    enemies: {
        truck: null,
        helicopter: null,
    },
    ally: null,
    explosions: [],
    markedForDeletion: INITIAL_MARKED_FOR_DELETION,
    spawnTimers: { truck: 0, ally: 0 },
    score: 0,
    highScore: 0,
    enemySpeedMultiplier: INITIAL_ENEMY_SPEED_MULTIPLIER,
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
    shot: `${ASSETS_PATH}bullet.png`,
    enemyHelicopter: `${ASSETS_PATH}enemy-helicopter.png`,
    enemyTruck: `${ASSETS_PATH}enemy-truck.png`,
    ally: `${ASSETS_PATH}ally.png`,
    allyDeath: `${ASSETS_PATH}ally-death.png`,
    explosion: `${ASSETS_PATH}explosion.png`,
    life: `${ASSETS_PATH}battery.png`,
};
