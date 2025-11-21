"use client";

import { useGameContext } from "@/contexts/GameContext";
import useEventListener from "@/hooks/useEventListener";
import useStateMachine from "@/hooks/useStateMachine";
import { Binding } from "@/types";
import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import {
    ALL_SOUNDS,
    ALL_SPRITES,
    CONSTANT_SIZES,
    GAME_NAME,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
    LOCALSTORAGE_HS_VAR,
    MUSIC,
    SOUNDS,
} from "./constants";
import { gameReducer } from "./game/reducer";
import Player from "./Player";
import Background from "./Background";
import GameOverlay from "@/components/GameOverlay";
import Shot from "./Shot";
import Enemy from "./Enemy";
import {
    createDeleteObjectHandler,
    handleGameOver,
    handleGameStart,
} from "@/utils/reducerCommon";
import useAssetLoader from "@/hooks/useAssetLoader";
import Loading from "@/components/Loading";
import DisplayError from "@/components/DisplayError";
import {
    DeletableObject,
    GameState,
    VolatileData,
    VolatileDataFn,
} from "./types";
import Ally from "./Ally";
import Explosion from "./Explosion";
import Hud from "./Hud";
import VolumeControls from "./VolumeControls";
import { loadHighScore, setHighScore } from "@/utils/highScore";
import { loadVolumeSettings, saveVolumeSettings } from "@/utils/volume";
import useSound from "@/hooks/useSound";

const Rescue = () => {
    const { isLoading, assets, error } = useAssetLoader(ALL_SPRITES);
    const { worldWidth, worldHeight } = useGameContext();
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const inputActionsRef = useRef({ ...INITIAL_INPUT_ACTIONS });
    const volatileDataRef = useRef<VolatileData>({});
    const sounds = useSound(ALL_SOUNDS);
    const [isSoundEnabled, setIsSoundEnabled] = useState(
        () => loadVolumeSettings(GAME_NAME).sound
    );
    const [isMusicEnabled, setIsMusicEnabled] = useState(
        () => loadVolumeSettings(GAME_NAME).music
    );

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
        saveVolumeSettings(GAME_NAME, {
            sound: isSoundEnabled,
            music: isMusicEnabled,
        });
    }, [isSoundEnabled, isMusicEnabled]);

    useEffect(() => {
        handleGameOver(gameState.player.life, stop, dispatch, () => {
            sounds.backgroundMusic.stop();
            sounds.gameOverMusic.playLoop();
        });
    }, [
        gameState.player.life,
        stop,
        sounds.backgroundMusic.stop,
        sounds.gameOverMusic.playLoop,
        sounds.backgroundMusic,
        sounds.gameOverMusic,
    ]);

    const handleStart = useCallback(() => {
        handleGameStart(gameState.player.life, start, dispatch);

        dispatch({
            type: "INITIALIZE_GAME_STATE",
            payload: {
                playerY: (worldHeight - CONSTANT_SIZES.player.height) / 2,
            },
        });

        sounds.gameOverMusic.stop();
        sounds.backgroundMusic.playLoop();
    }, [
        gameState.player.life,
        start,
        worldHeight,
        sounds.backgroundMusic,
        sounds.gameOverMusic,
    ]);

    const handlePause = useCallback(() => {
        togglePause();
        sounds.backgroundMusic.togglePause();
    }, [togglePause, sounds.backgroundMusic]);

    const pause = useCallback(() => {
        if (engineState === "RUNNING") handlePause();
    }, [engineState, handlePause]);

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
                    if (type === "keydown") handlePause();
                },
            },
        ],
        [handlePause, handleStart]
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

    useEffect(() => {
        Object.keys(SOUNDS).forEach((soundKey) => {
            sounds[soundKey as keyof typeof SOUNDS].setMuted(!isSoundEnabled);
        });
    }, [isSoundEnabled, sounds]);

    useEffect(() => {
        Object.keys(MUSIC).forEach((musicKey) => {
            sounds[musicKey as keyof typeof MUSIC].setMuted(!isMusicEnabled);
        });
    }, [isMusicEnabled, sounds]);

    useEffect(() => {
        if (isSoundEnabled) {
            gameState.soundEvents.forEach((event) => {
                sounds[event].play();
            });
        }

        if (gameState.soundEvents.length > 0) {
            dispatch({ type: "CLEAR_SOUND_EVENTS" });
        }
    }, [gameState.soundEvents, sounds, isSoundEnabled]);

    const shouldRenderGameElements = useMemo(
        () => engineState !== "IDLE" || gameState.player.life === 0,
        [engineState, gameState.player.life]
    );

    if (isLoading) return <Loading />;
    if (error) return <DisplayError message={error} />;
    return (
        <Background engineState={engineState} score={gameState.score}>
            {Object.values(gameState.enemies).map((enemy) => {
                if (enemy) {
                    return (
                        <Enemy
                            key={enemy.id}
                            enemyState={enemy}
                            engineState={engineState}
                            onFrameUpdate={updateEnemyAnimationData}
                        />
                    );
                }
            })}

            {gameState.explosions.map((explosion) => (
                <Explosion
                    key={explosion.id}
                    explosionState={explosion}
                    engineState={engineState}
                    deleteObject={deleteObject}
                />
            ))}

            {gameState.ally && (
                <Ally
                    key={gameState.ally.id}
                    allyState={gameState.ally}
                    engineState={engineState}
                    isMarkedForDeletion={gameState.markedForDeletion.ally}
                    onFrameUpdate={updateAllyAnimationData}
                    deleteObject={deleteObject}
                />
            )}

            {gameState.shots.map((shot) => (
                <Shot key={shot.id} shotState={shot} />
            ))}

            {shouldRenderGameElements && (
                <>
                    <Player
                        key="player"
                        playerState={gameState.player}
                        engineState={engineState}
                        onFrameUpdate={updatePlayerAnimationData}
                    />

                    <Hud
                        key="hud"
                        playerLife={gameState.player.life}
                        score={gameState.score}
                        highScore={gameState.highScore}
                        isSoundEnabled={isSoundEnabled}
                        isMusicEnabled={isMusicEnabled}
                        onSoundToggle={setIsSoundEnabled}
                        onMusicToggle={setIsMusicEnabled}
                    />
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
                    headline="Achieve the highest combat score by protecting our operatives and eliminating hostile threats."
                >
                    <VolumeControls
                        absolute
                        isSoundEnabled={isSoundEnabled}
                        isMusicEnabled={isMusicEnabled}
                        onSoundToggle={setIsSoundEnabled}
                        onMusicToggle={setIsMusicEnabled}
                    />
                </GameOverlay.StartScreen>

                <GameOverlay.PauseScreen />

                <GameOverlay.GameOverScreen restartFunction={handleStart}>
                    <div className="text-xl md:text-2xl flex flex-col gap-2">
                        <span>
                            Score: <span>{Math.floor(gameState.score)}</span>
                        </span>
                        <span>
                            High Score:{" "}
                            <span>{Math.floor(gameState.highScore)}</span>
                        </span>
                    </div>
                </GameOverlay.GameOverScreen>
            </GameOverlay>
        </Background>
    );
};
export default Rescue;
