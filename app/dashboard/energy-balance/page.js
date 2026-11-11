"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";
import { useNEBData } from "@/app/context/NEBData";
import NEBSectionCard from "@/app/components/NEBSectionCard";
import HeroSection from "@/app/components/ui/HeroSection";
import SourceLine from "@/app/components/ui/SourceLine";
import Link from "next/link";

const EnergySankey = dynamic(() => import("@/app/components/EnergySankey"), { ssr: false });
const FinalConsumptionBars = dynamic(() => import("@/app/components/FinalConsumptionBars"), { ssr: false });

const GROUP_LABELS = { coal: "Coal & Coke", biomass: "Biomass", liquid: "Liquid Fuels", other: "Gas & Electricity" };
const COMMODITY_GROUP_ORDER = ["coal", "biomass", "liquid", "other"];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EnergyBalancePage() {
    const { canEdit } = usePermissions();
    const canEditTitle = canEdit("neb.balance");
    const { user } = useAuth();

    const {
        sections, sankeyTitle, activeYear,
        commodities, meta, loading: dataLoading, saveMeta,
    } = useNEBData();

    // Table UI state
    const [activeGroup, setActiveGroup] = useState("all");
    const [collapsed,   setCollapsed]   = useState({});

    // Sankey title edit state
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft,   setTitleDraft]   = useState("");
    const [savingTitle,  setSavingTitle]  = useState(false);

    async function saveTitle() {
        const next = titleDraft.trim();
        setEditingTitle(false);
        if (!next || next === sankeyTitle) return;
        setSavingTitle(true);
        try {
            await saveMeta({
                year: activeYear,
                patch: { sankeyTitle: next },
                userEmail: user?.email,
                historyLabel: "NEB — Sankey title",
            });
        } catch { /* silent */ }
        finally { setSavingTitle(false); }
    }

    const visibleCommodities = useMemo(() => {
        if (activeGroup === "all") return commodities;
        return commodities.filter((c) => c.group === activeGroup);
    }, [activeGroup, commodities]);

    function toggleSection(id) {
        setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    // ── Summary stats ─────────────────────────────────────────────────────────

    const { summaryStats, sectorTotals } = useMemo(() => {
        const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

        const tpesVal = byId["primary-supply"]?.rows.find((r) => r.isTotal)?.values?.total ?? 0;
        const elecVal = byId["conversion"]?.rows.find((r) => r.id === "total-electricity")?.values?.electricity ?? 0;
        const tfesVal = byId["final-supply"]?.rows.find((r) => r.id === "tfes")?.values?.total ?? 0;
        const tfcVal  = Math.abs(byId["final-supply"]?.rows.find((r) => r.id === "tfc-bottomup")?.values?.total ?? 0);

        const fmt0 = (v) => Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 0 });

        const SECTOR_IDS = ["agriculture", "commerce", "industry", "residential", "transport"];
        const SECTOR_LABELS = { agriculture: "Agriculture", commerce: "Commerce", industry: "Industry", residential: "Residential", transport: "Transport" };

        return {
            summaryStats: [
                { label: "Total Primary Energy Supply", value: `${fmt0(tpesVal)} PJ`, raw: tpesVal, color: "text-blue-700"    },
                { label: "Electricity Generated",        value: `${fmt0(elecVal)} PJ`, raw: elecVal, color: "text-purple-700"  },
                { label: "Total Final Energy Supply",    value: `${fmt0(tfesVal)} PJ`, raw: tfesVal, color: "text-emerald-700" },
                { label: "Total Final Consumption",      value: `${fmt0(tfcVal)} PJ`,  raw: tfcVal,  color: "text-red-600"     },
            ],
            sectorTotals: SECTOR_IDS.map((id) => {
                const row = byId[id]?.rows.find((r) => r.isTotal);
                const val = row?.values?.total ?? 0;
                return {
                    id,
                    label: SECTOR_LABELS[id],
                    value: `${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PJ`,
                };
            }),
        };
    }, [sections]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <main>
            {/* Slow-drifting two-tone accent line used atop the chart cards below -
                each card passes its own pair of colors (drawn from that chart's
                own palette, not arbitrary ones) via CSS custom properties. */}
            <style>{`
                @keyframes cardAccentDrift {
                    0%, 100% { background-position: 0% 50%; }
                    50%      { background-position: 100% 50%; }
                }
                .card-accent {
                    height: 2px;
                    background-image: linear-gradient(90deg, transparent, var(--accent-a), var(--accent-b), transparent);
                    background-size: 200% 100%;
                    animation: cardAccentDrift 7s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .card-accent { animation: none; background-position: 50% 50%; }
                }
            `}</style>

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            {/* The active year lives in the YearSwitcher bar directly above this
                page (app/components/YearSwitcher.js, rendered from this route's
                layout) - it is deliberately not restated here, in the title, or
                in any card below. */}
            <HeroSection variant="dark" eyebrow="National Energy Balance">
                <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    <span className="text-[var(--color-accent)]">National Energy Planning</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-[var(--color-cream)]/60 leading-relaxed">
                    South Africa&apos;s complete energy flow from primary supply through conversion to final consumption. All values in Petajoules (PJ).
                </p>
                <SourceLine source={meta.source} date={meta.date} dark className="mt-2" />

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {summaryStats.map((s) => (
                        <div key={s.label} className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="mt-0.5 text-xs text-white/50">{s.label}</div>
                        </div>
                    ))}
                </div>
            </HeroSection>

            {/* ── Sector strip ──────────────────────────────────────────────── */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 sm:divide-x sm:divide-slate-100">

                        {/* Supply & Conversion */}
                        <div className="sm:pr-8">
                            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                Supply &amp; Conversion
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    href="/dashboard/energy-balance/primary-supply"
                                    className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs transition-all hover:border-green-200 hover:bg-green-50"
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                    <span className="font-medium text-slate-700 group-hover:text-green-700">Primary Energy Supply</span>
                                    <span className="font-mono text-slate-500">{summaryStats[0].value}</span>
                                </Link>
                                <Link
                                    href="/dashboard/energy-balance/conversion"
                                    className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs transition-all hover:border-green-200 hover:bg-green-50"
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                    <span className="font-medium text-slate-700 group-hover:text-green-700">Conversion &amp; Transformation</span>
                                    <span className="font-mono text-slate-500">{summaryStats[1].value}</span>
                                </Link>
                            </div>
                        </div>

                        {/* Final Consumption by Sector */}
                        <div className="flex-1 min-w-0 sm:pl-8">
                            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                Final Consumption by Sector
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sectorTotals.map((s) => (
                                    <Link
                                        key={s.id}
                                        href={`/dashboard/energy-balance/${s.id}`}
                                        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs transition-all hover:border-green-200 hover:bg-green-50"
                                    >
                                        <span className="font-medium text-slate-700 group-hover:text-green-700">{s.label}</span>
                                        <span className="font-mono text-red-500">{s.value}</span>
                                    </Link>
                                ))}
                                <Link
                                    href="/dashboard/energy-balance/methodology"
                                    className="group inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                                >
                                    Methodology &amp; Sources
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ── Sankey Diagram ────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
                <div className="rounded-[28px] bg-white ring-1 ring-slate-200/70 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_48px_-12px_rgba(15,23,42,0.18)] overflow-hidden">
                    <div className="card-accent" style={{ "--accent-a": "#2563eb", "--accent-b": "#8b5cf6" }} />
                    <div className="px-6 pt-6 pb-2 flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            {canEditTitle && editingTitle ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        autoFocus
                                        value={titleDraft}
                                        onChange={(e) => setTitleDraft(e.target.value)}
                                        onBlur={saveTitle}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") saveTitle();
                                            if (e.key === "Escape") setEditingTitle(false);
                                        }}
                                        className="text-base font-semibold text-slate-900 bg-transparent border-b-2 border-violet-400 outline-none w-64"
                                    />
                                    <button onClick={saveTitle} className="text-xs text-violet-600 font-medium hover:text-violet-800">Save</button>
                                    <button onClick={() => setEditingTitle(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group">
                                    <h2 className={`text-base font-semibold text-slate-900 ${savingTitle ? "opacity-50" : ""}`}>
                                        {sankeyTitle}
                                    </h2>
                                    {canEditTitle && !savingTitle && (
                                        <button
                                            onClick={() => { setTitleDraft(sankeyTitle); setEditingTitle(true); }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-violet-600"
                                            title="Edit title"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            )}
                            <p className="text-xs text-slate-500 mt-0.5">
                                Primary supply through transformation to final consumption. Hover over flows for PJ values.
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: 820 }}>
                            <EnergySankey sections={sections} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Final Consumption by Sector (fuel-mix bar chart) ─────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-8">
                <div className="rounded-[28px] bg-white ring-1 ring-slate-200/70 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_48px_-12px_rgba(15,23,42,0.18)] overflow-hidden">
                    <div className="card-accent" style={{ "--accent-a": "#ea580c", "--accent-b": "#2563eb" }} />
                    <div className="px-6 pt-6 pb-2 flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">Final Consumption by Sector</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Energy delivered to each end-use sector, by fuel. Hover a segment for its PJ value.
                            </p>
                        </div>
                    </div>
                    <FinalConsumptionBars sections={sections} />
                </div>
            </div>

            {/* ── Commodity filter ──────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveGroup("all")}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeGroup === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                    All Commodities
                </button>
                {COMMODITY_GROUP_ORDER.map((g) => (
                    <button
                        key={g}
                        onClick={() => setActiveGroup(g)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeGroup === g ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {GROUP_LABELS[g]}
                    </button>
                ))}
            </div>

            {/* ── Data table ────────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16 space-y-6">
                {dataLoading ? (
                    <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Loading data…</div>
                ) : (
                    sections.map((section) => (
                        <NEBSectionCard
                            key={section.id}
                            section={section}
                            collapsed={!!collapsed[section.id]}
                            onToggle={() => toggleSection(section.id)}
                            visibleCommodities={visibleCommodities}
                        />
                    ))
                )}
            </div>

            {/* ── Footer notes ──────────────────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-5 py-4">
                    <h3 className="text-xs font-semibold text-slate-700 mb-2">Data Notes</h3>
                    <ul className="space-y-1 text-xs text-slate-500">
                        <li>• All values in Petajoules (PJ). Negative = consumption, Positive = production/supply.</li>
                        <li>• A dash (—) indicates zero, negligible, or not applicable for that commodity/row combination.</li>
                        <li>• TPES = Total Primary Energy Supply. OCGT = Open Cycle Gas Turbine. CHP = Combined Heat & Power. CTL = Coal to Liquids.</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
