export const checkIsBlinking = (invulnerabilityTimer: number) => {
    return (
        invulnerabilityTimer > 0 &&
        Math.floor(invulnerabilityTimer * 5) % 2 === 0
    );
};
