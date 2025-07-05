import { cn } from "@/utils/cn";
import Cell from "./Cell";
import { TicTacToeMarker } from "./types";

interface BoardProps {
    board: TicTacToeMarker[][];
    winnerCells?: number[][] | null;
    onCellClick?: (row: number, col: number) => void;
    isNeonEffect?: boolean;
}

const Board = ({
    board,
    onCellClick,
    winnerCells,
    isNeonEffect = false,
}: BoardProps) => {
    if (isNeonEffect && onCellClick) {
        throw new Error(
            "Board cannot have 'onCellClick' when 'isNeonEffect' is enabled. The neon effect is purely visual and must not handle any game logic."
        );
    }

    return (
        <div
            className={cn(
                "grid grid-cols-3 grid-rows-3 size-full before:tictactoe-grid",
                isNeonEffect
                    ? "absolute inset-0 z-[-1] animate-neon-line-pulse"
                    : "relative"
            )}
        >
            {board.map((row, rowIndex) => {
                return row.map((col, colIndex) => {
                    const cellPosition = `${rowIndex},${colIndex}`;
                    const winnerPositions = winnerCells?.map(
                        ([row, col]) => `${row},${col}`
                    );

                    return (
                        <Cell
                            key={cellPosition}
                            className={
                                winnerPositions?.includes(cellPosition)
                                    ? "animate-winning-pulse"
                                    : winnerPositions?.length === 1
                                    ? "animate-draw-pulse"
                                    : ""
                            }
                            text={col}
                            onClick={() => onCellClick?.(rowIndex, colIndex)}
                            isNeonEffect={isNeonEffect}
                        />
                    );
                });
            })}
        </div>
    );
};

export default Board;
