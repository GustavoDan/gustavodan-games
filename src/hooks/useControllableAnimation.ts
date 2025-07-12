import { useEffect, useRef } from "react";

interface AnimationControls {
    isPlaying: boolean;
    playbackRate: number;
}

const useControllableAnimation = (
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options: KeyframeAnimationOptions,
    controls: AnimationControls
) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<Animation | null>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const animation = element.animate(keyframes, options);
        animation.pause();

        animationRef.current = animation;

        return () => {
            animation.cancel();
        };
    }, []);

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

    return elementRef;
};

export default useControllableAnimation;
