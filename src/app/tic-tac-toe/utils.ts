import { TicTacToeMarker } from "./types";

export const checkWinner = (board: TicTacToeMarker[][]) => {
    for (let i = 0; i < 3; i++) {
        if (
            board[i][0] &&
            board[i][0] === board[i][1] &&
            board[i][0] === board[i][2]
        ) {
            return [
                [i, 0],
                [i, 1],
                [i, 2],
            ];
        }

        if (
            board[0][i] &&
            board[0][i] === board[1][i] &&
            board[0][i] === board[2][i]
        ) {
            return [
                [0, i],
                [1, i],
                [2, i],
            ];
        }
    }

    if (
        board[0][0] &&
        board[0][0] === board[1][1] &&
        board[0][0] === board[2][2]
    ) {
        return [
            [0, 0],
            [1, 1],
            [2, 2],
        ];
    }

    if (
        board[0][2] &&
        board[0][2] === board[1][1] &&
        board[0][2] === board[2][0]
    ) {
        return [
            [0, 2],
            [1, 1],
            [2, 0],
        ];
    }

    return null;
};
export const checkDraw = (board: TicTacToeMarker[][]) => {
    if (board.flat().every((cell) => cell !== null)) {
        return [[]];
    }

    return null;
};
