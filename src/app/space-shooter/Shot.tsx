"use client";

import { useEffect, useMemo } from "react";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { ShotState, VolatileDataShotFn } from "./types";
import { MachineState } from "@/hooks/useStateMachine";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface ShotProps {
    shotState: ShotState;
    engineState: MachineState;
    onShotAnimationUpdate: VolatileDataShotFn;
    unregister: (id: string) => void;
}

const STEPS = 5;

const Shot = ({
    shotState,
    engineState,
    onShotAnimationUpdate,
    unregister,
}: ShotProps) => {
    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            { backgroundPosition: `-${CONSTANT_SIZES.shot.width * STEPS}px 0` },
        ],
        []
    );

    const options = useMemo(
        () => ({
            duration: 200,
            easing: `steps(${STEPS}, start)`,
            fill: "forwards" as const,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: 1,
    };

    const { elementRef, getCurrentFrame, isFinished } =
        useControllableAnimation(keyframes, options, animationControls);

    useEffect(() => {
        onShotAnimationUpdate(shotState.id, getCurrentFrame, isFinished);

        return () => {
            unregister(shotState.id);
        };
    }, [isFinished, onShotAnimationUpdate, shotState.id, unregister]);

    return (
        <div
            ref={elementRef}
            style={{
                backgroundImage: `url(${ALL_SPRITES.shot})`,
                backgroundSize: `${
                    CONSTANT_SIZES.shot.width * (STEPS + 1)
                }px 100%`,
                width: CONSTANT_SIZES.shot.width,
                height: CONSTANT_SIZES.shot.height,
                left: shotState.pos.x,
                bottom: shotState.pos.y,
            }}
            className="absolute text-purple-700 animate-neon-text-pulse"
        />
    );
};
export default Shot;
