"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/auth";

function PencilIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
        </svg>
    );
}

// SourceLine, plus an inline edit affordance for whoever holds `canEdit` -
// the source/date are real context for the data (where it came from, how
// current it is), specific to the active year, and previously had no way
// to be corrected short of a developer editing the seed JSON directly.
// Saves through the same saveMeta() path the Sankey title edit already
// uses, so it's one more field on the same per-year meta record, not a
// new storage mechanism.
export default function EditableSourceLine({ source, date, dark = false, canEdit, onSave, className = "" }) {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [sourceDraft, setSourceDraft] = useState(source ?? "");
    const [dateDraft,   setDateDraft]   = useState(date ?? "");
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState("");

    function startEdit() {
        setSourceDraft(source ?? "");
        setDateDraft(date ?? "");
        setError("");
        setEditing(true);
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        try {
            await onSave({ source: sourceDraft.trim(), date: dateDraft.trim(), userEmail: user?.email });
            setEditing(false);
        } catch (err) {
            setError(err?.message ?? "Failed to save.");
        } finally {
            setSaving(false);
        }
    }

    const mutedText = dark ? "text-[var(--color-cream)]/40" : "text-[var(--color-ink-soft)]";
    const labelText = dark ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink-soft)]";
    const iconClass = dark
        ? "text-[var(--color-cream)]/40 hover:text-[var(--color-accent)]"
        : "text-[var(--color-ink-soft)]/50 hover:text-[var(--color-accent)]";

    if (editing) {
        return (
            <div className={`text-xs ${className}`}>
                <div className="flex flex-wrap items-center gap-2">
                    <span className={labelText}>Source:</span>
                    <input
                        autoFocus
                        value={sourceDraft}
                        onChange={(e) => setSourceDraft(e.target.value)}
                        placeholder="e.g. Energy Systems Research Group, University of Cape Town"
                        className="w-64 max-w-full rounded-none border border-[var(--color-hairline)] bg-white px-2 py-1 text-xs text-[var(--color-ink)]"
                    />
                    <input
                        value={dateDraft}
                        onChange={(e) => setDateDraft(e.target.value)}
                        placeholder="e.g. 23 March 2026"
                        className="w-36 rounded-none border border-[var(--color-hairline)] bg-white px-2 py-1 text-xs text-[var(--color-ink)]"
                    />
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-none bg-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className={dark ? "text-[var(--color-cream)]/50 hover:text-[var(--color-cream)]" : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"}
                    >
                        Cancel
                    </button>
                </div>
                {error && <p className="mt-1 text-red-400">{error}</p>}
            </div>
        );
    }

    const parts = [source, date].filter(Boolean);

    return (
        <div className={`group flex items-center gap-1.5 ${className}`}>
            <p className={`text-xs ${mutedText}`}>
                {parts.length ? `Source: ${parts.join(" · ")}` : "Source not set."}
            </p>
            {canEdit && (
                <button
                    onClick={startEdit}
                    title="Edit source & date"
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ${iconClass}`}
                >
                    <PencilIcon className="h-3 w-3" />
                </button>
            )}
        </div>
    );
}
