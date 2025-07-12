"use client";

import { cn } from "@/utils/cn";
import { DINOSAUR } from "./constants";
import { Vector2D } from "./types";
import { MachineState } from "@/hooks/useStateMachine";
import { useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface DinosaurProps {
    position: Vector2D;
    engineState: MachineState;
    speedMultiplier: number;
}

const Dinosaur = ({
    position,
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

    return (
        <div
            style={{
                width: DINOSAUR.width,
                height: DINOSAUR.height,
                bottom: position.y,
                left: position.x,
            }}
            className="relative animate-neon-text-pulse"
        >
            <div
                ref={dinosaurRef}
                className={cn(
                    "size-full pointer-events-none bg-circle-gradient animate-circle-gradient"
                )}
            />
        </div>
    );
};

export default Dinosaur;
