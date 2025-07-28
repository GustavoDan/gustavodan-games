import { BoundingBox, CollidableObject, Vector2D } from "@/types";
import {
    EnemyState,
    EnemyType,
    GameState,
    PlayerState,
    ShooterInputAction,
    ShotState,
    VolatileData,
} from "../types";
import {
    ALL_SPRITES,
    CONSTANT_SIZES,
    EMPTY_MARKED_FOR_DELETION,
    ENEMY_SPAWN_TIME_RANGE,
    INVULNERABILITY_DURATION,
    SHOT_COOLDOWN,
} from "../constants";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";
import { handleTimer } from "@/utils/timer";
import { getRandomFloat, getRandomInt, getRandomItem } from "@/utils/random";
import { areBoxesOverlapping, isPixelColliding } from "@/utils/collision";

type Assets = { [k in keyof typeof ALL_SPRITES]: HTMLImageElement };

type TickAction = {
    type: "TICK";
    payload: {
        deltaTime: number;
        screenSize: Vector2D;
        inputActions: ShooterInputAction;
        volatileData: VolatileData;
        assets: Assets;
    };
};
type InitializePlayerYAction = {
    type: "INITIALIZE_GAME_STATE";
    payload: {
        playerY: number;
    };
};

type GameAction = TickAction | InitializePlayerYAction;

const ENEMY_TYPES = (Object.keys(CONSTANT_SIZES.enemies) as EnemyType[]).map(
    (key) => key
);

const getNewSpawnTimer = () => {
    return getRandomFloat(
        ENEMY_SPAWN_TIME_RANGE.min,
        ENEMY_SPAWN_TIME_RANGE.max,
        3
    );
};

const getPlayerGunPos = (playerPos: Vector2D): Vector2D => {
    return {
        x: playerPos.x + CONSTANT_SIZES.player.width,
        y:
            playerPos.y +
            (CONSTANT_SIZES.player.height - CONSTANT_SIZES.shot.height) / 2,
    };
};

const handleShooting = (gameState: GameState) => {
    if (gameState.player.currentShotCooldown !== 0) return;

    const newShot: ShotState = {
        id: crypto.randomUUID(),
        pos: getPlayerGunPos(gameState.player.pos),
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
        x: screenSize.x / 2 - CONSTANT_SIZES.player.width,
        y: screenSize.y - CONSTANT_SIZES.player.height,
    };

    playerState.pos.x = moveOnAxis(
        playerState.pos.x,
        playerState.moveDirection.horizontal,
        playerState.moveSpeed,
        deltaTime,
        { max: maxPlayerPos.x }
    );

    playerState.pos.y = moveOnAxis(
        playerState.pos.y,
        playerState.moveDirection.vertical,
        playerState.moveSpeed,
        deltaTime,
        { max: maxPlayerPos.y }
    );
};

const handleShots = (
    gameState: GameState,
    volatileData: VolatileData,
    screenSize: Vector2D,
    deltaTime: number
) => {
    gameState.shots.forEach((shot) => {
        const isShotAnimFinished = volatileData.shot.get(
            shot.id
        )?.isAnimationFinished;

        if (isShotAnimFinished?.()) {
            shot.pos.x = moveOnAxis(shot.pos.x, "RIGHT", 600, deltaTime);
        } else {
            shot.pos = getPlayerGunPos(gameState.player.pos);
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
    gameState.enemies.forEach((enemie) => {
        enemie.pos.x = moveOnAxis(enemie.pos.x, "LEFT", 600, deltaTime);
    });

    gameState.enemySpawnTimer -= deltaTime;

    if (gameState.enemySpawnTimer <= 0) {
        const currentEnemyType = getRandomItem(ENEMY_TYPES);

        if (!currentEnemyType) {
            throw new Error("ENEMY_TYPES cannot be an empty array.");
        }

        const enemyHeigth = CONSTANT_SIZES.enemies[currentEnemyType].height;
        const newEnemy: EnemyState = {
            id: crypto.randomUUID(),
            pos: {
                x: screenSize.x,
                y: getRandomInt(0, screenSize.y - enemyHeigth),
            },
            type: currentEnemyType,
        };
        gameState.enemies.push(newEnemy);

        gameState.enemySpawnTimer = getNewSpawnTimer();
    }

    gameState.enemies = gameState.enemies.filter(
        (enemy) => enemy.pos.x > -CONSTANT_SIZES.enemies[enemy.type].width
    );
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
            x: enemy.pos.x,
            y: enemy.pos.y,
            width: enemySize.width,
            height: enemySize.height,
            image: assets[`${enemy.type}Enemy`],
        };

        for (const shot of shots) {
            if (markedShots.has(shot.id)) continue;

            const getShotFrame = volatileData.shot.get(
                shot.id
            )?.getCurrentFrame;

            const shotBox: CollidableObject = {
                x: shot.pos.x,
                y: shot.pos.y,
                width: CONSTANT_SIZES.shot.width,
                height: CONSTANT_SIZES.shot.height,
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
        x: player.pos.x,
        y: player.pos.y,
        width: CONSTANT_SIZES.player.width,
        height: CONSTANT_SIZES.player.height,
    };

    for (const enemy of enemies) {
        if (markedEnemies.has(enemy.id)) continue;

        const enemySize = CONSTANT_SIZES.enemies[enemy.type];
        const enemyBox: BoundingBox = {
            x: enemy.pos.x,
            y: enemy.pos.y,
            width: enemySize.width,
            height: enemySize.height,
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

const deleteObjects = (gameState: GameState) => {
    const { enemies: markedEnemies, shots: markedShots } =
        gameState.markedForDeletion;

    gameState.shots = gameState.shots.filter(
        (shot) => !markedShots.has(shot.id)
    );
    gameState.enemies = gameState.enemies.filter(
        (shot) => !markedEnemies.has(shot.id)
    );
    gameState.markedForDeletion = EMPTY_MARKED_FOR_DELETION;
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
            } = action.payload;

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handlePlayerPhysics(newState.player, screenSize, stepTime);
                handleShots(newState, volatileData, screenSize, stepTime);
                handleEnemies(newState, screenSize, stepTime);
                handleCollisions(newState, volatileData, assets);
            });

            deleteObjects(newState);
            handlePlayerInput(newState, inputActions);

            return newState;
        }
        case "INITIALIZE_GAME_STATE":
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

        default:
            return gameState;
    }
};
