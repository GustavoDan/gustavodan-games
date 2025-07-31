import {
    AllMovementDirection,
    BaseInputAction,
    HorizontalMovementDirection,
    VerticalMovementDirection,
} from "@/types";

type Axis = "horizontal" | "vertical";

type GetDirectionOnAxisFn = {
    (input: BaseInputAction, axis: "vertical"): VerticalMovementDirection;
    (input: BaseInputAction, axis: "horizontal"): HorizontalMovementDirection;
};

interface DirectionInfo {
    key: keyof BaseInputAction;
    direction: AllMovementDirection;
}

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(value, max));

const applyWrapAround = (pos: number, min: number, max: number) => {
    if (pos > max) return min;
    if (pos < min) return max;
    return pos;
};

const DIRECTION_MULTIPLIERS = {
    UP: 1,
    RIGHT: 1,
    DOWN: -1,
    LEFT: -1,
    IDLE: 0,
};

const DIRECTION_MAPPING: Record<
    Axis,
    { positive: DirectionInfo; negative: DirectionInfo }
> = {
    horizontal: {
        positive: { key: "right", direction: "RIGHT" },
        negative: { key: "left", direction: "LEFT" },
    },
    vertical: {
        positive: { key: "up", direction: "UP" },
        negative: { key: "down", direction: "DOWN" },
    },
};

export const moveOnAxis = (
    position: number,
    moveDirection: AllMovementDirection,
    moveSpeed: number,
    deltaTime: number,
    movementLimits?: {
        min?: number;
        max: number;
        wrapAround?: boolean;
    }
) => {
    const directionMultiplier = DIRECTION_MULTIPLIERS[moveDirection];
    position += directionMultiplier * moveSpeed * deltaTime;

    if (!movementLimits) {
        return position;
    }

    const min = movementLimits.min ?? 0;
    const max = movementLimits.max;

    return movementLimits.wrapAround
        ? applyWrapAround(position, min, max)
        : clamp(position, min, max);
};

// The 'as' assertion is required to satisfy the function overload type.
// This is a known limitation when implementing overloads with arrow functions.
export const getDirectionOnAxis = ((input: BaseInputAction, axis: Axis) => {
    const isPositive = input[DIRECTION_MAPPING[axis].positive.key];
    const isNegative = input[DIRECTION_MAPPING[axis].negative.key];

    const isMovingPositive = isPositive && !isNegative;
    const isMovingNegative = isNegative && !isPositive;

    if (isMovingPositive) return DIRECTION_MAPPING[axis].positive.direction;
    if (isMovingNegative) return DIRECTION_MAPPING[axis].negative.direction;
    return "IDLE";
}) as GetDirectionOnAxisFn;
