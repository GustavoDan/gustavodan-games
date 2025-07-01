import Button from "@/components/Button";
import MainContainer from "@/components/MainContainer";
import Title from "@/components/Title";
import { FocusProvider } from "@/context/FocusContext";

export default function Home() {
    return (
        <MainContainer className="w-11/12 max-w-xl py-9.5 px-7.5 gap-5">
            <Title>Select a game</Title>
            <FocusProvider>
                <Button id="space-shooter">🚀 Space Shooter</Button>
                <Button id="tic-tac-toe">#️⃣ Tic-Tac-Toe</Button>
                <Button id="simon">🧠 Simon</Button>
                <Button id="rescue">🚁 Rescue</Button>
                <Button id="dinosaur">🦖 Dinosaur</Button>
            </FocusProvider>
        </MainContainer>
    );
}
