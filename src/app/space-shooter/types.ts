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
    currentShotCooldown: number;
}

export interface ShotState {
    id: string;
    pos: Vector2D;
}

export interface GameState {
    player: PlayerState;
    shots: ShotState[];
}

export interface ShooterInputAction extends BaseInputAction {
    shoot: boolean;
}

export interface VolatileData {
    isShotAnimFinished: Map<string, () => boolean>;
}
