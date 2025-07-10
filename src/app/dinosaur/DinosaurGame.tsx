"use client";

import { GameContainer } from "@/components/containers";
import { useCallback, useMemo, useState } from "react";
import { INITIAL_GAME_STATE } from "./constants";
import Dinosaur from "./Dinosaur";
import Floor from "./Floor";
import useGameLoop, { MachineStatus } from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import { GameState } from "./types";
import { updateGame } from "./game/main";
import { initiateJump } from "./game/dinosaur";

interface DinosaurGameProps {
    gameTitle: string;
}

type KeyActionMap = {
    [key: string]: () => void;
};

type StateDrivenKeyMap = {
    [key in MachineStatus]: KeyActionMap;
};

export default function DinosaurGame({ gameTitle }: DinosaurGameProps) {
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

    const gameTick = useCallback(
        (deltaTime: number) => {
            const { newState } = updateGame(gameState, deltaTime);

            setGameState(newState);
        },
        [gameState]
    );

    const { start, togglePause, status } = useGameLoop(gameTick);

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
            keyMap[status][event.code]?.();
        },
        [status, keyMap]
    );

    useEventListener("keydown", handleKeyDown);

    return (
        <GameContainer
            gameTitle={gameTitle}
            className="max-w-7xl"
            childrenClassName="justify-end"
        >
            <style>
                {`@property --flow-position {
                    syntax: '<percentage>';
                    inherits: false;
                    initial-value: 0%;
                }`}
            </style>
            {status}
            <Dinosaur status={status} position={gameState.dinosaur.pos} />
            <Floor status={status} />
        </GameContainer>
    );
}
