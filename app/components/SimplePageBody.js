"use client";

import { useEffect, useState } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { usePermissions } from "@/app/context/permissions";
import { usePageEditMode } from "@/app/context/pageEditMode";
import { useAuth } from "@/app/context/auth";
import { logEdit } from "@/app/lib/editHistory";

// Temporary stand-in for the full EditableSections block editor (that's a
// separate, deliberately deferred phase - drag/drop, multiple named
// sections, image blocks). This proves the same PageContent + permissions
// chain with a single editable field per page.
//
// Owns the page-level "Edit page" toggle (drives the shared pageEditMode
// context, same as the real EditableSections/usePageSections will in Phase
// B) - EditablePageHeader's own edit button is gated on that same context,
// so this is what makes it appear at all.
export default function SimplePageBody({ pageKey, placeholder = "Add content for this page." }) {
    const { canEdit, isAdmin } = usePermissions();
    const { user } = useAuth();
    const { editMode: pageEditMode, setEditMode: setPageEditMode } = usePageEditMode();
    const canManage = isAdmin || canEdit(pageKey);

    const [record, setRecord] = useState(null);
    const [content, setContent] = useState("");
    const [draft, setDraft] = useState("");
    // Derived, not stored: turning off the page-level edit toggle closes any
    // in-progress edit automatically, discarding unsaved changes - no reset
    // effect needed, unlike the old app's per-page useEffect-based version.
    const [editRequested, setEditRequested] = useState(false);
    const editing = editRequested && pageEditMode;
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: pageKey });
                const item = res.data?.[0] ?? null;
                if (!cancelled) {
                    setRecord(item);
                    setContent(item?.content ?? "");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [pageKey]);

    function openEdit() {
        setDraft(content);
        setEditRequested(true);
    }

    async function saveEdit() {
        setSaving(true);
        const before = record?.content ?? null;
        try {
            if (record) {
                const res = await client.models.PageContent.update({ id: record.id, content: draft });
                setRecord(res.data);
            } else {
                const res = await client.models.PageContent.create({ slug: pageKey, content: draft });
                setRecord(res.data);
            }
            setContent(draft);
            setEditRequested(false);
            logEdit(client, {
                slug: pageKey,
                label: pageKey,
                email: user?.email,
                action: record ? "update" : "create",
                before,
                after: draft,
            });
        } finally {
            setSaving(false);
        }
    }

    const pageEditToggle = canManage && (
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
    );

    if (loading) {
        return <div className="h-32 rounded-2xl bg-slate-50 animate-pulse" />;
    }

    if (editing) {
        return (
            <>
                {pageEditToggle}
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 space-y-3">
                    <textarea
                        rows={8}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={placeholder}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={saveEdit}
                            disabled={saving}
                            className="rounded-xl bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800 disabled:opacity-40"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                        <button
                            onClick={() => setEditRequested(false)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {pageEditToggle}
            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                {content ? (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{content}</p>
                ) : (
                    <p className="text-sm text-slate-400 italic">{placeholder}</p>
                )}
                {canManage && pageEditMode && (
                    <button
                        onClick={openEdit}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                    >
                        Edit content
                    </button>
                )}
            </div>
        </>
    );
}
