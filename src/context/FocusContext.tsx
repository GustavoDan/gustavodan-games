"use client";

import { createContext, useContext, useState } from "react";

const FocusContext = createContext<
    | {
          focusedId: string | null;
          setFocusedId: (id: string | null) => void;
      }
    | undefined
>(undefined);

export const FocusProvider = ({ children }: { children: React.ReactNode }) => {
    const [focusedId, setFocusedId] = useState<string | null>(null);

    return (
        <FocusContext.Provider value={{ focusedId, setFocusedId }}>
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => {
    const context = useContext(FocusContext);
    if (!context) {
        throw new Error("useFocus must be used within a FocusProvider");
    }
    return context;
};
