import { useEffect, useRef } from "react";

type EventMap = HTMLElementEventMap & WindowEventMap;

const useEventListener = <K extends keyof EventMap>(
    eventName: K,
    handler: (event: EventMap[K]) => void,
    element?: EventTarget
) => {
    const savedHandler = useRef(handler);
    savedHandler.current = handler;

    useEffect(() => {
        const target = element ?? window;

        const eventListener = (event: Event) => {
            savedHandler.current(event as EventMap[K]);
        };

        target.addEventListener(eventName, eventListener);

        return () => {
            target.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};

export default useEventListener;
