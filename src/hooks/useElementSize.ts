import { useState, useEffect, RefObject } from "react";

interface ElementSize {
    width: number;
    height: number;
}

const useElementSize = <T extends HTMLElement>(
    elementRef: RefObject<T | null>
): ElementSize => {
    const [size, setSize] = useState<ElementSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return size;
};

export default useElementSize;
