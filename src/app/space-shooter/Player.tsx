import { ALL_SPRITES, PLAYER_SIZE } from "./constants";
import { PlayerState } from "./types";

interface PlayerProps {
    playerState: PlayerState;
}

const Player = ({ playerState }: PlayerProps) => {
    return (
        <div
            style={{
                backgroundImage: `url(${ALL_SPRITES.player})`,
                width: PLAYER_SIZE.width,
                height: PLAYER_SIZE.height,
                bottom: playerState.pos.y,
                left: playerState.pos.x,
            }}
            className="absolute bg-cover text-purple-300 animate-neon-text-pulse "
        >
            {/*  "transition-opacity duration-300"
             isBlinking ? "opacity-25" : "opacity-100" */}
        </div>
    );
};
export default Player;
