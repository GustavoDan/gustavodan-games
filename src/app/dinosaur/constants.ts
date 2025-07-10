import { GameState, Vector2D } from "./types";

export const FLOOR = { heigth: 24 };

export const DINOSAUR = {
    height: 86,
    width: 80,
    initialPos: { x: 0, y: -FLOOR.heigth } satisfies Vector2D,
    initialVel: { x: 0, y: 0 } satisfies Vector2D,
};

export const INITIAL_GAME_STATE: GameState = {
    dinosaur: {
        pos: DINOSAUR.initialPos,
        vel: DINOSAUR.initialVel,
        isJumping: false,
        jumpStrength: 1200,
    },
};

export const GRAVITY = 3000;
