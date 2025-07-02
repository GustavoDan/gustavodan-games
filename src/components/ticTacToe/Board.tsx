import { cn } from "@/utils/cn";
import Cell from "./Cell";

const Board = () => {
    return (
        <div
            className={cn(
                "relative grid grid-cols-3 grid-rows-3 w-full max-w-md aspect-square before:tictactoe-grid"
            )}
        >
            {Array.from({ length: 9 }, (_, i) => (
                <Cell key={i} text={i % 2 === 0 ? "X" : "O"} />
            ))}
        </div>
    );
};
export default Board;
