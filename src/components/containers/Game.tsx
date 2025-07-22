"use client";

import { cn } from "@/utils/cn";
import { BaseContainer, BaseContainerProps } from "./";
import Title from "../Title";
import { BackButton } from "../buttons";
import GameContext from "@/contexts/GameContext";
import { useRef } from "react";
import useElementSize from "@/hooks/useElementSize";

interface GameContainerProps extends BaseContainerProps {
    gameTitle: string;
    childrenClassName?: string;
}

const GameContainer = ({
    children,
    className,
    childrenClassName,
    gameTitle,
    ...props
}: GameContainerProps) => {
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const { width, height } = useElementSize(gameAreaRef);

    return (
        <BaseContainer
            className={cn(
                "py-5 px-7.5 w-11/12 h-11/12 overflow-hidden sm-h:p-1.5",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between">
                <BackButton />
                <Title>{gameTitle}</Title>
                <div className="spacer md:size-10.5 sm-h:size-7"></div>
            </div>
            <div
                ref={gameAreaRef}
                className={cn("flex flex-col flex-1", childrenClassName)}
            >
                <GameContext.Provider
                    value={{ worldWidth: width, worldHeight: height }}
                >
                    {children}
                </GameContext.Provider>
            </div>
        </BaseContainer>
    );
};
export default GameContainer;
