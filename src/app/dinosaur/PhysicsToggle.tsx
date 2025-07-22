import ToggleSwitch from "@/components/Switcher";

interface PhysicsToggleProps {
    onClick: () => void;
    defaultCheckedValue: boolean;
}

const PhysicsToggle = ({
    onClick,
    defaultCheckedValue,
}: PhysicsToggleProps) => {
    return (
        <ToggleSwitch
            className="md:text-lg"
            text="Relative speed"
            tooltip="When enabled, moving forward and backward will change the speed of the game world."
            onClick={onClick}
            defaultCheckedValue={defaultCheckedValue}
        />
    );
};
export default PhysicsToggle;
