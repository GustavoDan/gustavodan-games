"use client";

import { GameActionButton } from "@/components/buttons";
import Board from "@/app/tic-tac-toe/Board";
import { TicTacToeMarker } from "@/app/tic-tac-toe/types";
import { checkDraw, checkWinner } from "@/app/tic-tac-toe/utils";
import { useState } from "react";

const InitialBoard = Array.from({ length: 3 }, () =>
    Array<TicTacToeMarker>(3).fill(null)
);

const TicTacToe = () => {
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
        <>
            <span
                className={`text-3xl md:text-[2.5rem] text-center transition duration-300 ease-in-out ${
                    winnerCells?.length === 1
                        ? "text-neon-tictactoe-draw"
                        : currentPlayer === "X"
                        ? "text-neon-tictactoe-primary"
                        : "text-neon-tictactoe-secondary"
                } sm-h:text-xl`}
            >
                {winnerCells
                    ? winnerCells.length === 1
                        ? "It's a tie!"
                        : `${currentPlayer} is the winner!`
                    : `${currentPlayer}'s Turn`}
            </span>

            <div className="relative w-full max-w-md aspect-square sm-h:w-7/12">
                <Board
                    board={board}
                    winnerCells={winnerCells}
                    onCellClick={handleCellClick}
                />
                <Board board={board} winnerCells={winnerCells} isNeonEffect />
            </div>

            <GameActionButton onClick={handleRestart}>
                Restart Game
            </GameActionButton>
        </>
    );
};

export default TicTacToe;
