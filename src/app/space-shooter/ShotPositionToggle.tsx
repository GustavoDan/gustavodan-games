import ToggleSwitch from "@/components/Switcher";

interface ShotPositionToggleProps {
    onClick: () => void;
    defaultCheckedValue: boolean;
}

const ShotPositionToggle = ({
    onClick,
    defaultCheckedValue,
}: ShotPositionToggleProps) => {
    return (
        <ToggleSwitch
            className="md:text-lg"
            text="Instant shot"
            tooltip="When enabled, shots fire immediately from the position where you shot. When disabled (default), shots wait for the animation to finish and follow your position until then."
            onClick={onClick}
            defaultCheckedValue={defaultCheckedValue}
        />
    );
};
export default ShotPositionToggle;
