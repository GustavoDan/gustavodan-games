import { GameContainer } from "@/components/containers";
import Rescue from "./Rescue";
import { ALL_SPRITES } from "./constants";
import { preload } from "react-dom";

export const metadata = {
    title: "RESCUE",
};

Object.values(ALL_SPRITES).forEach((sprite) => {
    preload(sprite, { as: "image" });
});

export default function SpaceShooterServer() {
    return (
        <GameContainer
            gameTitle={metadata.title}
            className="2xl:max-w-9/12"
            childrenClassName="relative overflow-hidden"
        >
            <Rescue />
        </GameContainer>
    );
}
