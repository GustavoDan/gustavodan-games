import { EnemyState } from "./types";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";

interface EnemyProps {
    enemyState: EnemyState;
}

const Enemy = ({ enemyState }: EnemyProps) => {
    const currentEnemyType = CONSTANT_SIZES.enemies[enemyState.type];

    return (
        <div
            style={{
                backgroundImage: `url(${
                    ALL_SPRITES[`${enemyState.type}Enemy`]
                })`,
                width: currentEnemyType.width,
                height: currentEnemyType.height,
                bottom: enemyState.pos.y,
                left: enemyState.pos.x,
            }}
            className={"absolute text-red-400 animate-neon-text-pulse"}
        />
    );
};
export default Enemy;
