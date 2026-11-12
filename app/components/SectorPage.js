"use client";

import Link from "next/link";
import { useNEBData, useNEBSection, COMMODITY_ID_MAP } from "@/app/context/NEBData";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";
import { useEditableSectionGrid } from "@/app/components/useEditableSectionGrid";
import EditableDataTable from "@/app/components/EditableDataTable";
import EditSaveControls from "@/app/components/EditSaveControls";
import NEBCsvControls from "@/app/components/NEBCsvControls";
import HeroSection from "@/app/components/ui/HeroSection";
import SourceLine from "@/app/components/ui/SourceLine";
import StatGaugeTile from "@/app/components/ui/StatGaugeTile";
import YearSwitcher from "@/app/components/YearSwitcher";
import { computeSectorCO2 } from "@/app/lib/co2Factors";

const fmtPJ = (n) => `${Math.round(n).toLocaleString("en-US")} PJ`;

// Sectors are told apart by label/position, not a unique hue each - the
// redesign's one terracotta accent covers all 5 (it used to be a different
// gradient + text color per sector, 5 one-off palettes doing one job).
const SECTOR_CONFIG = {
    agriculture: {
        label:       "Agriculture",
        description: "Energy consumed for heating, irrigation, and traction across South Africa's farming sector.",
        fuels:       ["diesel", "electricity", "lpg", "gasoline", "kerosene"],
    },
    commerce: {
        label:       "Commerce",
        description: "Energy use in commercial and public buildings — offices, retail, schools, and hospitals.",
        fuels:       ["electricity", "wood", "charcoal", "kerosene", "gasoline", "hfo", "naturalGas"],
    },
    industry: {
        label:       "Industry",
        description: "South Africa's largest consuming sector — covering chemicals, metals, mining, and manufacturing.",
        fuels:       ["electricity", "bituminous", "biomass", "naturalGas", "hfo", "coking", "anthracite", "coke"],
    },
    residential: {
        label:       "Residential",
        description: "Household energy use across low, middle, and high income groups.",
        fuels:       ["electricity", "wood", "lpg", "gasoline", "bituminous", "charcoal", "solar"],
    },
    transport: {
        label:       "Transport",
        description: "Energy consumed by road, rail, aviation, and pipeline across passenger and freight modes.",
        fuels:       ["diesel", "gasoline", "kerosene", "aviationGas", "electricity", "naturalGas", "hfo"],
    },
};

const COMMODITY_LABEL = COMMODITY_ID_MAP;

const GROUP_STYLE = {
    coal:    { bar: "bg-slate-400",  label: "Coal & Coke"        },
    biomass: { bar: "bg-lime-400",   label: "Biomass & Wood"      },
    liquid:  { bar: "bg-amber-400",  label: "Liquid Fuels"        },
    other:   { bar: "bg-blue-400",   label: "Electricity & Gas"   },
};

function rowTotal(row, commodities) {
    if (row.values.total !== null && row.values.total !== undefined)
        return Math.abs(row.values.total);
    return commodities.reduce((s, c) => {
        const v = row.values[c.id];
        return s + (v != null ? Math.abs(v) : 0);
    }, 0);
}

export default function SectorPage({ sectionId }) {
    const { commodities, meta, activeYear, saveSectionData } = useNEBData();
    const cfg     = SECTOR_CONFIG[sectionId];
    const section = useNEBSection(sectionId);
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const canEditSection = canEdit(`neb.${sectionId}`);
    const grid = useEditableSectionGrid({
        year: activeYear, sectionId, section,
        canEdit: canEditSection, userEmail: user?.email, saveSectionData,
    });
    if (!section || !cfg) return null;

    const totalRow     = section.rows.find((r) => r.isTotal);
    const subsectors   = section.rows.filter((r) => !r.isTotal);
    const sectorTotal  = totalRow ? Math.abs(totalRow.values.total) : 0;

    // Fuel group totals (across all subsectors)
    const groupTotals = { coal: 0, biomass: 0, liquid: 0, other: 0 };
    subsectors.forEach((row) => {
        commodities.forEach((c) => {
            const v = row.values[c.id];
            if (v != null) groupTotals[c.group] += Math.abs(v);
        });
    });

    // Key fuel totals
    const keyFuels = cfg.fuels
        .map((id) => ({
            id,
            label: COMMODITY_LABEL[id] ?? id,
            total: subsectors.reduce((s, row) => {
                const v = row.values[id];
                return s + (v != null ? Math.abs(v) : 0);
            }, 0),
        }))
        .filter((f) => f.total > 0)
        .sort((a, b) => b.total - a.total);

    const pct = (v) => sectorTotal > 0 ? (v / sectorTotal * 100).toFixed(1) : "0.0";
    // Total Consumption is always >= any single fuel's share, so it anchors
    // the gauges at 100% and each fuel tile's bar reflects its real share.
    const gaugePct = (v) => sectorTotal > 0 ? Math.abs(v) / sectorTotal * 100 : 0;

    const co2 = computeSectorCO2(section, commodities);
    const co2Groups = [
        { key: "coal",    label: "Coal & Coke",      color: "bg-slate-400" },
        { key: "liquid",  label: "Liquid Fuels",      color: "bg-amber-400" },
        { key: "other",   label: "Electricity & Gas", color: "bg-blue-400"  },
        { key: "biomass", label: "Biomass",           color: "bg-lime-400"  },
    ].filter((g) => co2.byGroup[g.key] > 0);
    const co2Pct = (v) => co2.totalMtCO2 > 0 ? (v / co2.totalMtCO2 * 100).toFixed(1) : "0.0";

    return (
        <main>
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            {/* No "· {year}" badge here - the active year lives once in the
                YearSwitcher embedded below, inside this hero. The breadcrumb
                also stops at the parent rather than repeating {cfg.label} a
                second time right above the identical H1. */}
            <HeroSection variant="dark">
                <nav className="flex items-center gap-1.5 text-xs text-[var(--color-cream)]/50 mb-4 flex-wrap">
                    <Link href="/dashboard" className="hover:text-[var(--color-cream)]/80 transition-colors">Dashboard</Link>
                    <span>/</span>
                    <Link href={`/dashboard/energy-balance?year=${activeYear}`} className="hover:text-[var(--color-cream)]/80 transition-colors">National Energy Planning</Link>
                </nav>

                {/* Sector quick-nav */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {[
                        { id: "industry",    label: "Industry",    href: "/dashboard/energy-balance/industry"    },
                        { id: "transport",   label: "Transport",   href: "/dashboard/energy-balance/transport"   },
                        { id: "residential", label: "Residential", href: "/dashboard/energy-balance/residential" },
                        { id: "commerce",    label: "Commerce",    href: "/dashboard/energy-balance/commerce"    },
                        { id: "agriculture", label: "Agriculture", href: "/dashboard/energy-balance/agriculture" },
                    ].map((s) => (
                        <Link
                            key={s.id}
                            href={`${s.href}?year=${activeYear}`}
                            className={`rounded-none px-3 py-1 text-xs font-medium transition-colors border ${
                                s.id === sectionId
                                    ? "bg-[var(--color-accent)]/20 text-[var(--color-cream)] border-[var(--color-accent)]/40"
                                    : "bg-white/5 text-[var(--color-cream)]/50 border-transparent hover:bg-white/10 hover:text-[var(--color-cream)]/80"
                            }`}
                        >
                            {s.label}
                        </Link>
                    ))}
                </div>

                <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    <span className="text-[var(--color-accent)]">{cfg.label}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-[var(--color-cream)]/60 leading-relaxed">{cfg.description}</p>

                <div className="mt-6">
                    <YearSwitcher dark />
                </div>

                {/* Key stat cards */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatGaugeTile
                        value={sectorTotal} label="Total Consumption" format={fmtPJ}
                        pct={100} barClassName="bg-[var(--color-accent)]" valueClassName="text-[var(--color-accent)]"
                    />
                    {keyFuels.slice(0, 3).map((f) => (
                        <StatGaugeTile
                            key={f.id}
                            value={f.total} label={f.label} format={fmtPJ}
                            pct={gaugePct(f.total)}
                        />
                    ))}
                </div>
            </HeroSection>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

                {/* ── Fuel group mix ────────────────────────────────────────── */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] p-6">
                    <h2 className="text-base font-semibold text-[var(--color-ink)] mb-1">Fuel Mix</h2>
                    <p className="text-xs text-[var(--color-ink-soft)] mb-5">
                        Share of {cfg.label.toLowerCase()} energy by fuel group
                    </p>
                    <div className="space-y-3.5">
                        {Object.entries(groupTotals)
                            .filter(([, v]) => v > 0)
                            .sort(([, a], [, b]) => b - a)
                            .map(([group, val]) => {
                                const g = GROUP_STYLE[group];
                                return (
                                    <div key={group}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-[var(--color-ink-soft)]">{g.label}</span>
                                            <span className="font-medium text-[var(--color-ink)] tabular-nums">
                                                {val.toFixed(1)} PJ
                                                <span className="text-[var(--color-ink-soft)]/70 font-normal ml-1.5">({pct(val)}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-none bg-[var(--color-cream-2)]">
                                            <div className={`h-1.5 rounded-none ${g.bar}`} style={{ width: `${pct(val)}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* ── CO₂ emissions estimate ───────────────────────────────── */}
                {co2.totalMtCO2 > 0 && (
                    <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] p-6">
                        <div className="flex items-start justify-between gap-4 mb-1">
                            <h2 className="text-base font-semibold text-[var(--color-ink)]">CO₂ Emissions Estimate</h2>
                            <span className="shrink-0 rounded-none bg-[var(--color-cream-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-ink-soft)] tabular-nums">
                                {co2.totalMtCO2.toFixed(2)} Mt CO₂
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-ink-soft)] mb-5">
                            Estimated direct CO₂ from combustion — IPCC 2006 emission factors · Biomass counted as carbon-neutral
                        </p>
                        <div className="space-y-3.5">
                            {co2Groups.map((g) => (
                                <div key={g.key}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-[var(--color-ink-soft)]">{g.label}</span>
                                        <span className="font-medium text-[var(--color-ink)] tabular-nums">
                                            {co2.byGroup[g.key].toFixed(2)} Mt CO₂
                                            <span className="text-[var(--color-ink-soft)]/70 font-normal ml-1.5">({co2Pct(co2.byGroup[g.key])}%)</span>
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-none bg-[var(--color-cream-2)]">
                                        <div className={`h-1.5 rounded-none ${g.color}`} style={{ width: `${co2Pct(co2.byGroup[g.key])}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-[11px] text-[var(--color-ink-soft)]/70">
                            Electricity CO₂ uses SA grid average (0.9 kg CO₂/kWh · NEB 2024 ~81% coal). Figures are indicative estimates, not official inventory values.
                        </p>
                    </div>
                )}

                {/* ── Subsector breakdown ───────────────────────────────────── */}
                {subsectors.length > 1 && (
                    <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] p-6">
                        <h2 className="text-base font-semibold text-[var(--color-ink)] mb-1">
                            {subsectors.length > 3 ? "Subsector Breakdown" : "End-Use Breakdown"}
                        </h2>
                        <p className="text-xs text-[var(--color-ink-soft)] mb-5">
                            Share of total {cfg.label.toLowerCase()} consumption by sub-category
                        </p>
                        <div className="space-y-3.5">
                            {subsectors
                                .map((row) => ({ row, total: rowTotal(row, commodities) }))
                                .sort((a, b) => b.total - a.total)
                                .map(({ row, total }) => (
                                    <div key={row.id}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-[var(--color-ink-soft)]">{row.label}</span>
                                            <span className="font-medium text-[var(--color-ink)] tabular-nums">
                                                {total.toFixed(1)} PJ
                                                <span className="text-[var(--color-ink-soft)]/70 font-normal ml-1.5">({pct(total)}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-none bg-[var(--color-cream-2)]">
                                            <div
                                                className="h-1.5 rounded-none bg-[var(--color-accent)]"
                                                style={{ width: `${pct(total)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* ── Full data table ───────────────────────────────────────── */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-hairline)] flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="font-semibold text-[var(--color-ink)]">Full Breakdown</h2>
                            <p className="text-xs text-[var(--color-ink-soft)]/70 mt-0.5">All values in PJ · Absolute values shown</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <EditSaveControls
                            canEdit={canEditSection}
                            isEditing={grid.isEditing}
                            saving={grid.saving}
                            error={grid.error}
                            draftRestored={grid.draftRestored}
                            onStartEdit={grid.handleStartEdit}
                            onSave={grid.handleSave}
                            onCancel={grid.handleCancel}
                        />
                        {!grid.isEditing && (
                            <NEBCsvControls
                                section={section}
                                year={activeYear}
                                canEdit={canEditSection}
                                saveSectionData={saveSectionData}
                            />
                        )}
                        <button
                            onClick={() => {
                                const data = section.rows.map((row) => ({
                                    row: row.label,
                                    isTotal: row.isTotal ?? false,
                                    total_pj: row.values.total != null ? Math.abs(row.values.total) : null,
                                    ...Object.fromEntries(cfg.fuels.map((id) => {
                                        const v = row.values[id];
                                        return [id, v != null ? Math.abs(v) : null];
                                    })),
                                }));
                                const json = JSON.stringify({ source: `SA NEB ${activeYear}`, section: sectionId, unit: "PJ", rows: data }, null, 2);
                                const blob = new Blob([json], { type: "application/json" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = `SA_NEB_${activeYear}_${sectionId}.json`; a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-none bg-white border border-[var(--color-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] transition-colors"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            JSON
                        </button>
                        </div>
                    </div>
                    {grid.isEditing && (
                        <p className="px-6 pt-3 text-[11px] text-amber-600">
                            Editing shows real stored values, not the absolute values shown above — consumption is negative, production/embedded generation (e.g. rooftop solar) is positive.
                        </p>
                    )}
                    <EditableDataTable
                        rows={grid.isEditing ? grid.draftRows : section.rows}
                        commodities={cfg.fuels.map((id) => ({ id, label: COMMODITY_LABEL[id] ?? id }))}
                        totalLabel="Total PJ"
                        isEditing={grid.isEditing}
                        setCell={grid.setCell}
                        formatValue={(v) => (v != null ? Math.abs(Number(v)).toFixed(2) : "—")}
                        cellClassName={(v, { isTotalRow, isTotalColumn }) => {
                            if (isTotalColumn) return isTotalRow ? "text-emerald-800" : "text-[var(--color-ink-soft)]";
                            if (v == null) return isTotalRow ? "text-[var(--color-ink-soft)]/70" : "text-[var(--color-ink-soft)]/40";
                            return isTotalRow ? "text-emerald-800" : "text-[var(--color-ink-soft)]";
                        }}
                    />
                </div>

                {/* ── Footer ────────────────────────────────────────────────── */}
                <div className="rounded-none bg-[var(--color-cream-2)] border border-[var(--color-hairline)] px-5 py-4">
                    <h3 className="text-xs font-semibold text-[var(--color-ink)] mb-2">Data Notes</h3>
                    <ul className="space-y-1 text-xs text-[var(--color-ink-soft)]">
                        <li>• All values in Petajoules (PJ). Absolute values shown — original sign convention: negative = consumption.</li>
                        <li>• A dash (—) indicates zero, negligible, or not applicable for that fuel/row combination.</li>
                        <li><SourceLine source={meta.source} date={meta.date} className="inline" /></li>
                        <li>
                            <Link href={`/dashboard/energy-balance?year=${activeYear}`} className="underline hover:text-[var(--color-ink)]">
                                ← Back to National Energy Planning
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
