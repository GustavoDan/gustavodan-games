"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from "./";
import { useRouter } from "next/navigation";

type BackProps = Omit<BaseButtonProps, "children">;

const Back = ({ className, ...props }: BackProps) => {
    const router = useRouter();

    return (
        <BaseButton
            onClick={router.back}
            className={cn(
                "text-sm p-2 leading-0.5  aspect-square md:text-xl md:p-0 md:leading-none md:indent-0.5 md:size-10.5",
                className
            )}
            {...props}
        >
            ←
        </BaseButton>
    );
};

export default Back;
