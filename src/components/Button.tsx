"use client";

import { useFocus } from "@/context/FocusContext";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    id: string;
    children: React.ReactNode;
}

const Button = ({ children, id, className = "", ...props }: ButtonProps) => {
    const { focusedId, setFocusedId } = useFocus();
    const isFocused = focusedId === id;

    const setFocus = (targetButton: HTMLButtonElement, id: string | null) => {
        setFocusedId(id);
        targetButton.focus();
    };

    const removeFocus = (targetButton: HTMLButtonElement) => {
        setFocusedId(null);
        targetButton.blur();
    };

    return (
        <button
            id={id}
            className={[
                "relative w-full py-3.5 px-5 bg-button rounded-xl text-button cursor-pointer shadow-button transition-all duration-300 ease-in-out",
                "before:absolute before:inset-0 before:z-[-1] before:size-full before:bg-focused-button before:rounded-xl",
                "before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out",
                "focus:outline-none active:transform-[translateY(-2px)_scale(1.01)]",
                isFocused
                    ? "transform-[translateY(-5px)_scale(1.02)] shadow-focused-button text-shadow-focused-button before:opacity-100"
                    : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            onFocus={(event) => setFocus(event?.currentTarget, id)}
            onMouseMove={(event) => setFocus(event?.currentTarget, id)}
            onMouseLeave={(event) => removeFocus(event?.currentTarget)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
