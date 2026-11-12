"use client";

import { useState, useEffect } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { upsertPageContent } from "@/app/lib/manageContent";
import { usePermissions } from "@/app/context/permissions";
import { usePageEditMode } from "@/app/context/pageEditMode";
import { useAuth } from "@/app/context/auth";


export default function EditablePageHeader({
    pageKey,
    defaultLabel,
    defaultTitle,
    defaultDesc,
}) {
    const { isAdmin, canEdit } = usePermissions();
    const canManage = isAdmin || canEdit(pageKey);
    const { editMode: pageEditMode } = usePageEditMode();
    const { user } = useAuth();

    const [record,        setRecord]        = useState(null);
    const [label,         setLabel]         = useState(defaultLabel);
    const [title,         setTitle]         = useState(defaultTitle);
    const [desc,          setDesc]          = useState(defaultDesc);
    // Derived, not stored: turning off the page-level edit toggle closes any
    // in-progress edit automatically, discarding unsaved changes - no reset
    // effect needed, unlike the old app's per-page useEffect-based version.
    const [editRequested, setEditRequested] = useState(false);
    const editing = editRequested && pageEditMode;
    const [draft,    setDraft]    = useState({ label: defaultLabel, title: defaultTitle, desc: defaultDesc });
    const [saving,   setSaving]   = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                // apiKey so anonymous visitors (not just signed-in editors) can view this.
                const res = await client.models.PageContent.pageContentBySlug({ slug: `header.${pageKey}` }, { authMode: "apiKey" });
                const item = res.data?.[0] ?? null;
                if (!cancelled && item?.content) {
                    const parsed = JSON.parse(item.content);
                    setRecord(item);
                    if (parsed.label !== undefined) setLabel(parsed.label);
                    if (parsed.title !== undefined) setTitle(parsed.title);
                    if (parsed.desc  !== undefined) setDesc(parsed.desc);
                }
            } catch {}
        }
        load();
        return () => { cancelled = true; };
    }, [pageKey]);

    function openEdit() {
        setDraft({ label, title, desc });
        setEditRequested(true);
    }

    function cancelEdit() {
        setEditRequested(false);
    }

    async function saveEdit() {
        setSaving(true);
        const content = JSON.stringify(draft);
        const headerSlug = `header.${pageKey}`;
        try {
            const saved = await upsertPageContent({
                slug: headerSlug,
                content,
                pageKeys: [pageKey],
                historyLabel: `${draft.title || pageKey} — Page Header`,
            });
            setRecord(saved ?? record);
            setLabel(draft.label);
            setTitle(draft.title);
            setDesc(draft.desc);
            setEditRequested(false);
        } finally {
            setSaving(false);
        }
    }

    if (editing) {
        return (
            <div className="rounded-none border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-5 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Editing page header</p>
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Label (e.g. Topic)</label>
                    <input
                        className="w-full rounded-none border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                        value={draft.label}
                        onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                        placeholder="Topic"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Title</label>
                    <input
                        className="w-full rounded-none border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="Page title"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Description</label>
                    <textarea
                        rows={3}
                        className="w-full rounded-none border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 resize-none"
                        value={draft.desc}
                        onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
                        placeholder="Short description…"
                    />
                </div>
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={saveEdit}
                        disabled={saving || !draft.title.trim()}
                        className="rounded-none bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="rounded-none border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {label && <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">{label}</p>}
            <h1 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
            {desc && <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-2xl">{desc}</p>}
            {canManage && pageEditMode && (
                <button
                    onClick={openEdit}
                    title="Edit page header"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-none border border-[var(--color-hairline)] px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)]/70 hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors"
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit header
                </button>
            )}
        </div>
    );
}
