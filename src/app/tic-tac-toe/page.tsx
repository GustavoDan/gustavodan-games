import TicTacToe from "./TicTacToe";

export const metadata = {
    title: "TIC-TAC-TOE",
};

export default function TicTacToeServer() {
    return (
        <>
            <style>
                {`@property --flow-position {
                    syntax: '<percentage>';
                    inherits: false;
                    initial-value: 0%;
                }`}
            </style>
            <TicTacToe gameTitle={metadata.title} />
        </>
    );
}
