"use client";

import Link from "next/link";
import { useNEBData, COMMODITY_ID_MAP } from "@/app/context/NEBData";
import { computeSectorCO2 } from "@/app/lib/co2Factors";

const SECTOR_CONFIG = {
    agriculture: {
        label:       "Agriculture",
        description: "Energy consumed for heating, irrigation, and traction across South Africa's farming sector.",
        accent:      "text-lime-400",
        badge:       "bg-lime-500",
        gradient:    "linear-gradient(135deg, #0a1a0a 0%, #0f2310 55%, #0a1a0a 100%)",
        fuels:       ["diesel", "electricity", "lpg", "gasoline", "kerosene"],
    },
    commerce: {
        label:       "Commerce",
        description: "Energy use in commercial and public buildings — offices, retail, schools, and hospitals.",
        accent:      "text-teal-400",
        badge:       "bg-teal-500",
        gradient:    "linear-gradient(135deg, #0a1a1a 0%, #0d2626 55%, #0a1a1a 100%)",
        fuels:       ["electricity", "wood", "charcoal", "kerosene", "gasoline", "hfo", "naturalGas"],
    },
    industry: {
        label:       "Industry",
        description: "South Africa's largest consuming sector — covering chemicals, metals, mining, and manufacturing.",
        accent:      "text-cyan-400",
        badge:       "bg-cyan-500",
        gradient:    "linear-gradient(135deg, #0d1526 0%, #0f2030 55%, #0d1526 100%)",
        fuels:       ["electricity", "bituminous", "biomass", "naturalGas", "hfo", "coking", "anthracite", "coke"],
    },
    residential: {
        label:       "Residential",
        description: "Household energy use across low, middle, and high income groups.",
        accent:      "text-pink-400",
        badge:       "bg-pink-500",
        gradient:    "linear-gradient(135deg, #1a0d1a 0%, #2a0f2a 55%, #1a0d1a 100%)",
        fuels:       ["electricity", "wood", "lpg", "gasoline", "bituminous", "charcoal", "solar"],
    },
    transport: {
        label:       "Transport",
        description: "Energy consumed by road, rail, aviation, and pipeline across passenger and freight modes.",
        accent:      "text-violet-400",
        badge:       "bg-violet-500",
        gradient:    "linear-gradient(135deg, #120d1a 0%, #1a1030 55%, #120d1a 100%)",
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
    const { sections, commodities, meta } = useNEBData();
    const cfg     = SECTOR_CONFIG[sectionId];
    const section = sections.find((s) => s.id === sectionId);
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
            <section className="relative overflow-hidden text-white" style={{ background: cfg.gradient }}>
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: "64px 64px",
                    }}
                />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-14">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4 flex-wrap">
                        <Link href="/dashboard" className="hover:text-white/80 transition-colors">Dashboard</Link>
                        <span>/</span>
                        <Link href="/dashboard/energy-balance" className="hover:text-white/80 transition-colors">National Energy Planning</Link>
                        <span>/</span>
                        <span className="text-white/80">{cfg.label}</span>
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
                                href={s.href}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    s.id === sectionId
                                        ? "bg-white/20 text-white ring-1 ring-white/30"
                                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                                }`}
                            >
                                {s.label}
                            </Link>
                        ))}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 ring-1 ring-inset ring-white/15">
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.badge}`} />
                        Final Consumption · 2024 NEB
                    </div>

                    <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                        <span className={cfg.accent}>{cfg.label}</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-base text-white/60 leading-relaxed">{cfg.description}</p>

                    {/* Key stat cards */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                            <div className={`text-xl font-bold ${cfg.accent}`}>
                                {sectorTotal.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                            </div>
                            <div className="mt-0.5 text-xs text-white/50">Total Consumption</div>
                        </div>
                        {keyFuels.slice(0, 3).map((f) => (
                            <div key={f.id} className="rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3">
                                <div className="text-xl font-bold text-white">
                                    {f.total.toLocaleString("en-US", { maximumFractionDigits: 0 })} PJ
                                </div>
                                <div className="mt-0.5 text-xs text-white/50">{f.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">

                {/* ── Fuel group mix ────────────────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                    <h2 className="text-base font-semibold text-slate-900 mb-1">Fuel Mix</h2>
                    <p className="text-xs text-slate-500 mb-5">
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
                </div>

                {/* ── CO₂ emissions estimate ───────────────────────────────── */}
                {co2.totalMtCO2 > 0 && (
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                        <div className="flex items-start justify-between gap-4 mb-1">
                            <h2 className="text-base font-semibold text-slate-900">CO₂ Emissions Estimate</h2>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 tabular-nums">
                                {co2.totalMtCO2.toFixed(2)} Mt CO₂
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-5">
                            Estimated direct CO₂ from combustion — IPCC 2006 emission factors · Biomass counted as carbon-neutral
                        </p>
                        <div className="space-y-3.5">
                            {co2Groups.map((g) => (
                                <div key={g.key}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-slate-700">{g.label}</span>
                                        <span className="font-medium text-slate-900 tabular-nums">
                                            {co2.byGroup[g.key].toFixed(2)} Mt CO₂
                                            <span className="text-slate-400 font-normal ml-1.5">({co2Pct(co2.byGroup[g.key])}%)</span>
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full rounded-full bg-slate-100">
                                        <div className={`h-2.5 rounded-full ${g.color}`} style={{ width: `${co2Pct(co2.byGroup[g.key])}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-[11px] text-slate-400">
                            Electricity CO₂ uses SA grid average (0.9 kg CO₂/kWh · NEB 2024 ~81% coal). Figures are indicative estimates, not official inventory values.
                        </p>
                    </div>
                )}

                {/* ── Subsector breakdown ───────────────────────────────────── */}
                {subsectors.length > 1 && (
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-slate-900 mb-1">
                            {subsectors.length > 3 ? "Subsector Breakdown" : "End-Use Breakdown"}
                        </h2>
                        <p className="text-xs text-slate-500 mb-5">
                            Share of total {cfg.label.toLowerCase()} consumption by sub-category
                        </p>
                        <div className="space-y-3.5">
                            {subsectors
                                .map((row) => ({ row, total: rowTotal(row, commodities) }))
                                .sort((a, b) => b.total - a.total)
                                .map(({ row, total }) => (
                                    <div key={row.id}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-slate-700">{row.label}</span>
                                            <span className="font-medium text-slate-900 tabular-nums">
                                                {total.toFixed(1)} PJ
                                                <span className="text-slate-400 font-normal ml-1.5">({pct(total)}%)</span>
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-slate-100">
                                            <div
                                                className="h-2.5 rounded-full bg-slate-400"
                                                style={{ width: `${pct(total)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* ── Full data table ───────────────────────────────────────── */}
                <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="font-semibold text-slate-900">Full Breakdown</h2>
                            <p className="text-xs text-slate-400 mt-0.5">All values in PJ · Absolute values shown</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const headers = ["Row", "Total PJ", ...cfg.fuels.map((id) => COMMODITY_LABEL[id] ?? id)];
                                const rows = section.rows.map((row) => [
                                    row.label,
                                    row.values.total != null ? Math.abs(row.values.total).toFixed(2) : "",
                                    ...cfg.fuels.map((id) => { const v = row.values[id]; return v != null ? Math.abs(v).toFixed(2) : ""; }),
                                ]);
                                const csv  = [headers, ...rows].map((r) => r.map((c) => { const s = String(c ?? ""); return s.includes(",") ? `"${s}"` : s; }).join(",")).join("\n");
                                const blob = new Blob([csv], { type: "text/csv" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = `SA_NEB_2024_${sectionId}.csv`; a.click();
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
                                    total_pj: row.values.total != null ? Math.abs(row.values.total) : null,
                                    ...Object.fromEntries(cfg.fuels.map((id) => {
                                        const v = row.values[id];
                                        return [id, v != null ? Math.abs(v) : null];
                                    })),
                                }));
                                const json = JSON.stringify({ source: "SA NEB 2024", section: sectionId, unit: "PJ", rows: data }, null, 2);
                                const blob = new Blob([json], { type: "application/json" });
                                const url  = URL.createObjectURL(blob);
                                const a    = document.createElement("a");
                                a.href = url; a.download = `SA_NEB_2024_${sectionId}.json`; a.click();
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
                                    {cfg.fuels.map((id) => (
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
                                            {row.values.total != null
                                                ? Math.abs(row.values.total).toFixed(2)
                                                : "—"}
                                        </td>
                                        {cfg.fuels.map((id) => {
                                            const v = row.values[id];
                                            return (
                                                <td
                                                    key={id}
                                                    className={`px-3 py-2.5 text-right font-mono ${
                                                        v == null
                                                            ? row.isTotal ? "text-slate-600" : "text-slate-300"
                                                            : row.isTotal ? "text-emerald-400" : "text-slate-700"
                                                    }`}
                                                >
                                                    {v != null ? Math.abs(v).toFixed(2) : "—"}
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
                        <li>• All values in Petajoules (PJ). Absolute values shown — original sign convention: negative = consumption.</li>
                        <li>• Source: {meta.source} · {meta.date}.</li>
                        <li>• A dash (—) indicates zero, negligible, or not applicable for that fuel/row combination.</li>
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
