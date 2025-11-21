import { VolumeToggleButton } from "@/components/buttons";
import { cn } from "@/utils/cn";

interface VolumeControlsProps {
    isSoundEnabled: boolean;
    isMusicEnabled: boolean;
    onSoundToggle: (isActive: boolean) => void;
    onMusicToggle: (isActive: boolean) => void;
    className?: string;
    absolute?: boolean;
}

const VolumeControls = ({
    isSoundEnabled,
    isMusicEnabled,
    onSoundToggle,
    onMusicToggle,
    className,
    absolute = false,
}: VolumeControlsProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-center gap-2 text-white",
                absolute && "absolute top-3 right-3",
                className
            )}
        >
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
    );
};

export default VolumeControls;
