export type MovementDirection = "IDLE" | "LEFT" | "RIGHT";
export type MovementDirectionNoIdle = Exclude<MovementDirection, "IDLE">;
export type MovementType = "START" | "STOP";
export type MovementFunction = (
    currentState: DinosaurState,
    type?: MovementType,
    direction?: MovementDirectionNoIdle
) => DinosaurState;

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
