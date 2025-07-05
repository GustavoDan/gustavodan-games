import { cn } from "@/utils/cn";
import { BaseContainer, BaseContainerProps } from "./";
import Title from "../Title";
import { BackButton } from "../buttons";

interface GameContainerProps extends BaseContainerProps {
    gameTitle: string;
}

const GameContainer = ({
    children,
    className,
    gameTitle,
    ...props
}: GameContainerProps) => {
    return (
        <BaseContainer
            className={cn("py-5 px-7.5 w-11/12 max-w-3xl h-11/12 ", className)}
            {...props}
        >
            <div className="flex items-center justify-between">
                <BackButton />
                <Title>{gameTitle}</Title>
                <div className="spacer size-10.5"></div>
            </div>

            <div className="flex flex-col flex-1 items-center justify-around">
                {children}
            </div>
        </BaseContainer>
    );
};
export default GameContainer;
