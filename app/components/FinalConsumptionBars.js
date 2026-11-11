"use client";

import { useEffect, useMemo, useState } from "react";
import { FUEL_COLOR, FUEL_LABEL, FUEL_ORDER, ELECTRICITY_COLOR, ELECTRICITY_LABEL } from "@/app/lib/energyColors";
import { SECTOR_IDS, SECTOR_LABEL, sectorGroupBreakdown } from "@/app/lib/energyCommodities";

const SERIES_ORDER = [...FUEL_ORDER, "electricity"];
const SERIES_COLOR = { ...FUEL_COLOR, electricity: ELECTRICITY_COLOR };
const SERIES_LABEL = { ...FUEL_LABEL, electricity: ELECTRICITY_LABEL };

const TOOLTIP_STYLE = {
    position: "fixed",
    pointerEvents: "none",
    background: "#0f172a",
    color: "#f1f5f9",
    fontSize: 12,
    borderRadius: 10,
    padding: "8px 12px",
    boxShadow: "0 12px 32px -4px rgba(15,23,42,0.45)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    zIndex: 50,
    transform: "translate(-50%, calc(-100% - 10px))",
};

function fmt(n) {
    return Math.round(n).toLocaleString("en-ZA");
}

// Mixes a hex color toward white by `amt` (0-1) - used to give each solid
// series color a subtle same-hue gradient (a touch of glossy depth) without
// changing its identity: both gradient stops come from the one validated hue.
function tint(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const mix = (c) => Math.round(c + (255 - c) * amt);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

// Breaks each end-use sector's total into fuel-group + electricity segments,
// for a shared-axis stacked bar chart - the composition/comparison job that
// the old all-in-one Sankey was forcing into a flow diagram, producing the
// long crossing diagonals that made it unreadable. This is "compare several
// wholes on one shared axis", which the dataviz skill's form table maps
// straight to a stacked bar chart, not ribbons.
function buildRows(sections) {
    if (!sections?.length) return [];
    const byId = Object.fromEntries(sections.map((s) => [s.id, s]));

    const rows = SECTOR_IDS.map((sectorId) => {
        const tot = byId[sectorId]?.rows.find((r) => r.isTotal);
        if (!tot) return null;
        const breakdown = sectorGroupBreakdown(tot);
        const segments = SERIES_ORDER
            .map((key) => ({ key, value: breakdown[key] ?? 0 }))
            .filter((s) => s.value > 0.5);
        const total = segments.reduce((sum, s) => sum + s.value, 0);
        if (total <= 0.5) return null;
        return { sectorId, label: SECTOR_LABEL[sectorId], total, segments };
    }).filter(Boolean);

    return rows.sort((a, b) => b.total - a.total);
}

export default function FinalConsumptionBars({ sections }) {
    const rows = useMemo(() => buildRows(sections), [sections]);
    const [hover, setHover] = useState(null); // { sectorId, sectorLabel, seriesKey, value, x, y }
    const [hoveredRow, setHoveredRow] = useState(null);
    const [grown, setGrown] = useState(false);

    const maxTotal = useMemo(() => rows.reduce((m, r) => Math.max(m, r.total), 0) || 1, [rows]);

    const activeSeries = useMemo(() => {
        const present = new Set(rows.flatMap((r) => r.segments.map((s) => s.key)));
        return SERIES_ORDER.filter((key) => present.has(key));
    }, [rows]);

    // Grow the bars in from zero on first paint rather than rendering them
    // full-width immediately - the "animated, not static" feel the redesign
    // was asked for, without looping/distracting motion once settled.
    useEffect(() => {
        setGrown(false);
        const raf = requestAnimationFrame(() => setGrown(true));
        return () => cancelAnimationFrame(raf);
    }, [rows]);

    if (!rows.length) {
        return <div className="px-6 py-10 text-sm text-slate-400">No final consumption data available.</div>;
    }

    return (
        <div className="px-6 pb-6 pt-2">
            <div className="flex flex-col gap-1">
                {rows.map((row, rowIndex) => {
                    const pct = grown ? (row.total / maxTotal) * 100 : 0;
                    const isRowHovered = hoveredRow === row.sectorId;
                    return (
                        <div
                            key={row.sectorId}
                            onMouseEnter={() => setHoveredRow(row.sectorId)}
                            onMouseLeave={() => setHoveredRow((r) => (r === row.sectorId ? null : r))}
                            className="rounded-xl px-2 py-2.5 -mx-2 transition-colors duration-150"
                            style={{ background: isRowHovered ? "rgba(100,116,139,0.06)" : "transparent" }}
                        >
                            <div className="mb-2 flex items-baseline justify-between">
                                <span className="text-sm font-semibold text-slate-700">{row.label}</span>
                                <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                                    {fmt(row.total)} <span className="text-xs font-normal text-slate-400">PJ</span>
                                </span>
                            </div>
                            <div className="h-6 w-full rounded-full bg-slate-100/80 shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]">
                                <div
                                    className="flex h-6"
                                    style={{
                                        width: `${pct}%`,
                                        gap: 2,
                                        minWidth: pct > 0 ? 2 : 0,
                                        transition: "width 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                                        transitionDelay: `${rowIndex * 70}ms`,
                                    }}
                                >
                                    {row.segments.map((seg, i) => {
                                        const isFirst = i === 0;
                                        const isLast  = i === row.segments.length - 1;
                                        const isHovered = hover?.sectorId === row.sectorId && hover?.seriesKey === seg.key;
                                        return (
                                            <div
                                                key={seg.key}
                                                onMouseMove={(e) => setHover({
                                                    sectorId: row.sectorId, sectorLabel: row.label,
                                                    seriesKey: seg.key, value: seg.value,
                                                    x: e.clientX, y: e.clientY,
                                                })}
                                                onMouseLeave={() => setHover((h) => (h?.sectorId === row.sectorId && h?.seriesKey === seg.key ? null : h))}
                                                tabIndex={0}
                                                role="img"
                                                aria-label={`${row.label} — ${SERIES_LABEL[seg.key]}: ${fmt(seg.value)} petajoules`}
                                                style={{
                                                    flexGrow: seg.value,
                                                    flexBasis: 0,
                                                    minWidth: 3,
                                                    background: `linear-gradient(180deg, ${tint(SERIES_COLOR[seg.key], 0.22)}, ${SERIES_COLOR[seg.key]})`,
                                                    borderTopLeftRadius: isFirst ? 999 : 0,
                                                    borderBottomLeftRadius: isFirst ? 999 : 0,
                                                    borderTopRightRadius: isLast ? 999 : 0,
                                                    borderBottomRightRadius: isLast ? 999 : 0,
                                                    transform: isHovered ? "scaleY(1.12)" : "scaleY(1)",
                                                    filter: isHovered ? "brightness(1.1)" : "none",
                                                    boxShadow: isHovered ? "0 2px 8px rgba(15,23,42,0.22)" : "none",
                                                    cursor: "pointer",
                                                    transition: "transform 140ms ease, filter 140ms ease, box-shadow 140ms ease",
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {activeSeries.map((key) => (
                    <div
                        key={key}
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ background: `${SERIES_COLOR[key]}14` }}
                    >
                        <span
                            className="inline-block h-2 w-2 shrink-0 rounded-full"
                            style={{ background: SERIES_COLOR[key] }}
                        />
                        <span className="text-xs font-medium text-slate-600">{SERIES_LABEL[key]}</span>
                    </div>
                ))}
            </div>

            {hover && (
                <div style={{ ...TOOLTIP_STYLE, left: hover.x, top: hover.y }}>
                    <span style={{ fontWeight: 600 }}>{hover.sectorLabel} — {SERIES_LABEL[hover.seriesKey]}</span>
                    <span style={{ color: "#94a3b8" }}>{fmt(hover.value)} PJ</span>
                </div>
            )}
        </div>
    );
}
