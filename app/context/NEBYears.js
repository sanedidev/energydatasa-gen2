"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import nebData2024 from "@/app/data/energy-balance-2024.json";

const YEARS_INDEX_SLUG = "neb.years.index";
const DEFAULT_YEAR = { year: "2024", label: "2024 NEB", isBuiltIn: true };

const NEBYearsContext = createContext(null);

export function NEBYearsProvider({ children }) {
    const [availableYears, setAvailableYears] = useState([DEFAULT_YEAR]);
    const [loadingYears, setLoadingYears] = useState(true);
    const cacheRef = useRef({ "2024": nebData2024 });

    useEffect(() => {
        let alive = true;
        async function load() {
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: YEARS_INDEX_SLUG }, { authMode: "apiKey" });
                const item = res?.data?.[0];
                if (item?.content && alive) {
                    const parsed = JSON.parse(item.content);
                    if (Array.isArray(parsed)) {
                        setAvailableYears([DEFAULT_YEAR, ...parsed.filter((y) => y.year !== "2024")]);
                    }
                }
            } catch { /* fall through to default */ }
            finally { if (alive) setLoadingYears(false); }
        }
        load();
        return () => { alive = false; };
    }, []);

    const loadYearData = useCallback(async (year) => {
        if (cacheRef.current[year]) return cacheRef.current[year];
        if (year === "2024") return nebData2024;
        try {
            const res = await client.models.PageContent.pageContentBySlug({ slug: `neb.data.${year}` }, { authMode: "apiKey" });
            const item = res?.data?.[0];
            if (item?.content) {
                const data = JSON.parse(item.content);
                cacheRef.current[year] = data;
                return data;
            }
        } catch { /* not found */ }
        return null;
    }, []);

    async function saveYearsIndex(years) {
        const content  = JSON.stringify(years);
        const checkRes = await client.models.PageContent.pageContentBySlug({ slug: YEARS_INDEX_SLUG }, { authMode: "apiKey" });
        const existing = checkRes?.data?.[0];
        if (existing?.id) {
            await client.models.PageContent.update({ id: existing.id, content });
        } else {
            await client.models.PageContent.create({ slug: YEARS_INDEX_SLUG, content });
        }
    }

    const saveYearData = useCallback(async ({ year, label, sections, userEmail }) => {
        const slug = `neb.data.${year}`;
        const uploadedAt = new Date().toISOString();
        const uploadDate = new Date(uploadedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
        const data = {
            sections,
            commodities: nebData2024.commodities,
            meta: {
                ...nebData2024.meta,
                year:  String(year),
                title: `South Africa Energy Balance ${year}`,
                date:  `Uploaded ${uploadDate}`,
            },
            uploadedAt,
            uploadedBy: userEmail ?? "unknown",
        };
        const content = JSON.stringify(data);

        const checkRes  = await client.models.PageContent.pageContentBySlug({ slug }, { authMode: "apiKey" });
        const existing  = checkRes?.data?.[0];
        if (existing?.id) {
            await client.models.PageContent.update({ id: existing.id, content });
        } else {
            await client.models.PageContent.create({ slug, content });
        }

        cacheRef.current[year] = data;

        setAvailableYears((prev) => {
            const entry = { year: String(year), label: label || `${year} NEB`, uploadedAt: data.uploadedAt, uploadedBy: data.uploadedBy };
            const next  = [DEFAULT_YEAR, ...prev.filter((y) => y.year !== "2024" && y.year !== String(year)), entry]
                .sort((a, b) => Number(b.year) - Number(a.year));
            saveYearsIndex(next.filter((y) => y.year !== "2024"));
            return next;
        });
    }, []);

    const deleteYear = useCallback(async (year) => {
        if (year === "2024") return;
        delete cacheRef.current[year];
        setAvailableYears((prev) => {
            const next = prev.filter((y) => y.year !== year);
            saveYearsIndex(next.filter((y) => y.year !== "2024"));
            return next;
        });
    }, []);

    return (
        <NEBYearsContext.Provider value={{ availableYears, loadingYears, loadYearData, saveYearData, deleteYear }}>
            {children}
        </NEBYearsContext.Provider>
    );
}

export function useNEBYears() {
    const ctx = useContext(NEBYearsContext);
    if (!ctx) throw new Error("useNEBYears must be used within NEBYearsProvider");
    return ctx;
}
