import { createContext, useContext } from "react";

interface GameContextType {
    worldWidth: number;
    worldHeight: number;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error(
            "useGameContext must be used within a GameContext.Provider"
        );
    }
    return context;
};

export default GameContext;
