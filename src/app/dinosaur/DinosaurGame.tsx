"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import {
    ALL_SPRITES,
    ASSETS_PATH,
    INITIAL_GAME_STATE,
    INITIAL_INPUT_ACTIONS,
    LOCALSTORAGE_HS_VAR,
} from "./constants";
import Dinosaur from "./Dinosaur";
import Floor from "./Floor";
import useStateMachine from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import Cactus from "./Cactus";
import { useGameContext } from "@/contexts/GameContext";
import { gameReducer } from "./game/reducer";
import useAssetLoader from "@/hooks/useAssetLoader";
import Pterodactyl from "./Pterodactyl";
import { VolatileData } from "./types";
import GameOverlay from "@/components/GameOverlay";
import useSound from "@/hooks/useSound";
import usePrevious from "@/hooks/usePrevious";
import PhysicsToggle from "./PhysicsToggle";
import Loading from "@/components/Loading";
import DisplayError from "@/components/DisplayError";
import { Binding } from "@/types";
import { loadHighScore, setHighScore } from "@/utils/highScore";
import { handleGameOver, handleGameStart } from "@/utils/reducerCommon";

const DinosaurGame = () => {
    const { isLoading, assets, error } = useAssetLoader(ALL_SPRITES);
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const [useRelativePhysics, setUseRelativePhysics] = useState(true);
    const { worldWidth, worldHeight } = useGameContext();
    const inputActionsRef = useRef({ ...INITIAL_INPUT_ACTIONS });

    const playJumpSound = useSound(`${ASSETS_PATH}jump.ogx`);
    const playHitSound = useSound(`${ASSETS_PATH}hit.ogx`);
    const playScoreSound = useSound(`${ASSETS_PATH}score.ogx`);
    const previousScore = usePrevious(gameState.score);
    const previousLife = usePrevious(gameState.dinosaur.life);

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
                        useRelativePhysics,
                    },
                });
            }
        },
        [worldWidth, worldHeight, assets, useRelativePhysics]
    );

    const handlePhysicsToggle = useCallback(() => {
        setUseRelativePhysics(
            (prevUseRelativePhysics) => !prevUseRelativePhysics
        );
    }, []);

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
        handleGameOver(gameState.dinosaur.life, stop, dispatch);
    }, [gameState.dinosaur.life, stop]);

    const handleStart = useCallback(() => {
        handleGameStart(gameState.dinosaur.life, start, dispatch);
    }, [gameState.dinosaur.life, start]);

    const pause = useCallback(() => {
        if (engineState === "RUNNING") togglePause();
    }, [engineState, togglePause]);

    useEffect(() => {
        if (gameState.dinosaur.isJumping === true) {
            playJumpSound();
        }
    }, [gameState.dinosaur.isJumping, playJumpSound]);

    useEffect(() => {
        if (previousLife == null) {
            return;
        }

        if (previousLife > gameState.dinosaur.life) {
            playHitSound();
        }
    }, [gameState.dinosaur.life, previousLife, playHitSound]);

    useEffect(() => {
        if (previousScore == null) {
            return;
        }

        const previousScoreBlock = Math.floor(previousScore / 30);
        const currentScoreBlock = Math.floor(gameState.score / 30);

        if (currentScoreBlock > previousScoreBlock) {
            playScoreSound();
        }
    }, [gameState.score, previousScore, playScoreSound]);

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
    useEventListener("blur", pause);
    useEventListener("contextmenu", pause);

    if (isLoading) return <Loading />;
    if (error) return <DisplayError message={error} />;
    return (
        <>
            {gameState.obstacles.map((obstacle) =>
                obstacle.type === "pterodactyl" ? (
                    <Pterodactyl
                        key={obstacle.id}
                        engineState={engineState}
                        obstacleState={obstacle}
                        onFrameUpdate={updateObstacleFrame}
                        unregister={unregisterObstacle}
                    />
                ) : (
                    <Cactus key={obstacle.id} obstacleState={obstacle} />
                )
            )}
            <Dinosaur
                engineState={engineState}
                speedMultiplier={gameState.gameSpeedMultiplier}
                dinosaurState={gameState.dinosaur}
                onFrameUpdate={updateDinosaurFrame}
            />
            <Floor engineState={engineState} gameState={gameState} />

            <div className="flex justify-around items-center mt-2.5 text-center text-neon-red-500 text-lg md:text-3xl">
                <span className="min-w-28 min-h-12 text-left text-5xl">
                    {"♡".repeat(gameState.dinosaur.life)}
                </span>
                <span>Score: {Math.floor(gameState.score)}</span>
                <span>High score: {Math.floor(gameState.highScore)}</span>
            </div>

            <GameOverlay
                engineState={engineState}
                isGameOver={gameState.dinosaur.life <= 0}
            >
                <GameOverlay.StartScreen
                    startFunction={handleStart}
                    controls={{
                        move: "A/D or ←/→ Keys",
                        duck: "S or ↓ Key",
                        jump: "W, ↑ Key or Spacebar",
                        pause: "Q Key",
                    }}
                >
                    <PhysicsToggle
                        onClick={handlePhysicsToggle}
                        defaultCheckedValue={useRelativePhysics}
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

                    <PhysicsToggle
                        onClick={handlePhysicsToggle}
                        defaultCheckedValue={useRelativePhysics}
                    />
                </GameOverlay.GameOverScreen>
            </GameOverlay>
        </>
    );
};

export default DinosaurGame;
