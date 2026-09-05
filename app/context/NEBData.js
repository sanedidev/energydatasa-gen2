"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import nebData from "@/app/data/energy-balance-2024.json";

const NEB_SLUG = "neb.data.current";

// Exported so other modules don't need to re-import the raw JSON
export const COMMODITY_IDS       = nebData.commodities.map((c) => c.id);
export const COMMODITY_LABEL_MAP = Object.fromEntries(nebData.commodities.map((c) => [c.label, c.id]));
export const COMMODITY_ID_MAP    = Object.fromEntries(nebData.commodities.map((c) => [c.id,    c.label]));

const NEBDataContext = createContext(null);

export function NEBDataProvider({ children }) {
    const [sections,    setSections]    = useState(nebData.sections);
    const [uploadMeta,  setUploadMeta]  = useState(null);
    const [sankeyTitle, setSankeyTitle] = useState("Energy Flow — 2024");
    const [loading,     setLoading]     = useState(true);

    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                const res  = await client.models.PageContent.pageContentBySlug({ slug: NEB_SLUG }, { authMode: "apiKey" });
                const item = res?.data?.[0];
                if (item?.content && alive) {
                    const parsed = JSON.parse(item.content);
                    if (parsed.sections?.length) setSections(parsed.sections);
                    if (parsed.sankeyTitle)      setSankeyTitle(parsed.sankeyTitle);
                    if (parsed.uploadedAt)       setUploadMeta({
                        uploadedAt: parsed.uploadedAt,
                        uploadedBy: parsed.uploadedBy,
                        recordId:   item.id,
                    });
                }
            } catch { /* fall through to static JSON */ }
            finally   { if (alive) setLoading(false); }
        }
        load();
        return () => { alive = false; };
    }, []);

    return (
        <NEBDataContext.Provider value={{
            sections,
            setSections,
            uploadMeta,
            setUploadMeta,
            sankeyTitle,
            setSankeyTitle,
            commodities: nebData.commodities,
            meta:        nebData.meta,
            loading,
        }}>
            {children}
        </NEBDataContext.Provider>
    );
}

export function useNEBData() {
    const ctx = useContext(NEBDataContext);
    if (!ctx) throw new Error("useNEBData must be used within NEBDataProvider");
    return ctx;
}
