import { VolumeToggleButton } from "@/components/buttons";
import LifeBar from "./LifeBar";

interface HudProps {
    playerLife: number;
    score: number;
    highScore: number;
    isSoundEnabled: boolean;
    isMusicEnabled: boolean;
    onSoundToggle: (isActive: boolean) => void;
    onMusicToggle: (isActive: boolean) => void;
}

const Hud = ({
    playerLife,
    score,
    highScore,
    isSoundEnabled,
    isMusicEnabled,
    onSoundToggle,
    onMusicToggle,
}: HudProps) => {
    return (
        <div className="flex flex-col justify-between h-full p-3">
            <div className="flex justify-between">
                <LifeBar playerLife={playerLife} />
                <div className="flex items-center justify-center gap-2 text-white">
                    <VolumeToggleButton
                        type="sound"
                        isActive={isSoundEnabled}
                        onToggle={onSoundToggle}
                    />
                    <VolumeToggleButton
                        type="music"
                        isActive={isMusicEnabled}
                        onToggle={onMusicToggle}
                    />
                </div>
            </div>
            <div className="text-3xl flex gap-10">
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>
        </div>
    );
};
export default Hud;
