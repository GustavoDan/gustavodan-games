import { cn } from "@/utils/cn";
import { DINOSAUR } from "./constants";
import { Vector2D } from "./types";
import { MachineState } from "@/hooks/useStateMachine";

interface DinosaurProps {
    position: Vector2D;
    engineState: MachineState;
}

const Dinosaur = ({ position, engineState }: DinosaurProps) => {
    return (
        <div
            style={{
                width: DINOSAUR.width,
                height: DINOSAUR.height,
                bottom: position.y,
                left: position.x,
            }}
            className={cn("relative animate-neon-text-pulse")}
        >
            <div
                className={cn(
                    "size-full mask-[url(/dinosaur/run.png)] animate-dinosaur",
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

export default Dinosaur;
