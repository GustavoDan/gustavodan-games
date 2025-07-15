"use client";

import { CSSProperties, useEffect } from "react";

type ImagePreloaderProps = {
    imageUrls: string[];
    onReady?: () => void;
};

const hiddenStyles: CSSProperties = {
    display: "none",
    position: "absolute",
    width: 0,
    height: 0,
    overflow: "hidden",
};

export function ImagePreloader({ imageUrls, onReady }: ImagePreloaderProps) {
    useEffect(() => {
        let loadedCount = 0;
        const numImages = imageUrls.length;

        if (numImages === 0) {
            onReady?.();
            return;
        }

        imageUrls.forEach((url) => {
            const img = new Image();
            img.src = url;

            img.decode()
                .then(() => {
                    loadedCount++;
                    if (loadedCount === numImages) {
                        onReady?.();
                    }
                })
                .catch((error) => {
                    console.error(
                        `Failed to preload and decode image: ${url}`,
                        error
                    );
                    loadedCount++;
                    if (loadedCount === numImages) {
                        onReady?.();
                    }
                });
        });
    }, [imageUrls, onReady]);

    return (
        <div style={hiddenStyles} aria-hidden="true">
            {imageUrls.map((src) => (
                <img key={src} src={src} />
            ))}
        </div>
    );
}
