import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";

const LifeIndicator = () => {
    return (
        <div
            style={{
                backgroundImage: `url(${ALL_SPRITES.life})`,
                width: CONSTANT_SIZES.life.width,
                height: CONSTANT_SIZES.life.height,
            }}
            className="flex-shrink-0"
        />
    );
};
export default LifeIndicator;
