import { MenuButton } from "@/components/buttons";
import { BaseContainer } from "@/components/containers";
import Title from "@/components/Title";

export default function Home() {
    return (
        <BaseContainer className="w-11/12 max-w-xl py-9 px-7 gap-5 justify-center items-center">
            <Title className="mb-2.5">Select a game</Title>
            <MenuButton disabled id="space-shooter">
                🚀 Space Shooter
            </MenuButton>
            <MenuButton id="tic-tac-toe">#️⃣ Tic-Tac-Toe</MenuButton>
            <MenuButton disabled id="simon">
                🧠 Simon
            </MenuButton>
            <MenuButton disabled id="rescue">
                🚁 Rescue
            </MenuButton>
            <MenuButton disabled id="dinosaur">
                🦖 Dinosaur
            </MenuButton>
        </BaseContainer>
    );
}
