"use client";

import { MachineState } from "@/hooks/useStateMachine";
import { ALL_SPRITES, OBSTACLES } from "./constants";
import { cn } from "@/utils/cn";
import { ObstacleState } from "./types";
import { useEffect, useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface PterodactylProps {
    engineState: MachineState;
    obstacleState: ObstacleState;
    onFrameUpdate: (id: string, getFrame: () => number | null) => void;
    unregister: (id: string) => void;
}
const Pterodactyl = ({
    engineState,
    obstacleState,
    onFrameUpdate,
    unregister,
}: PterodactylProps) => {
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
        playbackRate: 1,
    };

    const { elementRef, getCurrentFrame } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    useEffect(() => {
        onFrameUpdate(obstacleState.id, getCurrentFrame);

        return () => {
            unregister(obstacleState.id);
        };
    }, [getCurrentFrame, onFrameUpdate, obstacleState.id, unregister]);

    return (
        <div
            style={{
                width: OBSTACLES.types.pterodactyl.width,
                height: OBSTACLES.types.pterodactyl.height,
                bottom: obstacleState.pos.y,
                left: obstacleState.pos.x,
            }}
            className={cn("absolute text-red-400 animate-neon-text-pulse")}
        >
            <div
                ref={elementRef}
                style={{
                    maskImage: `url(/${ALL_SPRITES.pterodactyl})`,
                }}
                className={cn(
                    "size-full",
                    "before:absolute before:inset-0 before:pointer-events-none",
                    "before:bg-danger before:animate-diagonal-stripes-gradient",
                    engineState === "RUNNING"
                        ? "animation-run"
                        : " animation-pause"
                )}
            />
        </div>
    );
};
export default Pterodactyl;
