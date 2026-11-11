"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import { upsertPageContent, deletePageContentById } from "@/app/lib/manageContent";
import structure from "@/app/data/neb-structure.json";
import seed2024 from "@/app/data/energy-balance-2024.json";

// Taxonomy (section/row/commodity ids and labels) is hardcoded and
// year-invariant by design - only the values differ per year. These are
// module-level, not year-aware, and other modules already import
// COMMODITY_ID_MAP etc. directly from here rather than through the hook.
export const COMMODITY_IDS       = structure.commodities.map((c) => c.id);
export const COMMODITY_LABEL_MAP = Object.fromEntries(structure.commodities.map((c) => [c.label, c.id]));
export const COMMODITY_ID_MAP    = Object.fromEntries(structure.commodities.map((c) => [c.id,    c.label]));
export const SECTION_IDS         = structure.sections.map((s) => s.id);

export const DEFAULT_YEAR = "2024";

function sectionSlug(year, sectionId) { return `neb.data.${year}.${sectionId}`; }
function metaSlug(year)               { return `neb.meta.${year}`; }
export function sectionPageKey(sectionId) { return `neb.${sectionId}`; }

const YEARS_INDEX_SLUG   = "neb.years.index";
const YEARS_CREATE_KEY   = "neb.years.create";
const META_PAGE_KEY      = "neb.balance";

function blankSectionRows(template) {
    return template.rows.map((r) => ({ ...r, values: { ...r.values } }));
}

function defaultMeta(year) {
    return {
        title:       `South Africa Energy Balance ${year}`,
        sankeyTitle: `Energy Flow — ${year}`,
        year:        String(year),
        unit:        seed2024.meta.unit,
        source:      seed2024.meta.source,
        date:        seed2024.meta.date,
        convention:  seed2024.meta.convention,
        uploadedAt:  null,
        uploadedBy:  null,
    };
}

const NEBDataContext = createContext(null);

export function NEBDataProvider({ children }) {
    const router       = useRouter();
    const pathname     = usePathname();
    const searchParams = useSearchParams();

    const [activeYear, setActiveYearState] = useState(DEFAULT_YEAR);
    const [availableYears, setAvailableYears] = useState([{ year: DEFAULT_YEAR, label: `${DEFAULT_YEAR} NEB`, isBuiltIn: true }]);
    const [loadingYears, setLoadingYears] = useState(true);

    const [sections, setSections] = useState(() => structure.sections.map((s) => ({ ...s, rows: blankSectionRows(s) })));
    const [meta, setMeta] = useState(() => defaultMeta(DEFAULT_YEAR));
    const [loading, setLoading] = useState(true);

    // year -> { sections, meta } - avoids re-fetching a year already seen
    // this session (switching back and forth via the year picker is then
    // instant), invalidated only by this provider's own save calls below.
    const cacheRef = useRef({});

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res  = await client.models.PageContent.pageContentBySlug({ slug: YEARS_INDEX_SLUG }, { authMode: "apiKey" });
                const item = res?.data?.[0];
                if (item?.content && alive) {
                    const parsed = JSON.parse(item.content);
                    if (Array.isArray(parsed)) {
                        setAvailableYears(
                            [{ year: DEFAULT_YEAR, label: `${DEFAULT_YEAR} NEB`, isBuiltIn: true }, ...parsed.filter((y) => y.year !== DEFAULT_YEAR)]
                                .sort((a, b) => Number(b.year) - Number(a.year))
                        );
                    }
                }
            } catch { /* fall through to default-only */ }
            finally { if (alive) setLoadingYears(false); }
        })();
        return () => { alive = false; };
    }, []);

    // Reads one year's full data straight from storage (8 parallel exact-slug
    // section reads + 1 meta read - never a Scan, the slugs are deterministic).
    // A section with no saved record yet (new/blank year) falls back to the
    // structure template for that section, not an error.
    const loadYear = useCallback(async (year) => {
        const key = String(year);
        if (cacheRef.current[key]) return cacheRef.current[key];

        const [sectionResults, metaResult] = await Promise.all([
            Promise.all(structure.sections.map((template) =>
                client.models.PageContent.pageContentBySlug({ slug: sectionSlug(key, template.id) }, { authMode: "apiKey" })
                    .then((r) => r?.data?.[0])
                    .catch(() => null)
            )),
            client.models.PageContent.pageContentBySlug({ slug: metaSlug(key) }, { authMode: "apiKey" })
                .then((r) => r?.data?.[0])
                .catch(() => null),
        ]);

        const loadedSections = structure.sections.map((template, i) => {
            const item = sectionResults[i];
            if (item?.content) {
                try {
                    const parsed = JSON.parse(item.content);
                    if (Array.isArray(parsed.rows)) {
                        return { id: template.id, label: template.label, description: template.description, rows: parsed.rows };
                    }
                } catch { /* fall through to blank template below */ }
            }
            return { id: template.id, label: template.label, description: template.description, rows: blankSectionRows(template) };
        });

        let loadedMeta = defaultMeta(key);
        if (metaResult?.content) {
            try { loadedMeta = { ...loadedMeta, ...JSON.parse(metaResult.content) }; } catch { /* keep default */ }
        }

        const result = { sections: loadedSections, meta: loadedMeta };
        cacheRef.current[key] = result;
        return result;
    }, []);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            const data = await loadYear(activeYear);
            if (alive) {
                setSections(data.sections);
                setMeta(data.meta);
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [activeYear, loadYear]);

    // Active year lives in the URL (?year=) so it's shareable/bookmarkable,
    // per-route (every NEB sub-page reads the same param), and survives
    // back/forward navigation - this provider is the one place that owns
    // that sync so no call site has to think about the URL at all.
    const setActiveYear = useCallback((year) => {
        const key = String(year);
        setActiveYearState(key);
        const params = new URLSearchParams(searchParams.toString());
        params.set("year", key);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    // Normalize the URL once the real years list is known: an explicit
    // ?year= for a year that actually exists wins (supports deep links and
    // back/forward); anything else - missing, or naming a year that was
    // deleted/never existed - falls back to the most recent year.
    useEffect(() => {
        if (loadingYears) return;
        const urlYear   = searchParams.get("year");
        const validYears = availableYears.map((y) => y.year);
        const resolved  = urlYear && validYears.includes(urlYear) ? urlYear : (validYears[0] ?? DEFAULT_YEAR);
        setActiveYearState(resolved);
        if (resolved !== urlYear) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("year", resolved);
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingYears, availableYears, searchParams]);

    // One section, one save - never the whole year's data just to change one
    // table (that's what made the old single-blob title edit re-serialize a
    // 26KB payload for a one-line change).
    const saveSectionData = useCallback(async ({ year, sectionId, rows, userEmail, historyLabel }) => {
        const key = String(year);
        await upsertPageContent({
            slug:         sectionSlug(key, sectionId),
            content:      JSON.stringify({ rows }),
            pageKeys:     [sectionPageKey(sectionId)],
            historyLabel: historyLabel ?? `NEB ${key} — ${sectionId}`,
        });

        if (cacheRef.current[key]) {
            cacheRef.current[key] = {
                ...cacheRef.current[key],
                sections: cacheRef.current[key].sections.map((s) => (s.id === sectionId ? { ...s, rows } : s)),
            };
        }
        if (key === activeYear) {
            setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, rows } : s)));
        }
    }, [activeYear]);

    // Meta (title, sankey title, upload attribution) - small, independent of
    // section data, gated by the existing neb.balance key.
    const saveMeta = useCallback(async ({ year, patch, userEmail, historyLabel }) => {
        const key     = String(year);
        const current = cacheRef.current[key]?.meta ?? (key === activeYear ? meta : defaultMeta(key));
        const next    = { ...current, ...patch, uploadedAt: new Date().toISOString(), uploadedBy: userEmail ?? current.uploadedBy ?? null };

        await upsertPageContent({
            slug:         metaSlug(key),
            content:      JSON.stringify(next),
            pageKeys:     [META_PAGE_KEY],
            historyLabel: historyLabel ?? `NEB ${key} — meta`,
        });

        if (cacheRef.current[key]) cacheRef.current[key] = { ...cacheRef.current[key], meta: next };
        if (key === activeYear) setMeta(next);
        return next;
    }, [activeYear, meta]);

    // Creates a brand-new, entirely blank year from the structure template -
    // never copies another year's values. Every seed write (8 sections + 1
    // meta + the years-index update) carries YEARS_CREATE_KEY alongside its
    // own section key, so a user who holds only "create a year" - and none
    // of the 8 section edit keys - can still successfully create one; the
    // Lambda's permission check is an OR across pageKeys, so omitting this
    // on any single write would silently break the feature for exactly the
    // users it's meant to empower.
    const createYear = useCallback(async ({ year, label, userEmail }) => {
        const key = String(year);
        if (availableYears.some((y) => y.year === key)) {
            throw new Error(`Year ${key} already exists.`);
        }

        await Promise.all(
            structure.sections.map((template) =>
                upsertPageContent({
                    slug:         sectionSlug(key, template.id),
                    content:      JSON.stringify({ rows: blankSectionRows(template) }),
                    pageKeys:     [YEARS_CREATE_KEY, sectionPageKey(template.id)],
                    historyLabel: `NEB ${key} — create (${template.id})`,
                })
            )
        );

        const seededMeta = defaultMeta(key);
        await upsertPageContent({
            slug:         metaSlug(key),
            content:      JSON.stringify(seededMeta),
            pageKeys:     [YEARS_CREATE_KEY, META_PAGE_KEY],
            historyLabel: `NEB ${key} — create (meta)`,
        });

        const entry = { year: key, label: label || `${key} NEB`, uploadedAt: null, uploadedBy: userEmail ?? null };
        const next  = [{ year: DEFAULT_YEAR, label: `${DEFAULT_YEAR} NEB`, isBuiltIn: true }, ...availableYears.filter((y) => y.year !== DEFAULT_YEAR && y.year !== key), entry]
            .sort((a, b) => Number(b.year) - Number(a.year));

        await upsertPageContent({
            slug:         YEARS_INDEX_SLUG,
            content:      JSON.stringify(next.filter((y) => y.year !== DEFAULT_YEAR)),
            pageKeys:     [YEARS_CREATE_KEY],
            historyLabel: `NEB — create year ${key}`,
        });

        cacheRef.current[key] = { sections: structure.sections.map((t) => ({ id: t.id, label: t.label, description: t.description, rows: blankSectionRows(t) })), meta: seededMeta };
        setAvailableYears(next);
        return entry;
    }, [availableYears]);

    // Moves a year's data to a new year label - for the "typed the wrong
    // year, already entered real data under it" case. This is a genuine
    // data move (every slug is keyed by the year string itself), not a
    // relabel: read whatever's really stored under `from` (not the cache,
    // which may hold blank-template placeholders for sections never
    // actually saved), write it under `to`, then delete the `from` records.
    // Gated by the same neb.years.create key as creating a year - it's a
    // structural operation on the years list, not a single section edit.
    const renameYear = useCallback(async ({ fromYear, toYear, userEmail }) => {
        const from = String(fromYear);
        const to   = String(toYear);
        if (from === DEFAULT_YEAR) throw new Error(`${DEFAULT_YEAR} can't be renamed.`);
        if (from === to) return;
        if (!availableYears.some((y) => y.year === from)) throw new Error(`Year ${from} doesn't exist.`);
        if (availableYears.some((y) => y.year === to)) throw new Error(`Year ${to} already exists.`);

        const [sectionReads, metaRead] = await Promise.all([
            Promise.all(structure.sections.map((t) =>
                client.models.PageContent.pageContentBySlug({ slug: sectionSlug(from, t.id) }, { authMode: "apiKey" })
                    .then((r) => r?.data?.[0]).catch(() => null)
            )),
            client.models.PageContent.pageContentBySlug({ slug: metaSlug(from) }, { authMode: "apiKey" })
                .then((r) => r?.data?.[0]).catch(() => null),
        ]);

        // Copy under the new slug - only sections that actually had a saved
        // record (an untouched section just keeps resolving to the blank
        // template under its new slug too, same as any other year).
        await Promise.all(
            structure.sections.map((t, i) => {
                const item = sectionReads[i];
                if (!item?.content) return null;
                return upsertPageContent({
                    slug:         sectionSlug(to, t.id),
                    content:      item.content,
                    pageKeys:     [YEARS_CREATE_KEY, sectionPageKey(t.id)],
                    historyLabel: `NEB ${to} — renamed from ${from} (${t.id})`,
                });
            })
        );

        let newMeta = { ...defaultMeta(to) };
        if (metaRead?.content) {
            try {
                const parsed = JSON.parse(metaRead.content);
                newMeta = {
                    ...parsed,
                    year:        to,
                    title:       typeof parsed.title === "string" ? parsed.title.split(from).join(to) : parsed.title,
                    sankeyTitle: typeof parsed.sankeyTitle === "string" ? parsed.sankeyTitle.split(from).join(to) : parsed.sankeyTitle,
                };
            } catch { /* keep the fresh default for `to` */ }
        }
        await upsertPageContent({
            slug:         metaSlug(to),
            content:      JSON.stringify(newMeta),
            pageKeys:     [YEARS_CREATE_KEY, META_PAGE_KEY],
            historyLabel: `NEB ${to} — renamed from ${from} (meta)`,
        });

        // Now that everything is safely copied, remove the old slugs.
        await Promise.all([
            ...sectionReads.map((item, i) => item?.id
                ? deletePageContentById({ id: item.id, pageKeys: [YEARS_CREATE_KEY, sectionPageKey(structure.sections[i].id)], historyLabel: `NEB ${from} — removed after rename to ${to}` })
                : null),
            metaRead?.id
                ? deletePageContentById({ id: metaRead.id, pageKeys: [YEARS_CREATE_KEY, META_PAGE_KEY], historyLabel: `NEB ${from} — meta removed after rename to ${to}` })
                : null,
        ]);

        const oldEntry = availableYears.find((y) => y.year === from);
        const newEntry = {
            year:       to,
            label:      (oldEntry?.label ?? `${from} NEB`).split(from).join(to),
            uploadedAt: oldEntry?.uploadedAt ?? null,
            uploadedBy: userEmail ?? oldEntry?.uploadedBy ?? null,
        };
        const next = [
            { year: DEFAULT_YEAR, label: `${DEFAULT_YEAR} NEB`, isBuiltIn: true },
            ...availableYears.filter((y) => y.year !== DEFAULT_YEAR && y.year !== from && y.year !== to),
            newEntry,
        ].sort((a, b) => Number(b.year) - Number(a.year));

        await upsertPageContent({
            slug:         YEARS_INDEX_SLUG,
            content:      JSON.stringify(next.filter((y) => y.year !== DEFAULT_YEAR)),
            pageKeys:     [YEARS_CREATE_KEY],
            historyLabel: `NEB — renamed year ${from} to ${to}`,
        });

        delete cacheRef.current[from];
        delete cacheRef.current[to];
        setAvailableYears(next);
        if (activeYear === from) setActiveYear(to);

        return newEntry;
    }, [availableYears, activeYear, setActiveYear]);

    return (
        <NEBDataContext.Provider value={{
            sections, meta, loading,
            sankeyTitle: meta.sankeyTitle,
            commodities: structure.commodities,
            activeYear, setActiveYear,
            availableYears, loadingYears,
            saveSectionData, saveMeta, createYear, renameYear, loadYear,
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

// One section of the active year - replaces every page's own
// sections.find((s) => s.id === sectionId).
export function useNEBSection(sectionId) {
    const { sections } = useNEBData();
    return useMemo(() => sections.find((s) => s.id === sectionId) ?? null, [sections, sectionId]);
}
