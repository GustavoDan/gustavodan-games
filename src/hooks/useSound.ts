import { useCallback, useEffect, useState } from "react";

interface PlayOptions {
    volume?: number;
}

const useSound = (soundFile: string) => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const audioInstance = new Audio(soundFile);

        audioInstance.addEventListener("canplaythrough", () => {
            setIsLoaded(true);
        });

        setAudio(audioInstance);

        return () => {
            audioInstance.pause();
            audioInstance.removeEventListener("canplaythrough", () =>
                setIsLoaded(true)
            );
        };
    }, [soundFile]);

    const play = useCallback(
        (options?: PlayOptions) => {
            if (audio && isLoaded) {
                audio.currentTime = 0;

                if (options?.volume) {
                    audio.volume = options.volume;
                }

                audio.play().catch((error) => {
                    console.error("Error playing sound:", error);
                });
            }
        },
        [audio, isLoaded]
    );

    return play;
};

export default useSound;
