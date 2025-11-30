import { cn } from "@/utils/cn";
import { useCallback, useState } from "react";
import Tooltip from "./Tooltip";
import { FaCircleInfo } from "react-icons/fa6";

interface ToggleSwitchProps {
    className?: string;
    text?: string;
    tooltip?: string;
    onClick?: () => void;
    defaultCheckedValue?: boolean;
}

const ToggleSwitch = ({
    text,
    onClick,
    tooltip,
    defaultCheckedValue = false,
    className,
}: ToggleSwitchProps) => {
    const [isChecked, setIsChecked] = useState(defaultCheckedValue);

    const handleClick = useCallback(() => {
        setIsChecked((prevIsChecked) => !prevIsChecked);
        onClick?.();
    }, [onClick]);

    const labelContent = (
        <label
            className={cn("flex items-center gap-2 cursor-pointer", className)}
            onClick={handleClick}
        >
            <div
                className={cn(
                    "h-6 w-11 p-1 rounded-full transition-color",
                    isChecked ? "bg-green-600" : "bg-gray-600"
                )}
            >
                <div
                    className={cn(
                        "flex justify-center items-center size-4 rounded-full bg-gray-900 text-gray-200 transition-transform",
                        isChecked ? "translate-x-[125%]" : "translate-x-0"
                    )}
                >
                    {isChecked ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-3.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-3.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <span>{text}</span>
                {tooltip ? (
                    <Tooltip content={tooltip}>
                        <FaCircleInfo size={16} />
                    </Tooltip>
                ) : null}
            </div>
        </label>
    );

    return labelContent;
};

export default ToggleSwitch;
