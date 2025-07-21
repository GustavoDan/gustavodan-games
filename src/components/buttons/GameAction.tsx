"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from ".";

const GameActionButton = ({
    className,
    children,
    ...props
}: BaseButtonProps) => {
    return (
        <BaseButton
            className={cn("py-3.5 px-5 text-2xl md:text-3xl", className)}
            {...props}
        >
            {children}
        </BaseButton>
    );
};

export default GameActionButton;
