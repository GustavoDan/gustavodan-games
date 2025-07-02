import { cn } from "@/utils/cn";

interface CellProps {
    text?: "X" | "O";
}

const Cell = ({ text }: CellProps) => {
    return (
        <div
            className={cn(
                "relative flex justify-center items-center font-title text-tictactoe cursor-pointer text-shadow-tictactoe",
                "before:absolute before:inset-0 before:bg-tictactoe-cell",
                "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:ease-in",
                text === "X" ? "text-[#ff4500]" : "text-[#7df9ff]"
            )}
        >
            {text}
        </div>
    );
};
export default Cell;
