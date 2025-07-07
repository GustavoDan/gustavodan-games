"use client";

import { forwardRef, useMemo } from "react";
import type {
    ButtonHTMLAttributes,
    ReactNode,
    Ref,
    SyntheticEvent,
} from "react";
import { cn } from "@/utils/cn";
import useFocusHandler from "@/hooks/useFocusHandler";
import { isTouchInside } from "@/utils/isTouchInside";

export interface BaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Base = forwardRef(
    (
        {
            children,
            className,
            onFocus,
            onBlur,
            onMouseMove,
            onMouseLeave,
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            ...props
        }: BaseProps,
        ref: Ref<HTMLButtonElement>
    ) => {
        const { isFocused, setFocus, removeFocus } = useFocusHandler();

        const createHandler =
            <T extends SyntheticEvent<HTMLButtonElement>>(
                action: (target: HTMLButtonElement, event: T) => void,
                originalHandler?: (event: T) => void
            ) =>
            (event: T) => {
                action(event.currentTarget, event);
                originalHandler?.(event);
            };

        const commonHandlers = useMemo(
            () => ({
                onFocus: createHandler(setFocus, onFocus),
                onBlur: createHandler(removeFocus, onBlur),
                onMouseMove: createHandler(setFocus, onMouseMove),
                onMouseLeave: createHandler(removeFocus, onMouseLeave),
                onTouchStart: createHandler(setFocus, onTouchStart),
                onTouchEnd: createHandler((target, event) => {
                    event.preventDefault();

                    if (!isTouchInside(target, event.changedTouches[0])) return;
                    event.currentTarget.click();
                    removeFocus(event.currentTarget);
                }, onTouchEnd),
                onTouchMove: createHandler((target, event) => {
                    if (isTouchInside(target, event.touches[0])) {
                        setFocus(target);
                        return;
                    }
                    removeFocus(target);
                }, onTouchMove),
            }),
            [
                onFocus,
                onBlur,
                onMouseMove,
                onMouseLeave,
                onTouchStart,
                onTouchEnd,
                onTouchMove,
                setFocus,
                removeFocus,
            ]
        );

        return (
            <button
                ref={ref}
                className={cn(
                    "relative bg-button rounded-xl text-2xl cursor-pointer shadow-button transition-all duration-300 ease-in-out",
                    "before:absolute before:inset-0 before:z-[-1] before:size-full before:bg-focused-button before:rounded-xl",
                    "before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out",
                    "focus:outline-none hover:active:transform-[translateY(-2px)_scale(1.01)] disabled:cursor-not-allowed disabled:opacity-50",
                    isFocused
                        ? "transform-[translateY(-5px)_scale(1.02)] shadow-focused-button text-shadow-focused-button before:opacity-100"
                        : "",
                    className
                )}
                {...commonHandlers}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Base.displayName = "BaseButton";

export default Base;
