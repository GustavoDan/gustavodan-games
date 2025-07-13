import {
    DINOSAUR_SIZE,
    FAST_FALL_MULTIPLIER,
    GRAVITY,
    INITIAL_GAME_STATE,
} from "../constants";
import { GameState, DinosaurState, InputAction, Vector2D } from "../types";

type TickAction = {
    type: "TICK";
    payload: {
        deltaTime: number;
        screenSize: Vector2D;
        inputActions: InputAction;
    };
};
type ResetAction = { type: "RESET" };
export type GameAction = TickAction | ResetAction;

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

    const FLOOR_HEIGHT = INITIAL_GAME_STATE.dinosaur.pos.y;
    if (dinosaurState.pos.y <= FLOOR_HEIGHT) {
        dinosaurState.pos.y = FLOOR_HEIGHT;
        dinosaurState.vel.y = 0;
        dinosaurState.isFastFalling = false;
        dinosaurState.isJumping = false;
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

            const dinosaurState = newState.dinosaur;

            handleDinosaurInput(dinosaurState, inputActions);
            handleDinosaurPhysics(dinosaurState, deltaTime, screenSize);

            return newState;
        }
        case "RESET": {
            return INITIAL_GAME_STATE;
        }
        default:
            return gameState;
    }
};
