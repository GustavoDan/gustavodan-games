import MenuButton from "@/components/Buttons/MenuButton";
import MainContainer from "@/components/MainContainer";
import Title from "@/components/Title";

export default function Home() {
    return (
        <MainContainer className="w-11/12 max-w-xl py-9.5 px-7.5 gap-5">
            <Title>Select a game</Title>
            <MenuButton id="space-shooter">🚀 Space Shooter</MenuButton>
            <MenuButton id="tic-tac-toe">#️⃣ Tic-Tac-Toe</MenuButton>
            <MenuButton id="simon">🧠 Simon</MenuButton>
            <MenuButton id="rescue">🚁 Rescue</MenuButton>
            <MenuButton id="dinosaur">🦖 Dinosaur</MenuButton>
        </MainContainer>
    );
}
