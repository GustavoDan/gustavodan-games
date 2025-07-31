import {
    HorizontalMovementDirection,
    Vector2D,
    VerticalMovementDirection,
} from "@/types";
import { CONSTANT_SIZES } from "./constants";

export type EnemyType = keyof typeof CONSTANT_SIZES.enemies;

export interface PlayerState {
    life: number;
    pos: Vector2D;
    moveDirection: {
        vertical: VerticalMovementDirection;
        horizontal: HorizontalMovementDirection;
    };
    currentShotCooldown: number;
    invulnerabilityTimer: number;
}

export interface ShotState {
    id: string;
    pos: Vector2D;
}

export interface EnemyState {
    pos: Vector2D;
    type: EnemyType;
}

export interface GameState {
    player: PlayerState;
    shots: ShotState[];
    enemies: {
        truck: EnemyState | null;
        helicopter: EnemyState | null;
    };
    markedForDeletion: {
        shots: Set<string>;
        enemies: Set<string>;
    };
    truckSpawnTimer: number;
}
