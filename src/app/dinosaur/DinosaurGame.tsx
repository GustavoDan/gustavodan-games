"use client";

import { useCallback, useMemo, useState } from "react";
import { INITIAL_GAME_STATE } from "./constants";
import Dinosaur from "./Dinosaur";
import Floor from "./Floor";
import useGameLoop, { MachineState } from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import { GameState, MovementDirection } from "./types";
import { updateGame } from "./game/main";
import { initiateJump } from "./game/dinosaur";
import { useGameContext } from "@/contexts/GameContext";

type KeyActionMap = {
    [key: string]: () => void;
};

type StateDrivenKeyMap = {
    [key in MachineState]: KeyActionMap;
};

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
            const { newState } = updateGame(gameState, deltaTime);

            setGameState(newState);
        },
        [gameState]
    );

    const { start, togglePause, engineState } = useGameLoop(gameTick);

    const jump = useCallback(() => {
        setGameState((currentGameState) => {
            const newDinosaurState = initiateJump(currentGameState.dinosaur);

            return {
                ...currentGameState,
                dinosaur: newDinosaurState,
            };
        });
    }, []);

    const keyMap = useMemo(
        (): StateDrivenKeyMap => ({
            IDLE: {
                Space: start,
            },
            RUNNING: {
                Space: jump,
                KeyQ: togglePause,
            },
            PAUSED: {
                KeyQ: togglePause,
            },
        }),
        [start, togglePause, jump]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            keyMap[engineState][event.code]?.();
        },
        [engineState, keyMap]
    );

    useEventListener("keydown", handleKeyDown);

    return (
        <>
            <style>
                {`@property --flow-position {
                    syntax: '<percentage>';
                    inherits: false;
                    initial-value: 0%;
                }`}
            </style>
            {engineState}
            <Dinosaur
                engineState={engineState}
                speedMultiplier={parallaxMultiplier}
                position={gameState.dinosaur.pos}
            />
            <Floor
                engineState={engineState}
                speedMultiplier={parallaxMultiplier}
            />
        </>
    );
};

export default DinosaurGame;
