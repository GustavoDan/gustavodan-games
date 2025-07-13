"use client";

import { useCallback, useMemo, useReducer, useRef } from "react";
import { INITIAL_GAME_STATE, INITIAL_INPUT_ACTIONS } from "./constants";
import Dinosaur from "./Dinosaur";
import Floor from "./Floor";
import useStateMachine, { MachineState } from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import { MovementDirection } from "./types";
import { useGameContext } from "@/contexts/GameContext";
import { gameReducer } from "./game/reducer";

type Binding = {
    keys: string[];
    states: MachineState[];
    action: (eventType: KeyboardEvent["type"]) => void;
};

const DinosaurGame = () => {
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const { worldWidth, worldHeight } = useGameContext();
    const inputActionsStateRef = useRef({ ...INITIAL_INPUT_ACTIONS });

    const gameTick = useCallback(
        (deltaTime: number) => {
            dispatch({
                type: "TICK",
                payload: {
                    deltaTime,
                    screenSize: { x: worldWidth, y: worldHeight },
                    inputActions: inputActionsStateRef.current,
                },
            });
        },
        [worldWidth, worldHeight]
    );

    const resetInputs = useCallback(() => {
        inputActionsStateRef.current = { ...INITIAL_INPUT_ACTIONS };
    }, []);

    const { start, togglePause, engineState } = useStateMachine(gameTick, {
        onPause: resetInputs,
        onResume: resetInputs,
    });

    const parallaxMultiplier = useMemo(() => {
        const multipliers: Partial<Record<MovementDirection, number>> = {
            RIGHT: 2.0,
            LEFT: 0.5,
        };

        return multipliers[gameState.dinosaur.moveDirection] ?? 1.0;
    }, [gameState.dinosaur.moveDirection]);

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
                keys: ["Space", "ArrowUp", "KeyW"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsStateRef.current.up = type === "keydown";
                },
            },
            {
                keys: ["ArrowLeft", "KeyA"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsStateRef.current.left = type === "keydown";
                },
            },
            {
                keys: ["ArrowRight", "KeyD"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsStateRef.current.right = type === "keydown";
                },
            },
            {
                keys: ["ArrowDown", "KeyS"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsStateRef.current.down = type === "keydown";
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
        [start, togglePause]
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
        <>
            {engineState}
            <Dinosaur
                engineState={engineState}
                speedMultiplier={parallaxMultiplier}
                dinosaurState={gameState.dinosaur}
            />
            <Floor
                engineState={engineState}
                speedMultiplier={parallaxMultiplier}
            />
        </>
    );
};

export default DinosaurGame;
