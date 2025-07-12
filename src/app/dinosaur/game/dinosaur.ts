import {
    DINOSAUR_SIZE,
    FAST_FALL_MULTIPLIER,
    GRAVITY,
    INITIAL_GAME_STATE,
} from "../constants";
import { DinosaurState, MovementFunction, Vector2D } from "../types";

export const initiateJump = (currentState: DinosaurState): DinosaurState => {
    if (currentState.isJumping || currentState.isDucking) {
        return currentState;
    }

    return {
        ...currentState,
        isJumping: true,
        vel: { ...currentState.vel, y: currentState.jumpStrength },
    };
};

export const handleMove: MovementFunction = (currentState, type, direction) => {
    if (!direction || !type) throw new Error("Missing type or direction!");

    if (type === "START") {
        return {
            ...currentState,
            moveDirection: direction,
        };
    }

    if (currentState.moveDirection === direction) {
        return {
            ...currentState,
            moveDirection: "IDLE",
        };
    }
    return currentState;
};

export const handleDucking: MovementFunction = (currentState, type) => {
    if (type !== "START") {
        return { ...currentState, isDucking: false, isFastFalling: false };
    }

    if (currentState.isJumping) {
        return currentState.isFastFalling
            ? currentState
            : { ...currentState, isFastFalling: true };
    }

    return currentState.isDucking
        ? currentState
        : { ...currentState, isDucking: true };
};

export const updateDinosaurState = (
    currentState: DinosaurState,
    deltaTime: number,
    screenSize: Vector2D
): DinosaurState => {
    let newState = structuredClone(currentState);

    if (newState.moveDirection === "LEFT") {
        newState.pos.x -= newState.moveSpeed * deltaTime;
    } else if (newState.moveDirection === "RIGHT") {
        newState.pos.x += newState.moveSpeed * deltaTime;
    }

    if (newState.pos.x < 0) {
        newState.pos.x = 0;
    }

    const dinosaurSprite = newState.isDucking ? "duck" : "run";
    const screenWidth = screenSize.x - DINOSAUR_SIZE[dinosaurSprite].width;
    if (newState.pos.x > screenWidth) {
        newState.pos.x = screenWidth;
    }

    if (!newState.isJumping) {
        return newState;
    }

    let totalGravity = GRAVITY;
    if (newState.isFastFalling) {
        totalGravity *= FAST_FALL_MULTIPLIER;
    }

    newState.pos.y += newState.vel.y * deltaTime;
    newState.vel.y -= totalGravity * deltaTime;

    const floorHeigth = INITIAL_GAME_STATE.dinosaur.pos.y;
    if (newState.pos.y <= floorHeigth) {
        newState.pos.y = floorHeigth;
        newState.vel.y = 0;
        newState.isFastFalling = false;
        newState.isJumping = false;
    }

    return newState;
};
