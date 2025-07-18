import { MachineState } from "@/hooks/useStateMachine";
import { ALL_SPRITES, OBSTACLES } from "./constants";
import { cn } from "@/utils/cn";
import { ObstacleState } from "./types";

interface CactusProps {
    engineState: MachineState;
    obstacleState: ObstacleState;
}

const Cactus = ({ engineState, obstacleState }: CactusProps) => {
    const currentCactusType = OBSTACLES.types[obstacleState.type];

    return (
        <div
            style={{
                width: currentCactusType.width,
                height: currentCactusType.height,
                bottom: obstacleState.pos.y,
                left: obstacleState.pos.x,
            }}
            className={cn("absolute animate-neon-text-pulse")}
        >
            <div
                style={{
                    maskImage: `url(/${ALL_SPRITES[obstacleState.type]})`,
                }}
                className={cn(
                    "size-full",
                    "before:absolute before:inset-0 before:pointer-events-none",
                    "before:bg-circle-gradient before:animate-circle-gradient",
                    engineState === "RUNNING"
                        ? "animation-run"
                        : " animation-pause"
                )}
            />
        </div>
    );
};
export default Cactus;
