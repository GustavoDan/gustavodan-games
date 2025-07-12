import { useRef, useCallback, useEffect, useState } from "react";

export type MachineState = "IDLE" | "RUNNING" | "PAUSED";
type TickFunction = (deltaTime: number) => void;

interface StateMachineControls {
    start: () => void;
    stop: () => void;
    togglePause: () => void;
    engineState: MachineState;
}

const useStateMachine = (onTick: TickFunction): StateMachineControls => {
    const [engineState, setEngineState] = useState<MachineState>("IDLE");
    const animationIdRef = useRef<number>(null);
    const lastTimeRef = useRef(performance.now());
    const onTickRef = useRef(onTick);
    onTickRef.current = onTick;

    useEffect(() => {
        if (engineState === "RUNNING") {
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
    }, [engineState]);

    const start = useCallback(() => setEngineState("RUNNING"), []);

    const stop = useCallback(() => setEngineState("IDLE"), []);

    const togglePause = useCallback(() => {
        setEngineState((current) => {
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

    return { start, stop, togglePause, engineState };
};

export default useStateMachine;
