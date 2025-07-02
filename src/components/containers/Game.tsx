import { cn } from "@/utils/cn";
import { BaseContainer, BaseContainerProps } from "./";
import Title from "../Title";
import BackButton from "../buttons/Back";

interface GameContainerProps extends BaseContainerProps {
    gameName: string;
}

const GameContainer = ({
    children,
    className,
    gameName,
    ...props
}: GameContainerProps) => {
    return (
        <BaseContainer className={cn("py-1 px-2.5", className)} {...props}>
            <div className="flex items-center justify-between ">
                <BackButton />
                <Title>{gameName}</Title>
                <div className="spacer size-10.5"></div>
            </div>

            {children}
        </BaseContainer>
    );
};
export default GameContainer;
