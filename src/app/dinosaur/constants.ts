import { GameState, InputAction, ObstacleType } from "./types";

export const GRAVITY = 3000;
export const FAST_FALL_MULTIPLIER = 5;
export const INVULNERABILITY_DURATION = 1.5;
export const SCORE_PER_SECOND = 1;
export const INITIAL_GAME_SPEED = 300;

export const FLOOR = { heigth: 24, width: 2400 };

const cactusDefaults = {
    weight: 15,
    static: true,
};

const shortCactus = {
    ...cactusDefaults,
    height: 66,
    bottom: 8,
};

const tallCactus = {
    ...cactusDefaults,
    height: 96,
    bottom: 4,
};

const imagePath = "dinosaur/";

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
            ...shortCactus,
            width: 30,
            fileName: "short_cactus.png",
        },
        shortSmallGroup: {
            ...shortCactus,
            width: 64,
            fileName: "small_short_cactus_group.png",
        },
        shortLargeGroup: {
            ...shortCactus,
            width: 98,
            fileName: "large_short_cactus_group.png",
        },
        tallSingle: {
            ...tallCactus,
            width: 46,
            fileName: "tall_cactus.png",
        },
        tallSmallGroup: {
            ...tallCactus,
            width: 96,
            fileName: "small_tall_cactus_group.png",
        },
        tallLargeGroup: {
            ...tallCactus,
            width: 146,
            fileName: "large_tall_cactus_group.png",
        },
        pterodactyl: {
            width: 84,
            height: 72,
            fileName: "pterodactyl.png",
            weight: 10,
            static: false,
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
    gameSpeed: INITIAL_GAME_SPEED,
    gameSpeedMultiplier: 1,
    obstacles: [],
    obstacleSpawnDistance: 0,
    obstacleSpawnInterval: {
        min: 0.5,
        max: 2,
    },
    score: 0,
    highScore: 0,
} as const;

export const INITIAL_INPUT_ACTIONS: InputAction = {
    down: false,
    up: false,
    left: false,
    right: false,
} as const;

export const ALL_SPRITES = {
    floor: `${imagePath}floor.png`,
    run: `${imagePath}run.png`,
    duck: `${imagePath}duck.png`,
    ...(Object.fromEntries(
        Object.entries(OBSTACLES.types).map(([key, value]) => {
            return [key, `${imagePath}${value.fileName}`];
        })
    ) as { [K in ObstacleType]: string }),
};
