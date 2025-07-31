import { checkIsBlinking } from "@/utils/checkIsBlinking";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { PlayerState } from "./types";
import { cn } from "@/utils/cn";
import { useMemo } from "react";
import { MachineState } from "@/hooks/useStateMachine";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface PlayerProps {
    playerState: PlayerState;
    engineState: MachineState;
}

const STEPS = 2;

const Player = ({ playerState, engineState }: PlayerProps) => {
    const playerSize = CONSTANT_SIZES.player;

    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${playerSize.width * STEPS}px 0`,
            },
        ],
        [playerSize.width]
    );

    const options = useMemo(
        () => ({
            duration: 200,
            easing: `steps(${STEPS}, end)`,
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
                backgroundImage: `url(${ALL_SPRITES.player})`,
                width: CONSTANT_SIZES.player.width,
                height: CONSTANT_SIZES.player.height,
                bottom: playerState.pos.y,
                left: playerState.pos.x,
            }}
            className={cn(
                "absolute bg-cover transition-opacity duration-300",
                checkIsBlinking(playerState.invulnerabilityTimer)
                    ? "opacity-25"
                    : "opacity-100"
            )}
        />
    );
};

export default Player;
