"use client";

import { DeleteObjectFn, EnemyState } from "./types";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { useEffect, useMemo, useState } from "react";
import { MachineState } from "@/hooks/useStateMachine";
import useControllableAnimation from "@/hooks/useControllableAnimation";
import { cn } from "@/utils/cn";

interface EnemyProps {
    enemyState: EnemyState;
    engineState: MachineState;
    isMarkedForDeletion: boolean;
    deleteObject: DeleteObjectFn;
}

const STEPS = 10;

const Enemy = ({
    enemyState,
    engineState,
    isMarkedForDeletion,
    deleteObject,
}: EnemyProps) => {
    const [shouldPlayAnimation, setShouldPlayAnimation] = useState(false);

    const currentEnemyType = CONSTANT_SIZES.enemies[enemyState.type];
    const explosionSize = CONSTANT_SIZES.enemyExplosion;

    const keyframes = useMemo(
        () => [
            { backgroundPosition: "0 0" },
            {
                backgroundPosition: `-${explosionSize.width * STEPS}px 0`,
            },
        ],
        [explosionSize.width]
    );

    const options = useMemo(
        () => ({
            duration: 300,
            easing: `steps(${STEPS}, end)`,
            fill: "forwards" as const,
        }),
        []
    );

    const animationControls = {
        isPlaying: shouldPlayAnimation && engineState === "RUNNING",
        playbackRate: 1,
    };

    const { elementRef, isFinished } = useControllableAnimation(
        keyframes,
        options,
        animationControls
    );

    useEffect(() => {
        if (isMarkedForDeletion && !shouldPlayAnimation) {
            setShouldPlayAnimation(true);
        }
    }, [isMarkedForDeletion, shouldPlayAnimation]);

    useEffect(() => {
        if (isMarkedForDeletion && isFinished) {
            deleteObject("enemies", enemyState.id);
        }
    }, [isFinished, isMarkedForDeletion, deleteObject, enemyState.id]);

    return (
        <div
            style={{
                backgroundImage: `url(${
                    ALL_SPRITES[`${enemyState.type}Enemy`]
                })`,
                width: currentEnemyType.width,
                height: currentEnemyType.height,
                bottom: enemyState.pos.y,
                left: enemyState.pos.x,
            }}
            className={
                "absolute text-red-400 animate-neon-text-pulse flex items-center justify-center"
            }
        >
            <div
                ref={elementRef}
                style={{
                    backgroundImage: `url(${ALL_SPRITES.enemyExplosion})`,
                    width: explosionSize.width,
                    height: explosionSize.height,
                }}
                className={cn("absolute", !isMarkedForDeletion && "hidden")}
            />
        </div>
    );
};
export default Enemy;
