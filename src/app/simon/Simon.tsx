"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import {
    INITIAL_GAME_STATE,
    LOCALSTORAGE_HS_VAR,
    SIMON_COLORS,
} from "./constants";
import { gameReducer } from "./game/reducer";
import { SimonColor } from "./types";
import SimonButton from "./SimonButton";
import SimonLogo from "./SimonLogo";
import useStateMachine from "@/hooks/useStateMachine";
import useEventListener from "@/hooks/useEventListener";
import GameOverlay from "@/components/GameOverlay";
import { loadHighScore, setHighScore } from "@/utils/highScore";
import { Binding } from "@/types";
import { cn } from "@/utils/cn";

const COLOR_POSITIONS: Record<
    SimonColor,
    "top-left" | "top-right" | "bottom-left" | "bottom-right"
> = {
    green: "top-left",
    red: "top-right",
    yellow: "bottom-left",
    blue: "bottom-right",
};

const Simon = () => {
    const [gameState, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);
    const pendingColorRef = useRef<SimonColor | null>(null);

    const gameTick = useCallback((deltaTime: number) => {
        dispatch({
            type: "TICK",
            payload: {
                deltaTime,
                inputActions: { pressedColor: pendingColorRef.current },
            },
        });
        pendingColorRef.current = null;
    }, []);

    const { start, stop, engineState } = useStateMachine(gameTick);

    useEffect(() => {
        loadHighScore(LOCALSTORAGE_HS_VAR, dispatch);
    }, []);

    useEffect(() => {
        setHighScore(LOCALSTORAGE_HS_VAR, gameState.highScore.toString());
    }, [gameState.highScore]);

    useEffect(() => {
        if (gameState.phase === "GAME_OVER" && engineState === "RUNNING") {
            stop();
        }
    }, [gameState.phase, engineState, stop]);

    const handleStart = useCallback(() => {
        if (gameState.phase === "GAME_OVER" || gameState.phase === "IDLE") {
            dispatch({ type: "START_GAME" });
            start();
        }
    }, [gameState.phase, start]);

    const handleColorClick = useCallback(
        (color: SimonColor) => {
            if (
                gameState.phase === "WAITING_INPUT" &&
                engineState === "RUNNING"
            ) {
                dispatch({ type: "PLAYER_INPUT", payload: color });
            }
        },
        [gameState.phase, engineState]
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
                keys: ["KeyQ", "Digit1"],
                states: ["RUNNING"],
                action: (type) => {
                    if (type === "keydown") handleColorClick("green");
                },
            },
            {
                keys: ["KeyW", "Digit2"],
                states: ["RUNNING"],
                action: (type) => {
                    if (type === "keydown") handleColorClick("red");
                },
            },
            {
                keys: ["KeyA", "Digit3"],
                states: ["RUNNING"],
                action: (type) => {
                    if (type === "keydown") handleColorClick("yellow");
                },
            },
            {
                keys: ["KeyS", "Digit4"],
                states: ["RUNNING"],
                action: (type) => {
                    if (type === "keydown") handleColorClick("blue");
                },
            },
        ],
        [handleStart, handleColorClick]
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

    const isColorActive = useCallback(
        (color: SimonColor) => {
            if (gameState.phase === "SHOWING_SEQUENCE") {
                return gameState.activeColor === color;
            }
            if (
                gameState.phase === "PLAYER_FLASH" ||
                gameState.phase === "GAME_OVER"
            ) {
                return gameState.flashColor === color;
            }
            return false;
        },
        [gameState.phase, gameState.activeColor, gameState.flashColor]
    );

    const isInputDisabled = useMemo(() => {
        return gameState.phase !== "WAITING_INPUT" || engineState !== "RUNNING";
    }, [gameState.phase, engineState]);

    const shouldRenderGameElements = useMemo(
        () => engineState !== "IDLE" || gameState.phase === "GAME_OVER",
        [engineState, gameState.phase]
    );

    const getStatusText = () => {
        switch (gameState.phase) {
            case "SHOWING_SEQUENCE":
                return "Watch the sequence...";
            case "WAITING_INPUT":
                return "Your turn!";
            case "PAUSE_AFTER_SHOW":
                return "Get ready...";
            case "PLAYER_FLASH":
                return "Your turn!";
            default:
                return "";
        }
    };

    return (
        <>
            <div
                className={cn(
                    "flex flex-col items-center gap-2 sm-h:gap-0.5",
                    !shouldRenderGameElements && "invisible"
                )}
            >
                <span className="text-2xl md:text-3xl font-bold sm-h:text-lg">
                    Level: {gameState.sequence.length}
                </span>
                <span className="text-lg md:text-xl text-main/70 h-7 sm-h:text-sm">
                    {getStatusText()}
                </span>
            </div>
            <div className="relative w-full max-w-md aspect-square sm-h:w-7/12">
                <div className="grid grid-cols-2 gap-3 w-full h-full sm-h:gap-2">
                    {SIMON_COLORS.map((color) => (
                        <SimonButton
                            key={color}
                            color={color}
                            isActive={isColorActive(color)}
                            isDisabled={isInputDisabled}
                            onClick={() => handleColorClick(color)}
                            position={COLOR_POSITIONS[color]}
                        />
                    ))}
                </div>

                <SimonLogo />
            </div>

            <div
                className={cn(
                    "text-center",
                    !shouldRenderGameElements && "invisible"
                )}
            >
                <span className="text-lg md:text-xl sm-h:text-base">
                    The highest level you&apos;ve completed:{" "}
                    {gameState.highScore}
                </span>
            </div>

            <GameOverlay
                engineState={engineState}
                isGameOver={gameState.phase === "GAME_OVER"}
            >
                <GameOverlay.StartScreen
                    startFunction={handleStart}
                    controls={{
                        "green (↖)": "Q or 1",
                        "red (↗)": "W or 2",
                        "yellow (↙)": "A or 3",
                        "blue (↘)": "S or 4",
                    }}
                    headline="Memorize and repeat the color sequence!"
                />

                <GameOverlay.GameOverScreen restartFunction={handleStart}>
                    <div className="text-xl md:text-2xl flex flex-col gap-2">
                        <span>
                            You reached level{" "}
                            <span className="font-bold">
                                {gameState.sequence.length}
                            </span>
                            !
                        </span>
                        <span>
                            The highest level you&apos;ve completed:{" "}
                            <span className="font-bold">
                                {gameState.highScore}
                            </span>
                        </span>
                    </div>
                </GameOverlay.GameOverScreen>
            </GameOverlay>
        </>
    );
};

export default Simon;
