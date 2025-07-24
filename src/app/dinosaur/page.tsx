import { GameContainer } from "@/components/containers";
import DinosaurGame from "./DinosaurGame";
import { preload } from "react-dom";
import { ALL_SPRITES } from "./constants";

export const metadata = {
    title: "DINOSAUR GAME",
};

Object.values(ALL_SPRITES).forEach((sprite) => {
    preload(sprite, { as: "image" });
});

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
