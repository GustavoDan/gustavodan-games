"use client";

import { MachineState } from "@/hooks/useStateMachine";
import { BaseObjectState } from "@/types";
import { DeleteObjectFn } from "./types";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { useEffect, useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface ExplosionProps {
    explosionState: BaseObjectState;
    engineState: MachineState;
    deleteObject: DeleteObjectFn;
}

const STEPS = 7;

const Explosion = ({
    explosionState,
    engineState,
    deleteObject,
}: ExplosionProps) => {
    const explosionSize = CONSTANT_SIZES.explosion;

    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${explosionSize.width * STEPS}px 0`,
            },
        ],
        [explosionSize.width]
    );

    const options = useMemo(
        () => ({
            duration: 400,
            easing: `steps(${STEPS}, end)`,
            fill: "forwards" as const,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: 1,
    };

    const { elementRef, isFinished } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    useEffect(() => {
        if (isFinished) {
            deleteObject("explosions", explosionState.id);
        }
    }, [isFinished, deleteObject, explosionState.id]);

    return (
        <div
            ref={elementRef}
            style={{
                backgroundImage: `url(${ALL_SPRITES.explosion})`,
                width: explosionSize.width,
                height: explosionSize.height,
                left: explosionState.pos.x,
                bottom: explosionState.pos.y,
            }}
            className="absolute bg-cover"
        />
    );
};
export default Explosion;
