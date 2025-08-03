import { MachineState } from "@/hooks/useStateMachine";

export type VerticalMovementDirection = "IDLE" | "UP" | "DOWN";
export type HorizontalMovementDirection = "IDLE" | "LEFT" | "RIGHT";
export type AllMovementDirection =
    | HorizontalMovementDirection
    | VerticalMovementDirection;

export interface ResetAction {
    type: "RESET";
}

export interface LoadHighScoreAction {
    type: "LOAD_HIGH_SCORE";
    payload: number;
}

export interface GameOverAction {
    type: "GAME_OVER";
}

export interface BaseTickAction {
    type: "TICK";
    payload: {
        deltaTime: number;
        screenSize: Vector2D;
        inputActions: BaseInputAction;
    };
}

export interface Vector2D {
    x: number;
    y: number;
}

export interface BoundingBox {
    pos: Vector2D;
    size: Vector2D;
}

export interface CollidableObject extends BoundingBox {
    image: HTMLImageElement;
    spriteScale?: number | Vector2D;
    frameIndex?: number | null;
}

export type Binding = {
    keys: string[];
    states: MachineState[];
    action: (eventType: KeyboardEvent["type"]) => void;
};

export interface BaseInputAction {
    down: boolean;
    up: boolean;
    left: boolean;
    right: boolean;
}

export interface ShooterInputAction extends BaseInputAction {
    shoot: boolean;
}

export type GenericDeleteObjectAction<
    TState extends object,
    TDeletableKeys extends keyof TState,
    TId extends string | number | bigint = string
> = {
    [K in TDeletableKeys]: {
        type: "DELETE_OBJECT";
        payload: TState[K] extends unknown[]
            ? {
                  objectType: K;
                  objectId: TId;
              }
            : {
                  objectType: K;
                  objectId?: never;
              };
    };
}[TDeletableKeys];

export type GenericDeleteObjectFn<
    TState extends object,
    TDeletableKeys extends keyof TState,
    TId extends string | number | bigint = string
> = (
    ...args: {
        [K in TDeletableKeys]: TState[K] extends unknown[]
            ? [objectType: K, objectId: TId]
            : [objectType: K];
    }[TDeletableKeys]
) => void;

export interface InitializeGameState {
    type: "INITIALIZE_GAME_STATE";
    payload: {
        playerY: number;
    };
}

export interface BaseObjectState {
    id: string;
    pos: Vector2D;
}
