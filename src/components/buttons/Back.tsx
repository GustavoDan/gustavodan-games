"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from "./";
import { useRouter } from "next/navigation";

interface BackProps extends Omit<BaseButtonProps, "children"> {}

const Back = ({ className, ...props }: BackProps) => {
    const router = useRouter();

    return (
        <BaseButton
            onClick={router.back}
            className={cn("size-10.5", className)}
            {...props}
        >
            ←
        </BaseButton>
    );
};

export default Back;
