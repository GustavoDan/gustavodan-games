import { RestartButton } from "@/components/buttons";
import { GameContainer } from "@/components/containers";
import Board from "@/components/ticTacToe/Board";

export const metadata = {
    title: "TIC-TAC-TOE",
};

export default function TicTacToe() {
    return (
        <GameContainer gameName={metadata.title} className="">
            <span className="text-2xl text-shadow-soft">X's Turn</span>
            <Board />
            <RestartButton />
        </GameContainer>
    );
}
