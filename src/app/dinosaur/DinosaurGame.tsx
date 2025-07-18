"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
    ALL_SPRITES,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
} from "./constants";
import Dinosaur from "./Dinosaur";
import Floor from "./Floor";
import useStateMachine, { MachineState } from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import Cactus from "./Cactus";
import { useGameContext } from "@/contexts/GameContext";
import { gameReducer } from "./game/reducer";
import useAssetLoader from "@/hooks/useAssetLoader";
import Pterodactyl from "./Pterodactyl";
import { VolatileData } from "./types";

type Binding = {
    keys: string[];
    states: MachineState[];
    action: (eventType: KeyboardEvent["type"]) => void;
};

const DinosaurGame = () => {
    const { isLoading, assets, error } = useAssetLoader(ALL_SPRITES);
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const { worldWidth, worldHeight } = useGameContext();
    const inputActionsRef = useRef({ ...INITIAL_INPUT_ACTIONS });

    const volatileDataRef = useRef<VolatileData>({
        getDinosaurFrame: null,
        getObstaclesFrame: new Map(),
    });

    const updateDinosaurFrame = useCallback((getFrame: () => number | null) => {
        volatileDataRef.current.getDinosaurFrame = getFrame;
    }, []);

    const updateObstacleFrame = useCallback(
        (id: string, getFrame: () => number | null) => {
            volatileDataRef.current.getObstaclesFrame.set(id, getFrame);
        },
        []
    );

    const unregisterObstacle = useCallback((id: string) => {
        volatileDataRef.current.getObstaclesFrame.delete(id);
    }, []);

    const gameTick = useCallback(
        (deltaTime: number) => {
            if (assets) {
                dispatch({
                    type: "TICK",
                    payload: {
                        deltaTime,
                        screenSize: { x: worldWidth, y: worldHeight },
                        inputActions: inputActionsRef.current,
                        assets,
                        volatileData: volatileDataRef.current,
                    },
                });
            }
        },
        [worldWidth, worldHeight, assets]
    );

    const resetInputs = useCallback(() => {
        inputActionsRef.current = { ...INITIAL_INPUT_ACTIONS };
    }, []);

    const { start, stop, togglePause, engineState } = useStateMachine(
        gameTick,
        {
            onPause: resetInputs,
            onResume: resetInputs,
            onStop: resetInputs,
        }
    );

    useEffect(() => {
        if (gameState.dinosaur.life <= 0) stop();
    });

    const handleStart = useCallback(() => {
        if (gameState.dinosaur.life <= 0) {
            dispatch({
                type: "RESET",
            });
        }
        start();
    }, [gameState, start]);

    const bindings = useMemo(
        (): Binding[] => [
            {
                keys: ["Space"],
                states: ["IDLE"],
                action: (type) => {
                    if (type === "keydown") handleStart();
                },
            },
            {
                keys: ["Space", "ArrowUp", "KeyW"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.up = type === "keydown";
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
                keys: ["ArrowDown", "KeyS"],
                states: ["RUNNING"],
                action: (type) => {
                    inputActionsRef.current.down = type === "keydown";
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
        [togglePause, handleStart]
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <>
            <div className="flex gap-5 absolute bottom-[400px]">
                <span>TEMPORARY: {"{"}</span>
                <span>ENGINE: {engineState}</span>
                <span>LIFES: {gameState.dinosaur.life}</span>
                <span>Press Space to start/restart the game</span>
                <span>The controls are WASD/Arrows/Space/Q{"}"}</span>
            </div>
            {gameState.obstacles.map((obstacle, index) =>
                obstacle.type === "pterodactyl" ? (
                    <Pterodactyl
                        key={index}
                        engineState={engineState}
                        obstacleState={obstacle}
                        onFrameUpdate={updateObstacleFrame}
                        unregister={unregisterObstacle}
                    />
                ) : (
                    <Cactus
                        key={index}
                        engineState={engineState}
                        obstacleState={obstacle}
                    />
                )
            )}
            <Dinosaur
                engineState={engineState}
                speedMultiplier={gameState.gameSpeedMultiplier}
                dinosaurState={gameState.dinosaur}
                onFrameUpdate={updateDinosaurFrame}
            />
            <Floor engineState={engineState} gameState={gameState} />
        </>
    );
};

export default DinosaurGame;
