"use client";

import { DINOSAUR_SIZE } from "./constants";
import { DinosaurState } from "./types";
import { MachineState } from "@/hooks/useStateMachine";
import { useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";
import { cn } from "@/utils/cn";

interface DinosaurProps {
    dinosaurState: DinosaurState;
    engineState: MachineState;
    speedMultiplier: number;
}

const Dinosaur = ({
    dinosaurState,
    engineState,
    speedMultiplier,
}: DinosaurProps) => {
    const keyframes = useMemo(
        () => [{ maskPosition: "0 0" }, { maskPosition: "200% 0%" }],
        []
    );

    const options = useMemo(
        () => ({
            duration: 300,
            easing: "steps(2, end)",
            iterations: Infinity,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: speedMultiplier,
    };

    const dinosaurRef = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    const dinosaurSprite = dinosaurState.isDucking ? "duck" : "run";
    return (
        <div
            style={{
                width: DINOSAUR_SIZE[dinosaurSprite].width,
                height: DINOSAUR_SIZE[dinosaurSprite].height,
                bottom: dinosaurState.pos.y,
                left: dinosaurState.pos.x,
            }}
            className="relative animate-neon-text-pulse"
        >
            <div
                ref={dinosaurRef}
                className={cn(
                    "size-full pointer-events-none bg-circle-gradient animate-circle-gradient",
                    dinosaurState.isDucking
                        ? "mask-[url(/dinosaur/duck.png)]"
                        : "mask-[url(/dinosaur/run.png)]"
                )}
            />
        </div>
    );
};

export default Dinosaur;
