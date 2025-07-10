import { DINOSAUR, GRAVITY } from "../constants";
import { DinosaurState } from "../types";

export function initiateJump(currentState: DinosaurState): DinosaurState {
    if (currentState.isJumping) {
        return currentState;
    }

    return {
        ...currentState,
        isJumping: true,
        vel: { ...currentState.vel, y: currentState.jumpStrength },
    };
}

export function updateDinosaurState(
    currentState: DinosaurState,
    deltaTime: number
): DinosaurState {
    if (!currentState.isJumping) {
        return currentState;
    }

    const newPosY = currentState.pos.y + currentState.vel.y * deltaTime;
    const newVelY = currentState.vel.y - GRAVITY * deltaTime;

    const floorHeigth = DINOSAUR.initialPos.y;
    if (newPosY <= floorHeigth) {
        return {
            ...currentState,
            pos: { ...currentState.pos, y: floorHeigth },
            vel: { ...currentState.vel, y: 0 },
            isJumping: false,
        };
    }

    return {
        ...currentState,
        pos: { ...currentState.pos, y: newPosY },
        vel: { ...currentState.vel, y: newVelY },
    };
}
