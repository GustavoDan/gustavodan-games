import { GameContainer } from "@/components/containers";
import SpaceShooter from "./SpaceShooter";
import { preload } from "react-dom";
import { ALL_SPRITES } from "./constants";

export const metadata = {
    title: "SPACE SHOOTER",
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
            <SpaceShooter />
        </GameContainer>
    );
}
