import { GameState, InputAction, ObstacleType } from "./types";

export const FLOOR = { heigth: 24, width: 2400 };

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

export const OBSTACLES = {
    spawnDistance: {
        initial: {
            min: 300,
            max: 1200,
        },
        final: {
            min: 0,
            max: 300,
        },
        decayRate: {
            // To calculate when min reaches the final value, use:
            //(spawnData.initial.min - spawnData.final.min) / gameSpeed at desired time of game
            min: 0.34,
            // To calculate when max reaches the final value, use:
            //(spawnData.initial.max - spawnData.final.max) / gameSpeed at desired time of game
            max: 1,
        },
    },
    types: {
        shortSingle: {
            width: 30,
            height: 66,
            bottom: 8,
            url: "dinosaur/short_cactus.png",
            weight: 15,
        },
        shortSmallGroup: {
            width: 64,
            height: 66,
            bottom: 8,
            url: "dinosaur/small_short_cactus_group.png",
            weight: 15,
        },
        shortLargeGroup: {
            width: 98,
            height: 66,
            bottom: 8,
            url: "dinosaur/large_short_cactus_group.png",
            weight: 15,
        },
        tallSingle: {
            width: 46,
            height: 96,
            bottom: 4,
            url: "dinosaur/tall_cactus.png",
            weight: 15,
        },
        tallSmallGroup: {
            width: 96,
            height: 96,
            bottom: 4,
            url: "dinosaur/small_tall_cactus_group.png",
            weight: 15,
        },
        tallLargeGroup: {
            width: 146,
            height: 96,
            bottom: 4,
            url: "dinosaur/large_tall_cactus_group.png",
            weight: 15,
        },
        pterodactyl: {
            width: 84,
            height: 72,
            url: "dinosaur/pterodactyl.png",
            weight: 10000000,
            bottom: {
                min: 30,
                max: 100,
            },
        },
    },
} as const;

export const INITIAL_GAME_STATE: GameState = {
    dinosaur: {
        life: 1,
        invulnerabilityTimer: 0,
        pos: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        isJumping: false,
        isDucking: false,
        isFastFalling: false,
        jumpStrength: 1200,
        moveSpeed: 600,
        moveDirection: "IDLE",
    },
    gameSpeed: 300,
    gameSpeedMultiplier: 1,
    obstacles: [],
    obstacleSpawnDistance: 0,
    obstacleSpawnInterval: {
        min: 0.5,
        max: 2,
    },
} as const;

export const INITIAL_INPUT_ACTIONS: InputAction = {
    down: false,
    up: false,
    left: false,
    right: false,
} as const;

export const ALL_SPRITES = {
    floor: "/dinosaur/floor.png",
    run: "/dinosaur/run.png",
    duck: "/dinosaur/duck.png",
    ...(Object.fromEntries(
        Object.entries(OBSTACLES.types).map(([key, value]) => {
            return [key, value.url];
        })
    ) as { [K in ObstacleType]: string }),
};

export const GRAVITY = 3000;
export const FAST_FALL_MULTIPLIER = 5;
export const INVULNERABILITY_DURATION = 1.5;
export const ADDITIONAL_GAME_SPEED_PER_SECOND = 1;
