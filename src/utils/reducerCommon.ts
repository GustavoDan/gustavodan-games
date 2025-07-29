import { GameOverAction, ResetAction } from "@/types";
import { Dispatch } from "react";

export const handleGameOver = (
    life: number,
    stop: () => void,
    dispatch: Dispatch<GameOverAction>
) => {
    if (life <= 0) {
        stop();
        dispatch({
            type: "GAME_OVER",
        });
    }
};

export const handleGameStart = (
    life: number,
    start: () => void,
    dispatch: Dispatch<ResetAction>
) => {
    if (life <= 0) {
        dispatch({
            type: "RESET",
        });
    }
    start();
};
