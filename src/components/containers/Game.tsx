import { cn } from "@/utils/cn";
import { BaseContainer, BaseContainerProps } from "./";
import Title from "../Title";
import { BackButton } from "../buttons";

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
    return (
        <BaseContainer
            className={cn(
                "py-5 px-7.5 w-11/12 h-11/12 overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-between">
                <BackButton />
                <Title>{gameTitle}</Title>
                <div className="spacer md:size-10.5"></div>
            </div>
            <div className={cn("flex flex-col flex-1", childrenClassName)}>
                {children}
            </div>
        </BaseContainer>
    );
};
export default GameContainer;
