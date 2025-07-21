import {
    ALL_SPRITES,
    DINOSAUR_SIZE,
    FAST_FALL_MULTIPLIER,
    GRAVITY,
    INITIAL_GAME_SPEED,
    INITIAL_GAME_STATE,
    INVULNERABILITY_DURATION,
    OBSTACLES,
    SCORE_PER_SECOND,
} from "../constants";
import {
    GameState,
    DinosaurState,
    InputAction,
    Vector2D,
    ObstacleState,
    MovementDirection,
    ObstacleType,
    VolatileData,
} from "../types";
import { getRandomInt, getRandomItem } from "@/utils/random";
import { isPixelColliding } from "@/utils/collision";
import { CollidableObject } from "@/types";
import { easeInOutQuad } from "@/utils/easing";

const OBSTACLE_TYPES_WEIGHTS: {
    type: ObstacleType;
    weight: number;
}[] = (Object.keys(OBSTACLES.types) as ObstacleType[]).map((key) => {
    return {
        type: key,
        weight: OBSTACLES.types[key].weight,
    };
});

type Assets = { [k in keyof typeof ALL_SPRITES]: HTMLImageElement };

type TickAction = {
    type: "TICK";
    payload: {
        deltaTime: number;
        screenSize: Vector2D;
        inputActions: InputAction;
        assets: Assets;
        volatileData: VolatileData;
    };
};
type ResetAction = { type: "RESET" };
type LoadHighScoreAction = { type: "LOAD_HIGH_SCORE"; payload: number };
type GameOverAction = { type: "GAME_OVER" };
export type GameAction =
    | TickAction
    | ResetAction
    | LoadHighScoreAction
    | GameOverAction;

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

const handleDinosaurInput = (
    dinosaurState: DinosaurState,
    input: InputAction
) => {
    const isMovingLeft = input.left && !input.right;
    const isMovingRight = input.right && !input.left;

    if (isMovingLeft) dinosaurState.moveDirection = "LEFT";
    else if (isMovingRight) dinosaurState.moveDirection = "RIGHT";
    else dinosaurState.moveDirection = "IDLE";

    if (input.up && !dinosaurState.isJumping && !dinosaurState.isDucking) {
        dinosaurState.isJumping = true;
        dinosaurState.vel.y = dinosaurState.jumpStrength;
    }

    dinosaurState.isDucking = !dinosaurState.isJumping && input.down;
    dinosaurState.isFastFalling = dinosaurState.isJumping && input.down;
};

const handleDinosaurPhysics = (
    dinosaurState: DinosaurState,
    deltaTime: number,
    screenSize: Vector2D
) => {
    if (dinosaurState.invulnerabilityTimer > 0) {
        dinosaurState.invulnerabilityTimer -= deltaTime;
    } else {
        dinosaurState.invulnerabilityTimer = 0;
    }

    if (dinosaurState.moveDirection === "LEFT")
        dinosaurState.pos.x -= dinosaurState.moveSpeed * deltaTime;
    else if (dinosaurState.moveDirection === "RIGHT")
        dinosaurState.pos.x += dinosaurState.moveSpeed * deltaTime;

    const dinosaurSprite = dinosaurState.isDucking ? "duck" : "run";
    const screenWidth = screenSize.x - DINOSAUR_SIZE[dinosaurSprite].width;
    //Keeps dinosaur inside screen
    dinosaurState.pos.x = clamp(dinosaurState.pos.x, 0, screenWidth);

    if (!dinosaurState.isJumping) return;

    const gravityMultiplier = dinosaurState.isFastFalling
        ? FAST_FALL_MULTIPLIER
        : 1;
    const totalGravity = GRAVITY * gravityMultiplier;

    dinosaurState.pos.y += dinosaurState.vel.y * deltaTime;
    dinosaurState.vel.y -= totalGravity * deltaTime;

    if (dinosaurState.pos.y <= 0) {
        dinosaurState.pos.y = 0;
        dinosaurState.vel.y = 0;
        dinosaurState.isFastFalling = false;
        dinosaurState.isJumping = false;
    }
};

const handleGameSpeedMultiplier = (
    gameState: GameState,
    moveDirection: MovementDirection
) => {
    const multipliers: Partial<Record<MovementDirection, number>> = {
        RIGHT: 2.0,
        LEFT: 0.5,
    };

    gameState.gameSpeedMultiplier = multipliers[moveDirection] ?? 1.0;
};

const handleObstacles = (
    gameState: GameState,
    deltaTime: number,
    screenSize: Vector2D
) => {
    gameState.obstacles.forEach((obstacle) => {
        obstacle.pos.x -=
            gameState.gameSpeed * gameState.gameSpeedMultiplier * deltaTime;
    });
    gameState.obstacleSpawnDistance -=
        gameState.gameSpeed * gameState.gameSpeedMultiplier * deltaTime;

    if (gameState.obstacleSpawnDistance <= 0) {
        const currentObstacleType = getRandomItem(
            OBSTACLE_TYPES_WEIGHTS,
            (obstacle) => obstacle.weight
        )?.type;

        if (!currentObstacleType) {
            throw new Error("OBSTACLE_TYPES_WEIGHTS cannot be an empty array.");
        }

        const obstacleData = OBSTACLES.types[currentObstacleType];
        const newObstacle: ObstacleState = {
            id: crypto.randomUUID(),
            pos: {
                x: screenSize.x,
                y:
                    typeof obstacleData.bottom === "number"
                        ? obstacleData.bottom
                        : getRandomInt(
                              obstacleData.bottom.min,
                              obstacleData.bottom.max
                          ),
            },
            type: currentObstacleType,
        };
        gameState.obstacles.push(newObstacle);

        const spawnData = OBSTACLES.spawnDistance;
        const min = Math.max(
            spawnData.final.min,
            spawnData.initial.min -
                gameState.gameSpeed * spawnData.decayRate.min,
            OBSTACLES.types[currentObstacleType].width
        );
        const max = Math.max(
            spawnData.final.max,
            spawnData.initial.max -
                gameState.gameSpeed * spawnData.decayRate.max
        );

        gameState.obstacleSpawnDistance =
            min + (max - min) * easeInOutQuad(Math.random());
    }

    gameState.obstacles = gameState.obstacles.filter(
        (obstacle) => obstacle.pos.x > -OBSTACLES.types[obstacle.type].width
    );
};

const handleCollisions = (
    gameState: GameState,
    assets: Assets,
    volatileData: VolatileData
) => {
    const dinosaur = gameState.dinosaur;

    if (dinosaur.invulnerabilityTimer > 0) {
        return;
    }

    const dinosaurSprite = dinosaur.isDucking ? "duck" : "run";
    const dinosaurBox: CollidableObject = {
        x: dinosaur.pos.x,
        y: dinosaur.pos.y,
        width: DINOSAUR_SIZE[dinosaurSprite].width,
        height: DINOSAUR_SIZE[dinosaurSprite].height,
        image: assets[dinosaurSprite],
        frameIndex: volatileData.getDinosaurFrame?.() ?? 0,
    };

    const hasCollision = gameState.obstacles.some((obstacle) => {
        const obstacleBox: CollidableObject = {
            x: obstacle.pos.x,
            y: obstacle.pos.y,
            width: OBSTACLES.types[obstacle.type].width,
            height: OBSTACLES.types[obstacle.type].height,
            image: assets[obstacle.type],
            frameIndex: volatileData.getObstaclesFrame.get(obstacle.id)?.(),
        };

        return isPixelColliding(dinosaurBox, obstacleBox);
    });

    if (hasCollision) {
        dinosaur.life -= 1;
        dinosaur.invulnerabilityTimer = INVULNERABILITY_DURATION;
    }
};

const updateGameProgression = (gameState: GameState, deltaTime: number) => {
    gameState.score += SCORE_PER_SECOND * deltaTime;
    gameState.gameSpeed = INITIAL_GAME_SPEED + gameState.score;
};

export const gameReducer = (
    gameState: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "TICK": {
            const newState = structuredClone(gameState);
            const {
                deltaTime,
                screenSize,
                inputActions,
                assets,
                volatileData,
            } = action.payload;

            const dinosaurState = newState.dinosaur;

            handleDinosaurInput(dinosaurState, inputActions);

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handleDinosaurPhysics(dinosaurState, stepTime, screenSize);
                handleObstacles(newState, stepTime, screenSize);
                handleCollisions(newState, assets, volatileData);
            });

            handleGameSpeedMultiplier(newState, dinosaurState.moveDirection);
            updateGameProgression(newState, deltaTime);

            return newState;
        }
        case "RESET": {
            return { ...INITIAL_GAME_STATE, highScore: gameState.highScore };
        }
        case "LOAD_HIGH_SCORE": {
            return { ...gameState, highScore: action.payload };
        }
        case "GAME_OVER": {
            return gameState.score <= gameState.highScore
                ? gameState
                : { ...gameState, highScore: gameState.score };
        }
        default:
            return gameState;
    }
};
