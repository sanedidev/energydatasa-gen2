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
        <table className="min-w-full text-xs">
            <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={`sticky left-0 z-10 bg-slate-50 px-4 py-2.5 text-left font-semibold text-slate-600 ${labelColWidth}`}>
                        Row
                    </th>
                    <th className="px-3 py-2.5 text-right font-semibold text-slate-600 min-w-20 border-r border-slate-200">
                        {totalLabel}
                    </th>
                    {commodities.map((c) => (
                        <th key={c.id} className="px-3 py-2.5 text-right font-medium text-slate-500 min-w-24 whitespace-nowrap">
                            {c.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {rows.map((row) => {
                    const isTotalRow = !!row.isTotal;
                    return (
                        <tr key={row.id} className={isTotalRow ? "bg-slate-900 font-semibold" : "hover:bg-slate-50 transition-colors"}>
                            <td className={`sticky left-0 z-10 px-4 py-2.5 font-medium ${isTotalRow ? "bg-slate-900 text-white" : "bg-white text-slate-800"}`}>
                                {row.label}
                            </td>
                            <td className={`px-3 py-2.5 text-right font-mono border-r border-slate-200 ${cellClassName(row.values?.total, { isTotalRow, isTotalColumn: true })}`}>
                                {formatValue(row.values?.total, { isTotalRow, isTotalColumn: true })}
                            </td>
                            {commodities.map((c) => {
                                const value = row.values?.[c.id];
                                const editableCell = isEditing && !isTotalRow;
                                return (
                                    <td
                                        key={c.id}
                                        className={`px-3 py-2.5 text-right font-mono ${editableCell ? "p-0" : ""} ${cellClassName(value, { isTotalRow, isTotalColumn: false })}`}
                                    >
                                        {editableCell ? (
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={value ?? ""}
                                                onChange={(e) => setCell(row.id, c.id, e.target.value)}
                                                className="w-full min-w-24 bg-transparent px-3 py-2.5 text-right font-mono text-slate-700 outline-none focus:bg-violet-50 rounded-sm"
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
