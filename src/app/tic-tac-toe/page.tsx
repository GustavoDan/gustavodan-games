import TicTacToe from "./TicTacToe";

export const metadata = {
    title: "TIC-TAC-TOE",
};

export default function TicTacToeServer() {
    return <TicTacToe gameTitle={metadata.title} />;
}
