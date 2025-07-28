import { Touch } from "react";
import { BoundingBox, CollidableObject } from "@/types";

export const toBoundingBox = (entity: HTMLElement | Touch): BoundingBox => {
    if (entity instanceof HTMLElement) {
        const rect = entity.getBoundingClientRect();
        return {
            pos: {
                x: rect.left,
                y: rect.top,
            },
            size: {
                x: rect.width,
                y: rect.height,
            },
        };
    }

    return {
        pos: { x: entity.clientX, y: entity.clientY },
        size: { x: 0, y: 0 },
    };
};

export const areBoxesOverlapping = (box1: BoundingBox, box2: BoundingBox) => {
    return (
        box1.pos.x < box2.pos.x + box2.size.x &&
        box1.pos.x + box1.size.x > box2.pos.x &&
        box1.pos.y < box2.pos.y + box2.size.y &&
        box1.pos.y + box1.size.y > box2.pos.y
    );
};

const getImageData = (
    obj: CollidableObject,
    overlapX: number,
    overlapY: number,
    overlapWidth: number,
    overlapHeight: number
) => {
    const canvas = document.createElement("canvas");
    canvas.width = obj.size.x;
    canvas.height = obj.size.y;
    const context = canvas.getContext("2d", { willReadFrequently: true })!;
    const spriteScaleX =
        typeof obj.spriteScale === "number"
            ? obj.spriteScale
            : obj.spriteScale?.x ?? 1;
    const spriteScaleY =
        typeof obj.spriteScale === "number"
            ? obj.spriteScale
            : obj.spriteScale?.y ?? 1;
    let sx: number, sWidth: number, sHeight: number;

    if (obj.frameIndex != null) {
        sx = obj.frameIndex * (obj.size.x / spriteScaleX);
        sWidth = obj.size.x / spriteScaleX;
        sHeight = obj.size.y / spriteScaleY;
    } else {
        sx = 0;
        sWidth = obj.image.width;
        sHeight = obj.image.height;
    }

    context.drawImage(
        obj.image,
        sx,
        0,
        sWidth,
        sHeight,
        0,
        0,
        obj.size.x,
        obj.size.y
    );

    return context.getImageData(
        overlapX - obj.pos.x,
        overlapY - obj.pos.y,
        overlapWidth,
        overlapHeight
    ).data;
};

export const isPixelColliding = (
    obj1: CollidableObject,
    obj2: CollidableObject
) => {
    const overlapX = Math.max(obj1.pos.x, obj2.pos.x);
    const overlapY = Math.max(obj1.pos.y, obj2.pos.y);
    const overlapWidth =
        Math.min(obj1.pos.x + obj1.size.x, obj2.pos.x + obj2.size.x) - overlapX;
    const overlapHeight =
        Math.min(obj1.pos.y + obj1.size.y, obj2.pos.y + obj2.size.y) - overlapY;

    if (overlapWidth < 1 || overlapHeight < 1) {
        return false;
    }

    const imageData1 = getImageData(
        obj1,
        overlapX,
        overlapY,
        overlapWidth,
        overlapHeight
    );
    const imageData2 = getImageData(
        obj2,
        overlapX,
        overlapY,
        overlapWidth,
        overlapHeight
    );

    const pixelIndices = Array.from(
        { length: imageData1.length / 4 },
        (_, k) => k * 4
    );

    return pixelIndices.some((i) => {
        const alpha1 = imageData1[i + 3];
        const alpha2 = imageData2[i + 3];
        return alpha1 > 128 && alpha2 > 128;
    });
};
