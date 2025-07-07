import { Touch } from "react";

export const isTouchInside = (target: HTMLElement, touch: Touch) => {
    const targetRect = target.getBoundingClientRect();
    return (
        touch.clientX >= targetRect.left &&
        touch.clientX <= targetRect.right &&
        touch.clientY >= targetRect.top &&
        touch.clientY <= targetRect.bottom
    );
};
