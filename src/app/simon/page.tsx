import { GameContainer } from "@/components/containers";
import Simon from "./Simon";

export const metadata = {
    title: "SIMON",
};

export default function SimonServer() {
    return (
        <GameContainer
            gameTitle={metadata.title}
            className="max-w-3xl sm-h:max-w-sm"
            childrenClassName="items-center justify-evenly"
        >
            <Simon />
        </GameContainer>
    );
}
