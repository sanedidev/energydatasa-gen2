"use client";

// Shared Edit / Save+Cancel toolbar for a NEB section table - slots into
// each page's existing header actions row next to its CSV/JSON buttons.
export default function EditSaveControls({ canEdit, isEditing, saving, error, draftRestored, onStartEdit, onSave, onCancel }) {
    if (!canEdit) return null;

    if (!isEditing) {
        return (
            <button
                onClick={onStartEdit}
                className="inline-flex items-center gap-1.5 rounded-none bg-white border border-[var(--color-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] transition-colors"
            >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                </svg>
                Edit
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            {draftRestored && <span className="text-[11px] text-amber-600">Unsaved draft restored</span>}
            {error && <span className="text-[11px] text-red-600">{error}</span>}
            <button
                onClick={onCancel}
                disabled={saving}
                className="rounded-none px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] disabled:opacity-50 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-none bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
            >
                {saving ? "Saving…" : "Save"}
            </button>
        </div>
    );
}
