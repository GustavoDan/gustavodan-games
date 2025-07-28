import { cn } from "@/utils/cn";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";

interface HeartContainerProps {
    isEmpty: boolean;
}

const HeartContainer = ({ isEmpty }: HeartContainerProps) => {
    const heartSize = CONSTANT_SIZES.heartContainer;
    return (
        <div
            style={{
                backgroundImage: `url(${ALL_SPRITES.HeartContainer})`,
                backgroundSize: `auto ${CONSTANT_SIZES.heartContainer.height}px`,
                width: heartSize.width,
                height: heartSize.height,
            }}
            className={cn(!isEmpty && "animate-heartbeat")}
        />
    );
};
export default HeartContainer;
