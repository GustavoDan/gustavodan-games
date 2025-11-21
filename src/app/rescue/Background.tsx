import { ReactNode, useMemo } from "react";
import {
    ALL_SPRITES,
    CONSTANT_SIZES,
    DIFFICULTY_SCALING_FACTOR,
} from "./constants";
import { MachineState } from "@/hooks/useStateMachine";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface BackgroundProps {
    children: ReactNode;
    engineState: MachineState;
    score: number;
}

const Background = ({ children, engineState, score }: BackgroundProps) => {
    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${CONSTANT_SIZES.background.width}px 0`,
            },
        ],
        []
    );

    const playbackRate = useMemo(() => {
        const progress = Math.min(score * DIFFICULTY_SCALING_FACTOR * 0.5, 1.0);
        const minRate = 1.0;
        const maxRate = 2.0;

        return minRate + (maxRate - minRate) * progress;
    }, [score]);

    const options = useMemo(
        () => ({
            duration: 4000,
            iterations: Infinity,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate,
    };

    const { elementRef } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    return (
        <div
            ref={elementRef}
            style={{
                backgroundImage: `url(${ALL_SPRITES.background})`,
                backgroundSize: `${CONSTANT_SIZES.background.width}px 100%`,
            }}
            className="size-full rendering-pixelated"
        >
            {children}
        </div>
    );
};

export default Background;
