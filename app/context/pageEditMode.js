"use client";

import { createContext, useContext, useState } from "react";

const PageEditModeContext = createContext({ editMode: false, setEditMode: () => {} });

export function usePageEditMode() {
    return useContext(PageEditModeContext);
}

export function PageEditModeProvider({ children }) {
    const [editMode, setEditMode] = useState(false);
    return (
        <PageEditModeContext.Provider value={{ editMode, setEditMode }}>
            {children}
        </PageEditModeContext.Provider>
    );
}
