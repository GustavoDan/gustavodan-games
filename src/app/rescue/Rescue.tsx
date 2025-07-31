"use client";

import { useGameContext } from "@/contexts/GameContext";
import useEventListener from "@/hooks/useEventListener";
import useStateMachine from "@/hooks/useStateMachine";
import { Binding } from "@/types";
import { useCallback, useMemo, useReducer, useRef } from "react";
import { INITIAL_GAME_STATE, INITIAL_INPUT_ACTIONS } from "./constants";
import { gameReducer } from "./game/reducer";
import Player from "./Player";
import Background from "./Background";
import GameOverlay from "@/components/GameOverlay";
import Shot from "./Shot";
import Enemy from "./Enemy";

const Rescue = () => {
    const { worldWidth, worldHeight } = useGameContext();
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

    const pause = useCallback(() => {
        if (engineState === "RUNNING") togglePause();
    }, [engineState, togglePause]);

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
                keys: ["Space", "ShiftLeft", "ShiftRight"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.shoot = type === "keydown";
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
    useEventListener("blur", pause);
    useEventListener("contextmenu", pause);

    return (
        <Background engineState={engineState}>
            <Enemy
                enemyState={gameState.enemies.truck}
                engineState={engineState}
            />
            <Enemy
                enemyState={gameState.enemies.helicopter}
                engineState={engineState}
            />

            {gameState.shots.map((shot) => (
                <Shot key={shot.id} shotState={shot} />
            ))}

            <Player playerState={gameState.player} engineState={engineState} />

            <GameOverlay engineState={engineState} isGameOver={false}>
                <GameOverlay.StartScreen
                    startFunction={start}
                    controls={{ temp: "temp" }}
                />

                <GameOverlay.PauseScreen />

                <GameOverlay.GameOverScreen restartFunction={start} />
            </GameOverlay>
        </Background>
    );
};
export default Rescue;
