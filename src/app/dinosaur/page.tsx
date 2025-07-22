import { GameContainer } from "@/components/containers";
import DinosaurGame from "./DinosaurGame";
import { preload } from "react-dom";

export const metadata = {
    title: "DINOSAUR GAME",
};

preload("/dinosaur/run.png", { as: "image" });
preload("/dinosaur/duck.png", { as: "image" });
preload("/dinosaur/background.png", { as: "image" });

export default function DinosaurGameServer() {
    return (
        <GameContainer
            gameTitle={metadata.title}
            className="max-w-7xl max-h-7/12 sm-h:max-h-none"
            childrenClassName="relative overflow-hidden"
        >
            <DinosaurGame />
        </GameContainer>
    );
}
