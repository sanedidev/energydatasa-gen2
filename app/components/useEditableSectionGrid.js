"use client";

import { useEffect, useState } from "react";

function cloneRows(rows) {
    return (rows ?? []).map((r) => ({ ...r, values: { ...r.values } }));
}

// A cell holds a number (untouched, loaded from storage) or a string (typed
// this session, not yet coerced) while editing - coercion only happens at
// save time, so a user can type "-" or "12." without the input fighting
// them mid-keystroke. "Client-side validation only": anything that doesn't
// parse to a finite number becomes null, same as leaving it blank.
function normalizeNumber(v) {
    if (v === null || v === undefined) return null;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    const trimmed = String(v).trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
}

// Mirrors useEditableContent's shape (edit-mode toggle -> draft state ->
// explicit Save/Cancel -> beforeunload warning -> localStorage crash-
// recovery draft) for a NEB section's row grid instead of a block-editor's
// blocks. One save = one saveSectionData call for the whole section, never
// per-cell.
export function useEditableSectionGrid({ year, sectionId, section, pageKey, canEdit, userEmail, saveSectionData, historyLabel }) {
    const [editRequested, setEditRequested] = useState(false);
    const isEditing = editRequested && canEdit;

    const [draftRows, setDraftRows] = useState(() => cloneRows(section.rows));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [draftRestored, setDraftRestored] = useState(false);

    const draftKey = `draft:neb.${year}.${sectionId}`;

    // Keep the draft in sync with fresh section data (year switch, a save
    // elsewhere completing) whenever NOT actively editing - never clobber
    // in-progress edits out from under the user.
    useEffect(() => {
        if (!isEditing) setDraftRows(cloneRows(section?.rows));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section, isEditing]);

    useEffect(() => {
        if (!isEditing) return;
        function handleBeforeUnload(e) { e.preventDefault(); e.returnValue = ""; }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) return;
        const t = setTimeout(() => {
            try { localStorage.setItem(draftKey, JSON.stringify(draftRows)); } catch { /* quota */ }
        }, 500);
        return () => clearTimeout(t);
    }, [draftRows, isEditing, draftKey]);

    function handleStartEdit() {
        let restored = false;
        try {
            const saved = localStorage.getItem(draftKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === (section?.rows?.length ?? -1)) {
                    setDraftRows(parsed);
                    restored = true;
                }
            }
        } catch { /* ignore */ }
        if (!restored) setDraftRows(cloneRows(section?.rows));
        setDraftRestored(restored);
        setError("");
        setEditRequested(true);
    }

    function handleCancel() {
        setDraftRows(cloneRows(section?.rows));
        setEditRequested(false);
        setError("");
        setDraftRestored(false);
        try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
    }

    function setCell(rowId, commodityId, rawValue) {
        setDraftRows((prev) => prev.map((r) =>
            r.id === rowId ? { ...r, values: { ...r.values, [commodityId]: rawValue } } : r
        ));
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        const finalRows = draftRows.map((r) => ({
            ...r,
            values: Object.fromEntries(Object.entries(r.values).map(([k, v]) => [k, normalizeNumber(v)])),
        }));
        try {
            await saveSectionData({ year, sectionId, rows: finalRows, userEmail, historyLabel: historyLabel ?? `NEB ${year} — ${section?.label ?? sectionId}` });
            setDraftRows(finalRows);
            setEditRequested(false);
            setDraftRestored(false);
            try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
        } catch {
            setError("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return {
        isEditing, draftRows, saving, error, draftRestored,
        handleStartEdit, handleSave, handleCancel, setCell,
    };
}
