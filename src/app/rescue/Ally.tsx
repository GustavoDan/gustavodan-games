"use client";

import { MachineState } from "@/hooks/useStateMachine";
import { DeleteAllyFn, VolatileDataFn } from "./types";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { useEffect, useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";
import { BaseObjectState } from "@/types";

interface AllyProps {
    allyState: BaseObjectState;
    engineState: MachineState;
    isMarkedForDeletion: boolean;
    onFrameUpdate: VolatileDataFn;
    deleteAlly: DeleteAllyFn;
}

const DEFAULT_STEPS = 11;
const DEATH_STEPS = 6;

const Ally = ({
    allyState,
    engineState,
    isMarkedForDeletion,
    onFrameUpdate,
    deleteAlly,
}: AllyProps) => {
    const allySize = useMemo(
        () =>
            isMarkedForDeletion
                ? CONSTANT_SIZES.allyDeath
                : CONSTANT_SIZES.ally,
        [isMarkedForDeletion]
    );
    const steps = useMemo(
        () => (isMarkedForDeletion ? DEATH_STEPS : DEFAULT_STEPS),
        [isMarkedForDeletion]
    );
    const sprite = useMemo(
        () => (isMarkedForDeletion ? ALL_SPRITES.allyDeath : ALL_SPRITES.ally),
        [isMarkedForDeletion]
    );

    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${allySize.width * steps}px 0`,
            },
        ],
        [allySize.width, steps]
    );

    const options = useMemo(
        () => ({
            duration: 1000,
            easing: `steps(${steps}, end)`,
            iterations: isMarkedForDeletion ? 1 : Infinity,
            fill: "forwards" as const,
        }),
        [steps, isMarkedForDeletion]
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: 1,
    };

    const { elementRef, getCurrentFrame, isFinished } =
        useControllableAnimation(keyframes, options, animationControls);

    useEffect(() => {
        onFrameUpdate(getCurrentFrame);
    }, [getCurrentFrame, onFrameUpdate]);

    useEffect(() => {
        if (isMarkedForDeletion && isFinished) {
            deleteAlly();
        }
    }, [isFinished, isMarkedForDeletion, deleteAlly]);

    return (
        <div
            ref={elementRef}
            style={{
                backgroundImage: `url(${sprite})`,
                width: allySize.width,
                height: allySize.height,
                left: allyState.pos.x,
                bottom: allyState.pos.y,
            }}
            className="absolute"
        />
    );
};
export default Ally;
