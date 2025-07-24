import { Vector2D } from "@/types";
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
    CONSTANT_SIZES,
    ENEMY_SPAWN_TIME_RANGE,
    SHOT_COOLDOWN,
} from "../constants";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";
import { handleTimer } from "@/utils/timer";
import { getRandomFloat, getRandomInt, getRandomItem } from "@/utils/random";

type TickAction = {
    type: "TICK";
    payload: {
        deltaTime: number;
        screenSize: Vector2D;
        inputActions: ShooterInputAction;
        volatileData: VolatileData;
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
        const isShotAnimFinished = volatileData.isShotAnimFinished.get(shot.id);

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

export const gameReducer = (
    gameState: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "TICK": {
            const newState = structuredClone(gameState);
            const { deltaTime, screenSize, inputActions, volatileData } =
                action.payload;

            const playerState = newState.player;

            handlePlayerInput(gameState, inputActions);

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handlePlayerPhysics(playerState, screenSize, stepTime);
                handleShots(gameState, volatileData, screenSize, stepTime);
                handleEnemies(gameState, screenSize, stepTime);
            });

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
