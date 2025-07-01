"use client";

import { cn } from "@/utils/cn";
import BaseButton, { BaseButtonProps } from "./BaseButton";
import { useRouter } from "next/navigation";

interface MenuButtonProps extends BaseButtonProps {
    id: string;
    children: React.ReactNode;
}

const MenuButton = ({ children, id, className, ...props }: MenuButtonProps) => {
    const router = useRouter();

    return (
        <BaseButton
            id={id}
            className={cn(className)}
            onClick={() => router.push(`/${id}`)}
            {...props}
        >
            {children}
        </BaseButton>
    );
};
export default MenuButton;
