"use client";

import { useCallback, useMemo, useState } from "react";
import { INITIAL_GAME_STATE } from "./constants";
import Dinosaur from "./Dinosaur";
import Floor from "./Floor";
import useGameLoop, { MachineState } from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import {
    GameState,
    MovementDirection,
    MovementDirectionNoIdle,
    MovementFunction,
    MovementType,
} from "./types";
import { updateGame } from "./game/main";
import { initiateJump, handleMove, handleDucking } from "./game/dinosaur";
import { useGameContext } from "@/contexts/GameContext";

type MovementAction = "MOVE" | "JUMP" | "DUCK";
type KeyActionMap = {
    [key: string]: () => void;
};
type TypeDrivenKeyMap<T extends string, V> = {
    [key in T]: V;
};
type StateDrivenKeyMap = TypeDrivenKeyMap<MachineState, KeyActionMap>;

const DinosaurGame = () => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
    const { worldWidth, worldHeight } = useGameContext();

    const parallaxMultiplier = useMemo(() => {
        const multipliers: Partial<Record<MovementDirection, number>> = {
            RIGHT: 2.0,
            LEFT: 0.5,
        };

        return multipliers[gameState.dinosaur.moveDirection] ?? 1.0;
    }, [gameState.dinosaur.moveDirection]);

    const gameTick = useCallback(
        (deltaTime: number) => {
            setGameState((currentGameState) => {
                const { newState } = updateGame(currentGameState, deltaTime, {
                    x: worldWidth,
                    y: worldHeight,
                });

                return newState;
            });
        },
        [worldWidth, worldHeight]
    );

    const { start, togglePause, engineState } = useGameLoop(gameTick);

    const jump = useCallback(() => {
        handleDinosaurMovement("JUMP");
    }, []);

    const startDuck = useCallback(() => {
        handleDinosaurMovement("DUCK", "START");
    }, []);

    const moveLeft = useCallback(() => {
        handleDinosaurMovement("MOVE", "START", "LEFT");
    }, []);

    const moveRight = useCallback(() => {
        handleDinosaurMovement("MOVE", "START", "RIGHT");
    }, []);

    const stopDuck = useCallback(() => {
        handleDinosaurMovement("DUCK", "STOP");
    }, []);

    const stopLeft = useCallback(() => {
        handleDinosaurMovement("MOVE", "STOP", "LEFT");
    }, []);

    const stopRight = useCallback(() => {
        handleDinosaurMovement("MOVE", "STOP", "RIGHT");
    }, []);

    const movementFunctions = useMemo(
        (): TypeDrivenKeyMap<MovementAction, MovementFunction> => ({
            MOVE: handleMove,
            JUMP: initiateJump,
            DUCK: handleDucking,
        }),
        [handleMove, initiateJump]
    );

    const handleDinosaurMovement = useCallback(
        (
            movementAction: MovementAction,
            movementType?: MovementType,
            direction?: MovementDirectionNoIdle
        ) => {
            const movementFunction = movementFunctions[movementAction];

            setGameState((currentGameState) => ({
                ...currentGameState,
                dinosaur: movementFunction(
                    currentGameState.dinosaur,
                    movementType,
                    direction
                ),
            }));
        },
        []
    );

    const keyDownMap = useMemo(
        (): StateDrivenKeyMap => ({
            IDLE: {
                Space: start,
            },
            RUNNING: {
                Space: jump,
                ArrowUp: jump,
                KeyW: jump,
                ArrowLeft: moveLeft,
                KeyA: moveLeft,
                ArrowRight: moveRight,
                KeyD: moveRight,
                ArrowDown: startDuck,
                KeyS: startDuck,
                KeyQ: togglePause,
            },
            PAUSED: {
                KeyQ: togglePause,
            },
        }),
        [jump, moveLeft, moveRight, startDuck, start, togglePause]
    );

    const keyUpMap = useMemo(
        (): Partial<StateDrivenKeyMap> => ({
            RUNNING: {
                ArrowLeft: stopLeft,
                KeyA: stopLeft,
                ArrowRight: stopRight,
                KeyD: stopRight,
                ArrowDown: stopDuck,
                KeyS: stopDuck,
            },
        }),
        [stopLeft, stopRight, stopDuck]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            keyDownMap[engineState][event.code]?.();
        },
        [engineState, keyDownMap]
    );

    const handleKeyUp = useCallback(
        (event: KeyboardEvent) => {
            keyUpMap[engineState]?.[event.code]?.();
        },
        [gameState, keyUpMap]
    );

    useEventListener("keydown", handleKeyDown);
    useEventListener("keyup", handleKeyUp);

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
