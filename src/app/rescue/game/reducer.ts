import {
    BaseObjectState,
    BaseTickAction,
    BoundingBox,
    ClearSoundsAction,
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
    EnemyType,
    GameState,
    PlayerState,
    VolatileData,
} from "../types";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";
import {
    ALL_SPRITES,
    CONSTANT_SIZES,
    DIFFICULTY_SCALING_FACTOR,
    FLOOR_HEIGHT,
    INITIAL_ENEMY_SPEED_MULTIPLIER,
    INITIAL_GAME_STATE,
    INITIAL_MARKED_FOR_DELETION,
    INVULNERABILITY_DURATION,
    MOVE_SPEEDS,
    SCORE_GAIN,
    SHOT_COOLDOWN,
    SPAWN_TIMERS_RANGE,
} from "../constants";
import { handleTimer } from "@/utils/timer";
import { getRandomFloat, getRandomInt } from "@/utils/random";
import { capitalize } from "@/utils/string";
import { areBoxesOverlapping, isPixelColliding } from "@/utils/collision";

type Assets = { [k in keyof typeof ALL_SPRITES]: HTMLImageElement };
type SpawnTimerType = keyof typeof SPAWN_TIMERS_RANGE;

interface TickAction extends BaseTickAction {
    payload: BaseTickAction["payload"] & {
        inputActions: ShooterInputAction;
        assets: Assets;
        volatileData: VolatileData;
    };
}

type GameAction =
    | TickAction
    | InitializeGameState
    | ResetAction
    | DeleteObjectAction
    | LoadHighScoreAction
    | GameOverAction
    | ClearSoundsAction;

const PLAYER_SIZE = {
    x: CONSTANT_SIZES.player.width,
    y: CONSTANT_SIZES.player.height,
};
const SHOT_SIZE = {
    x: CONSTANT_SIZES.shot.width,
    y: CONSTANT_SIZES.shot.height,
};
const ALLY_SIZE = {
    x: CONSTANT_SIZES.ally.width,
    y: CONSTANT_SIZES.ally.height,
};

const getPlayerGunPos = (
    playerPos: Vector2D,
    playerSize: Vector2D,
    shotSize: Vector2D
) => {
    return {
        x: playerPos.x + playerSize.x / 1.4,
        y: playerPos.y + shotSize.y / 1.4,
    };
};

const getHelicopterFlyingHeight = (screenHeight: number) => {
    return getRandomInt(
        FLOOR_HEIGHT + CONSTANT_SIZES.enemies.truck.height,
        screenHeight - CONSTANT_SIZES.enemies.helicopter.height
    );
};

const getSpawnTimer = (type: SpawnTimerType) => {
    return getRandomFloat(
        SPAWN_TIMERS_RANGE[type].min,
        SPAWN_TIMERS_RANGE[type].max,
        3
    );
};

const handleEnemyKill = (gameState: GameState, enemyType: EnemyType) => {
    const enemy = gameState.enemies[enemyType];
    const enemySize = CONSTANT_SIZES.enemies[enemyType];
    if (!enemy) return;

    gameState.explosions.push({
        id: crypto.randomUUID(),
        pos: {
            x: enemy.pos.x + enemySize.width / 2,
            y: enemy.pos.y,
        },
    });

    gameState.enemies[enemyType] = null;
    gameState.soundEvents.push("explosion");
};

const handleAllyKill = (gameState: GameState) => {
    gameState.markedForDeletion.ally = true;
    gameState.score += SCORE_GAIN.kill.ally;
    gameState.soundEvents.push("allyDeath");
};

const handleShooting = (gameState: GameState) => {
    if (gameState.player.currentShotCooldown !== 0) return;

    const newShot: BaseObjectState = {
        id: crypto.randomUUID(),
        pos: getPlayerGunPos(gameState.player.pos, PLAYER_SIZE, SHOT_SIZE),
    };

    gameState.shots.push(newShot);
    gameState.player.currentShotCooldown = SHOT_COOLDOWN;
    gameState.soundEvents.push("shoot");
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
        x: screenSize.x - PLAYER_SIZE.x,
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
        { min: FLOOR_HEIGHT, max: maxPlayerPos.y }
    );
};

const handleShots = (gameState: GameState, deltaTime: number) => {
    gameState.shots.forEach((shot) => {
        shot.pos.x = moveOnAxis(
            shot.pos.x,
            "RIGHT",
            MOVE_SPEEDS.shot,
            deltaTime
        );
    });

    gameState.player.currentShotCooldown = handleTimer(
        gameState.player.currentShotCooldown,
        deltaTime
    );
};

export const handleEnemies = (
    gameState: GameState,
    screenSize: Vector2D,
    deltaTime: number
) => {
    for (const enemy of Object.values(gameState.enemies)) {
        if (!enemy) continue;

        enemy.pos.x = moveOnAxis(
            enemy.pos.x,
            "LEFT",
            MOVE_SPEEDS.enemies * gameState.enemySpeedMultiplier,
            deltaTime,
            {
                min: -CONSTANT_SIZES.enemies[enemy.type].width,
                max: screenSize.x,
                wrapAround: true,
            }
        );

        if (enemy.type === "helicopter" && enemy.pos.x === screenSize.x) {
            enemy.pos.y = getHelicopterFlyingHeight(screenSize.y);
        }
    }

    if (!gameState.enemies.helicopter) {
        gameState.enemies.helicopter = {
            id: crypto.randomUUID(),
            pos: {
                x: screenSize.x,
                y: getHelicopterFlyingHeight(screenSize.y),
            },
            type: "helicopter",
        };
    }

    if (!gameState.enemies.truck) {
        gameState.spawnTimers.truck -= deltaTime;
    }

    if (gameState.spawnTimers.truck <= 0) {
        gameState.enemies.truck = {
            id: crypto.randomUUID(),
            pos: {
                x: screenSize.x,
                y: FLOOR_HEIGHT,
            },
            type: "truck",
        };

        gameState.spawnTimers.truck = getSpawnTimer("truck");
    }
};

export const handleAlly = (
    gameState: GameState,
    screenSize: Vector2D,
    deltaTime: number
) => {
    const { ally, markedForDeletion } = gameState;

    if (ally) {
        if (!markedForDeletion.ally) {
            ally.pos.x = moveOnAxis(
                ally.pos.x,
                "RIGHT",
                MOVE_SPEEDS.ally,
                deltaTime,
                {
                    min: -ALLY_SIZE.x,
                    max: screenSize.x,
                    wrapAround: true,
                }
            );
        }

        return;
    }

    gameState.spawnTimers.ally -= deltaTime;

    if (gameState.spawnTimers.ally <= 0) {
        gameState.ally = {
            id: crypto.randomUUID(),
            pos: {
                x: 0,
                y: FLOOR_HEIGHT,
            },
        };

        gameState.spawnTimers.ally = getSpawnTimer("ally");
    }
};

const checkEnemyShotCollisions = (
    gameState: GameState,
    volatileData: VolatileData,
    assets: Assets
) => {
    const { enemies, shots, markedForDeletion } = gameState;
    const { shots: markedShots } = markedForDeletion;

    for (const enemy of Object.values(enemies)) {
        if (!enemy) continue;

        const enemySize = CONSTANT_SIZES.enemies[enemy.type];
        const enemyBox: CollidableObject = {
            pos: {
                ...enemy.pos,
            },
            size: {
                x: enemySize.width,
                y: enemySize.height,
            },
            image: assets[`enemy${capitalize(enemy.type)}`],
            frameIndex: volatileData.enemyAnimationFrame?.(),
        };

        for (const shot of shots) {
            if (markedShots.has(shot.id)) continue;

            const shotBox: CollidableObject = {
                pos: {
                    ...shot.pos,
                },
                size: {
                    ...SHOT_SIZE,
                },
                image: assets.shot,
            };

            if (isPixelColliding(enemyBox, shotBox)) {
                markedShots.add(shot.id);
                handleEnemyKill(gameState, enemy.type);
                gameState.score += SCORE_GAIN.kill.enemy;
                break;
            }
        }
    }
};

const checkPlayerEnemyCollisions = (
    gameState: GameState,
    volatileData: VolatileData,
    assets: Assets
) => {
    const { player, enemies } = gameState;

    const playerBox: CollidableObject = {
        pos: { ...player.pos },
        size: {
            ...PLAYER_SIZE,
        },
        image: assets.player,
        frameIndex: volatileData.playerAnimationFrame?.(),
    };

    for (const enemy of Object.values(enemies)) {
        if (!enemy) continue;

        const enemySize = CONSTANT_SIZES.enemies[enemy.type];
        const enemyBox: CollidableObject = {
            pos: { ...enemy.pos },
            size: {
                x: enemySize.width,
                y: enemySize.height,
            },
            image: assets[`enemy${capitalize(enemy.type)}`],
            frameIndex: volatileData.enemyAnimationFrame?.(),
        };

        if (isPixelColliding(playerBox, enemyBox)) {
            handleEnemyKill(gameState, enemy.type);
            if (player.invulnerabilityTimer <= 0) {
                player.life -= 1;
                player.invulnerabilityTimer = INVULNERABILITY_DURATION;
            }
        }
    }
};

const checkPlayerAllyCollisions = (gameState: GameState) => {
    const { player, ally, markedForDeletion } = gameState;
    if (!ally || markedForDeletion.ally) return;

    const playerBox: BoundingBox = {
        pos: { ...player.pos },
        size: {
            ...PLAYER_SIZE,
        },
    };

    const allyBox: BoundingBox = {
        pos: { ...ally.pos },
        size: {
            ...ALLY_SIZE,
        },
    };

    if (areBoxesOverlapping(playerBox, allyBox)) {
        gameState.ally = null;
        gameState.score += SCORE_GAIN.rescue.ally;
        gameState.soundEvents.push("allyRescued");
    }
};

const checkAllyShotsCollision = (gameState: GameState, assets: Assets) => {
    const { shots, ally, markedForDeletion } = gameState;
    const { shots: markedShots, ally: isAllyMarked } = markedForDeletion;
    if (!ally || isAllyMarked) return;

    const allyBox: CollidableObject = {
        pos: { ...ally.pos },
        size: {
            ...ALLY_SIZE,
        },
        image: assets.ally,
    };

    for (const shot of shots) {
        if (markedShots.has(shot.id)) continue;

        const shotBox: CollidableObject = {
            pos: {
                ...shot.pos,
            },
            size: {
                ...SHOT_SIZE,
            },
            image: assets.shot,
        };

        if (isPixelColliding(allyBox, shotBox)) {
            markedShots.add(shot.id);
            handleAllyKill(gameState);
        }
    }
};

const checkAllyEnemiesCollision = (gameState: GameState, assets: Assets) => {
    const { enemies, ally, markedForDeletion } = gameState;
    if (!ally || markedForDeletion.ally) return;

    const allyBox: CollidableObject = {
        pos: { ...ally.pos },
        size: {
            ...ALLY_SIZE,
        },
        image: assets.ally,
    };

    for (const enemy of Object.values(enemies)) {
        if (!enemy) continue;

        const enemyBox: CollidableObject = {
            pos: {
                ...enemy.pos,
            },
            size: {
                x: CONSTANT_SIZES.enemies[enemy.type].width,
                y: CONSTANT_SIZES.enemies[enemy.type].height,
            },
            image: assets[`enemy${capitalize(enemy?.type)}`],
        };

        if (isPixelColliding(allyBox, enemyBox)) {
            handleAllyKill(gameState);
        }
    }
};

const handleCollisions = (
    gameState: GameState,
    volatileData: VolatileData,
    assets: Assets
) => {
    checkEnemyShotCollisions(gameState, volatileData, assets);
    checkPlayerEnemyCollisions(gameState, volatileData, assets);
    checkPlayerAllyCollisions(gameState);
    checkAllyShotsCollision(gameState, assets);
    checkAllyEnemiesCollision(gameState, assets);
};

const handleObjectsDeletion = (gameState: GameState, screenWidth: number) => {
    gameState.shots = gameState.shots.filter(
        (shot) =>
            !gameState.markedForDeletion.shots.has(shot.id) &&
            shot.pos.x < screenWidth
    );
    gameState.markedForDeletion.shots = INITIAL_MARKED_FOR_DELETION.shots;
};

const updateEnemySpeedMultiplier = (gameState: GameState) => {
    gameState.enemySpeedMultiplier =
        INITIAL_ENEMY_SPEED_MULTIPLIER +
        gameState.score * DIFFICULTY_SCALING_FACTOR;
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

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handlePlayerPhysics(newState.player, screenSize, stepTime);
                handleShots(newState, stepTime);
                handleEnemies(newState, screenSize, stepTime);
                handleAlly(newState, screenSize, stepTime);
                handleCollisions(newState, volatileData, assets);
            });

            handlePlayerInput(newState, inputActions);
            handleObjectsDeletion(newState, screenSize.x);

            updateEnemySpeedMultiplier(newState);

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
            };
        }
        case "DELETE_OBJECT": {
            const { objectType, objectId } = action.payload;

            return {
                ...gameState,
                ...(objectType in gameState.markedForDeletion && {
                    markedForDeletion: {
                        ...gameState.markedForDeletion,
                        [objectType]:
                            objectId == null
                                ? false
                                : gameState[objectType].filter(
                                      (object) => object.id !== objectId
                                  ),
                    },
                }),
                [objectType]:
                    objectId == null
                        ? null
                        : gameState[objectType].filter(
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
        case "CLEAR_SOUND_EVENTS": {
            return {
                ...gameState,
                soundEvents: [],
            };
        }
        default:
            return gameState;
    }
};
