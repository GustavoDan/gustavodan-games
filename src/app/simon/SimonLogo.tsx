import { SIMON_CIRCLE_BASE_CLASSES } from "./constants";

const SimonLogo = () => {
    return (
        <div
            className={`${SIMON_CIRCLE_BASE_CLASSES} size-24 sm-h:size-20 border-4 flex items-center justify-center`}
        >
            <span className="text-gray-400 font-bold text-base tracking-wider select-none sm-h:text-xs">
                SIMON
            </span>
        </div>
    );
};

export default SimonLogo;
