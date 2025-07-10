import { useRef, useCallback, useEffect, useState } from "react";

export type MachineStatus = "IDLE" | "RUNNING" | "PAUSED";
type TickFunction = (deltaTime: number) => void;

interface StateMachineControls {
    start: () => void;
    stop: () => void;
    togglePause: () => void;
    status: MachineStatus;
}

const useStateMachine = (onTick: TickFunction): StateMachineControls => {
    const [status, setStatus] = useState<MachineStatus>("IDLE");
    const animationIdRef = useRef<number>(null);
    const lastTimeRef = useRef(performance.now());
    const onTickRef = useRef(onTick);
    onTickRef.current = onTick;

    useEffect(() => {
        if (status === "RUNNING") {
            lastTimeRef.current = performance.now();

            const loop = (currentTime: number) => {
                const deltaTime = (currentTime - lastTimeRef.current) / 1000;
                onTickRef.current(deltaTime);
                lastTimeRef.current = currentTime;

                animationIdRef.current = requestAnimationFrame(loop);
            };

            animationIdRef.current = requestAnimationFrame(loop);
        }

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
        };
    }, [status]);

    const start = useCallback(() => setStatus("RUNNING"), []);

    const stop = useCallback(() => setStatus("IDLE"), []);

    const togglePause = useCallback(() => {
        console.log("pause");
        setStatus((current) => {
            switch (current) {
                case "RUNNING":
                    return "PAUSED";
                case "PAUSED":
                    return "RUNNING";
                default:
                    return current;
            }
        });
    }, []);

    return { start, stop, togglePause, status };
};

export default useStateMachine;
