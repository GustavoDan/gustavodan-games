import {
    BaseObjectState,
    BaseTickAction,
    BoundingBox,
    CollidableObject,
    GameOverAction,
    InitializeGameState,
    LoadHighScoreAction,
    ResetAction,
    ShooterInputAction,
    Vector2D,
} from "@/types";
import {
    DeleteObjectAction,
    EnemyState,
    EnemyType,
    GameState,
    PlayerState,
    VolatileData,
} from "../types";
import {
    ALL_SPRITES,
    CONSTANT_SIZES,
    ENEMY_SPAWN_TIME_RANGE,
    INITIAL_GAME_STATE,
    INVULNERABILITY_DURATION,
    MOVE_SPEEDS,
    SHOT_COOLDOWN,
} from "../constants";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";
import { handleTimer } from "@/utils/timer";
import { getRandomFloat, getRandomInt, getRandomItem } from "@/utils/random";
import { areBoxesOverlapping, isPixelColliding } from "@/utils/collision";

type Assets = { [k in keyof typeof ALL_SPRITES]: HTMLImageElement };

interface TickAction extends BaseTickAction {
    payload: BaseTickAction["payload"] & {
        inputActions: ShooterInputAction;
        volatileData: VolatileData;
        assets: Assets;
        useInstantShot: boolean;
    };
}

type GameAction =
    | TickAction
    | InitializeGameState
    | DeleteObjectAction
    | LoadHighScoreAction
    | ResetAction
    | GameOverAction;

const ENEMY_TYPES = (Object.keys(CONSTANT_SIZES.enemies) as EnemyType[]).map(
    (key) => key
);
const PLAYER_SIZE = {
    x: CONSTANT_SIZES.player.width,
    y: CONSTANT_SIZES.player.height,
};
const SHOT_SIZE = {
    x: CONSTANT_SIZES.shot.width,
    y: CONSTANT_SIZES.shot.height,
};

const getPlayerGunPos = (
    playerPos: Vector2D,
    playerSize: Vector2D,
    shotSize: Vector2D
) => {
    return {
        x: playerPos.x + playerSize.x,
        y: playerPos.y + (playerSize.y - shotSize.y) / 2,
    };
};

const getNewSpawnTimer = () => {
    return getRandomFloat(
        ENEMY_SPAWN_TIME_RANGE.min,
        ENEMY_SPAWN_TIME_RANGE.max,
        3
    );
};

const handleShooting = (gameState: GameState) => {
    if (gameState.player.currentShotCooldown !== 0) return;

    const newShot: BaseObjectState = {
        id: crypto.randomUUID(),
        pos: getPlayerGunPos(gameState.player.pos, PLAYER_SIZE, SHOT_SIZE),
    };

    gameState.shots.push(newShot);
    gameState.player.currentShotCooldown = SHOT_COOLDOWN;
};

const handlePlayerInput = (gameState: GameState, input: ShooterInputAction) => {
    gameState.player.moveDirection.vertical = getDirectionOnAxis(
        input,
        "vertical"
    );

    gameState.player.moveDirection.horizontal = getDirectionOnAxis(
        input,
        "horizontal"
    );

    if (input.shoot) {
        handleShooting(gameState);
    }
};

const handlePlayerPhysics = (
    playerState: PlayerState,
    screenSize: Vector2D,
    deltaTime: number
) => {
    playerState.invulnerabilityTimer = handleTimer(
        playerState.invulnerabilityTimer,
        deltaTime
    );

    const maxPlayerPos = {
        x: screenSize.x / 2 - PLAYER_SIZE.x,
        y: screenSize.y - PLAYER_SIZE.y,
    };

    playerState.pos.x = moveOnAxis(
        playerState.pos.x,
        playerState.moveDirection.horizontal,
        MOVE_SPEEDS.player,
        deltaTime,
        { max: maxPlayerPos.x }
    );

    playerState.pos.y = moveOnAxis(
        playerState.pos.y,
        playerState.moveDirection.vertical,
        MOVE_SPEEDS.player,
        deltaTime,
        { max: maxPlayerPos.y }
    );
};

const handleShots = (
    gameState: GameState,
    volatileData: VolatileData,
    screenSize: Vector2D,
    deltaTime: number,
    useInstantShot: boolean
) => {
    gameState.shots.forEach((shot) => {
        const isShotAnimFinished = volatileData.shot.get(
            shot.id
        )?.isAnimationFinished;
        const isShotMarked = gameState.markedForDeletion.shots.has(shot.id);

        if (isShotMarked) {
        } else if (useInstantShot || isShotAnimFinished) {
            shot.pos.x = moveOnAxis(
                shot.pos.x,
                "RIGHT",
                MOVE_SPEEDS.shot,
                deltaTime
            );
        } else {
            shot.pos = getPlayerGunPos(
                gameState.player.pos,
                PLAYER_SIZE,
                SHOT_SIZE
            );
        }
    });

    gameState.player.currentShotCooldown = handleTimer(
        gameState.player.currentShotCooldown,
        deltaTime
    );

    gameState.shots = gameState.shots.filter(
        (shot) => shot.pos.x < screenSize.x
    );
};

export const handleEnemies = (
    gameState: GameState,
    screenSize: Vector2D,
    deltaTime: number
) => {
    gameState.enemies.forEach((enemy) => {
        if (!gameState.markedForDeletion.enemies.has(enemy.id)) {
            enemy.pos.x = moveOnAxis(
                enemy.pos.x,
                "LEFT",
                MOVE_SPEEDS.enemies,
                deltaTime
            );
        }
    });

    gameState.enemySpawnTimer -= deltaTime;

    if (gameState.enemySpawnTimer <= 0) {
        const currentEnemyType = getRandomItem(ENEMY_TYPES);

        if (!currentEnemyType) {
            throw new Error("ENEMY_TYPES cannot be an empty array.");
        }

        const enemyHeight = CONSTANT_SIZES.enemies[currentEnemyType].height;
        const newEnemy: EnemyState = {
            id: crypto.randomUUID(),
            pos: {
                x: screenSize.x,
                y: getRandomInt(0, screenSize.y - enemyHeight),
            },
            type: currentEnemyType,
        };
        gameState.enemies.push(newEnemy);

        gameState.enemySpawnTimer = getNewSpawnTimer();
    }

    const initialEnemyCount = gameState.enemies.length;

    gameState.enemies = gameState.enemies.filter(
        (enemy) => enemy.pos.x > -CONSTANT_SIZES.enemies[enemy.type].width
    );

    gameState.player.life -= initialEnemyCount - gameState.enemies.length;
};

const checkEnemyShotCollisions = (
    gameState: GameState,
    volatileData: VolatileData,
    assets: Assets
) => {
    const { enemies, shots, markedForDeletion } = gameState;
    const { enemies: markedEnemies, shots: markedShots } = markedForDeletion;

    for (const enemy of enemies) {
        if (markedEnemies.has(enemy.id)) continue;

        const enemySize = CONSTANT_SIZES.enemies[enemy.type];
        const enemyBox: CollidableObject = {
            pos: {
                ...enemy.pos,
            },
            size: {
                x: enemySize.width,
                y: enemySize.height,
            },
            image: assets[`${enemy.type}Enemy`],
        };

        for (const shot of shots) {
            if (markedShots.has(shot.id)) continue;

            const getShotFrame = volatileData.shot.get(
                shot.id
            )?.getCurrentFrame;

            const shotBox: CollidableObject = {
                pos: {
                    ...shot.pos,
                },
                size: {
                    ...SHOT_SIZE,
                },
                image: assets.shot,
                spriteScale: CONSTANT_SIZES.shot.spriteScale,
                frameIndex: getShotFrame?.() ?? 0,
            };

            if (isPixelColliding(enemyBox, shotBox)) {
                markedShots.add(shot.id);
                markedEnemies.add(enemy.id);
                gameState.score += 1;
                break;
            }
        }
    }
};

const checkPlayerEnemyCollisions = (gameState: GameState) => {
    const { player, enemies, markedForDeletion } = gameState;
    const markedEnemies = markedForDeletion.enemies;

    const playerBox: BoundingBox = {
        pos: { ...player.pos },
        size: {
            ...PLAYER_SIZE,
        },
    };

    for (const enemy of enemies) {
        if (markedEnemies.has(enemy.id)) continue;

        const enemySize = CONSTANT_SIZES.enemies[enemy.type];
        const enemyBox: BoundingBox = {
            pos: { ...enemy.pos },
            size: {
                x: enemySize.width,
                y: enemySize.height,
            },
        };

        if (areBoxesOverlapping(playerBox, enemyBox)) {
            markedEnemies.add(enemy.id);

            if (player.invulnerabilityTimer <= 0) {
                player.life -= 1;
                player.invulnerabilityTimer = INVULNERABILITY_DURATION;
            }
        }
    }
};

const handleCollisions = (
    gameState: GameState,
    volatileData: VolatileData,
    assets: Assets
) => {
    checkEnemyShotCollisions(gameState, volatileData, assets);
    checkPlayerEnemyCollisions(gameState);
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
                volatileData,
                assets,
                useInstantShot,
            } = action.payload;

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handlePlayerPhysics(newState.player, screenSize, stepTime);
                handleShots(
                    newState,
                    volatileData,
                    screenSize,
                    stepTime,
                    useInstantShot
                );
                handleEnemies(newState, screenSize, stepTime);
                handleCollisions(newState, volatileData, assets);
            });

            handlePlayerInput(newState, inputActions);

            return newState;
        }
        case "INITIALIZE_GAME_STATE": {
            return {
                ...gameState,
                player: {
                    ...gameState.player,
                    pos: {
                        ...gameState.player.pos,
                        y: action.payload.playerY,
                    },
                },
                enemySpawnTimer: getNewSpawnTimer(),
            };
        }
        case "DELETE_OBJECT": {
            const { objectType, objectId } = action.payload;
            const newObjectSet = new Set(
                gameState.markedForDeletion[objectType]
            );
            newObjectSet.delete(objectId);

            return {
                ...gameState,
                markedForDeletion: {
                    ...gameState.markedForDeletion,
                    [objectType]: newObjectSet,
                },
                [objectType]: gameState[objectType].filter(
                    (object) => object.id !== objectId
                ),
            };
        }
        case "LOAD_HIGH_SCORE": {
            return { ...gameState, highScore: action.payload };
        }
        case "RESET": {
            return { ...INITIAL_GAME_STATE, highScore: gameState.highScore };
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
