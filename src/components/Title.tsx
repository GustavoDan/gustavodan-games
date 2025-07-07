import { cn } from "@/utils/cn";
import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}

const Title = ({ children, className, ...props }: TitleProps) => {
    return (
        <h1
            className={cn(
                "font-title text-center text-white text-5xl font-bold text-shadow-title leading-[1.4]",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    );
};

export default Title;
