"use client";

import { useNEBData } from "@/app/context/NEBData";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";
import { useEditableSectionGrid } from "@/app/components/useEditableSectionGrid";
import EditableDataTable from "@/app/components/EditableDataTable";
import EditSaveControls from "@/app/components/EditSaveControls";
import NEBCsvControls from "@/app/components/NEBCsvControls";

function fmt(val) {
    if (val === null || val === undefined) return "—";
    const n = Number(val);
    if (isNaN(n)) return "—";
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function valueClass(val) {
    if (val === null || val === undefined) return "text-slate-300";
    const n = Number(val);
    if (n < 0) return "text-red-600 tabular-nums";
    if (n > 0) return "text-emerald-700 tabular-nums";
    return "text-slate-400 tabular-nums";
}

// One collapsible section card on the NEB overview page - its own component
// (rather than inline in a .map()) because each section needs its own
// useEditableSectionGrid hook instance, and hooks can't be called
// conditionally/in a loop at a parent's top level.
export default function NEBSectionCard({ section, collapsed, onToggle, visibleCommodities }) {
    const { activeYear, saveSectionData } = useNEBData();
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const canEditSection = canEdit(`neb.${section.id}`);
    const grid = useEditableSectionGrid({
        year: activeYear, sectionId: section.id, section,
        canEdit: canEditSection, userEmail: user?.email, saveSectionData,
    });

    return (
        <div className="rounded-2xl bg-white border border-[var(--color-hairline)] overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <button onClick={onToggle} className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-slate-900">{section.label}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
                    </div>
                    <svg
                        className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${collapsed ? "-rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
                <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {canEditSection && (
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
                    )}
                    {!grid.isEditing && (
                        <NEBCsvControls
                            section={section}
                            year={activeYear}
                            canEdit={canEditSection}
                            saveSectionData={saveSectionData}
                        />
                    )}
                </div>
            </div>

            {!collapsed && (
                <div className="overflow-x-auto border-t border-slate-100">
                    <EditableDataTable
                        rows={grid.isEditing ? grid.draftRows : section.rows}
                        commodities={visibleCommodities}
                        totalLabel="Total"
                        labelColWidth="min-w-50"
                        isEditing={grid.isEditing}
                        setCell={grid.setCell}
                        formatValue={(v) => fmt(v)}
                        cellClassName={(v, { isTotalRow, isTotalColumn }) => {
                            if (isTotalColumn) return isTotalRow ? (v < 0 ? "text-red-400" : "text-emerald-400") : valueClass(v);
                            if (isTotalRow) return v == null ? "text-slate-600" : (v < 0 ? "text-red-400" : "text-emerald-400");
                            return valueClass(v);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
