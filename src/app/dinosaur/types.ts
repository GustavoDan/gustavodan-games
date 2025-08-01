import { HorizontalMovementDirection, Vector2D } from "@/types";
import { OBSTACLES } from "./constants";

export type ObstacleType = keyof typeof OBSTACLES.types;

export interface DinosaurState {
    life: number;
    invulnerabilityTimer: number;
    pos: Vector2D;
    vel: Vector2D;
    isJumping: boolean;
    isDucking: boolean;
    isFastFalling: boolean;
    jumpStrength: number;
    moveSpeed: number;
    moveDirection: HorizontalMovementDirection;
}

export interface ObstacleState {
    id: string;
    pos: Vector2D;
    type: ObstacleType;
    speedMultiplier: number;
}

export interface GameState {
    dinosaur: DinosaurState;
    gameSpeed: number;
    gameSpeedMultiplier: number;
    obstacles: ObstacleState[];
    obstacleSpawnDistance: number;
    obstacleSpawnInterval: {
        min: number;
        max: number;
    };
    score: number;
    highScore: number;
}
export interface VolatileData {
    getDinosaurFrame: (() => number | null) | null;
    getObstaclesFrame: Map<string, () => number | null>;
}
