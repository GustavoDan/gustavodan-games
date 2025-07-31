import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { ShotState } from "./types";

interface ShotProps {
    shotState: ShotState;
}

const Shot = ({ shotState }: ShotProps) => {
    return (
        <div
            style={{
                backgroundImage: `url(${ALL_SPRITES.shot})`,
                width: CONSTANT_SIZES.shot.width,
                height: CONSTANT_SIZES.shot.height,
                left: shotState.pos.x,
                bottom: shotState.pos.y,
            }}
            className="absolute"
        />
    );
};
export default Shot;
