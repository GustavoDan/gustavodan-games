import { GameContainer } from "@/components/containers";
import TicTacToe from "./TicTacToe";

export const metadata = {
    title: "TIC-TAC-TOE",
};

export default function TicTacToeServer() {
    return (
        <GameContainer
            gameTitle={metadata.title}
            className="max-w-3xl sm-h:max-w-sm"
            childrenClassName="items-center justify-evenly"
        >
            <style>
                {`@property --flow-position {
                    syntax: '<percentage>';
                    inherits: false;
                    initial-value: 0%;
                }`}
            </style>
            <TicTacToe />
        </GameContainer>
    );
}
