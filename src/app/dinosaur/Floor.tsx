"use client";

import { cn } from "@/utils/cn";
import { ALL_SPRITES, FLOOR, INITIAL_GAME_STATE } from "./constants";
import { MachineState } from "@/hooks/useStateMachine";
import { useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";
import { GameState } from "./types";

interface FloorProps {
    engineState: MachineState;
    gameState: GameState;
}

const Floor = ({ engineState, gameState }: FloorProps) => {
    const keyframes = useMemo(
        () => [
            { maskPosition: "0 0" },
            { maskPosition: `-${FLOOR.width}px 0` },
        ],
        []
    );

    const options = useMemo(
        () => ({
            duration: (FLOOR.width / INITIAL_GAME_STATE.gameSpeed) * 1000,
            iterations: Infinity,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate:
            (gameState.gameSpeed / INITIAL_GAME_STATE.gameSpeed) *
            gameState.gameSpeedMultiplier,
    };

    const { elementRef } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    return (
        <div
            style={{ height: FLOOR.height }}
            className="absolute bottom-0 z-[-1] w-full overflow-hidden text-gray-400 animate-neon-text-pulse"
        >
            <div
                ref={elementRef}
                style={{
                    maskImage: `url(${ALL_SPRITES.floor})`,
                }}
                className={cn(
                    "size-full pointer-events-none bg-gray-400",
                    "mask-repeat-x"
                )}
            />
        </div>
    );
};

export default Floor;
