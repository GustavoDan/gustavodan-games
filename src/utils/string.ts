type CapitalizeFn = {
    <T extends string>(str: T): Capitalize<T>;
    (str: string): string;
};

// The 'as' assertion is required to satisfy the function overload type.
// This is a known limitation when implementing overloads with arrow functions.
export const capitalize = ((string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}) as CapitalizeFn;
