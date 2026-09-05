"use client";

import Link from "next/link";
import { useNEBData, COMMODITY_ID_MAP } from "@/app/context/NEBData";

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
    const { sections, commodities, meta } = useNEBData();
    const section = sections.find((s) => s.id === "conversion");
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
            <section
                className="relative overflow-hidden text-white"
                style={{ background: "linear-gradient(135deg, #0d1030 0%, #150d2e 55%, #0d1030 100%)" }}
            >
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: "64px 64px",
                    }}
                />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-14">
                    <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4 flex-wrap">
                        <Link href="/dashboard" className="hover:text-white/80 transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/energy-balance" className="hover:text-white/80 transition-colors">National Energy Planning</Link>
                        <span>/</span>
                        <span className="text-white/80">Conversion & Transformation</span>
                    </nav>

                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 ring-1 ring-inset ring-white/15">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        Transformation Sector · 2024 NEB
                    </div>

                    <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                        <span className="text-indigo-400">Conversion &amp; Transformation</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-base text-white/60 leading-relaxed">
                        How South Africa transforms primary energy into usable electricity and liquid fuels — power stations, CHP plants, crude oil refineries, and Sasol&apos;s coal-to-liquids process.
                    </p>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-indigo-400">
                                {netElectricity.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Net Electricity Generated</div>
                        </div>
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-yellow-400">
                                {powerStationTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Power Station Gross Output</div>
                        </div>
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-red-400">
                                {tdLosses.toFixed(0)} PJ <span className="text-base font-normal">({tdLossPct}%)</span>
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">T&amp;D Losses</div>
                        </div>
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-amber-400">
                                {(crudeOutputTotal + ctlOutput).toFixed(0)} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Refinery Liquid Output</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

                {/* ── Power generation by source ────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900">Power Generation by Source</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Input fuel consumed vs. electricity output — conversion efficiency shown for thermal plants
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    <th className="px-6 py-3 text-left">Source</th>
                                    <th className="px-4 py-3 text-right">Input (PJ)</th>
                                    <th className="px-4 py-3 text-right">Input Fuel</th>
                                    <th className="px-4 py-3 text-right">Electricity Out (PJ)</th>
                                    <th className="px-4 py-3 text-right">Efficiency</th>
                                    <th className="px-4 py-3 text-right">Share of Grid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {powerRows.map((r) => {
                                    const efficiency = r.cfg.thermal ? eff(r.inputPJ, r.outputPJ) : null;
                                    const sharePct   = powerStationTotal > 0
                                        ? (r.outputPJ / powerStationTotal * 100).toFixed(1)
                                        : "0.0";
                                    return (
                                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${r.cfg.dot}`} />
                                                    <span className="font-medium text-slate-900">{r.cfg.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-slate-700">
                                                {r.inputPJ > 0 ? r.inputPJ.toFixed(2) : "—"}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-slate-500">
                                                {COMMODITY_LABEL[r.inputId] ?? r.inputId}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-slate-700">
                                                {r.outputPJ.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {efficiency != null ? (
                                                    <span className={`font-semibold ${parseFloat(efficiency) < 40 ? "text-red-500" : "text-emerald-600"}`}>
                                                        {efficiency}%
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">primary equiv.</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-1.5 rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-1.5 rounded-full ${r.cfg.color}`}
                                                            style={{ width: `${sharePct}%` }}
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-slate-900 tabular-nums w-10 text-right">
                                                        {sharePct}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* Totals row */}
                                <tr className="bg-slate-900 font-semibold text-sm">
                                    <td className="px-6 py-3 text-white">Total Power Stations</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-400">—</td>
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
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-1">Electricity Balance</h2>
                    <p className="text-xs text-slate-500 mb-5">
                        From gross generation to net electricity available for final consumption
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
                        <div className="rounded-xl bg-indigo-50 ring-1 ring-indigo-100 p-4 text-center">
                            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Power Stations</div>
                            <div className="text-2xl font-bold text-indigo-700 tabular-nums">+{powerStationTotal.toFixed(0)}</div>
                            <div className="text-xs text-indigo-500 mt-0.5">PJ</div>
                        </div>
                        <div className="rounded-xl bg-teal-50 ring-1 ring-teal-100 p-4 text-center">
                            <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">CHP Plants</div>
                            <div className="text-2xl font-bold text-teal-700 tabular-nums">+{chpTotal.toFixed(0)}</div>
                            <div className="text-xs text-teal-500 mt-0.5">PJ</div>
                        </div>
                        <div className="rounded-xl bg-amber-50 ring-1 ring-amber-100 p-4 text-center">
                            <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Imports / Exports</div>
                            <div className="text-2xl font-bold text-amber-700 tabular-nums">
                                {electricityImports > electricityExports ? "+" : "−"}
                                {Math.abs(electricityImports - electricityExports).toFixed(0)}
                            </div>
                            <div className="text-xs text-amber-500 mt-0.5">PJ net</div>
                        </div>
                        <div className="rounded-xl bg-red-50 ring-1 ring-red-100 p-4 text-center">
                            <div className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">T&amp;D Losses</div>
                            <div className="text-2xl font-bold text-red-700 tabular-nums">−{tdLosses.toFixed(0)}</div>
                            <div className="text-xs text-red-500 mt-0.5">PJ</div>
                        </div>
                        <div className="rounded-xl bg-slate-900 p-4 text-center">
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Net Electricity</div>
                            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{netElectricity.toFixed(0)}</div>
                            <div className="text-xs text-slate-500 mt-0.5">PJ</div>
                        </div>
                    </div>
                </div>

                {/* ── Refinery section ──────────────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-1">Liquid Fuel Transformation</h2>
                    <p className="text-xs text-slate-500 mb-5">
                        Crude oil refining and Sasol&apos;s Coal-to-Liquids (CTL) process
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Crude refining */}
                        <div className="rounded-xl bg-amber-50 ring-1 ring-amber-100 p-5">
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
                                        <div className="h-1.5 w-full rounded-full bg-amber-100">
                                            <div
                                                className="h-1.5 rounded-full bg-amber-400"
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
                        <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Coal to Liquids — Sasol CTL</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Secunda synfuels complex</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500">Input</div>
                                    <div className="text-lg font-bold text-slate-800 tabular-nums">{ctlInput.toFixed(0)} PJ</div>
                                    <div className="text-[11px] text-slate-400">bituminous coal</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-0.5">
                                        <span className="text-slate-700">Diesel / Synfuels Output</span>
                                        <span className="font-mono font-medium text-slate-900">{ctlOutput.toFixed(1)} PJ</span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-slate-200">
                                        <div
                                            className="h-1.5 rounded-full bg-slate-500"
                                            style={{ width: `${(ctlOutput / ctlInput * 100).toFixed(1)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="rounded-lg bg-white ring-1 ring-slate-200 px-4 py-3 flex items-center justify-between">
                                    <span className="text-xs text-slate-600">Conversion Efficiency</span>
                                    <span className="text-sm font-bold text-red-500">
                                        {(ctlOutput / ctlInput * 100).toFixed(1)}%
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Sasol&apos;s CTL process converts coal to synthetic diesel and chemicals. The ~47% conversion loss reflects the thermodynamic cost of the Fischer-Tropsch synthesis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Full data table ───────────────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="font-semibold text-slate-900">Full Breakdown</h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                All values in PJ · Negative = energy consumed in transformation · Positive = output
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const headers = ["Row", "Total PJ", ...commodities.map((c) => c.label)];
                                const rows = section.rows.map((row) => [
                                    row.label,
                                    row.values.total != null ? row.values.total.toFixed(2) : "",
                                    ...commodities.map((c) => { const v = row.values[c.id]; return v != null ? v.toFixed(2) : ""; }),
                                ]);
                                const csv  = [headers, ...rows].map((r) => r.map((c) => { const s = String(c ?? ""); return s.includes(",") ? `"${s}"` : s; }).join(",")).join("\n");
                                const blob = new Blob([csv], { type: "text/csv" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = "SA_NEB_2024_Conversion.csv"; a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white ring-1 ring-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            CSV
                        </button>
                        <button
                            onClick={() => {
                                const data = section.rows.map((row) => ({
                                    row: row.label,
                                    isTotal: row.isTotal ?? false,
                                    total_pj: row.values.total ?? null,
                                    ...Object.fromEntries(commodities.map((c) => [c.id, row.values[c.id] ?? null])),
                                }));
                                const json = JSON.stringify({ source: "SA NEB 2024", section: "conversion-and-transformation", unit: "PJ", rows: data }, null, 2);
                                const blob = new Blob([json], { type: "application/json" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = "SA_NEB_2024_Conversion.json"; a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white ring-1 ring-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            JSON
                        </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-2.5 text-left font-semibold text-slate-600 min-w-52">
                                        Row
                                    </th>
                                    <th className="px-3 py-2.5 text-right font-semibold text-slate-600 min-w-20 border-r border-slate-200">
                                        Total PJ
                                    </th>
                                    {commodities.map((c) => (
                                        <th key={c.id} className="px-3 py-2.5 text-right font-medium text-slate-500 min-w-24 whitespace-nowrap">
                                            {c.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {section.rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={row.isTotal ? "bg-slate-900 font-semibold" : "hover:bg-slate-50 transition-colors"}
                                    >
                                        <td className={`sticky left-0 z-10 px-4 py-2.5 font-medium ${row.isTotal ? "bg-slate-900 text-white" : "bg-white text-slate-800"}`}>
                                            {row.label}
                                        </td>
                                        <td className={`px-3 py-2.5 text-right font-mono border-r border-slate-200 ${row.isTotal ? "text-emerald-400" : "text-slate-700"}`}>
                                            {row.values.total != null ? row.values.total.toFixed(2) : "—"}
                                        </td>
                                        {commodities.map((c) => {
                                            const v    = row.values[c.id];
                                            const isNeg = v != null && v < 0;
                                            return (
                                                <td
                                                    key={c.id}
                                                    className={`px-3 py-2.5 text-right font-mono ${
                                                        v == null
                                                            ? row.isTotal ? "text-slate-600" : "text-slate-300"
                                                            : row.isTotal ? "text-emerald-400"
                                                            : isNeg ? "text-red-500" : "text-slate-700"
                                                    }`}
                                                >
                                                    {v != null ? v.toFixed(2) : "—"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Footer ────────────────────────────────────────────────── */}
                <div className="rounded-xl bg-slate-50 ring-1 ring-slate-200 px-5 py-4">
                    <h3 className="text-xs font-semibold text-slate-700 mb-2">Data Notes</h3>
                    <ul className="space-y-1 text-xs text-slate-500">
                        <li>• All values in Petajoules (PJ). Negative = energy input consumed. Positive = energy output produced.</li>
                        <li>• Solar PV, wind, hydro, and nuclear are reported as primary equivalent — efficiency shown as &quot;primary equiv.&quot; rather than a thermal conversion rate.</li>
                        <li>• CHP = Combined Heat &amp; Power. These plants simultaneously produce electricity and useful heat for industrial processes.</li>
                        <li>• T&amp;D = Transmission &amp; Distribution losses in the electricity grid ({tdLossPct}% of gross generation).</li>
                        <li>• Source: {meta.source} · {meta.date}.</li>
                        <li>
                            <Link href="/dashboard/energy-balance" className="underline hover:text-slate-700">
                                ← Back to National Energy Planning
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
