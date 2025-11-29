import { cn } from "@/utils/cn";
import { COLOR_CONFIG } from "./constants";
import { SimonColor } from "./types";

interface SimonButtonProps {
    color: SimonColor;
    isActive: boolean;
    isDisabled: boolean;
    onClick: () => void;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const POSITION_CLASSES: Record<SimonButtonProps["position"], string> = {
    "top-left": "rounded-tl-full rounded-br-3xl",
    "top-right": "rounded-tr-full rounded-bl-3xl",
    "bottom-left": "rounded-bl-full rounded-tr-3xl",
    "bottom-right": "rounded-br-full rounded-tl-3xl",
};

const SimonButton = ({
    color,
    isActive,
    isDisabled,
    onClick,
    position,
}: SimonButtonProps) => {
    const config = COLOR_CONFIG[color];

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={cn(
                "aspect-square w-full transition-all duration-150 animate-simon-pulse",
                POSITION_CLASSES[position],
                config.text,
                isActive ? `${config.active} ${config.glow}` : config.base,
                isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:brightness-110 active:brightness-200 active:scale-[0.98]"
            )}
            aria-label={`${color} button`}
        />
    );
};

export default SimonButton;
