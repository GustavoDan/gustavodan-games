import { GameState } from "../types";
import { updateDinosaurState } from "./dinosaur";

export function updateGame(
    currentState: GameState,
    deltaTime: number
): { newState: GameState } {
    const newDinosaurState = updateDinosaurState(
        currentState.dinosaur,
        deltaTime
    );

    return {
        newState: {
            ...currentState,
            dinosaur: newDinosaurState,
        },
    };
}
