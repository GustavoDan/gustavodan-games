"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
    ALL_SPRITES,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
    PLAYER_SIZE,
} from "./constants";
import Player from "./Player";
import { gameReducer } from "./game/reducer";
import { useGameContext } from "@/contexts/GameContext";
import usePrevious from "@/hooks/usePrevious";
import useStateMachine from "@/hooks/useStateMachine";
import { Binding } from "@/types";
import useEventListener from "@/hooks/useEventListener";
import GameOverlay from "@/components/GameOverlay";
import { GameActionButton } from "@/components/buttons";

const SpaceShooter = () => {
    const { worldWidth, worldHeight } = useGameContext();
    const previousWorldHeight = usePrevious(worldHeight);

    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const inputActionsRef = useRef({ ...INITIAL_INPUT_ACTIONS });

    const gameTick = useCallback(
        (deltaTime: number) => {
            dispatch({
                type: "TICK",
                payload: {
                    deltaTime,
                    screenSize: { x: worldWidth, y: worldHeight },
                    inputActions: inputActionsRef.current,
                },
            });
        },
        [worldWidth, worldHeight]
    );

    const resetInputs = useCallback(() => {
        inputActionsRef.current = { ...INITIAL_INPUT_ACTIONS };
    }, []);

    const { start, togglePause, engineState } = useStateMachine(gameTick, {
        onPause: resetInputs,
        onResume: resetInputs,
        onStop: resetInputs,
    });

    useEffect(() => {
        if (worldHeight <= 0 || previousWorldHeight) return;

        dispatch({
            type: "INITIALIZE_PLAYER_Y",
            payload: { playerY: (worldHeight - PLAYER_SIZE.height) / 2 },
        });
    }, [worldHeight, previousWorldHeight]);

    const bindings = useMemo(
        (): Binding[] => [
            {
                keys: ["Space"],
                states: ["IDLE"],
                action: (type) => {
                    if (type === "keydown") start();
                },
            },
            {
                keys: ["ArrowUp", "KeyW"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.up = type === "keydown";
                },
            },
            {
                keys: ["ArrowDown", "KeyS"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.down = type === "keydown";
                },
            },
            {
                keys: ["ArrowLeft", "KeyA"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.left = type === "keydown";
                },
            },
            {
                keys: ["ArrowRight", "KeyD"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.right = type === "keydown";
                },
            },
            {
                keys: ["KeyQ"],
                states: ["RUNNING", "PAUSED"],
                action: (type) => {
                    if (type === "keydown") togglePause();
                },
            },
        ],
        [togglePause, start]
    );

    const handleInput = useCallback(
        (event: KeyboardEvent) => {
            bindings
                .find(
                    ({ keys, states }) =>
                        keys.includes(event.code) &&
                        states.includes(engineState)
                )
                ?.action(event.type);
        },
        [bindings, engineState]
    );

    useEventListener("keydown", handleInput);
    useEventListener("keyup", handleInput);

    return (
        <div
            style={{ backgroundImage: `url(${ALL_SPRITES.background})` }}
            className="size-full"
        >
            <Player playerState={gameState.player} />

            <GameOverlay engineState={engineState} isGameOver={false}>
                <GameOverlay.StartScreen>
                    <div className="flex flex-col gap-2">
                        <GameActionButton onClick={start}>
                            Start Game
                        </GameActionButton>
                        <span className="text-xs md:text-sm">
                            (or Spacebar to Start)
                        </span>
                    </div>
                </GameOverlay.StartScreen>
                <GameOverlay.PauseScreen>
                    <h1 className="text-5xl font-bold">PAUSED</h1>
                    <span>Press Q to resume</span>
                </GameOverlay.PauseScreen>
            </GameOverlay>
        </div>
    );
};

export default SpaceShooter;
