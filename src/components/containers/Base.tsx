import { cn } from "@/utils/cn";
import { forwardRef, HTMLAttributes, Ref } from "react";

export type BaseProps = HTMLAttributes<HTMLDivElement>;

const Base = forwardRef(
    (
        { children, className, ...props }: BaseProps,
        ref: Ref<HTMLDivElement>
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col bg-transparent-dark-blue border border-transparent-grey rounded-[1.25rem] before:rounded-b-full backdrop-blur-[10px] shadow-soft select-none",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Base.displayName = "BaseContainer";

export default Base;
