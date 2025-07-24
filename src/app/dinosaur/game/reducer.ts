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
    ObstacleState,
    ObstacleType,
    VolatileData,
} from "../types";
import { getRandomFloat, getRandomInt, getRandomItem } from "@/utils/random";
import { isPixelColliding } from "@/utils/collision";
import {
    BaseInputAction,
    CollidableObject,
    HorizontalMovementDirection,
    Vector2D,
} from "@/types";
import { easeInOutQuad } from "@/utils/easing";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";
import { handleTimer } from "@/utils/timer";

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
        inputActions: BaseInputAction;
        assets: Assets;
        volatileData: VolatileData;
        useRelativePhysics: boolean;
    };
};
type ResetAction = { type: "RESET" };
type LoadHighScoreAction = { type: "LOAD_HIGH_SCORE"; payload: number };
type GameOverAction = { type: "GAME_OVER" };
type GameAction =
    | TickAction
    | ResetAction
    | LoadHighScoreAction
    | GameOverAction;

const handleDinosaurInput = (
    dinosaurState: DinosaurState,
    input: BaseInputAction
) => {
    dinosaurState.moveDirection = getDirectionOnAxis(input, "horizontal");

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
    dinosaurState.invulnerabilityTimer = handleTimer(
        dinosaurState.invulnerabilityTimer,
        deltaTime
    );

    const dinosaurSprite = dinosaurState.isDucking ? "duck" : "run";
    const maxDinosaurX = screenSize.x - DINOSAUR_SIZE[dinosaurSprite].width;
    dinosaurState.pos.x = moveOnAxis(
        dinosaurState.pos.x,
        dinosaurState.moveDirection,
        dinosaurState.moveSpeed,
        deltaTime,
        { max: maxDinosaurX }
    );

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
    moveDirection: HorizontalMovementDirection
) => {
    const multipliers: Partial<Record<HorizontalMovementDirection, number>> = {
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
        obstacle.pos.x = moveOnAxis(
            obstacle.pos.x,
            "LEFT",
            gameState.gameSpeed *
                gameState.gameSpeedMultiplier *
                obstacle.speedMultiplier,
            deltaTime
        );
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
            speedMultiplier: obstacleData.static ? 1 : getRandomFloat(1.3, 2),
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
                useRelativePhysics,
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

            if (useRelativePhysics) {
                handleGameSpeedMultiplier(
                    newState,
                    dinosaurState.moveDirection
                );
            }
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
