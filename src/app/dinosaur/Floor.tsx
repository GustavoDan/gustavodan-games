import { cn } from "@/utils/cn";
import { FLOOR } from "./constants";
import { MachineState } from "@/hooks/useStateMachine";

interface FloorProps {
    engineState: MachineState;
}

const Floor = ({ engineState }: FloorProps) => {
    return (
        <div
            style={{ height: FLOOR.heigth }}
            className="relative z-[-1] overflow-hidden animate-neon-text-pulse"
        >
            <div
                className={cn(
                    "size-full animate-dinosaur-floor mask-[url(/dinosaur/background.png)] mask-repeat-x",
                    "before:absolute before:inset-0 before:pointer-events-none before:bg-circle-gradient before:animate-circle-gradient",
                    engineState === "RUNNING"
                        ? "animation-run"
                        : "animation-pause"
                )}
            />
        </div>
    );
};

export default Floor;
