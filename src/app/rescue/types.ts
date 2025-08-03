import {
    BaseObjectState,
    GenericDeleteObjectAction,
    GenericDeleteObjectFn,
    HorizontalMovementDirection,
    Vector2D,
    VerticalMovementDirection,
} from "@/types";
import { CONSTANT_SIZES } from "./constants";

export type EnemyType = keyof typeof CONSTANT_SIZES.enemies;
export type DeletableObject =
    | keyof GameState["markedForDeletion"]
    | "explosions";
export type DeleteObjectFn = GenericDeleteObjectFn<GameState, DeletableObject>;
export type DeleteObjectAction = GenericDeleteObjectAction<
    GameState,
    DeletableObject
>;

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
    enemies: {
        truck: EnemyState | null;
        helicopter: EnemyState | null;
    };
    ally: BaseObjectState | null;
    explosions: BaseObjectState[];
    markedForDeletion: {
        shots: Set<string>;
        ally: boolean;
    };
    spawnTimers: {
        truck: number;
        ally: number;
    };
}

type GetCurrentFrame = () => number | null;

export interface VolatileData {
    enemyAnimationFrame?: GetCurrentFrame;
    playerAnimationFrame?: GetCurrentFrame;
    allyAnimationFrame?: GetCurrentFrame;
}

export type VolatileDataFn = (getCurrentFrame: GetCurrentFrame) => void;
