import { cn } from "@/utils/cn";
import { TicTacToeMarker } from "./types";

interface CellProps {
    text?: TicTacToeMarker;
    onClick: () => void;
    isDraw: boolean;
    isNeonEffect: boolean;
    className?: string;
}

const Cell = ({
    text,
    isNeonEffect,
    isDraw,
    className,
    ...props
}: CellProps) => {
    return (
        <div
            className={cn(
                "relative flex justify-center items-center font-title text-7xl cursor-pointer text-shadow-tictactoe",
                !isNeonEffect &&
                    "before:absolute before:inset-0 before:bg-tictactoe-cell",
                !isNeonEffect &&
                    "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:ease-in",
                isDraw
                    ? "text-tictactoe-draw"
                    : text === "X"
                    ? "text-tictactoe-primary"
                    : "text-tictactoe-secundary",
                className
            )}
            {...props}
        >
            {text}
        </div>
    );
};
export default Cell;
