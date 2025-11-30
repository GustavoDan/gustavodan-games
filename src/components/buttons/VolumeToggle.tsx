import { cn } from "@/utils/cn";
import { useCallback, useMemo } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff } from "react-icons/io";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import { BaseButton } from ".";

export type VolumeToggleType = "sound" | "music";

interface VolumeToggleProps {
    className?: string;
    type?: VolumeToggleType;
    isActive: boolean;
    onToggle: (isActive: boolean) => void;
}

const VolumeToggle = ({
    className,
    type = "sound",
    isActive,
    onToggle,
}: VolumeToggleProps) => {
    const handleClick = useCallback(() => {
        onToggle(!isActive);
    }, [isActive, onToggle]);

    const icons = useMemo(() => {
        switch (type) {
            case "sound":
                return {
                    ActiveIcon: IoMdVolumeHigh,
                    InactiveIcon: IoMdVolumeOff,
                };
            case "music":
                return { ActiveIcon: MdMusicNote, InactiveIcon: MdMusicOff };
        }
    }, [type]);

    const IconComponent = useMemo(
        () => (isActive ? icons.ActiveIcon : icons.InactiveIcon),
        [isActive, icons]
    );

    return (
        <BaseButton
            onClick={handleClick}
            className={cn("p-2 z-[9999]", className)}
        >
            <IconComponent size={36} fill="currentColor" />
        </BaseButton>
    );
};

export default VolumeToggle;
