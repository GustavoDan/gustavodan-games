import getStepsFromEasingString from "@/utils/getStepsFromEasingString";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface AnimationControls {
    isPlaying: boolean;
    playbackRate: number;
}

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
    const stepsAmount = useMemo(
        () => getStepsFromEasingString(options.easing),
        [options.easing]
    );
    const animationDuration = useMemo(
        () => handleDuration(options.duration),
        [options.duration]
    );
    const durationPerFrame = useMemo(() => {
        if (!animationDuration || !stepsAmount || stepsAmount === 0)
            return null;
        return animationDuration / stepsAmount;
    }, [animationDuration, stepsAmount]);

    const getCurrentFrame = useCallback(() => {
        const currentTime = animationRef.current?.currentTime;
        if (!animationDuration || !durationPerFrame || !currentTime)
            return null;

        const currentTimeFloat = parseFloat(currentTime.toString());
        const cycleTime = currentTimeFloat % animationDuration;
        const frameIndex = Math.floor(cycleTime / durationPerFrame);

        return frameIndex;
    }, [animationDuration, durationPerFrame]);

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
        if (!animation) return;

        if (controls.isPlaying) {
            animation.play();
        } else {
            animation.pause();
        }

        animation.playbackRate = controls.playbackRate;
    }, [controls.isPlaying, controls.playbackRate]);

    return { getCurrentFrame, elementRef };
};

export default useControllableAnimation;
