"use client";

import AnimatedNumber from "./AnimatedNumber";

// A stat tile whose small gauge bar is sized from real data (pct of the
// largest value among the tiles shown alongside it) and transitions
// smoothly whenever that data changes - e.g. switching years. Replaces
// the old ambient motion-pulse-dot, which pulsed the same way regardless
// of what the numbers actually were - this one represents the data instead
// of just decorating it.
export default function StatGaugeTile({
    value, label, format, pct,
    barClassName = "bg-[var(--color-accent)]",
    valueClassName = "text-[var(--color-cream)]",
    extra = null,
}) {
    const clampedPct = Math.max(0, Math.min(100, pct));
    return (
        <div className="flex items-center gap-3 rounded-none border border-[var(--color-cream)]/10 px-4 py-3">
            <div className="relative h-9 w-1.5 shrink-0 overflow-hidden bg-[var(--color-cream)]/10">
                <div
                    className={`absolute inset-x-0 bottom-0 transition-[height] duration-700 ease-out ${barClassName}`}
                    style={{ height: `${clampedPct}%` }}
                />
            </div>
            <div className="min-w-0">
                <div className={`text-xl font-bold tabular-nums ${valueClassName}`}>
                    <AnimatedNumber value={value} format={format} />{extra}
                </div>
                <div className="mt-0.5 text-xs text-[var(--color-cream)]/50">{label}</div>
            </div>
        </div>
    );
}
