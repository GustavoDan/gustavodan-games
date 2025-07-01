import { cn } from "@/utils/cn";
import { HTMLAttributes } from "react";

const MainContainer = ({
    children,
    className = "",
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center bg-transparent-dark-blue border border-transparent-grey rounded-[1.25rem] backdrop-blur-[10px] shadow-soft select-none",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
export default MainContainer;
