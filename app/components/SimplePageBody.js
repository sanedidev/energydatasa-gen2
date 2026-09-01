"use client";

import { useEffect, useState } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";
import { logEdit } from "@/app/lib/editHistory";

// Temporary stand-in for the full EditableSections block editor (that's a
// separate, deliberately deferred phase - drag/drop, multiple named
// sections, image blocks). This proves the same PageContent + permissions
// chain with a single editable field per page.
export default function SimplePageBody({ pageKey, placeholder = "Add content for this page." }) {
    const { canEdit, isAdmin } = usePermissions();
    const { user } = useAuth();
    const canManage = isAdmin || canEdit(pageKey);

    const [record, setRecord] = useState(null);
    const [content, setContent] = useState("");
    const [draft, setDraft] = useState("");
    const [editing, setEditing] = useState(false);
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
        setEditing(true);
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
            setEditing(false);
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

    if (loading) {
        return <div className="h-32 rounded-2xl bg-slate-50 animate-pulse" />;
    }

    if (editing) {
        return (
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
                        onClick={() => setEditing(false)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
            {content ? (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{content}</p>
            ) : (
                <p className="text-sm text-slate-400 italic">{placeholder}</p>
            )}
            {canManage && (
                <button
                    onClick={openEdit}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                    Edit content
                </button>
            )}
        </div>
    );
}
