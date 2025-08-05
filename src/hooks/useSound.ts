import { useEffect, useMemo, useRef } from "react";

interface PlayOptions {
    volume?: number;
}
type PlayFunction = (options?: PlayOptions) => void;
interface SoundPlayer {
    play: PlayFunction;
    playLoop: PlayFunction;
    playOnce: PlayFunction;
    togglePause: () => void;
    stop: () => void;
    isPlaying: boolean;
}
type PlayersObject<T> = { [K in keyof T]: SoundPlayer };

const useSound = <T extends string | Record<string, string>>(
    soundSource: T
): T extends string ? SoundPlayer : PlayersObject<T> => {
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
                const getMasterAudio = () => audioRefs.current[key];

                const executePlay = (
                    soundInstance: HTMLAudioElement,
                    options?: PlayOptions
                ) => {
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

                const schedulePlay = (
                    soundInstance: HTMLAudioElement,
                    playLogic: () => void
                ) => {
                    if (soundInstance.readyState >= 3) {
                        playLogic();
                    } else {
                        const handleCanPlayThrough = () => {
                            playLogic();
                            soundInstance.removeEventListener(
                                "canplaythrough",
                                handleCanPlayThrough
                            );
                        };
                        soundInstance.addEventListener(
                            "canplaythrough",
                            handleCanPlayThrough
                        );
                    }
                };

                const playMasterInstance = (
                    isLooping: boolean,
                    options?: PlayOptions
                ) => {
                    const audio = getMasterAudio();
                    if (!audio) return;

                    const playLogic = () => {
                        audio.loop = isLooping;
                        audio.currentTime = 0;
                        executePlay(audio, options);
                    };

                    schedulePlay(audio, playLogic);
                };

                const play: SoundPlayer["play"] = (options) => {
                    const masterAudio = getMasterAudio();
                    if (!masterAudio) return;

                    const playLogic = () => {
                        const soundInstance = masterAudio.cloneNode(
                            true
                        ) as HTMLAudioElement;
                        executePlay(soundInstance, options);
                    };

                    schedulePlay(masterAudio, playLogic);
                };

                const playOnce: SoundPlayer["playOnce"] = (options) => {
                    playMasterInstance(false, options);
                };

                const playLoop: SoundPlayer["playLoop"] = (options) => {
                    playMasterInstance(true, options);
                };

                const togglePause: SoundPlayer["togglePause"] = () => {
                    const audio = getMasterAudio();
                    if (!audio) return;

                    if (audio.paused) {
                        executePlay(audio);
                    } else {
                        audio.pause();
                    }
                };

                const stop: SoundPlayer["stop"] = () => {
                    const audio = getMasterAudio();
                    if (!audio) return;
                    audio.pause();
                    audio.currentTime = 0;
                    audio.loop = false;
                };

                return [key, { play, playOnce, playLoop, togglePause, stop }];
            })
        );
    }, [soundMap]);

    return (isSingleSound ? players.default : players) as T extends string
        ? SoundPlayer
        : PlayersObject<T>;
};

export default useSound;
