import { useCallback, useEffect, useMemo, useRef } from "react";

interface AnimationControls {
    isPlaying: boolean;
    playbackRate: number;
}

const parseStepsEasing = (easingString: string | undefined) => {
    const match = easingString?.match(/steps\((\d+)(?:,\s*(start|end))?\)/);

    if (!match) {
        return null;
    }

    const amount = parseInt(match[1], 10);
    const jump = match[2] || "end";

    return { amount, jump };
};

const handleDuration = (
    duration: CSSNumericValue | string | number | undefined
) => {
    if (!duration) return null;
    if (typeof duration === "number") return duration;
    return parseInt(duration.toString());
};

const useControllableAnimation = (
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions,
    controls: AnimationControls
) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);
    const stepsConfig = useMemo(
        () => parseStepsEasing(options.easing),
        [options.easing]
    );
    const animationDuration = useMemo(
        () => handleDuration(options.duration),
        [options.duration]
    );
    const durationPerFrame = useMemo(() => {
        if (!animationDuration || !stepsConfig?.amount) return null;

        return animationDuration / stepsConfig.amount;
    }, [animationDuration, stepsConfig?.amount]);

    const getCurrentFrame = useCallback(() => {
        const currentTime = animationRef.current?.currentTime;

        if (
            !animationDuration ||
            !durationPerFrame ||
            !stepsConfig ||
            !stepsConfig.amount ||
            currentTime == null
        )
            return null;

        const currentTimeFloat = parseFloat(currentTime.toString());

        if (
            options.fill === "forwards" &&
            currentTimeFloat === animationDuration
        ) {
            return stepsConfig.amount;
        }

        const cycleTime = currentTimeFloat % animationDuration;
        const frameIndex = Math.floor(cycleTime / durationPerFrame);

        if (stepsConfig.jump === "start") {
            return currentTimeFloat !== animationDuration ? frameIndex + 1 : 0;
        }

        return frameIndex;
    }, [animationDuration, durationPerFrame, options.fill, stepsConfig]);

    const isFinished = useCallback(() => {
        return animationRef.current?.playState === "finished";
    }, []);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const animation = element.animate(keyframes, options);
        animation.pause();

        animationRef.current = animation;

        return () => {
            animation.cancel();
        };
    }, [keyframes, options]);

    useEffect(() => {
        const animation = animationRef.current;
        if (!animation || isFinished()) return;

        if (controls.isPlaying) {
            animation.play();
        } else {
            animation.pause();
        }

        animation.playbackRate = controls.playbackRate;
    }, [controls.isPlaying, controls.playbackRate, isFinished]);

    return {
        getCurrentFrame,
        isFinished,
        elementRef,
    };
};

export default useControllableAnimation;
