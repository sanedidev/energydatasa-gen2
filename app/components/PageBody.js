"use client";

import { usePermissions } from "@/app/context/permissions";
import { usePageEditMode } from "@/app/context/pageEditMode";
import { useAuth } from "@/app/context/auth";
import EditableContent from "./EditableContent";

// Replaces the Phase A placeholder SimplePageBody now that the real block
// editor exists. Owns the page-level "Edit page" toggle (same role
// EditableSections/usePageSections will take over in Phase B2, once
// multiple named sections per page are supported) - EditablePageHeader's
// own edit button is gated on that same shared pageEditMode context.
export default function PageBody({ pageKey, placeholder = "Add content for this page." }) {
    const { canEdit, isAdmin } = usePermissions();
    const { user } = useAuth();
    const { editMode: pageEditMode, setEditMode: setPageEditMode } = usePageEditMode();
    const canManage = isAdmin || canEdit(pageKey);

    return (
        <>
            {canManage && (
                <div className="mb-4">
                    <button
                        type="button"
                        onClick={() => setPageEditMode(!pageEditMode)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                            pageEditMode
                                ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                    >
                        {pageEditMode ? "Done editing" : "Edit page"}
                    </button>
                </div>
            )}

            <EditableContent
                slug={pageKey}
                placeholder={placeholder}
                canEdit={canManage && pageEditMode}
                userEmail={user?.email}
                sectionLabel={pageKey}
            />
        </>
    );
}
