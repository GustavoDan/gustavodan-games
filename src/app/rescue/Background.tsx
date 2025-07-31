import { ReactNode, useMemo } from "react";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { MachineState } from "@/hooks/useStateMachine";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface BackgroundProps {
    children: ReactNode;
    engineState: MachineState;
}

const Background = ({ children, engineState }: BackgroundProps) => {
    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${CONSTANT_SIZES.background.width}px 0`,
            },
        ],
        []
    );

    const options = useMemo(
        () => ({
            duration: 2000,
            iterations: Infinity,
        }),
        []
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: 1,
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
