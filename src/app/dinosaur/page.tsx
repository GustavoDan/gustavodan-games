import { GameContainer } from "@/components/containers";
import DinosaurGame from "./DinosaurGame";

export const metadata = {
    title: "DINOSAUR GAME",
};

export default function DinosaurGameServer() {
    return (
        <GameContainer
            gameTitle={metadata.title}
            className="max-w-7xl"
            childrenClassName="relative justify-end overflow-hidden"
        >
            <style>
                {`@property --flow-position {
                    syntax: '<percentage>';
                    inherits: false;
                    initial-value: 0%;
                    }`}
            </style>
            <DinosaurGame />
        </GameContainer>
    );
}
