"use client";

import { ALL_SPRITES, DINOSAUR_SIZE } from "./constants";
import { DinosaurState } from "./types";
import { MachineState } from "@/hooks/useStateMachine";
import { useEffect, useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";
import { cn } from "@/utils/cn";

interface DinosaurProps {
    dinosaurState: DinosaurState;
    engineState: MachineState;
    speedMultiplier: number;
    onFrameUpdate: (getFrame: () => number | null) => void;
}

const Dinosaur = ({
    dinosaurState,
    engineState,
    speedMultiplier,
    onFrameUpdate,
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

    const { elementRef, getCurrentFrame } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    useEffect(() => {
        onFrameUpdate(getCurrentFrame);
    }, [getCurrentFrame, onFrameUpdate]);

    const isBlinking =
        dinosaurState.invulnerabilityTimer > 0 &&
        Math.floor(dinosaurState.invulnerabilityTimer * 5) % 2 === 0;

    const dinosaurSprite = dinosaurState.isDucking ? "duck" : "run";
    return (
        <div
            style={{
                width: DINOSAUR_SIZE[dinosaurSprite].width,
                height: DINOSAUR_SIZE[dinosaurSprite].height,
                bottom: dinosaurState.pos.y,
                left: dinosaurState.pos.x,
            }}
            className="absolute text-green-300 animate-neon-text-pulse "
        >
            <div
                ref={elementRef}
                style={{
                    maskImage: `url(${
                        ALL_SPRITES[dinosaurState.isDucking ? "duck" : "run"]
                    })`,
                }}
                className={cn(
                    "size-full pointer-events-none bg-dinosaur animate-diagonal-stripes-gradient",
                    "transition-opacity duration-300",
                    isBlinking ? "opacity-25" : "opacity-100"
                )}
            />
        </div>
    );
};

export default Dinosaur;
