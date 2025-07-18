import { useState, useEffect } from "react";

const useAssetLoader = <T extends Record<string, string>>(sources: T) => {
    const [isLoading, setIsLoading] = useState(true);
    const [assets, setAssets] = useState<Record<
        keyof T,
        HTMLImageElement
    > | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        const loadAssets = async () => {
            const assetPromises = Object.entries(sources).map(([key, url]) => {
                return new Promise<[keyof T, HTMLImageElement]>(
                    (resolve, reject) => {
                        const img = new Image();
                        img.src = url;

                        img.onload = () => resolve([key, img]);
                        img.onerror = () =>
                            reject(
                                new Error(`Falha ao carregar asset: ${url}`)
                            );
                    }
                );
            });

            try {
                const loadedAssetTuples = await Promise.all(assetPromises);

                if (!isCancelled) {
                    const assetMap = Object.fromEntries(loadedAssetTuples);

                    setAssets(assetMap as Record<keyof T, HTMLImageElement>);
                    setIsLoading(false);
                }
            } catch (err) {
                if (!isCancelled && err instanceof Error) {
                    setError(err.message);
                    setIsLoading(false);
                }
            }
        };

        loadAssets();

        return () => {
            isCancelled = true;
        };
    }, [sources]);

    return { isLoading, assets, error };
};

export default useAssetLoader;
