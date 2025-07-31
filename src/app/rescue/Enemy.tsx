import { MachineState } from "@/hooks/useStateMachine";
import { EnemyState } from "./types";
import { ALL_SPRITES, CONSTANT_SIZES } from "./constants";
import { capitalize } from "@/utils/string";

interface EnemyProps {
    enemyState: EnemyState | null;
    engineState: MachineState;
}

const Enemy = ({ enemyState }: EnemyProps) => {
    if (!enemyState) return;

    const enemySize = CONSTANT_SIZES.enemies[enemyState.type];
    return (
        <div
            style={{
                backgroundImage: `url(${
                    ALL_SPRITES[`enemy${capitalize(enemyState.type)}`]
                })`,
                width: enemySize.width,
                height: enemySize.height,
                bottom: enemyState?.pos.y,
                left: enemyState?.pos.x,
            }}
            className="absolute"
        />
    );
};
export default Enemy;
