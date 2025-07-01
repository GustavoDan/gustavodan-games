import Button from "@/components/Button";
import Title from "@/components/Title";
import { FocusProvider } from "@/context/FocusContext";

export default function Home() {
    return (
        <div className="w-11/12 max-w-xl py-9.5 px-7.5 flex flex-col items-center justify-center gap-5 bg-transparent-dark-blue border border-transparent-grey rounded-[1.25rem] backdrop-blur-[10px] shadow-soft select-none">
            <Title>Select a game</Title>
            <FocusProvider>
                <Button id="space-shooter">🚀 Space Shooter</Button>
                <Button id="jogo-da-velha">#️⃣ Tic-Tac-Toe</Button>
                <Button id="genesis">🧠 Simon</Button>
                <Button id="resgate">🚁 Rescue</Button>
                <Button id="dinossauro">🦖 Dinosaur</Button>
            </FocusProvider>
        </div>
    );
}
