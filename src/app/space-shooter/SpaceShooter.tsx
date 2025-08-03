"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
    ALL_SPRITES,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
    CONSTANT_SIZES,
    MAX_PLAYER_LIFE,
    LOCALSTORAGE_HS_VAR,
} from "./constants";
import Player from "./Player";
import { gameReducer } from "./game/reducer";
import { useGameContext } from "@/contexts/GameContext";
import useStateMachine from "@/hooks/useStateMachine";
import { Binding } from "@/types";
import useEventListener from "@/hooks/useEventListener";
import GameOverlay from "@/components/GameOverlay";
import Shot from "./Shot";
import {
    DeletableObject,
    GameState,
    VolatileData,
    VolatileDataShotFn,
} from "./types";
import Enemy from "./Enemy";
import useAssetLoader from "@/hooks/useAssetLoader";
import Loading from "@/components/Loading";
import DisplayError from "@/components/DisplayError";
import HeartContainer from "./HeartContainer";
import { loadHighScore, setHighScore } from "@/utils/highScore";
import {
    createDeleteObjectHandler,
    handleGameOver,
    handleGameStart,
} from "@/utils/reducerCommon";
import pluralize from "pluralize";

const SpaceShooter = () => {
    const { isLoading, assets, error } = useAssetLoader(ALL_SPRITES);
    const { worldWidth, worldHeight } = useGameContext();

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

    const { start, stop, togglePause, engineState } = useStateMachine(
        gameTick,
        {
            onPause: resetInputs,
            onResume: resetInputs,
            onStop: resetInputs,
        }
    );

    useEffect(() => {
        loadHighScore(LOCALSTORAGE_HS_VAR, dispatch);
    }, []);

    useEffect(() => {
        setHighScore(LOCALSTORAGE_HS_VAR, gameState.highScore.toString());
    }, [gameState.highScore]);

    useEffect(() => {
        handleGameOver(gameState.player.life, stop, dispatch);
    }, [gameState.player.life, stop]);

    const handleStart = useCallback(() => {
        handleGameStart(gameState.player.life, start, dispatch);

        dispatch({
            type: "INITIALIZE_GAME_STATE",
            payload: {
                playerY: (worldHeight - CONSTANT_SIZES.player.height) / 2,
            },
        });
    }, [gameState.player.life, start, worldHeight]);

    const pause = useCallback(() => {
        if (engineState === "RUNNING") togglePause();
    }, [engineState, togglePause]);

    const deleteObject = useMemo(
        () => createDeleteObjectHandler<GameState, DeletableObject>(dispatch),
        [dispatch]
    );

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
    useEventListener("blur", pause);
    useEventListener("contextmenu", pause);

    const shouldRenderGameElements = useMemo(
        () => engineState !== "IDLE" || gameState.player.life === 0,
        [engineState, gameState.player.life]
    );

    if (isLoading) return <Loading />;
    if (error) return <DisplayError message={error} />;
    return (
        <div
            style={{ backgroundImage: `url(${ALL_SPRITES.background})` }}
            className="size-full rendering-pixelated"
        >
            <div className="absolute w-1 h-full left-1/2 opacity-20 bg-blue-200" />

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

            {shouldRenderGameElements && (
                <>
                    <Player playerState={gameState.player} />

                    <div className="relative flex justify-between p-2.5">
                        <div className="flex">
                            {Array.from({ length: MAX_PLAYER_LIFE }).map(
                                (_, index) => (
                                    <HeartContainer
                                        key={index}
                                        isEmpty={index >= gameState.player.life}
                                    />
                                )
                            )}
                        </div>

                        <span className="text-lg md:text-4xl">
                            Score: {gameState.score}
                        </span>
                    </div>
                </>
            )}

            <GameOverlay
                engineState={engineState}
                isGameOver={gameState.player.life <= 0}
            >
                <GameOverlay.StartScreen
                    startFunction={handleStart}
                    controls={{
                        move: "WASD or ↑←↓→ Keys",
                        shoot: "Spacebar or Shift",
                        pause: "Q Key",
                    }}
                    headline="An alien horde is approaching. Defend your planet at all costs!"
                />

                <GameOverlay.PauseScreen />

                <GameOverlay.GameOverScreen restartFunction={handleStart}>
                    <div className="text-xl md:text-2xl flex flex-col gap-2">
                        <span>
                            Awesome! You obliterated{" "}
                            {pluralize("ship", gameState.score, true)}!
                        </span>
                        <span>
                            Your current record is{" "}
                            {pluralize("ship", gameState.highScore, true)}!
                        </span>
                    </div>
                </GameOverlay.GameOverScreen>
            </GameOverlay>
        </div>
    );
};

export default SpaceShooter;
