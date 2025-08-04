import { useEffect, useMemo, useRef } from "react";

interface PlayOptions {
    volume?: number;
}

type PlayFunction = (options?: PlayOptions) => void;
type PlayersObject<T> = { [K in keyof T]: PlayFunction };

const useSound = <T extends string | Record<string, string>>(
    soundSource: T
): T extends string ? PlayFunction : PlayersObject<T> => {
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

    const isSingleSound = typeof soundSource === "string";
    const soundMap = useMemo(
        () => (isSingleSound ? { default: soundSource } : soundSource),
        [isSingleSound, soundSource]
    );

    useEffect(() => {
        Object.entries(soundMap).forEach(([key, soundFile]) => {
            if (!audioRefs.current[key]) {
                const audio = new Audio(soundFile);
                audio.load();
                audioRefs.current[key] = audio;
            }
        });

        return () => {
            Object.values(audioRefs.current).forEach((audio) => {
                audio?.pause();
            });
            audioRefs.current = {};
        };
    }, [soundMap]);

    const players = useMemo(() => {
        return Object.fromEntries(
            Object.keys(soundMap).map((key) => {
                const playerFunction: PlayFunction = (options) => {
                    const audio = audioRefs.current[key];
                    if (!audio) return;

                    const playSound = () => {
                        const soundInstance = audio.cloneNode(
                            true
                        ) as HTMLAudioElement;
                        if (options?.volume) {
                            soundInstance.volume = options.volume;
                        }
                        soundInstance.play().catch((error) => {
                            console.error(
                                `Error playing sound for key "${key}":`,
                                error
                            );
                        });
                    };

                    if (audio.readyState >= 3) {
                        playSound();
                    } else {
                        const handleCanPlayThrough = () => {
                            playSound();
                            audio.removeEventListener(
                                "canplaythrough",
                                handleCanPlayThrough
                            );
                        };
                        audio.addEventListener(
                            "canplaythrough",
                            handleCanPlayThrough
                        );
                    }
                };

                return [key, playerFunction];
            })
        );
    }, [soundMap]);

    return (isSingleSound ? players.default : players) as T extends string
        ? PlayFunction
        : PlayersObject<T>;
};

export default useSound;
