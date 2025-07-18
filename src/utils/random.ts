export const getRandomItem = <T>(
    arr: T[],
    getWeight?: (item: T) => number
): T | undefined => {
    if (arr.length === 0) {
        return undefined;
    }

    if (!getWeight) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    const totalWeight = arr.reduce((sum, item) => sum + getWeight(item), 0);

    if (totalWeight <= 0) {
        console.warn(
            "The sum of weights is 0 or negative. Falling back to a uniform random selection."
        );
        return getRandomItem(arr);
    }

    const randomThreshold = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    return arr.find((item) => {
        const weight = getWeight(item);
        if (weight > 0) {
            cumulativeWeight += weight;
            return randomThreshold < cumulativeWeight;
        }
        return false;
    });
};

export const getRandomInt = (min: number, max: number) => {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
};
