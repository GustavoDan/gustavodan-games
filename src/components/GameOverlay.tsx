import { createContext, ReactNode, useContext } from "react";
import { MachineState } from "@/hooks/useStateMachine";
import { GameActionButton } from "./buttons";
import { capitalize } from "@/utils/string";
import { cn } from "@/utils/cn";

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

interface BaseScreenProps {
    children?: ReactNode;
}

interface StartScreenProps extends BaseScreenProps {
    startFunction: () => void;
    controls: Record<string, string>;
    headline?: string;
}

const StartScreen = ({
    children,
    startFunction,
    controls,
    headline,
}: StartScreenProps) => {
    const { engineState, isGameOver } = useOverlayContext();

    return !isGameOver && engineState === "IDLE" ? (
        <>
            <div className="flex flex-col gap-25 sm-h:gap-5">
                {headline && <h1 className="text-5xl sm-h:text-2xl">{headline}</h1>}

                <div className="flex flex-col justify-center items-center gap-5 sm-h:gap-0">
                    <h2
                        className={cn(
                            "text-4xl font-bold sm-h:text-2xl",
                            !headline && "md:text-5xl sm-h:text-xl"
                        )}
                    >
                        CONTROLS
                    </h2>
                    <div className="flex md:text-lg sm-h:text-base">
                        <div className="text-left flex flex-col">
                            {Object.keys(controls).map((controlType, index) => (
                                <span key={index}>{`${capitalize(
                                    controlType
                                )}:`}</span>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            {Object.values(controls).map(
                                (controlKeys, index) => (
                                    <span key={index}>{controlKeys}</span>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {children}
            <div className="flex flex-col gap-2">
                <GameActionButton onClick={startFunction}>
                    Start Game
                </GameActionButton>
                <span className="text-xs md:text-sm sm-h:text-xs">
                    (or Spacebar to Start)
                </span>
            </div>
        </>
    ) : null;
};

const PauseScreen = ({ children }: BaseScreenProps) => {
    const { engineState, isGameOver } = useOverlayContext();

    return !isGameOver && engineState === "PAUSED" ? (
        <>
            <h1 className="text-5xl font-bold">PAUSED</h1>
            <span>Press Q to resume</span>
            {children}
        </>
    ) : null;
};

interface GameOverScreenProps extends BaseScreenProps {
    restartFunction: () => void;
}

const GameOverScreen = ({ children, restartFunction }: GameOverScreenProps) => {
    const { isGameOver } = useOverlayContext();

    return isGameOver ? (
        <>
            <h1 className="text-4xl md:text-5xl font-bold sm-h:text-3xl">GAME OVER</h1>
            {children}
            <div className="flex flex-col gap-2">
                <GameActionButton onClick={restartFunction}>
                    Play Again
                </GameActionButton>
                <span className="text-xs md:text-sm">
                    (or press Spacebar to Restart)
                </span>
            </div>
        </>
    ) : null;
};

GameOverlay.StartScreen = StartScreen;
GameOverlay.PauseScreen = PauseScreen;
GameOverlay.GameOverScreen = GameOverScreen;

export default GameOverlay;
