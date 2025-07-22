"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from "./";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface MenuProps extends BaseButtonProps {
    id: string;
    children: ReactNode;
}

const Menu = ({ children, id, className, ...props }: MenuProps) => {
    const router = useRouter();

    return (
        <BaseButton
            id={id}
            className={cn("w-full py-4 px-5 sm-h:py-2.5", className)}
            onClick={() => router.push(`/${id}`)}
            {...props}
        >
            {children}
        </BaseButton>
    );
};

export default Menu;
