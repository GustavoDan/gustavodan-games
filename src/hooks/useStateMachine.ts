import { useRef, useCallback, useEffect, useState } from "react";

export type MachineState = "IDLE" | "RUNNING" | "PAUSED";
type TickFunction = (deltaTime: number) => void;

interface StateMachineControls {
    start: () => void;
    stop: () => void;
    togglePause: () => void;
    engineState: MachineState;
}

type GameLoopOptions = {
    onPause?: () => void;
    onResume?: () => void;
    onStart?: () => void;
    onStop?: () => void;
};

const useStateMachine = (
    onTick: TickFunction,
    { onPause, onResume, onStart, onStop }: GameLoopOptions = {}
): StateMachineControls => {
    const [engineState, setEngineState] = useState<MachineState>("IDLE");
    const animationIdRef = useRef<number>(null);
    const lastTimeRef = useRef(performance.now());
    const onTickRef = useRef(onTick);
    onTickRef.current = onTick;

    useEffect(() => {
        if (engineState === "RUNNING") {
            const loop = (currentTime: number) => {
                if (lastTimeRef.current === 0) {
                    lastTimeRef.current = currentTime;
                }

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

    const start = useCallback(() => {
        lastTimeRef.current = 0;
        setEngineState("RUNNING");
        onStart?.();
    }, [onStart]);

    const stop = useCallback(() => {
        setEngineState("IDLE");
        onStop?.();
    }, [onStop]);

    const togglePause = useCallback(() => {
        setEngineState((current) => {
            switch (current) {
                case "RUNNING":
                    onPause?.();
                    return "PAUSED";
                case "PAUSED":
                    lastTimeRef.current = 0;
                    onResume?.();
                    return "RUNNING";
                default:
                    return current;
            }
        });
    }, [onPause, onResume]);

    return { start, stop, togglePause, engineState };
};

export default useStateMachine;
