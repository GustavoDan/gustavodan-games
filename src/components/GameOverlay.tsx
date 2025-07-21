import { createContext, ReactNode, useContext } from "react";
import { MachineState } from "@/hooks/useStateMachine";

interface OverlayContextType {
    engineState: MachineState;
    isGameOver: boolean;
}

const OverlayContext = createContext<OverlayContextType | null>(null);

const useOverlayContext = () => {
    const context = useContext(OverlayContext);
    if (!context) {
        throw new Error(
            "GameOverlay.* components must be used within a GameOverlay component"
        );
    }
    return context;
};

interface GameOverlayProps extends OverlayContextType {
    children: ReactNode;
}

const GameOverlay = ({
    engineState,
    isGameOver,
    children,
}: GameOverlayProps) => {
    const isVisible = isGameOver || ["PAUSED", "IDLE"].includes(engineState);

    if (!isVisible) {
        return null;
    }

    return (
        <OverlayContext.Provider value={{ engineState, isGameOver }}>
            <div className="absolute inset-0 z-10 flex flex-col gap-5 items-center justify-center text-center bg-black/50">
                {children}
            </div>
        </OverlayContext.Provider>
    );
};

const StartScreen = ({ children }: { children: ReactNode }) => {
    const { engineState, isGameOver } = useOverlayContext();

    return !isGameOver && engineState === "IDLE" ? <>{children}</> : null;
};

const PauseScreen = ({ children }: { children: ReactNode }) => {
    const { engineState, isGameOver } = useOverlayContext();

    return !isGameOver && engineState === "PAUSED" ? <>{children}</> : null;
};

const GameOverScreen = ({ children }: { children: ReactNode }) => {
    const { isGameOver } = useOverlayContext();

    return isGameOver ? <>{children}</> : null;
};

GameOverlay.StartScreen = StartScreen;
GameOverlay.PauseScreen = PauseScreen;
GameOverlay.GameOverScreen = GameOverScreen;

export default GameOverlay;
