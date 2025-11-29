import { getRandomItem } from "@/utils/random";
import { INITIAL_GAME_STATE, SIMON_COLORS, TIMING } from "../constants";
import { GameState, InputActions, SimonColor } from "../types";

interface TickAction {
    type: "TICK";
    payload: {
        deltaTime: number;
        inputActions: InputActions;
    };
}

interface StartGameAction {
    type: "START_GAME";
}

interface ResetAction {
    type: "RESET";
}

interface LoadHighScoreAction {
    type: "LOAD_HIGH_SCORE";
    payload: number;
}

interface PlayerInputAction {
    type: "PLAYER_INPUT";
    payload: SimonColor;
}

type GameAction =
    | TickAction
    | StartGameAction
    | ResetAction
    | LoadHighScoreAction
    | PlayerInputAction;

const addNewColorToSequence = (state: GameState): GameState => {
    const newColor = getRandomItem(SIMON_COLORS);
    if (!newColor) return state;

    return {
        ...state,
        sequence: [...state.sequence, newColor],
    };
};

const getShowDuration = (speedMultiplier: number) => {
    const duration =
        TIMING.SHOW_COLOR_DURATION * (1 - (speedMultiplier - 1) * 0.15);
    return Math.max(duration, TIMING.MIN_SHOW_DURATION);
};

const getPauseDuration = (speedMultiplier: number) => {
    const duration =
        TIMING.PAUSE_BETWEEN_COLORS * (1 - (speedMultiplier - 1) * 0.15);
    return Math.max(duration, TIMING.MIN_SHOW_DURATION / 2);
};

const getPauseBeforeNextLevel = (speedMultiplier: number) => {
    const duration =
        TIMING.PAUSE_BEFORE_NEXT_LEVEL * (1 - (speedMultiplier - 1) * 0.15);
    return Math.max(duration, TIMING.MIN_SHOW_DURATION / 2);
};

const handleShowingSequence = (
    state: GameState,
    deltaTime: number
): GameState => {
    const newTimer = state.showTimer - deltaTime;

    if (newTimer > 0) {
        return {
            ...state,
            showTimer: newTimer,
        };
    }

    if (state.activeColor !== null) {
        const nextIndex = state.showingIndex + 1;

        if (nextIndex >= state.sequence.length) {
            return {
                ...state,
                showTimer: TIMING.PAUSE_BEFORE_INPUT,
                activeColor: null,
                phase: "PAUSE_AFTER_SHOW",
            };
        }

        return {
            ...state,
            showTimer: getPauseDuration(state.speedMultiplier),
            activeColor: null,
            showingIndex: nextIndex,
        };
    }

    return {
        ...state,
        showTimer: getShowDuration(state.speedMultiplier),
        activeColor: state.sequence[state.showingIndex],
    };
};

const handlePauseAfterShow = (
    state: GameState,
    deltaTime: number
): GameState => {
    const newTimer = state.showTimer - deltaTime;

    if (newTimer <= 0) {
        return {
            ...state,
            phase: "WAITING_INPUT",
            showTimer: 0,
        };
    }

    return {
        ...state,
        showTimer: newTimer,
    };
};

const handlePlayerFlash = (state: GameState, deltaTime: number): GameState => {
    const newTimer = state.flashTimer - deltaTime;

    if (newTimer <= 0) {
        if (state.playerIndex >= state.sequence.length) {
            const newSpeedMultiplier =
                state.speedMultiplier + TIMING.SPEED_INCREASE_PER_LEVEL;

            const newState: GameState = {
                ...state,
                highScore: Math.max(state.sequence.length, state.highScore),
                speedMultiplier: newSpeedMultiplier,
                flashTimer: 0,
                flashColor: null,
                showingIndex: 0,
                playerIndex: 0,
                phase: "SHOWING_SEQUENCE",
                showTimer: getPauseBeforeNextLevel(newSpeedMultiplier),
                activeColor: null,
            };

            return addNewColorToSequence(newState);
        }

        return {
            ...state,
            flashTimer: 0,
            flashColor: null,
            phase: "WAITING_INPUT",
        };
    }

    return {
        ...state,
        flashTimer: newTimer,
    };
};

const handlePlayerInput = (state: GameState, color: SimonColor): GameState => {
    if (state.phase !== "WAITING_INPUT") return state;

    const expectedColor = state.sequence[state.playerIndex];

    if (color !== expectedColor) {
        return {
            ...state,
            phase: "GAME_OVER",
            flashColor: color,
            flashTimer: TIMING.FLASH_DURATION,
        };
    }

    return {
        ...state,
        playerIndex: state.playerIndex + 1,
        flashColor: color,
        flashTimer: TIMING.FLASH_DURATION,
        phase: "PLAYER_FLASH",
    };
};

export const gameReducer = (
    state: GameState,
    action: GameAction
): GameState => {
    switch (action.type) {
        case "TICK": {
            switch (state.phase) {
                case "SHOWING_SEQUENCE":
                    return handleShowingSequence(
                        state,
                        action.payload.deltaTime
                    );
                case "PAUSE_AFTER_SHOW":
                    return handlePauseAfterShow(
                        state,
                        action.payload.deltaTime
                    );
                case "PLAYER_FLASH":
                    return handlePlayerFlash(state, action.payload.deltaTime);
                default:
                    return state;
            }
        }

        case "START_GAME": {
            const newState: GameState = {
                ...INITIAL_GAME_STATE,
                highScore: state.highScore,
                phase: "SHOWING_SEQUENCE",
                showTimer: TIMING.PAUSE_BETWEEN_COLORS,
            };

            return addNewColorToSequence(newState);
        }

        case "PLAYER_INPUT": {
            return handlePlayerInput(state, action.payload);
        }

        case "LOAD_HIGH_SCORE": {
            return { ...state, highScore: action.payload };
        }

        case "RESET": {
            return { ...INITIAL_GAME_STATE, highScore: state.highScore };
        }

        default:
            return state;
    }
};
