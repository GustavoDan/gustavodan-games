import { SIMON_CIRCLE_BASE_CLASSES } from "./constants";

const SimonBase = () => {
    return (
        <div
            className={`${SIMON_CIRCLE_BASE_CLASSES} size-[120%] md:size-[113%] border-[12px] -z-10`}
        />
    );
};

export default SimonBase;
