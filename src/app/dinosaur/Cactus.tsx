import { ALL_SPRITES, OBSTACLES } from "./constants";
import { cn } from "@/utils/cn";
import { ObstacleState } from "./types";

interface CactusProps {
    obstacleState: ObstacleState;
}

const Cactus = ({ obstacleState }: CactusProps) => {
    const currentCactusType = OBSTACLES.types[obstacleState.type];

    return (
        <div
            style={{
                width: currentCactusType.width,
                height: currentCactusType.height,
                bottom: obstacleState.pos.y,
                left: obstacleState.pos.x,
            }}
            className={"absolute text-red-400 animate-neon-text-pulse"}
        >
            <div
                style={{
                    maskImage: `url(/${ALL_SPRITES[obstacleState.type]})`,
                }}
                className={cn(
                    "size-full",
                    "before:absolute before:inset-0 before:pointer-events-none",
                    "before:bg-danger before:animate-diagonal-stripes-gradient"
                )}
            />
        </div>
    );
};
export default Cactus;
