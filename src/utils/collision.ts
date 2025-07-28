import { BoundingBox, CollidableObject } from "@/types";

const getImageData = (
    obj: CollidableObject,
    overlapX: number,
    overlapY: number,
    overlapWidth: number,
    overlapHeight: number
) => {
    const canvas = document.createElement("canvas");
    canvas.width = obj.width;
    canvas.height = obj.height;
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
        sx = obj.frameIndex * (obj.width / spriteScaleX);
        sWidth = obj.width / spriteScaleX;
        sHeight = obj.height / spriteScaleY;
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
        obj.width,
        obj.height
    );

    return context.getImageData(
        overlapX - obj.x,
        overlapY - obj.y,
        overlapWidth,
        overlapHeight
    ).data;
};

export const areBoxesOverlapping = (box1: BoundingBox, box2: BoundingBox) => {
    return (
        box1.x < box2.x + box2.width &&
        box1.x + box1.width > box2.x &&
        box1.y < box2.y + box2.height &&
        box1.y + box1.height > box2.y
    );
};

export const isPixelColliding = (
    obj1: CollidableObject,
    obj2: CollidableObject
) => {
    const overlapX = Math.max(obj1.x, obj2.x);
    const overlapY = Math.max(obj1.y, obj2.y);
    const overlapWidth =
        Math.min(obj1.x + obj1.width, obj2.x + obj2.width) - overlapX;
    const overlapHeight =
        Math.min(obj1.y + obj1.height, obj2.y + obj2.height) - overlapY;

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
