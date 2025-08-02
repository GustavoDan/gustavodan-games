import {
    BaseObjectState,
    HorizontalMovementDirection,
    Vector2D,
    VerticalMovementDirection,
} from "@/types";
import { CONSTANT_SIZES } from "./constants";

export type EnemyType = keyof typeof CONSTANT_SIZES.enemies;
export type DeletableObject = keyof GameState["markedForDeletion"];
export type DeleteObjectFn = (
    objectType: DeletableObject,
    objectId: string
) => void;

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

export interface EnemyState extends BaseObjectState {
    type: EnemyType;
}

export interface GameState {
    player: PlayerState;
    shots: BaseObjectState[];
    enemies: EnemyState[];
    enemySpawnTimer: number;
    markedForDeletion: {
        shots: Set<string>;
        enemies: Set<string>;
    };
    score: number;
    highScore: number;
}

interface VolatileDataShot {
    getCurrentFrame: () => number | null;
    isAnimationFinished: boolean;
}

export interface VolatileData {
    shot: Map<string, VolatileDataShot>;
}

export type VolatileDataShotFn = (
    id: string,
    getCurrentFrame: VolatileDataShot["getCurrentFrame"],
    isAnimationFinished: VolatileDataShot["isAnimationFinished"]
) => void;
