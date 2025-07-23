import { GameContainer } from "@/components/containers";
import SpaceShooter from "./SpaceShooter";

export const metadata = {
    title: "SPACE SHOOTER",
};

export default function SpaceShooterServer() {
    return (
        <GameContainer
            gameTitle={metadata.title}
            className="max-w-5xl"
            childrenClassName="relative overflow-hidden"
        >
            <SpaceShooter />
        </GameContainer>
    );
}
