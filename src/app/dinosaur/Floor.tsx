"use client";

import { cn } from "@/utils/cn";
import { FLOOR } from "./constants";
import { MachineState } from "@/hooks/useStateMachine";
import { useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface FloorProps {
    engineState: MachineState;
    speedMultiplier: number;
}

const Floor = ({ engineState, speedMultiplier }: FloorProps) => {
    const keyframes = useMemo(
        () => [{ maskPosition: "0 0" }, { maskPosition: "-2400px 0" }],
        []
    );

    const options = useMemo(
        () => ({
            duration: 4000,
            iterations: Infinity,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: speedMultiplier,
    };

    const floorRef = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    return (
        <div
            style={{ height: FLOOR.heigth }}
            className="relative z-[-1] overflow-hidden animate-neon-text-pulse"
        >
            <div
                ref={floorRef}
                className={cn(
                    "size-full pointer-events-none bg-circle-gradient animate-circle-gradient",
                    "mask-[url(/dinosaur/background.png)] mask-repeat-x"
                )}
            />
        </div>
    );
};

export default Floor;
