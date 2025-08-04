import LifeBar from "./LifeBar";

interface HudProps {
    playerLife: number;
    score: number;
    highScore: number;
}

const Hud = ({ playerLife, score, highScore }: HudProps) => {
    return (
        <div className="flex flex-col justify-between h-full p-3">
            <LifeBar playerLife={playerLife} />
            <div className="text-3xl flex gap-10">
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>
        </div>
    );
};
export default Hud;
