"use client";

import { useState } from "react";

interface FocusHandlerCallback<Args extends unknown[]> {
    (...args: Args): void;
}

const useFocusHandler = <
    FocusArgs extends unknown[] = [],
    BlurArgs extends unknown[] = []
>(
    onFocusOverride?: FocusHandlerCallback<FocusArgs>,
    onBlurOverride?: FocusHandlerCallback<BlurArgs>
) => {
    const [isFocused, setIsFocused] = useState(false);

    const setFocus = (target: HTMLButtonElement, ...args: FocusArgs) => {
        if (onFocusOverride) onFocusOverride(...args);
        target.focus();
        setIsFocused(true);
    };

    const removeFocus = (target: HTMLButtonElement, ...args: BlurArgs) => {
        if (onBlurOverride) onBlurOverride(...args);
        target.blur();
        setIsFocused(false);
    };

    return { isFocused, setFocus, removeFocus };
};

export default useFocusHandler;
