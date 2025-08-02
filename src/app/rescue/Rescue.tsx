"use client";

import { useGameContext } from "@/contexts/GameContext";
import useEventListener from "@/hooks/useEventListener";
import useStateMachine from "@/hooks/useStateMachine";
import { Binding } from "@/types";
import { useCallback, useMemo, useReducer, useRef } from "react";
import {
    ALL_SPRITES,
    CONSTANT_SIZES,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
} from "./constants";
import { gameReducer } from "./game/reducer";
import Player from "./Player";
import Background from "./Background";
import GameOverlay from "@/components/GameOverlay";
import Shot from "./Shot";
import Enemy from "./Enemy";
import { handleGameStart } from "@/utils/reducerCommon";
import useAssetLoader from "@/hooks/useAssetLoader";
import Loading from "@/components/Loading";
import DisplayError from "@/components/DisplayError";
import { DeleteAllyFn, VolatileData, VolatileDataFn } from "./types";
import Ally from "./Ally";

const Rescue = () => {
    const { isLoading, assets, error } = useAssetLoader(ALL_SPRITES);
    const { worldWidth, worldHeight } = useGameContext();
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const inputActionsRef = useRef({ ...INITIAL_INPUT_ACTIONS });
    const volatileDataRef = useRef<VolatileData>({});

    const updateEnemyAnimationData = useCallback<VolatileDataFn>(
        (getCurrentFrame) => {
            volatileDataRef.current.enemyAnimationFrame = getCurrentFrame;
        },
        []
    );

    const updatePlayerAnimationData = useCallback<VolatileDataFn>(
        (getCurrentFrame) => {
            volatileDataRef.current.playerAnimationFrame = getCurrentFrame;
        },
        []
    );

    const updateAllyAnimationData = useCallback<VolatileDataFn>(
        (getCurrentFrame) => {
            volatileDataRef.current.allyAnimationFrame = getCurrentFrame;
        },
        []
    );

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

    const { start, togglePause, engineState } = useStateMachine(gameTick, {
        onPause: resetInputs,
        onResume: resetInputs,
        onStop: resetInputs,
    });

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

    const deleteAlly: DeleteAllyFn = useCallback(() => {
        dispatch({
            type: "DELETE_ALLY",
        });
    }, []);

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
        <Background engineState={engineState}>
            {Object.values(gameState.enemies).map(
                (enemy) =>
                    enemy && (
                        <Enemy
                            key={enemy.id}
                            enemyState={enemy}
                            engineState={engineState}
                            onFrameUpdate={updateEnemyAnimationData}
                        />
                    )
            )}

            {gameState.ally && (
                <Ally
                    key={gameState.ally.id}
                    allyState={gameState.ally}
                    engineState={engineState}
                    isMarkedForDeletion={gameState.markedForDeletion.ally}
                    onFrameUpdate={updateAllyAnimationData}
                    deleteAlly={deleteAlly}
                />
            )}

            {gameState.shots.map((shot) => (
                <Shot key={shot.id} shotState={shot} />
            ))}

            {shouldRenderGameElements && (
                <Player
                    playerState={gameState.player}
                    engineState={engineState}
                    onFrameUpdate={updatePlayerAnimationData}
                />
            )}

            <GameOverlay engineState={engineState} isGameOver={false}>
                <GameOverlay.StartScreen
                    startFunction={handleStart}
                    controls={{ temp: "temp" }}
                />

                <GameOverlay.PauseScreen />

                <GameOverlay.GameOverScreen restartFunction={handleStart} />
            </GameOverlay>
        </Background>
    );
};
export default Rescue;
