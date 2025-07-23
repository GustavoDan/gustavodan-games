import {
    BaseInputAction,
    HorizontalMovementDirection,
    Vector2D,
    VerticalMovementDirection,
} from "@/types";

export interface PlayerState {
    pos: Vector2D;
    moveSpeed: number;
    moveDirection: {
        vertical: VerticalMovementDirection;
        horizontal: HorizontalMovementDirection;
    };
}

export interface GameState {
    player: PlayerState;
}

export interface ShooterInputAction extends BaseInputAction {
    shoot: boolean;
}
