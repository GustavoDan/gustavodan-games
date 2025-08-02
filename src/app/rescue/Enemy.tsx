"use client";

import { MachineState } from "@/hooks/useStateMachine";
import { EnemyState, VolatileDataFn } from "./types";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { capitalize } from "@/utils/string";
import { useEffect, useMemo } from "react";
import useControllableAnimation from "@/hooks/useControllableAnimation";

interface EnemyProps {
    enemyState: EnemyState;
    engineState: MachineState;
    onFrameUpdate: VolatileDataFn;
}

const DEFAULT_STEPS = 1;
const HELICOPTER_STEPS = 2;

const Enemy = ({ enemyState, engineState, onFrameUpdate }: EnemyProps) => {
    const enemySize = CONSTANT_SIZES.enemies[enemyState.type];

    const steps = useMemo(
        () =>
            enemyState.type === "helicopter" ? HELICOPTER_STEPS : DEFAULT_STEPS,
        [enemyState.type]
    );

    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${enemySize.width * steps}px 0`,
            },
        ],
        [enemySize.width, steps]
    );

    const options = useMemo(
        () => ({
            duration: 200,
            easing: `steps(${steps}, end)`,
            iterations: Infinity,
        }),
        [steps]
    );

    const animationControls = {
        isPlaying: engineState === "RUNNING",
        playbackRate: 1,
    };

    const { elementRef, getCurrentFrame } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    useEffect(() => {
        onFrameUpdate(getCurrentFrame);
    }, [getCurrentFrame, onFrameUpdate]);

    return (
        <div
            ref={elementRef}
            style={{
                backgroundImage: `url(${
                    ALL_SPRITES[`enemy${capitalize(enemyState.type)}`]
                })`,
                width: enemySize.width,
                height: enemySize.height,
                bottom: enemyState?.pos.y,
                left: enemyState?.pos.x,
            }}
            className="absolute"
        />
    );
};
export default Enemy;
