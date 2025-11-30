"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/utils/cn";

interface TooltipProps {
    children: ReactNode;
    content: string;
    className?: string;
}

type TooltipState = "hidden" | "visible" | "exiting";

const Tooltip = ({ children, content, className }: TooltipProps) => {
    const [state, setState] = useState<TooltipState>("hidden");

    const handleMouseEnter = () => {
        setState("visible");
    };

    const handleMouseLeave = () => {
        setState("exiting");
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        setState("visible");
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.stopPropagation();
        setState("exiting");
    };

    const handleAnimationEnd = () => {
        if (state === "exiting") {
            setState("hidden");
        }
    };

    return (
        <div
            className={cn("relative inline-block", className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {children}
            {state !== "hidden" && content && (
                <div
                    key={state}
                    className={cn(
                        "absolute bottom-full left-1/2 mb-4.5 z-50 px-3 py-2",
                        "text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal w-md pointer-events-none",
                        state === "exiting"
                            ? "animate-tooltip-fade-out"
                            : "animate-tooltip-fade-in"
                    )}
                    onAnimationEnd={handleAnimationEnd}
                >
                    {content}
                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 border-[16px] border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
