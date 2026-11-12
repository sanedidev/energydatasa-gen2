"use client";

// Shared table body for every NEB section grid (the overview page's 8
// collapsible tables, Primary Supply, Conversion, and all 5 sector pages).
// Read mode renders exactly what each page already rendered before this
// component existed - formatValue/cellClassName are render props specifically
// because each page's number formatting (commas or not, abs or signed) and
// coloring (red/green on sign vs. always-green totals vs. plain) genuinely
// differ, and unifying them would change what visitors already see.
//
// Edit mode only turns non-total cells in non-total rows into inputs - the
// Total column and any isTotal row stay read-only (today's totals are
// independently stored, not a client-computed sum, so editing them here
// would risk diverging from the source data's own convention).
export default function EditableDataTable({
    rows,
    commodities,
    totalLabel = "Total PJ",
    isEditing = false,
    setCell = () => {},
    formatValue,
    cellClassName,
    labelColWidth = "min-w-48",
}) {
    return (
        <table className="min-w-full text-xs border-separate border-spacing-0">
            <thead>
                <tr>
                    <th className={`sticky left-0 z-10 bg-white px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] border-b border-[var(--color-hairline)] ${labelColWidth}`}>
                        Row
                    </th>
                    <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] min-w-20 bg-[var(--color-cream-2)]/60 border-b border-[var(--color-hairline)]">
                        {totalLabel}
                    </th>
                    {commodities.map((c) => (
                        <th key={c.id} className="px-3 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-soft)]/70 min-w-24 whitespace-nowrap border-b border-[var(--color-hairline)]">
                            {c.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => {
                    const isTotalRow = !!row.isTotal;
                    return (
                        <tr key={row.id} className={isTotalRow ? "font-semibold" : "group hover:bg-[var(--color-cream-2)]/40 transition-colors"}>
                            <td
                                className={`sticky left-0 z-10 px-4 py-2.5 font-medium border-b ${
                                    isTotalRow
                                        ? "bg-[var(--color-cream-2)] text-[var(--color-ink)] border-t-2 border-t-[var(--color-accent)] border-b-[var(--color-hairline)]"
                                        : "bg-white group-hover:bg-[var(--color-cream-2)]/40 text-slate-800 border-b-[var(--color-hairline)] transition-colors"
                                }`}
                            >
                                {row.label}
                            </td>
                            <td
                                className={`px-3 py-2.5 text-right font-mono tabular-nums border-b ${
                                    isTotalRow
                                        ? "bg-[var(--color-cream-2)] border-t-2 border-t-[var(--color-accent)] border-b-[var(--color-hairline)]"
                                        : "bg-[var(--color-cream-2)]/30 border-b-[var(--color-hairline)]"
                                } ${cellClassName(row.values?.total, { isTotalRow, isTotalColumn: true })}`}
                            >
                                {formatValue(row.values?.total, { isTotalRow, isTotalColumn: true })}
                            </td>
                            {commodities.map((c) => {
                                const value = row.values?.[c.id];
                                const editableCell = isEditing && !isTotalRow;
                                return (
                                    <td
                                        key={c.id}
                                        className={`px-3 py-2.5 text-right font-mono tabular-nums border-b border-[var(--color-hairline)] ${editableCell ? "p-0" : ""} ${isTotalRow ? "border-t-2 border-t-[var(--color-accent)]" : ""} ${cellClassName(value, { isTotalRow, isTotalColumn: false })}`}
                                    >
                                        {editableCell ? (
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={value ?? ""}
                                                onChange={(e) => setCell(row.id, c.id, e.target.value)}
                                                className="w-full min-w-24 bg-transparent px-3 py-2.5 text-right font-mono text-slate-700 outline-none focus:bg-[var(--color-accent-soft)] rounded-sm"
                                            />
                                        ) : (
                                            formatValue(value, { isTotalRow, isTotalColumn: false })
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
