import DinosaurGame from "./DinosaurGame";

export const metadata = {
    title: "DINOSAUR GAME",
};

export default function DinosaurGameServer() {
    return <DinosaurGame gameTitle={metadata.title} />;
}
