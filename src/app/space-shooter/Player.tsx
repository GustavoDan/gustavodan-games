"use client";

import { cn } from "@/utils/cn";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { PlayerState } from "./types";
import { checkIsBlinking } from "@/utils/checkIsBlinking";

interface PlayerProps {
    playerState: PlayerState;
}

const Player = ({ playerState }: PlayerProps) => {
    return (
        <div
            style={{
                backgroundImage: `url(${ALL_SPRITES.player})`,
                width: CONSTANT_SIZES.player.width,
                height: CONSTANT_SIZES.player.height,
                bottom: playerState.pos.y,
                left: playerState.pos.x,
            }}
            className={cn(
                "absolute bg-cover text-purple-300 animate-neon-text-pulse",
                "transition-opacity duration-300",
                checkIsBlinking(playerState.invulnerabilityTimer)
                    ? "opacity-25"
                    : "opacity-100"
            )}
        ></div>
    );
};
export default Player;
