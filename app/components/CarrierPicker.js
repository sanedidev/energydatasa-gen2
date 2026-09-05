"use client";

/**
 * CarrierPicker — modal search/browse for pages within a dataset section.
 *
 * Props:
 *   sectionConfig   – { base, rootCardsSlug, sectionPathKey, staticItems }
 *                     Defaults to Energy Carriers if omitted.
 *   onSelect({ title, href, desc }) — called when user picks an item
 *   onCancel                        — called to close without selecting
 *   excludeHrefs                    — array of hrefs already in this carrier (skip them)
 */

import { useState, useEffect, useRef } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { BASE as EC_BASE, STATIC_NAV as EC_NAV } from "@/app/dashboard/energy-carriers/_nav-data";
import { BASE as EE_BASE, STATIC_NAV as EE_NAV } from "@/app/dashboard/energy-efficiency/_nav-data";
import { BASE as EP_BASE, STATIC_NAV as EP_NAV } from "@/app/dashboard/energy-planning/_nav-data";


// ─── Per-subsystem static items + section configs ────────────────────────────

function flattenNav(nodes, ancestors = []) {
    const items = [];
    for (const node of nodes) {
        const path = [...ancestors, node.label];
        items.push({
            label: node.label,
            href: node.href,
            desc: null,
            type: node.children?.length ? "carrier" : "file",
            path,
            isStatic: true,
        });
        if (node.children?.length) items.push(...flattenNav(node.children, path));
    }
    return items;
}

export const DEFAULT_SECTION_CONFIG = {
    base: EC_BASE,
    rootCardsSlug: "ec.carriers.__cards__",
    sectionPathKey: "dashboard.energy-carriers",
    sectionLabel: "Energy Carriers",
    staticItems: flattenNav(EC_NAV, ["Energy Carriers"]),
    // Static carriers (folders) that exist as hardcoded page.js files, with
    // the real PageContent cards slug + the built-in default cards each one
    // falls back to when it has no saved record yet. Without this, moving a
    // card into a static carrier that's never been edited would create a
    // brand-new record containing ONLY the moved card, silently wiping out
    // its built-in cards (which normally come from defaultCards, not a DB
    // record). Extend whenever a new static carrier page.js is added.
    staticCarriers: [
        {
            href: "/dashboard/energy-carriers",
            label: "Energy Carriers",
            cardsSlug: "ec.carriers.__cards__",
            defaultCards: [
                { id: "coal", href: "/dashboard/energy-carriers/coal", title: "Coal", desc: "Production, mining, markets and power stations.", hidden: false },
            ],
        },
        {
            href: "/dashboard/energy-carriers/coal",
            label: "Coal",
            cardsSlug: "ec.coal.__cards__",
            defaultCards: [
                { id: "coal-information", href: "/dashboard/energy-carriers/coal/coal-information", title: "Coal Information", desc: "Quality, calorific values, composition and logistics.", hidden: false },
                { id: "production-and-mining", href: "/dashboard/energy-carriers/coal/production-and-mining", title: "Production & Mining", desc: "Mines, methods, output and remaining life of mines.", hidden: false },
                { id: "market-and-trade", href: "/dashboard/energy-carriers/coal/market-and-trade-information", title: "Market & Trade Information", desc: "Imports/exports, prices, contracts and indices.", hidden: false },
            ],
        },
    ],
};

export const EE_SECTION_CONFIG = {
    base: EE_BASE,
    rootCardsSlug: "energy-efficiency.__cards__",
    sectionPathKey: "dashboard.energy-efficiency",
    sectionLabel: "Energy Efficiency",
    staticItems: flattenNav(EE_NAV, ["Energy Efficiency"]),
    staticCarriers: [
        {
            href: "/dashboard/energy-efficiency",
            label: "Energy Efficiency",
            cardsSlug: "energy-efficiency.__cards__",
            defaultCards: [
                { id: "tax-incentives", href: `${EE_BASE}/tax-incentives`, title: "Tax Incentives", desc: "Incentive schemes, eligibility and application guidance.", hidden: false },
                { id: "energy-performance-certificates", href: `${EE_BASE}/energy-performance-certificates`, title: "Energy Performance Certificates", desc: "EPC requirements, ratings and compliance process.", hidden: false },
                { id: "balancing-energy-supply-demand", href: `${EE_BASE}/balancing-energy-supply-and-demand`, title: "Balancing Energy Supply and Demand", desc: "Demand-side management, DSM programs and planning.", hidden: false },
                { id: "standards-and-labelling", href: `${EE_BASE}/standards-and-labelling`, title: "Standards & Labelling", desc: "Minimum performance standards and product labels.", hidden: false },
            ],
        },
    ],
};

export const EP_SECTION_CONFIG = {
    base: EP_BASE,
    rootCardsSlug: "energy-planning.__cards__",
    sectionPathKey: "dashboard.energy-planning",
    sectionLabel: "Energy Planning",
    staticItems: flattenNav(EP_NAV, ["Energy Planning"]),
    staticCarriers: [
        {
            href: "/dashboard/energy-planning",
            label: "Energy Planning",
            cardsSlug: "energy-planning.__cards__",
            defaultCards: [
                { id: "integrated-resource-plan", href: `${EP_BASE}/integrated-resource-plan`, title: "Integrated Resource Plan (IRP)", desc: "Capacity outlooks, technology splits, assumptions and scenarios.", hidden: false },
                { id: "integrated-energy-plan", href: `${EP_BASE}/integrated-energy-plan`, title: "Integrated Energy Plan (IEP)", desc: "Energy balance, long-term demand drivers and policy pathways.", hidden: false },
                { id: "gas-master-plan", href: `${EP_BASE}/gas-master-plan`, title: "Gas Master Plan", desc: "Infrastructure, LNG vs piped options, demand outlooks and timelines.", hidden: false },
                { id: "liquid-fuels-master-plan", href: `${EP_BASE}/liquid-fuels-master-plan`, title: "Liquid Fuels Master Plan", desc: "Refinery/import strategy, specs, logistics and security of supply.", hidden: false },
            ],
        },
    ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchJson(slug) {
    try {
        const res = await client.models.PageContent.pageContentBySlug({ slug }, { authMode: "apiKey" });
        const content = res?.data?.[0]?.content;
        if (content) return JSON.parse(content);
    } catch {}
    return null;
}

export async function buildDynamicItems(sectionConfig) {
    const { base, rootCardsSlug, sectionPathKey, staticItems } = sectionConfig;
    const staticHrefs = new Set(staticItems.map((i) => i.href));
    const items = [];
    const queue = [{ cardsSlug: rootCardsSlug, parentHref: base, ancestors: [sectionConfig.sectionLabel ?? ""] }];
    const visited = new Set();

    while (queue.length > 0) {
        const batch = queue.splice(0, 4);
        await Promise.all(batch.map(async ({ cardsSlug, parentHref, ancestors }) => {
            if (visited.has(cardsSlug)) return;
            visited.add(cardsSlug);

            const data = await fetchJson(cardsSlug);
            const cards = Array.isArray(data) ? data.filter((c) => !c.hidden) : [];

            await Promise.all(cards.map(async (card) => {
                const href = card.href ?? `${parentHref}/${card.id}`;
                if (staticHrefs.has(href)) return;

                const rel = href.replace(`${base}/`, "");
                const pathKey = rel.replace(/\//g, ".");
                const nodeConfig = await fetchJson(`dyn.node.${sectionPathKey}.${pathKey}`);
                const type = nodeConfig?.type ?? "file";
                const path = [...ancestors, card.title];

                items.push({ label: card.title, href, desc: card.desc ?? null, type, path, isStatic: false });

                if (type === "carrier") {
                    queue.push({
                        cardsSlug: `dyn.cards.${sectionPathKey}.${pathKey}`,
                        parentHref: href,
                        ancestors: path,
                    });
                }
            }));
        }));
    }

    return items;
}

function sourceCardsSlug(href, sectionConfig) {
    const { base, rootCardsSlug, sectionPathKey } = sectionConfig;
    const lastSlash = href.lastIndexOf("/");
    const parentHref = href.substring(0, lastSlash);
    if (parentHref === base || !parentHref.startsWith(base + "/")) return rootCardsSlug;
    const rel = parentHref.replace(`${base}/`, "");
    return `dyn.cards.${sectionPathKey}.${rel.replace(/\//g, ".")}`;
}

async function removeFromSource(item, sectionConfig) {
    const slug = sourceCardsSlug(item.href, sectionConfig);
    try {
        const res = await client.models.PageContent.pageContentBySlug({ slug }, { authMode: "apiKey" });
        const record = res?.data?.[0] ?? null;
        if (!record?.content) return;
        const cards = JSON.parse(record.content);
        const parentHref = item.href.substring(0, item.href.lastIndexOf("/"));
        const updated = cards.filter((c) => {
            const h = c.href ?? `${parentHref}/${c.id}`;
            return h !== item.href;
        });
        await client.models.PageContent.update({ id: record.id, content: JSON.stringify(updated) });
    } catch (e) {
        console.error("CarrierPicker: failed to remove from source", e);
    }
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function FolderIcon() {
    return (
        <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg className="h-3.5 w-3.5 shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CarrierPicker({ sectionConfig: sectionConfigProp, onSelect, onCancel, excludeHrefs = [] }) {
    const sectionConfig = { ...DEFAULT_SECTION_CONFIG, ...sectionConfigProp };
    const excludeSet = new Set(excludeHrefs);

    const [query, setQuery] = useState("");
    const [allItems, setAllItems] = useState(sectionConfig.staticItems);
    const [loadingDyn, setLoadingDyn] = useState(true);
    const [selected, setSelected] = useState(null);
    const [actioning, setActioning] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => { searchRef.current?.focus(); }, []);

    useEffect(() => {
        function load() {
            setAllItems(sectionConfig.staticItems);
            setLoadingDyn(true);
            buildDynamicItems(sectionConfig).then((dynItems) => {
                setAllItems([...sectionConfig.staticItems, ...dynItems]);
                setLoadingDyn(false);
            });
        }
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionConfig.rootCardsSlug]);

    const q = query.trim().toLowerCase();
    const filtered = allItems.filter((item) => {
        if (excludeSet.has(item.href)) return false;
        if (!q) return true;
        return item.label.toLowerCase().includes(q) || item.path.some((p) => p.toLowerCase().includes(q));
    });
    const displayed = q ? filtered : filtered.filter((i) => i.path.length === 2);

    async function handleDuplicate() {
        onSelect({ title: selected.label, href: selected.href, desc: selected.desc ?? "" });
    }

    async function handleMove() {
        setActioning(true);
        await removeFromSource(selected, sectionConfig);
        setActioning(false);
        onSelect({ title: selected.label, href: selected.href, desc: selected.desc ?? "" });
    }

    // ── Action panel ─────────────────────────────────────────────────────────
    if (selected) {
        return (
            <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-20">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden">
                    <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
                        <span className="mt-0.5">{selected.type === "carrier" ? <FolderIcon /> : <FileIcon />}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{selected.label}</p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{selected.path.slice(0, -1).join(" / ")}</p>
                        </div>
                        <button onClick={() => setSelected(null)} className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Back">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="p-5 space-y-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">How would you like to add this?</p>

                        <button onClick={handleDuplicate} disabled={actioning}
                            className="w-full flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-green-300 hover:bg-green-50 transition-all group disabled:opacity-40">
                            <span className="mt-0.5 rounded-lg bg-green-100 p-1.5 text-green-700 group-hover:bg-green-200 transition-colors">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                            </span>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-green-800">Duplicate here</p>
                                <p className="text-xs text-slate-500 mt-0.5">Keep the original in <span className="font-medium">{selected.path[selected.path.length - 2] ?? "its carrier"}</span> and also add a copy here.</p>
                            </div>
                        </button>

                        {!selected.isStatic ? (
                            <button onClick={handleMove} disabled={actioning}
                                className="w-full flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-300 hover:bg-blue-50 transition-all group disabled:opacity-40">
                                <span className="mt-0.5 rounded-lg bg-blue-100 p-1.5 text-blue-600 group-hover:bg-blue-200 transition-colors">
                                    {actioning ? (
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" /></svg>
                                    )}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-800">{actioning ? "Moving…" : "Move here"}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Remove from <span className="font-medium">{selected.path[selected.path.length - 2] ?? "its carrier"}</span> and move it here.</p>
                                </div>
                            </button>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">
                                Move is not available for built-in pages.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 px-5 py-3">
                        <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">← Back to search</button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Search list ───────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-20">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 flex flex-col max-h-[70vh]">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input ref={searchRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search ${sectionConfig.sectionLabel ?? "pages"}…`}
                        className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent" />
                    {loadingDyn && <span className="text-[10px] text-slate-400 animate-pulse shrink-0">Loading…</span>}
                    <button onClick={onCancel} className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Close">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {!q && <p className="px-4 pt-2.5 pb-1 text-[11px] text-slate-400">Showing top-level items — type to search all</p>}

                <ul className="flex-1 overflow-y-auto divide-y divide-slate-50 py-1">
                    {displayed.length === 0 && (
                        <li className="px-4 py-8 text-center text-sm text-slate-400">{q ? "No matches found." : "No items available."}</li>
                    )}
                    {displayed.map((item) => (
                        <li key={item.href}>
                            <button type="button" onClick={() => setSelected(item)}
                                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group">
                                <span className="mt-0.5">{item.type === "carrier" ? <FolderIcon /> : <FileIcon />}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 group-hover:text-green-700 transition-colors truncate">{item.label}</p>
                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.path.slice(0, -1).join(" / ")}</p>
                                </div>
                                <span className={`shrink-0 self-center text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md ${item.type === "carrier" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-500"}`}>
                                    {item.type}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">{displayed.length} {displayed.length === 1 ? "item" : "items"}{q ? " found" : " shown"}</p>
                    <button onClick={onCancel} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
}
