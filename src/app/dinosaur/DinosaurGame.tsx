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
        const storedHighScore = localStorage.getItem("dino_hs");
        if (storedHighScore) {
            dispatch({
                type: "LOAD_HIGH_SCORE",
                payload: parseInt(storedHighScore),
            });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("dino_hs", gameState.highScore.toString());
    }, [gameState.highScore]);

    useEffect(() => {
        if (gameState.dinosaur.life <= 0) {
            stop();
            dispatch({
                type: "GAME_OVER",
            });
        }
    }, [gameState.dinosaur.life, stop]);

    const handleStart = useCallback(() => {
        if (gameState.dinosaur.life <= 0) {
            dispatch({
                type: "RESET",
            });
        }
        start();
    }, [gameState.dinosaur.life, start]);

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
            <div className="flex justify-around items-center text-3xl mt-2.5 text-neon-red-500">
                <span className="text-5xl min-w-28 min-h-12">
                    {"♡".repeat(gameState.dinosaur.life)}
                </span>
                <span>Score: {Math.floor(gameState.score)}</span>
                <span>High score: {Math.floor(gameState.highScore)}</span>
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
