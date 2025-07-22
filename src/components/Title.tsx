import { cn } from "@/utils/cn";
import { HTMLAttributes, ReactNode } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}

const Title = ({ children, className, ...props }: TitleProps) => {
    return (
        <h1
            className={cn(
                "font-title text-center text-white text-3xl font-bold text-shadow-title leading-[1.4] ",
                "md:text-5xl sm-h:text-xl",
                className
            )}
            {...props}
        >
            {children}
        </h1>
    );
};

export default Title;
