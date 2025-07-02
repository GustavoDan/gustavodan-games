"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from "./";

interface RestartProps extends Omit<BaseButtonProps, "children"> {}

const Restart = ({ className, ...props }: RestartProps) => {
    return (
        <BaseButton
            className={cn("text-3xl py-3.5 px-5", className)}
            {...props}
        >
            Restart Game
        </BaseButton>
    );
};

export default Restart;
