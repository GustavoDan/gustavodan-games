export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CollidableObject extends BoundingBox {
    image: HTMLImageElement;
    frameIndex?: number | null;
}
