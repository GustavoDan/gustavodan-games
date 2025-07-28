"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
    ALL_SPRITES,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
    CONSTANT_SIZES,
    MAX_PLAYER_LIFE,
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
import Shot from "./Shot";
import { DeleteObjectFn, VolatileData, VolatileDataShotFn } from "./types";
import Enemy from "./Enemy";
import useAssetLoader from "@/hooks/useAssetLoader";
import Loading from "@/components/Loading";
import DisplayError from "@/components/DisplayError";
import HeartContainer from "./HeartContainer";

const SpaceShooter = () => {
    const { isLoading, assets, error } = useAssetLoader(ALL_SPRITES);
    const { worldWidth, worldHeight } = useGameContext();
    const previousWorldHeight = usePrevious(worldHeight);

    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const inputActionsRef = useRef({ ...INITIAL_INPUT_ACTIONS });
    const volatileDataRef = useRef<VolatileData>({
        shot: new Map(),
    });

    const updateShotAnimationData = useCallback<VolatileDataShotFn>(
        (id, getCurrentFrame, isAnimationFinished) => {
            volatileDataRef.current.shot.set(id, {
                getCurrentFrame,
                isAnimationFinished,
            });
        },
        []
    );

    const unregisterShot = useCallback((id: string) => {
        volatileDataRef.current.shot.delete(id);
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
                        volatileData: volatileDataRef.current,
                        assets,
                    },
                });
            }
        },
        [worldWidth, worldHeight, assets]
    );

    const resetInputs = useCallback(() => {
        inputActionsRef.current = { ...INITIAL_INPUT_ACTIONS };
    }, []);

    const { start, togglePause, engineState } = useStateMachine(gameTick, {
        onPause: resetInputs,
        onResume: resetInputs,
        onStop: resetInputs,
    });

    const deleteObject: DeleteObjectFn = useCallback((objectType, objectId) => {
        dispatch({
            type: "DELETE_OBJECT",
            payload: {
                objectType,
                objectId,
            },
        });
    }, []);

    useEffect(() => {
        if (worldHeight <= 0 || previousWorldHeight) return;

        dispatch({
            type: "INITIALIZE_GAME_STATE",
            payload: {
                playerY: (worldHeight - CONSTANT_SIZES.player.height) / 2,
            },
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
                keys: ["Space", "ShiftLeft"],
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

    if (isLoading) return <Loading />;
    if (error) return <DisplayError message={error} />;
    return (
        <div
            style={{ backgroundImage: `url(${ALL_SPRITES.background})` }}
            className="size-full rendering-pixelated"
        >
            {gameState.enemies.map((enemy) => (
                <Enemy
                    key={enemy.id}
                    enemyState={enemy}
                    engineState={engineState}
                    isMarkedForDeletion={gameState.markedForDeletion.enemies.has(
                        enemy.id
                    )}
                    deleteObject={deleteObject}
                />
            ))}

            {gameState.shots.map((shot) => (
                <Shot
                    key={shot.id}
                    shotState={shot}
                    engineState={engineState}
                    onShotAnimationUpdate={updateShotAnimationData}
                    unregister={unregisterShot}
                    isMarkedForDeletion={gameState.markedForDeletion.shots.has(
                        shot.id
                    )}
                    deleteObject={deleteObject}
                />
            ))}

            <Player playerState={gameState.player} />

            <div className="flex justify-between">
                <div className="flex">
                    {Array.from({ length: MAX_PLAYER_LIFE }).map((_, index) => (
                        <HeartContainer
                            key={index}
                            isEmpty={index >= gameState.player.life}
                        />
                    ))}
                </div>

                {gameState.score}
            </div>

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
