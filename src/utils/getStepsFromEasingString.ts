const getStepsFromEasingString = (easingString: string | undefined) => {
    const match = easingString?.match(/steps\((\d+)/);

    if (match && match[1]) {
        return parseInt(match[1], 10);
    }

    return null;
};

export default getStepsFromEasingString;
