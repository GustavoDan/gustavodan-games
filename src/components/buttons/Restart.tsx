"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from "./";

type RestartProps = Omit<BaseButtonProps, "children">;

const Restart = ({ className, ...props }: RestartProps) => {
    return (
        <BaseButton
            className={cn("py-3.5 px-5 text-2xl md:text-3xl", className)}
            {...props}
        >
            Restart Game
        </BaseButton>
    );
};

export default Restart;
