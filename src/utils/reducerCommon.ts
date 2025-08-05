import {
    GameOverAction,
    GenericDeleteObjectAction,
    GenericDeleteObjectFn,
    ResetAction,
} from "@/types";
import { Dispatch } from "react";

export const handleGameOver = (
    life: number,
    stop: () => void,
    dispatch: Dispatch<GameOverAction>,
    customCallback?: () => void
) => {
    if (life <= 0) {
        stop();
        dispatch({
            type: "GAME_OVER",
        });
        customCallback?.();
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

export const createDeleteObjectHandler = <
    TState extends object,
    TDeletableKeys extends keyof TState,
    TId extends string | number | bigint = string
>(
    dispatch: Dispatch<GenericDeleteObjectAction<TState, TDeletableKeys, TId>>
): GenericDeleteObjectFn<TState, TDeletableKeys, TId> => {
    return ((objectType: TDeletableKeys, objectId?: TId) => {
        const action = {
            type: "DELETE_OBJECT",
            payload: {
                objectType,
                objectId,
            },
        } as GenericDeleteObjectAction<TState, TDeletableKeys, TId>;

        dispatch(action);
    }) as GenericDeleteObjectFn<TState, TDeletableKeys, TId>;
};
