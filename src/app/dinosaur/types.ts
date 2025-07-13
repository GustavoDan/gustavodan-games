export type MovementDirection = "IDLE" | "LEFT" | "RIGHT";

export interface Vector2D {
    x: number;
    y: number;
}

export interface DinosaurState {
    pos: Vector2D;
    vel: Vector2D;
    isJumping: boolean;
    isDucking: boolean;
    isFastFalling: boolean;
    jumpStrength: number;
    moveSpeed: number;
    moveDirection: MovementDirection;
}

export interface GameState {
    dinosaur: DinosaurState;
    worldSpeed: number;
}

export interface InputAction {
    down: boolean;
    up: boolean;
    left: boolean;
    right: boolean;
}
