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
import AnimatedNumber from "@/app/components/ui/AnimatedNumber";

const fmtPJ = (n) => `${Math.round(n).toLocaleString("en-US")} PJ`;

const COMMODITY_LABEL = COMMODITY_ID_MAP;

// Per-source display config for power generation rows
const POWER_CONFIG = {
    "power-coal":    { label: "Coal",               color: "bg-slate-500",   dot: "bg-slate-500",   thermal: true  },
    "power-nuclear": { label: "Nuclear",             color: "bg-violet-500",  dot: "bg-violet-500",  thermal: true  },
    "power-solar":   { label: "Solar PV",            color: "bg-yellow-400",  dot: "bg-yellow-400",  thermal: false },
    "power-wind":    { label: "Wind",                color: "bg-sky-400",     dot: "bg-sky-400",     thermal: false },
    "power-ocgt":    { label: "Gas / OCGT",          color: "bg-orange-400",  dot: "bg-orange-400",  thermal: true  },
    "power-biomass": { label: "Biomass & Landfill",  color: "bg-lime-500",    dot: "bg-lime-500",    thermal: true  },
    "power-hydro":   { label: "Hydro",               color: "bg-emerald-400", dot: "bg-emerald-400", thermal: false },
};

// Input fuel id for each power row
const POWER_INPUT = {
    "power-coal":    "bituminous",
    "power-nuclear": "nuclear",
    "power-solar":   "solar",
    "power-wind":    "wind",
    "power-ocgt":    "diesel",
    "power-biomass": "biomass",
    "power-hydro":   "hydro",
};

function eff(input, output) {
    if (!input || input === 0) return null;
    return (output / input * 100).toFixed(1);
}

export default function ConversionPage() {
    const { commodities, meta, activeYear, saveSectionData } = useNEBData();
    const section = useNEBSection("conversion");
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const canEditSection = canEdit("neb.conversion");
    const grid = useEditableSectionGrid({
        year: activeYear, sectionId: "conversion", section,
        canEdit: canEditSection, userEmail: user?.email, saveSectionData,
    });
    if (!section) return null;

    const byId = Object.fromEntries(section.rows.map((r) => [r.id, r]));

    // ── Power generation ──────────────────────────────────────────────────────
    const powerRows = Object.keys(POWER_CONFIG).map((id) => {
        const row      = byId[id];
        const inputId  = POWER_INPUT[id];
        const inputPJ  = row?.values[inputId] != null ? Math.abs(row.values[inputId]) : 0;
        const outputPJ = row?.values.electricity ?? 0;
        return { id, inputId, inputPJ, outputPJ, cfg: POWER_CONFIG[id] };
    });

    const powerStationTotal = powerRows.reduce((s, r) => s + r.outputPJ, 0);
    const chpIds            = ["chp-chemical", "chp-pulp", "chp-sugar"];
    const chpTotal          = chpIds.reduce((s, id) => s + (byId[id]?.values.electricity ?? 0), 0);
    const electricityImports = Math.abs(byId["electricity-imports"]?.values.electricity ?? 0);
    const electricityExports = Math.abs(byId["electricity-exports"]?.values.electricity ?? 0);
    const tdLosses           = Math.abs(byId["electricity-losses"]?.values.electricity ?? 0);
    const totalElecRow       = byId["total-electricity"];
    const netElectricity     = totalElecRow?.values.electricity ?? 0;

    const tdLossPct = powerStationTotal > 0 ? (tdLosses / (powerStationTotal + chpTotal) * 100).toFixed(1) : "0";

    // ── Refinery ──────────────────────────────────────────────────────────────
    const crudRow = byId["refinery-crude"];
    const ctlRow  = byId["refinery-ctl"];

    const crudeInput   = Math.abs(crudRow?.values.crude ?? 0);
    const ctlInput     = Math.abs(ctlRow?.values.bituminous ?? 0);
    const ctlOutput    = ctlRow?.values.diesel ?? 0;

    const CRUDE_OUTPUTS = ["gasoline", "diesel", "lpg", "kerosene", "hfo"];
    const crudeOutputs  = CRUDE_OUTPUTS.map((id) => ({
        id, label: COMMODITY_LABEL[id] ?? id, value: crudRow?.values[id] ?? 0,
    })).filter((o) => o.value > 0);
    const crudeOutputTotal = crudeOutputs.reduce((s, o) => s + o.value, 0);

    const totalRefineryRow = byId["refinery-total"];

    return (
        <main>
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            {/* No "· {year}" badge - the active year lives once in the
                YearSwitcher bar shared by every NEB route. Breadcrumb stops at
                the parent rather than repeating the page title a second time. */}
            <HeroSection variant="dark">
                <nav className="flex items-center gap-1.5 text-xs text-[var(--color-cream)]/50 mb-4 flex-wrap">
                    <Link href="/dashboard" className="hover:text-[var(--color-cream)]/80 transition-colors">Dashboard</Link>
                    <span>/</span>
                    <Link href={`/dashboard/energy-balance?year=${activeYear}`} className="hover:text-[var(--color-cream)]/80 transition-colors">National Energy Planning</Link>
                </nav>

                <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    <span className="text-[var(--color-accent)]">Conversion &amp; Transformation</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-[var(--color-cream)]/60 leading-relaxed">
                    How South Africa transforms primary energy into usable electricity and liquid fuels — power stations, CHP plants, crude oil refineries, and Sasol&apos;s coal-to-liquids process.
                </p>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="relative rounded-none border border-[var(--color-cream)]/10 px-4 py-3">
                        <span className="motion-pulse-dot absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        <div className="text-xl font-bold text-[var(--color-accent)] tabular-nums">
                            <AnimatedNumber value={netElectricity} format={fmtPJ} />
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--color-cream)]/50">Net Electricity Generated</div>
                    </div>
                    <div className="rounded-none border border-[var(--color-cream)]/10 px-4 py-3">
                        <div className="text-xl font-bold text-yellow-400 tabular-nums">
                            <AnimatedNumber value={powerStationTotal} format={fmtPJ} />
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--color-cream)]/50">Power Station Gross Output</div>
                    </div>
                    <div className="rounded-none border border-[var(--color-cream)]/10 px-4 py-3">
                        <div className="text-xl font-bold text-red-400 tabular-nums">
                            <AnimatedNumber value={tdLosses} format={fmtPJ} /> <span className="text-base font-normal">({tdLossPct}%)</span>
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--color-cream)]/50">T&amp;D Losses</div>
                    </div>
                    <div className="rounded-none border border-[var(--color-cream)]/10 px-4 py-3">
                        <div className="text-xl font-bold text-amber-400 tabular-nums">
                            <AnimatedNumber value={crudeOutputTotal + ctlOutput} format={fmtPJ} />
                        </div>
                        <div className="mt-0.5 text-xs text-[var(--color-cream)]/50">Refinery Liquid Output</div>
                    </div>
                </div>
            </HeroSection>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

                {/* ── Power generation by source ────────────────────────────── */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-hairline)]">
                        <h2 className="font-semibold text-[var(--color-ink)]">Power Generation by Source</h2>
                        <p className="text-xs text-[var(--color-ink-soft)]/70 mt-0.5">
                            Input fuel consumed vs. electricity output — conversion efficiency shown for thermal plants
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--color-cream-2)] border-b border-[var(--color-hairline)] text-xs font-semibold text-[var(--color-ink-soft)] uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left">Source</th>
                                    <th className="px-4 py-3 text-right">Input (PJ)</th>
                                    <th className="px-4 py-3 text-right">Input Fuel</th>
                                    <th className="px-4 py-3 text-right">Electricity Out (PJ)</th>
                                    <th className="px-4 py-3 text-right">Efficiency</th>
                                    <th className="px-4 py-3 text-right">Share of Grid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-hairline)]">
                                {powerRows.map((r) => {
                                    const efficiency = r.cfg.thermal ? eff(r.inputPJ, r.outputPJ) : null;
                                    const sharePct   = powerStationTotal > 0
                                        ? (r.outputPJ / powerStationTotal * 100).toFixed(1)
                                        : "0.0";
                                    return (
                                        <tr key={r.id} className="hover:bg-[var(--color-cream-2)] transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${r.cfg.dot}`} />
                                                    <span className="font-medium text-[var(--color-ink)]">{r.cfg.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-[var(--color-ink-soft)]">
                                                {r.inputPJ > 0 ? r.inputPJ.toFixed(2) : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-[var(--color-ink-soft)]">
                                                {COMMODITY_LABEL[r.inputId] ?? r.inputId}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-[var(--color-ink-soft)]">
                                                {r.outputPJ.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {efficiency != null ? (
                                                    <span className={`font-semibold ${parseFloat(efficiency) < 40 ? "text-red-500" : "text-emerald-600"}`}>
                                                        {efficiency}%
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-ink-soft)]/70 text-xs">primary equiv.</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 rounded-none bg-[var(--color-cream-2)]">
                                                        <div
                                                            className={`h-1.5 rounded-none ${r.cfg.color}`}
                                                            style={{ width: `${sharePct}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-[var(--color-ink)] tabular-nums w-10 text-right">
                                                        {sharePct}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* Totals row */}
                                <tr className="bg-[var(--color-ink)] font-semibold text-sm">
                                    <td className="px-6 py-3 text-[var(--color-cream)]">Total Power Stations</td>
                                    <td className="px-4 py-3 text-right font-mono text-[var(--color-cream)]/50">—</td>
                                    <td className="px-4 py-3" />
                                    <td className="px-4 py-3 text-right font-mono text-emerald-400">
                                        {powerStationTotal.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3" />
                                    <td className="px-4 py-3 text-right text-emerald-400">100%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Electricity balance ───────────────────────────────────── */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] p-6">
                    <h2 className="text-base font-semibold text-[var(--color-ink)] mb-1">Electricity Balance</h2>
                    <p className="text-xs text-[var(--color-ink-soft)] mb-5">
                        From gross generation to net electricity available for final consumption
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
                        <div className="rounded-none bg-indigo-50 border border-indigo-100 p-4 text-center">
                            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Power Stations</div>
                            <div className="text-2xl font-bold text-indigo-700 tabular-nums">+{powerStationTotal.toFixed(0)}</div>
                            <div className="text-xs text-indigo-500 mt-0.5">PJ</div>
                        </div>
                        <div className="rounded-none bg-violet-50 border border-violet-100 p-4 text-center">
                            <div className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-1">CHP Plants</div>
                            <div className="text-2xl font-bold text-violet-700 tabular-nums">+{chpTotal.toFixed(0)}</div>
                            <div className="text-xs text-violet-500 mt-0.5">PJ</div>
                        </div>
                        <div className="rounded-none bg-amber-50 border border-amber-100 p-4 text-center">
                            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Imports / Exports</div>
                            <div className="text-2xl font-bold text-amber-700 tabular-nums">
                                {electricityImports > electricityExports ? "+" : "−"}
                                {Math.abs(electricityImports - electricityExports).toFixed(0)}
                            </div>
                            <div className="text-xs text-amber-500 mt-0.5">PJ net</div>
                        </div>
                        <div className="rounded-none bg-red-50 border border-red-100 p-4 text-center">
                            <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">T&amp;D Losses</div>
                            <div className="text-2xl font-bold text-red-700 tabular-nums">−{tdLosses.toFixed(0)}</div>
                            <div className="text-xs text-red-500 mt-0.5">PJ</div>
                        </div>
                        <div className="rounded-none bg-[var(--color-ink)] p-4 text-center">
                            <div className="text-xs font-semibold text-[var(--color-cream)]/50 uppercase tracking-wide mb-1">Net Electricity</div>
                            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{netElectricity.toFixed(0)}</div>
                            <div className="text-xs text-[var(--color-cream)]/40 mt-0.5">PJ</div>
                        </div>
                    </div>
                </div>

                {/* ── Refinery section ──────────────────────────────────────── */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] p-6">
                    <h2 className="text-base font-semibold text-[var(--color-ink)] mb-1">Liquid Fuel Transformation</h2>
                    <p className="text-xs text-[var(--color-ink-soft)] mb-5">
                        Crude oil refining and Sasol&apos;s Coal-to-Liquids (CTL) process
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Crude refining */}
                        <div className="rounded-none bg-amber-50 border border-amber-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-amber-900">Crude Oil Refining</h3>
                                    <p className="text-xs text-amber-600 mt-0.5">NATREF &amp; Engen refineries</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-amber-600">Input</div>
                                    <div className="text-lg font-bold text-amber-800 tabular-nums">{crudeInput.toFixed(0)} PJ</div>
                                    <div className="text-[11px] text-amber-500">crude oil</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {crudeOutputs.map((o) => (
                                    <div key={o.id}>
                                        <div className="flex justify-between text-xs mb-0.5">
                                            <span className="text-amber-800">{o.label}</span>
                                            <span className="font-mono font-medium text-amber-900">{o.value.toFixed(1)} PJ</span>
                                        </div>
                                        <div className="h-1.5 w-full rounded-none bg-amber-100">
                                            <div
                                                className="h-1.5 rounded-none bg-amber-400"
                                                style={{ width: `${(o.value / crudeOutputTotal * 100).toFixed(1)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-amber-200 flex justify-between text-xs font-semibold">
                                    <span className="text-amber-800">Total Output</span>
                                    <span className="font-mono text-amber-900">{crudeOutputTotal.toFixed(1)} PJ</span>
                                </div>
                            </div>
                        </div>

                        {/* Sasol CTL */}
                        <div className="rounded-none bg-[var(--color-cream-2)] border border-[var(--color-hairline)] p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--color-ink)]">Coal to Liquids — Sasol CTL</h3>
                                    <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">Secunda synfuels complex</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-[var(--color-ink-soft)]">Input</div>
                                    <div className="text-lg font-bold text-[var(--color-ink)] tabular-nums">{ctlInput.toFixed(0)} PJ</div>
                                    <div className="text-[11px] text-[var(--color-ink-soft)]/70">bituminous coal</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-0.5">
                                        <span className="text-[var(--color-ink-soft)]">Diesel / Synfuels Output</span>
                                        <span className="font-mono font-medium text-[var(--color-ink)]">{ctlOutput.toFixed(1)} PJ</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-none bg-[var(--color-hairline)]">
                                        <div
                                            className="h-1.5 rounded-none bg-[var(--color-ink-soft)]"
                                            style={{ width: `${(ctlOutput / ctlInput * 100).toFixed(1)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="rounded-none bg-white border border-[var(--color-hairline)] px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs text-[var(--color-ink-soft)]">Conversion Efficiency</span>
                                    <span className="text-sm font-bold text-red-500">
                                        {(ctlOutput / ctlInput * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <p className="text-[11px] text-[var(--color-ink-soft)]/70">
                                    Sasol&apos;s CTL process converts coal to synthetic diesel and chemicals. The ~47% conversion loss reflects the thermodynamic cost of the Fischer-Tropsch synthesis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Full data table ───────────────────────────────────────── */}
                <div className="rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-hairline)] flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="font-semibold text-[var(--color-ink)]">Full Breakdown</h2>
                            <p className="text-xs text-[var(--color-ink-soft)]/70 mt-0.5">
                                All values in PJ · Negative = energy consumed in transformation · Positive = output
                            </p>
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
                                    total_pj: row.values.total ?? null,
                                    ...Object.fromEntries(commodities.map((c) => [c.id, row.values[c.id] ?? null])),
                                }));
                                const json = JSON.stringify({ source: `SA NEB ${activeYear}`, section: "conversion-and-transformation", unit: "PJ", rows: data }, null, 2);
                                const blob = new Blob([json], { type: "application/json" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = `SA_NEB_${activeYear}_Conversion.json`; a.click();
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
                    <EditableDataTable
                        rows={grid.isEditing ? grid.draftRows : section.rows}
                        commodities={commodities}
                        totalLabel="Total PJ"
                        labelColWidth="min-w-52"
                        isEditing={grid.isEditing}
                        setCell={grid.setCell}
                        formatValue={(v) => (v != null ? Number(v).toFixed(2) : "—")}
                        cellClassName={(v, { isTotalRow, isTotalColumn }) => {
                            if (isTotalColumn) return isTotalRow ? "text-emerald-800" : "text-[var(--color-ink-soft)]";
                            if (v == null) return isTotalRow ? "text-[var(--color-ink-soft)]/70" : "text-[var(--color-ink-soft)]/40";
                            if (isTotalRow) return "text-emerald-800";
                            return Number(v) < 0 ? "text-red-500" : "text-[var(--color-ink-soft)]";
                        }}
                    />
                </div>

                {/* ── Footer ────────────────────────────────────────────────── */}
                <div className="rounded-none bg-[var(--color-cream-2)] border border-[var(--color-hairline)] px-5 py-4">
                    <h3 className="text-xs font-semibold text-[var(--color-ink)] mb-2">Data Notes</h3>
                    <ul className="space-y-1 text-xs text-[var(--color-ink-soft)]">
                        <li>• All values in Petajoules (PJ). Negative = energy input consumed. Positive = energy output produced.</li>
                        <li>• Solar PV, wind, hydro, and nuclear are reported as primary equivalent — efficiency shown as &quot;primary equiv.&quot; rather than a thermal conversion rate.</li>
                        <li>• CHP = Combined Heat &amp; Power. These plants simultaneously produce electricity and useful heat for industrial processes.</li>
                        <li>• T&amp;D = Transmission &amp; Distribution losses in the electricity grid ({tdLossPct}% of gross generation).</li>
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
