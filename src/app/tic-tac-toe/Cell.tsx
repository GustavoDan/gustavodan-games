import { cn } from "@/utils/cn";
import { TicTacToeMarker } from "./types";
import { areBoxesOverlapping, toBoundingBox } from "@/utils/collision";

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
                "relative flex justify-center items-center font-title text-[3.5rem] cursor-pointer text-shadow-tictactoe md:text-7xl sm-h:text-5xl",
                !isNeonEffect &&
                    "before:absolute before:inset-0 before:bg-tictactoe-cell md:before:transition-opacity md:before:duration-300 md:before:ease-in",
                !isNeonEffect &&
                    "before:opacity-0 hover:before:opacity-100 active:before:opacity-100 md:active:before:opacity-0 md:hover:active:before:opacity-100",
                !isNeonEffect && "",
                isDraw
                    ? "text-tictactoe-draw"
                    : text === "X"
                    ? "text-tictactoe-primary"
                    : "text-tictactoe-secondary",
                className
            )}
            onTouchEnd={(event) => {
                const target = event.currentTarget;

                if (
                    areBoxesOverlapping(
                        toBoundingBox(target),
                        toBoundingBox(event.changedTouches[0])
                    )
                ) {
                    target.click();
                }
            }}
            {...props}
        >
            {text}
        </div>
    );
};
export default Cell;
