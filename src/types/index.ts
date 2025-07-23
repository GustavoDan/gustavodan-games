import { MachineState } from "@/hooks/useStateMachine";

export type VerticalMovementDirection = "IDLE" | "UP" | "DOWN";
export type HorizontalMovementDirection = "IDLE" | "LEFT" | "RIGHT";
export type AllMovementDirection =
    | HorizontalMovementDirection
    | VerticalMovementDirection;

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

export interface Vector2D {
    x: number;
    y: number;
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
