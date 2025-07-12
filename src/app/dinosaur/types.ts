export type MovementDirection = "RIGHT" | "LEFT" | "IDLE";

export interface Vector2D {
    x: number;
    y: number;
}

export interface DinosaurState {
    pos: Vector2D;
    vel: Vector2D;
    isJumping: boolean;
    jumpStrength: number;
    moveDirection: MovementDirection;
}

export interface GameState {
    dinosaur: DinosaurState;
}
