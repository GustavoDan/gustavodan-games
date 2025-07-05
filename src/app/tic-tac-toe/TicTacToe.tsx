"use client";

import { RestartButton } from "@/components/buttons";
import { GameContainer } from "@/components/containers";
import Board from "@/components/ticTacToe/Board";
import { TicTacToeMarker } from "@/components/ticTacToe/types";
import { checkDraw, checkWinner } from "@/components/ticTacToe/utils";
import { useState } from "react";

interface TicTacToeProps {
    gameTitle: string;
}

const InitialBoard = Array.from({ length: 3 }, () =>
    Array<TicTacToeMarker>(3).fill(null)
);

export default function TicTacToe({ gameTitle }: TicTacToeProps) {
    const [board, setBoard] = useState(InitialBoard);
    const [currentPlayer, setCurrentPlayer] =
        useState<Exclude<TicTacToeMarker, null>>("X");
    const [winnerCells, setWinnerCells] = useState<number[][] | null>(null);

    const handleCellClick = (row: number, col: number) => {
        if (board[row][col] !== null || winnerCells) return;

        const newBoard = board.map((row) => row.slice());
        newBoard[row][col] = currentPlayer;

        setBoard(newBoard);

        const tempWinner = checkWinner(newBoard) || checkDraw(newBoard);
        if (!tempWinner) {
            setCurrentPlayer(currentPlayer !== "X" ? "X" : "O");
        }

        setWinnerCells(tempWinner);
    };

    const handleRestart = () => {
        setBoard(InitialBoard);
        setCurrentPlayer("X");
        setWinnerCells(null);
    };

    return (
        <GameContainer gameTitle={gameTitle}>
            <span className="text-2xl text-shadow-soft">
                {winnerCells
                    ? winnerCells.length === 1
                        ? "Game ended in a draw!"
                        : `${currentPlayer} has won!`
                    : `${currentPlayer}'s Turn`}
            </span>

            <div className="relative w-full max-w-md aspect-square">
                <Board
                    board={board}
                    winnerCells={winnerCells}
                    onCellClick={handleCellClick}
                />
                <Board board={board} winnerCells={winnerCells} isNeonEffect />
            </div>

            <RestartButton onClick={handleRestart} />
        </GameContainer>
    );
}
