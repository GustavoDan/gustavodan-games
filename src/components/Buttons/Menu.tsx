"use client";

import { cn } from "@/utils/cn";
import { BaseButton, BaseButtonProps } from "./";
import { useRouter } from "next/navigation";

interface MenuProps extends BaseButtonProps {
    id: string;
    children: React.ReactNode;
}

const Menu = ({ children, id, className, ...props }: MenuProps) => {
    const router = useRouter();

    return (
        <BaseButton
            id={id}
            className={cn("w-full py-3.5 px-5", className)}
            onClick={() => router.push(`/${id}`)}
            {...props}
        >
            {children}
        </BaseButton>
    );
};

export default Menu;
