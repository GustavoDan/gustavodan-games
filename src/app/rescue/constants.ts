import { ShooterInputAction } from "@/types";
import { GameState } from "./types";

export const ASSETS_PATH = "rescue/";
export const MAX_PLAYER_LIFE = 3;
export const SHOT_COOLDOWN = 0.5;
export const FLOOR_HEIGHT = 140;

export const TRUCK_SPAWN_TIME_RANGE = {
    min: 3,
    max: 6,
};

export const MOVE_SPEEDS = {
    player: 600,
    enemies: 450,
    shot: 1500,
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
    markedForDeletion: {
        shots: new Set(),
        enemies: new Set(),
    },
    truckSpawnTimer: 0,
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
};
