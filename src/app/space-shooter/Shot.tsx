"use client";

import { useCallback, useEffect, useMemo } from "react";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { DeleteObjectFn, VolatileDataShotFn } from "./types";
import { MachineState } from "@/hooks/useStateMachine";
import useControllableAnimation from "@/hooks/useControllableAnimation";
import { BaseObjectState } from "@/types";

interface ShotProps {
    shotState: BaseObjectState;
    engineState: MachineState;
    onShotAnimationUpdate: VolatileDataShotFn;
    unregister: (id: string) => void;
    isMarkedForDeletion: boolean;
    deleteObject: DeleteObjectFn;
}

const DEFAULT_STEPS = 5;
const MARKED_STEPS = 7;

const Shot = ({
    shotState,
    engineState,
    onShotAnimationUpdate,
    unregister,
    isMarkedForDeletion,
    deleteObject,
}: ShotProps) => {
    const shotSize = CONSTANT_SIZES.shot;

    const steps = useMemo(() => {
        return isMarkedForDeletion ? MARKED_STEPS : DEFAULT_STEPS;
    }, [isMarkedForDeletion]);

    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${shotSize.width * steps}px 0`,
            },
        ],
        [shotSize.width, steps]
    );

    const options = useMemo(
        () => ({
            duration: isMarkedForDeletion ? 300 : 200,
            easing: `steps(${steps}, end)`,
            fill: "forwards" as const,
        }),
        [steps, isMarkedForDeletion]
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: 1,
    };

    const handleAnimationFinish = useCallback(() => {
        if (isMarkedForDeletion) {
            deleteObject("shots", shotState.id);
        }
    }, [isMarkedForDeletion, deleteObject, shotState.id]);

    const { elementRef, getCurrentFrame, isFinished } =
        useControllableAnimation(
            keyframes,
            options,
            animationControls,
            handleAnimationFinish
        );

    useEffect(() => {
        onShotAnimationUpdate(shotState.id, getCurrentFrame, isFinished);

        return () => {
            unregister(shotState.id);
        };
    }, [
        isFinished,
        onShotAnimationUpdate,
        shotState.id,
        getCurrentFrame,
        unregister,
    ]);

    return (
        <div
            ref={elementRef}
            style={{
                backgroundImage: `url(${
                    ALL_SPRITES[`shot${isMarkedForDeletion ? "Explosion" : ""}`]
                })`,

                backgroundSize: `${shotSize.width * (steps + 1)}px 100%`,
                width: shotSize.width,
                height: shotSize.height,
                left: shotState.pos.x,
                bottom: shotState.pos.y,
            }}
            className="absolute text-purple-700 animate-neon-text-pulse"
        />
    );
};
export default Shot;
