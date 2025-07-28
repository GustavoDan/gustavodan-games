import { MachineState } from "@/hooks/useStateMachine";

export type VerticalMovementDirection = "IDLE" | "UP" | "DOWN";
export type HorizontalMovementDirection = "IDLE" | "LEFT" | "RIGHT";
export type AllMovementDirection =
    | HorizontalMovementDirection
    | VerticalMovementDirection;

export interface Vector2D {
    x: number;
    y: number;
}

export interface BoundingBox {
    pos: Vector2D;
    size: Vector2D;
}

export interface CollidableObject extends BoundingBox {
    image: HTMLImageElement;
    spriteScale?: number | Vector2D;
    frameIndex?: number | null;
}

export type Binding = {
    keys: string[];
    states: MachineState[];
    action: (eventType: KeyboardEvent["type"]) => void;
};

export interface BaseInputAction {
    down: boolean;
    up: boolean;
    left: boolean;
    right: boolean;
}
