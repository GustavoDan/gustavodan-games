import { cn } from "@/utils/cn";
import { TicTacToeMarker } from "./types";

interface CellProps {
    text?: TicTacToeMarker;
    onClick: () => void;
    isNeonEffect: boolean;
    className?: string;
}

const Cell = ({ text, isNeonEffect, className, ...props }: CellProps) => {
    return (
        <div
            className={cn(
                "relative flex justify-center items-center font-title text-tictactoe cursor-pointer text-shadow-tictactoe",
                !isNeonEffect &&
                    "before:absolute before:inset-0 before:bg-tictactoe-cell",
                !isNeonEffect &&
                    "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:ease-in",
                text === "X" ? "text-[#ff4500]" : "text-[#7df9ff]",
                className
            )}
            {...props}
        >
            {text}
        </div>
    );
};
export default Cell;
