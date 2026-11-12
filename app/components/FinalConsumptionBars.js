"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FUEL_COLOR, FUEL_LABEL, FUEL_ORDER, ELECTRICITY_COLOR, ELECTRICITY_LABEL } from "@/app/lib/energyColors";
import { SECTOR_IDS, SECTOR_LABEL, sectorGroupBreakdown } from "@/app/lib/energyCommodities";

const SERIES_ORDER = [...FUEL_ORDER, "electricity"];
const SERIES_COLOR = { ...FUEL_COLOR, electricity: ELECTRICITY_COLOR };
const SERIES_LABEL = { ...FUEL_LABEL, electricity: ELECTRICITY_LABEL };

const TOOLTIP_STYLE = {
    position: "fixed",
    pointerEvents: "none",
    background: "var(--color-ink)",
    color: "var(--color-cream)",
    fontSize: 12,
    borderRadius: 0,
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    zIndex: 50,
    transform: "translate(-50%, calc(-100% - 10px))",
};

function fmt(n) {
    return Math.round(n).toLocaleString("en-ZA");
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

export default function FinalConsumptionBars({ sections, activeYear }) {
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
        return <div className="px-6 py-10 text-sm text-[var(--color-ink-soft)]">No final consumption data available.</div>;
    }

    return (
        <div className="px-6 pb-6 pt-2">
            {/* Asymmetric focus: the largest sector carries real visual weight (a
                taller bar, a serif label) and every row after it recedes - rank
                read at a glance, not just from the numbers. */}
            <div className="flex flex-col">
                {rows.map((row, rowIndex) => {
                    const pct = grown ? (row.total / maxTotal) * 100 : 0;
                    const isRowHovered = hoveredRow === row.sectorId;
                    const isFocus = rowIndex === 0;
                    const barHeight = isFocus ? 14 : 7;
                    return (
                        <Link
                            key={row.sectorId}
                            href={`/dashboard/energy-balance/${row.sectorId}${activeYear ? `?year=${activeYear}` : ""}`}
                            onMouseEnter={() => setHoveredRow(row.sectorId)}
                            onMouseLeave={() => setHoveredRow((r) => (r === row.sectorId ? null : r))}
                            className="group block px-2 -mx-2 transition-colors duration-150 border-b border-[var(--color-hairline)] last:border-b-0"
                            style={{
                                background: isRowHovered ? "var(--color-cream-2)" : "transparent",
                                paddingTop: isFocus ? 16 : 10,
                                paddingBottom: isFocus ? 16 : 10,
                            }}
                        >
                            <div className="mb-2 flex items-baseline justify-between gap-3">
                                <span
                                    className={
                                        isFocus
                                            ? "text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors [font-family:var(--font-display)]"
                                            : "text-sm text-[var(--color-ink-soft)] group-hover:text-[var(--color-accent)] transition-colors"
                                    }
                                >
                                    {row.label}
                                </span>
                                <span className="flex items-center gap-2 shrink-0">
                                    <span className={isFocus ? "font-mono text-base font-semibold tabular-nums text-[var(--color-ink)]" : "font-mono text-sm tabular-nums text-[var(--color-ink-soft)]"}>
                                        {fmt(row.total)} <span className="text-xs font-normal text-[var(--color-ink-soft)]/70">PJ</span>
                                    </span>
                                    <svg
                                        className="h-3.5 w-3.5 text-[var(--color-accent)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </div>
                            <div className="w-full bg-[var(--color-cream-2)]" style={{ height: barHeight }}>
                                <div
                                    className="flex"
                                    style={{
                                        height: barHeight,
                                        width: `${pct}%`,
                                        gap: 3,
                                        minWidth: pct > 0 ? 2 : 0,
                                        transition: "width 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                                        transitionDelay: `${rowIndex * 70}ms`,
                                    }}
                                >
                                    {row.segments.map((seg, i) => {
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
                                                style={{
                                                    flexGrow: seg.value,
                                                    flexBasis: 0,
                                                    minWidth: 3,
                                                    background: SERIES_COLOR[seg.key],
                                                    borderTopRightRadius: isLast ? 2 : 0,
                                                    borderBottomRightRadius: isLast ? 2 : 0,
                                                    opacity: isHovered ? 1 : hover ? 0.55 : 1,
                                                    transform: isHovered ? "scaleY(1.2)" : "scaleY(1)",
                                                    cursor: "pointer",
                                                    transition: "transform 140ms ease, opacity 140ms ease",
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-hairline)] pt-4">
                {activeSeries.map((key) => (
                    <div key={key} className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-2 w-2 shrink-0"
                            style={{ background: SERIES_COLOR[key] }}
                        />
                        <span className="text-xs text-[var(--color-ink-soft)]">{SERIES_LABEL[key]}</span>
                    </div>
                ))}
            </div>

            {hover && (
                <div style={{ ...TOOLTIP_STYLE, left: hover.x, top: hover.y }}>
                    <span style={{ fontWeight: 600 }}>{hover.sectorLabel} — {SERIES_LABEL[hover.seriesKey]}</span>
                    <span style={{ color: "var(--color-cream)", opacity: 0.6 }}>{fmt(hover.value)} PJ</span>
                </div>
            )}
        </div>
    );
}
