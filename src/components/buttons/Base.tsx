import { forwardRef } from "react";
import type { ButtonHTMLAttributes, Ref } from "react";
import { cn } from "@/utils/cn";
import useFocusHandler from "@/hooks/useFocusHandler";

export interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Base = forwardRef(
    (
        {
            children,
            className,
            onFocus,
            onMouseMove,
            onMouseLeave,
            onBlur,
            ...props
        }: BaseProps,
        ref: Ref<HTMLButtonElement>
    ) => {
        const { isFocused, setFocus, removeFocus } = useFocusHandler();

        return (
            <button
                ref={ref}
                className={cn(
                    "relative bg-button rounded-xl text-2xl cursor-pointer shadow-button transition-all duration-300 ease-in-out",
                    "before:absolute before:inset-0 before:z-[-1] before:size-full before:bg-focused-button before:rounded-xl",
                    "before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out",
                    "focus:outline-none active:transform-[translateY(-2px)_scale(1.01)] disabled:cursor-not-allowed disabled:opacity-50",
                    isFocused
                        ? "transform-[translateY(-5px)_scale(1.02)] shadow-focused-button text-shadow-focused-button before:opacity-100"
                        : "",
                    className
                )}
                onFocus={(event) => {
                    setFocus(event.currentTarget);
                    if (onFocus) onFocus(event);
                }}
                onMouseMove={(event) => {
                    setFocus(event.currentTarget);
                    if (onMouseMove) onMouseMove(event);
                }}
                onMouseLeave={(event) => {
                    removeFocus(event.currentTarget);
                    if (onMouseLeave) onMouseLeave(event);
                }}
                onBlur={(event) => {
                    removeFocus(event.currentTarget);
                    if (onBlur) onBlur(event);
                }}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Base.displayName = "BaseButton";

export default Base;
