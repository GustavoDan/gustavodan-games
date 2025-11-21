interface VolumeSettings {
    sound: boolean;
    music: boolean;
}

const DEFAULT_VOLUME_SETTINGS: VolumeSettings = {
    sound: true,
    music: true,
};

const getStorageKey = (gameName: string): string => `${gameName}_volume`;

export const loadVolumeSettings = (gameName: string): VolumeSettings => {
    if (typeof window === "undefined") {
        return DEFAULT_VOLUME_SETTINGS;
    }

    try {
        const stored = localStorage.getItem(getStorageKey(gameName));
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                sound: parsed.sound ?? DEFAULT_VOLUME_SETTINGS.sound,
                music: parsed.music ?? DEFAULT_VOLUME_SETTINGS.music,
            };
        }
    } catch (error) {
        console.error(`Error loading volume settings for ${gameName}:`, error);
    }

    return DEFAULT_VOLUME_SETTINGS;
};

export const saveVolumeSettings = (
    gameName: string,
    settings: VolumeSettings
): void => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.setItem(getStorageKey(gameName), JSON.stringify(settings));
    } catch (error) {
        console.error(`Error saving volume settings for ${gameName}:`, error);
    }
};
