import { GameState, Vector2D } from "../types";
import { updateDinosaurState } from "./dinosaur";

export const updateGame = (
    currentState: GameState,
    deltaTime: number,
    screenSize: Vector2D
): { newState: GameState } => {
    const newDinosaurState = updateDinosaurState(
        currentState.dinosaur,
        deltaTime,
        screenSize
    );
    return {
        newState: {
            ...currentState,
            dinosaur: newDinosaurState,
        },
    };
};
