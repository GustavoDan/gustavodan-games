import {
    BaseInputAction,
    HorizontalMovementDirection,
    Vector2D,
    VerticalMovementDirection,
} from "@/types";
import { CONSTANT_SIZES } from "./constants";

export type EnemyType = keyof typeof CONSTANT_SIZES.enemies;

export interface PlayerState {
    life: number;
    pos: Vector2D;
    moveSpeed: number;
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
    id: string;
    pos: Vector2D;
    type: EnemyType;
}

export interface GameState {
    player: PlayerState;
    shots: ShotState[];
    enemies: EnemyState[];
    enemySpawnTimer: number;
    markedForDeletion: {
        shots: Set<string>;
        enemies: Set<string>;
    };
    score: number;
}

export interface ShooterInputAction extends BaseInputAction {
    shoot: boolean;
}

export interface VolatileData {
    shot: Map<
        string,
        {
            getCurrentFrame: () => number | null;
            isAnimationFinished: () => boolean;
        }
    >;
}

export type VolatileDataShotFn = (
    id: string,
    getCurrentFrame: () => number | null,
    isAnimationFinished: () => boolean
) => void;
