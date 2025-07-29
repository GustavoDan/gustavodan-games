import { LoadHighScoreAction } from "@/types";

type Dispatch<A> = (value: A) => void;

export const loadHighScore = (
    itemName: string,
    dispatch: Dispatch<LoadHighScoreAction>
) => {
    const storedHighScore = localStorage.getItem(itemName);
    if (storedHighScore) {
        dispatch({
            type: "LOAD_HIGH_SCORE",
            payload: parseInt(storedHighScore),
        });
    }
};

export const setHighScore = (itemName: string, highScore: string) => {
    localStorage.setItem(itemName, highScore);
};
