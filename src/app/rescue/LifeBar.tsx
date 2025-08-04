import { cn } from "@/utils/cn";
import { CONSTANT_SIZES, MAX_PLAYER_LIFE } from "./constants";
import LifeIndicator from "./LifeIndicator";

interface LifeBarProps {
    playerLife: number;
}

const BORDER_WIDTH = 4;
const PADDING = 4;
const GAP = 4;

const LifeBar = ({ playerLife }: LifeBarProps) => {
    return (
        <div
            style={{
                width:
                    CONSTANT_SIZES.life.width * MAX_PLAYER_LIFE +
                    2 * BORDER_WIDTH +
                    2 * PADDING +
                    (MAX_PLAYER_LIFE - 1) * GAP,
                borderWidth: BORDER_WIDTH,
                padding: PADDING,
                gap: GAP,
            }}
            className={cn(
                "bg-[#414141] border-t-black border-r-black border-b-[#8A8A8A] border-l-[#8A8A8A] opacity-50",
                "flex justify-start items-center h-12"
            )}
        >
            {Array.from({ length: playerLife }).map((_, index) => (
                <LifeIndicator key={index} />
            ))}
        </div>
    );
};
export default LifeBar;
