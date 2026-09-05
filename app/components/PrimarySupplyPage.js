"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useNEBData } from "@/app/context/NEBData";

const SUPPLY_FUELS = [
    "bituminous", "coking", "anthracite", "coke", "charcoal",
    "crude", "gasoline", "diesel", "lpg", "kerosene", "aviationGas", "hfo",
    "naturalGas", "nuclear",
];

const GROUP_STYLE = {
    coal:    { bar: "bg-slate-500",  label: "Coal & Coke"    },
    biomass: { bar: "bg-lime-400",   label: "Biomass & Wood"  },
    liquid:  { bar: "bg-amber-400",  label: "Liquid Fuels"    },
    other:   { bar: "bg-blue-400",   label: "Gas & Nuclear"   },
};

export default function PrimarySupplyPage() {
    const { sections, commodities, meta } = useNEBData();
    const COMMODITY_LABEL = useMemo(() => Object.fromEntries(commodities.map((c) => [c.id, c.label])), [commodities]);
    const COMMODITY_GROUP = useMemo(() => Object.fromEntries(commodities.map((c) => [c.id, c.group])), [commodities]);
    const section = sections.find((s) => s.id === "primary-supply");
    if (!section) return null;

    const totalRow  = section.rows.find((r) => r.isTotal);
    const flowRows  = section.rows.filter((r) => !r.isTotal);
    const tpesTotal = totalRow?.values?.total ?? 0;

    const miningRow  = section.rows.find((r) => r.id === "coal-mining");
    const cokeRow    = section.rows.find((r) => r.id === "coke-production");
    const importsRow = section.rows.find((r) => r.id === "imports");
    const exportsRow = section.rows.find((r) => r.id === "exports");

    function rowPositiveSum(row) {
        if (!row) return 0;
        return commodities.reduce((s, c) => {
            const v = row.values[c.id];
            return s + (v != null && v > 0 ? v : 0);
        }, 0);
    }
    function rowNegativeSum(row) {
        if (!row) return 0;
        return commodities.reduce((s, c) => {
            const v = row.values[c.id];
            return s + (v != null && v < 0 ? Math.abs(v) : 0);
        }, 0);
    }

    const prodTotal    = rowPositiveSum(miningRow) + rowPositiveSum(cokeRow);
    const importsTotal = rowPositiveSum(importsRow);
    const exportsTotal = rowNegativeSum(exportsRow);

    // Net per commodity across all non-total rows
    const netByCommodity = {};
    SUPPLY_FUELS.forEach((id) => {
        const net = flowRows.reduce((s, row) => s + (row.values[id] ?? 0), 0);
        netByCommodity[id] = net;
    });
    // Nuclear only appears in TPES row
    const nuclearPJ = totalRow?.values?.nuclear ?? 0;
    if (nuclearPJ) netByCommodity["nuclear"] = nuclearPJ;

    // Group totals (positive net only)
    const groupTotals = { coal: 0, biomass: 0, liquid: 0, other: 0 };
    Object.entries(netByCommodity).forEach(([id, net]) => {
        if (net > 0) {
            const g = COMMODITY_GROUP[id] ?? "other";
            groupTotals[g] = (groupTotals[g] ?? 0) + net;
        }
    });

    // Top fuels (positive net, sorted)
    const topFuels = SUPPLY_FUELS
        .map((id) => ({ id, label: COMMODITY_LABEL[id] ?? id, value: netByCommodity[id] ?? 0 }))
        .filter((f) => f.value > 0)
        .sort((a, b) => b.value - a.value);

    const groupSum = Object.values(groupTotals).reduce((a, b) => a + b, 0);
    const pct = (v) => groupSum > 0 ? (v / groupSum * 100).toFixed(1) : "0.0";
    const tpesPct = (v) => tpesTotal > 0 ? (v / tpesTotal * 100).toFixed(1) : "0.0";

    return (
        <main>
            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <section
                className="relative overflow-hidden text-white"
                style={{ background: "linear-gradient(135deg, #091520 0%, #0d2035 55%, #091520 100%)" }}
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
                        <span className="text-white/80">Primary Energy Supply</span>
                    </nav>

                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 ring-1 ring-inset ring-white/15">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        Supply Side · 2024 NEB
                    </div>

                    <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                        <span className="text-sky-400">Primary Energy Supply</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-base text-white/60 leading-relaxed">
                        South Africa&apos;s total primary energy supply — domestic production, imports, exports, and stock changes before any transformation or conversion.
                    </p>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-sky-400">
                                {tpesTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Total Primary Energy Supply</div>
                        </div>
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-emerald-400">
                                {prodTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Domestic Production</div>
                        </div>
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-amber-400">
                                {importsTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Total Imports</div>
                        </div>
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className="text-xl font-bold text-red-400">
                                {exportsTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Total Exports</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

                {/* ── Supply flows ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Domestic Production</span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-700 tabular-nums">
                            +{prodTotal.toFixed(0)} PJ
                        </div>
                        <p className="mt-1 text-xs text-emerald-600">Coal mining + coke &amp; charcoal production</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 ring-1 ring-amber-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Imports</span>
                        </div>
                        <div className="text-3xl font-bold text-amber-700 tabular-nums">
                            +{importsTotal.toFixed(0)} PJ
                        </div>
                        <p className="mt-1 text-xs text-amber-600">Crude oil, refined liquid fuels &amp; coal</p>
                    </div>
                    <div className="rounded-2xl bg-red-50 ring-1 ring-red-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs font-semibold text-red-800 uppercase tracking-wide">Exports</span>
                        </div>
                        <div className="text-3xl font-bold text-red-700 tabular-nums">
                            −{exportsTotal.toFixed(0)} PJ
                        </div>
                        <p className="mt-1 text-xs text-red-600">Mainly coal — SA is a major exporter</p>
                    </div>
                </div>

                {/* ── TPES composition by group ─────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-1">Supply Mix by Fuel Group</h2>
                    <p className="text-xs text-slate-500 mb-5">
                        Net supply by energy carrier group (production + imports − exports − losses)
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
                                            <span className="text-slate-700">{g.label}</span>
                                            <span className="font-medium text-slate-900 tabular-nums">
                                                {val.toFixed(1)} PJ
                                                <span className="text-slate-400 font-normal ml-1.5">({pct(val)}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-slate-100">
                                            <div className={`h-2.5 rounded-full ${g.bar}`} style={{ width: `${pct(val)}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                    <p className="mt-4 text-[11px] text-slate-400">
                        Note: liquid fuels include both crude imports and refined product imports/exports. Nuclear (28 PJ) is from the TPES row.
                    </p>
                </div>

                {/* ── Top individual fuels ──────────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-1">Top Energy Sources</h2>
                    <p className="text-xs text-slate-500 mb-5">
                        Largest contributors by commodity — as a share of TPES ({tpesTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ)
                    </p>
                    <div className="space-y-3.5">
                        {topFuels.map((f) => (
                            <div key={f.id}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-slate-700">{f.label}</span>
                                    <span className="font-medium text-slate-900 tabular-nums">
                                        {f.value.toFixed(1)} PJ
                                        <span className="text-slate-400 font-normal ml-1.5">({tpesPct(f.value)}%)</span>
                                    </span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-slate-100">
                                    <div className="h-2.5 rounded-full bg-sky-400" style={{ width: `${tpesPct(f.value)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Full data table ───────────────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="font-semibold text-slate-900">Full Breakdown</h2>
                            <p className="text-xs text-slate-400 mt-0.5">All values in PJ · Negative = outflow (exports / losses)</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const headers = ["Row", "Total PJ", ...SUPPLY_FUELS.map((id) => COMMODITY_LABEL[id] ?? id)];
                                const rows = section.rows.map((row) => [
                                    row.label,
                                    row.values.total != null ? row.values.total.toFixed(2) : "",
                                    ...SUPPLY_FUELS.map((id) => { const v = row.values[id]; return v != null ? v.toFixed(2) : ""; }),
                                ]);
                                const csv  = [headers, ...rows].map((r) => r.map((c) => { const s = String(c ?? ""); return s.includes(",") ? `"${s}"` : s; }).join(",")).join("\n");
                                const blob = new Blob([csv], { type: "text/csv" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = "SA_NEB_2024_Primary_Supply.csv"; a.click();
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
                                    ...Object.fromEntries(SUPPLY_FUELS.map((id) => [id, row.values[id] ?? null])),
                                }));
                                const json = JSON.stringify({ source: "SA NEB 2024", section: "primary-supply", unit: "PJ", rows: data }, null, 2);
                                const blob = new Blob([json], { type: "application/json" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = "SA_NEB_2024_Primary_Supply.json"; a.click();
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
                                    <th className="sticky left-0 z-10 bg-slate-50 px-4 py-2.5 text-left font-semibold text-slate-600 min-w-48">
                                        Row
                                    </th>
                                    <th className="px-3 py-2.5 text-right font-semibold text-slate-600 min-w-20 border-r border-slate-200">
                                        Total PJ
                                    </th>
                                    {SUPPLY_FUELS.map((id) => (
                                        <th key={id} className="px-3 py-2.5 text-right font-medium text-slate-500 min-w-24 whitespace-nowrap">
                                            {COMMODITY_LABEL[id] ?? id}
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
                                        {SUPPLY_FUELS.map((id) => {
                                            const v = row.values[id];
                                            const isNeg = v != null && v < 0;
                                            return (
                                                <td
                                                    key={id}
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
                        <li>• All values in Petajoules (PJ). Negative values represent outflows — exports, losses, or stock draws.</li>
                        <li>• TPES = domestic production + imports − exports ± stock changes. Crude oil and refined products are both present in the supply rows; the TPES total reconciles these through conversion accounting.</li>
                        <li>• Nuclear energy (28 PJ) is reported as a thermal equivalent input to Koeberg.</li>
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
