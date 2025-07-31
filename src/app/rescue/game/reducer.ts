import { BaseTickAction, ShooterInputAction, Vector2D } from "@/types";
import { GameState, PlayerState, ShotState } from "../types";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";
import {
    CONSTANT_SIZES,
    FLOOR_HEIGHT,
    MOVE_SPEEDS,
    SHOT_COOLDOWN,
    TRUCK_SPAWN_TIME_RANGE,
} from "../constants";
import { handleTimer } from "@/utils/timer";
import { getRandomFloat, getRandomInt } from "@/utils/random";

interface TickAction extends BaseTickAction {
    payload: BaseTickAction["payload"] & {
        inputActions: ShooterInputAction;
    };
}

type GameAction = TickAction;

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

const getTruckSpawnTimer = () => {
    return getRandomFloat(
        TRUCK_SPAWN_TIME_RANGE.min,
        TRUCK_SPAWN_TIME_RANGE.max,
        3
    );
};

const handleShooting = (gameState: GameState) => {
    if (gameState.player.currentShotCooldown !== 0) return;

    const newShot: ShotState = {
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

const handleShots = (
    gameState: GameState,
    screenSize: Vector2D,
    deltaTime: number
) => {
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

    gameState.shots = gameState.shots.filter(
        (shot) =>
            !gameState.markedForDeletion.shots.has(shot.id) ||
            shot.pos.x < screenSize.x
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
            MOVE_SPEEDS.enemies,
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
            pos: {
                x: screenSize.x,
                y: getHelicopterFlyingHeight(screenSize.y),
            },
            type: "helicopter",
        };
    }

    if (!gameState.enemies.truck) {
        gameState.truckSpawnTimer -= deltaTime;
    }

    if (gameState.truckSpawnTimer <= 0) {
        gameState.enemies.truck = {
            pos: {
                x: screenSize.x,
                y: FLOOR_HEIGHT,
            },
            type: "truck",
        };

        gameState.truckSpawnTimer = getTruckSpawnTimer();
    }
};

export const gameReducer = (
    gameState: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "TICK": {
            const newState = structuredClone(gameState);
            const { deltaTime, screenSize, inputActions } = action.payload;

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handlePlayerPhysics(newState.player, screenSize, stepTime);
                handleShots(newState, screenSize, stepTime);
                handleEnemies(newState, screenSize, stepTime);
            });

            handlePlayerInput(newState, inputActions);

            return newState;
        }
        default:
            return gameState;
    }
};
