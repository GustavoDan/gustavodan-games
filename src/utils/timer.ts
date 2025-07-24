export const handleTimer = (timer: number, deltaTime: number) => {
    if (timer <= 0) return 0;

    return timer - deltaTime;
};
