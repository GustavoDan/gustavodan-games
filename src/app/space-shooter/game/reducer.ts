import { Vector2D } from "@/types";
import { GameState, PlayerState, ShooterInputAction } from "../types";
import { PLAYER_SIZE } from "../constants";
import { getDirectionOnAxis, moveOnAxis } from "@/utils/movement";

type TickAction = {
    type: "TICK";
    payload: {
        deltaTime: number;
        screenSize: Vector2D;
        inputActions: ShooterInputAction;
    };
};
type InitializePlayerYAction = {
    type: "INITIALIZE_PLAYER_Y";
    payload: {
        playerY: number;
    };
};

type GameAction = TickAction | InitializePlayerYAction;

const handlePlayerInput = (
    playerState: PlayerState,
    input: ShooterInputAction
) => {
    playerState.moveDirection.vertical = getDirectionOnAxis(input, "vertical");
    playerState.moveDirection.horizontal = getDirectionOnAxis(
        input,
        "horizontal"
    );
};

const handlePlayerPhysics = (
    playerState: PlayerState,
    deltaTime: number,
    screenSize: Vector2D
) => {
    const maxPlayerPos = {
        x: screenSize.x / 2 - PLAYER_SIZE.width,
        y: screenSize.y - PLAYER_SIZE.height,
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

export const gameReducer = (
    gameState: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "TICK": {
            const newState = structuredClone(gameState);
            const { deltaTime, screenSize, inputActions } = action.payload;

            const playerState = newState.player;

            handlePlayerInput(playerState, inputActions);

            const subSteps = 4;
            const stepTime = deltaTime / subSteps;
            Array.from({ length: subSteps }).forEach(() => {
                handlePlayerPhysics(playerState, stepTime, screenSize);
            });

            return newState;
        }
        case "INITIALIZE_PLAYER_Y":
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

        default:
            return gameState;
    }
};
