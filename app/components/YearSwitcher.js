"use client";

import { useState } from "react";
import { useNEBData, DEFAULT_YEAR } from "@/app/context/NEBData";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

function PencilIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
        </svg>
    );
}

function TrashIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );
}

// Embedded directly inside each NEB page's own hero (per the owner's
// request - it used to be a standalone sticky bar floating above every
// hero, disconnected from the content it controls). `dark` matches it to
// a `variant="dark"` HeroSection; the methodology page has no hero, so it
// renders YearSwitcher in its default light treatment instead.
export default function YearSwitcher({ dark = false }) {
    const { availableYears: rawAvailableYears, activeYear, setActiveYear, loadingYears, createYear, renameYear, deleteYear } = useNEBData();
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const canCreate = canEdit("neb.years.create");

    // Always sort smallest-to-largest at render time, independent of
    // whatever order the context/API returned - a newly-created or
    // renamed year must never land out of numeric order regardless of
    // how/when it was added.
    const availableYears = [...rawAvailableYears].sort((a, b) => Number(a.year) - Number(b.year));

    const [creating, setCreating] = useState(false);
    const [yearInput, setYearInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const [renamingYear, setRenamingYear] = useState(null);
    const [renameInput,  setRenameInput]  = useState("");
    const [renameBusy,   setRenameBusy]   = useState(false);
    const [renameError,  setRenameError]  = useState("");

    const [deleteTarget, setDeleteTarget] = useState(null); // year string
    const [deleteBusy,   setDeleteBusy]   = useState(false);
    const [deleteError,  setDeleteError]  = useState("");

    async function handleCreate() {
        const year = yearInput.trim();
        if (!/^(19|20)\d{2}$/.test(year)) {
            setError("Enter a 4-digit year (e.g. 2025).");
            return;
        }
        setBusy(true);
        setError("");
        try {
            await createYear({ year, userEmail: user?.email });
            setActiveYear(year);
            setCreating(false);
            setYearInput("");
        } catch (err) {
            setError(err?.message ?? "Failed to create year.");
        } finally {
            setBusy(false);
        }
    }

    function startRename(year) {
        setRenamingYear(year);
        setRenameInput(year);
        setRenameError("");
    }

    async function handleRename() {
        const to = renameInput.trim();
        if (!/^(19|20)\d{2}$/.test(to)) {
            setRenameError("Enter a 4-digit year.");
            return;
        }
        if (to === renamingYear) {
            setRenamingYear(null);
            return;
        }
        if (!window.confirm(`Move all of ${renamingYear}'s data to ${to}? ${renamingYear} will no longer exist afterward.`)) return;
        setRenameBusy(true);
        setRenameError("");
        try {
            await renameYear({ fromYear: renamingYear, toYear: to, userEmail: user?.email });
            setRenamingYear(null);
        } catch (err) {
            setRenameError(err?.message ?? "Failed to rename year.");
        } finally {
            setRenameBusy(false);
        }
    }

    async function handleDelete() {
        setDeleteBusy(true);
        setDeleteError("");
        try {
            await deleteYear(deleteTarget);
            setDeleteTarget(null);
        } catch (err) {
            setDeleteError(err?.message ?? "Failed to delete year.");
            setDeleteBusy(false);
        }
    }

    if (loadingYears) return null;

    const mutedText   = dark ? "text-[var(--color-cream)]/40" : "text-[var(--color-ink-soft)]/70";
    const activePill  = dark ? "bg-[var(--color-cream)] text-[var(--color-ink)]" : "bg-[var(--color-ink)] text-[var(--color-cream)]";
    const idlePill     = dark
        ? "border border-[var(--color-cream)]/20 text-[var(--color-cream)]/70 hover:bg-white/5"
        : "bg-white text-[var(--color-ink-soft)] border border-[var(--color-hairline)] hover:bg-[var(--color-cream-2)]";
    const iconBtn      = dark
        ? "text-[var(--color-cream)]/40 hover:text-[var(--color-accent)]"
        : "text-[var(--color-ink-soft)]/50 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]";
    const newYearBtn   = dark
        ? "text-[var(--color-accent)] border border-dashed border-[var(--color-accent)]/60 hover:bg-white/5"
        : "text-[var(--color-accent)] border border-dashed border-[var(--color-accent)]/40 hover:bg-[var(--color-accent-soft)]";
    const cancelText   = dark ? "text-[var(--color-cream)]/50 hover:text-[var(--color-cream)]" : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]";

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium ${mutedText}`}>Year</span>
            {availableYears.map((y) =>
                renamingYear === y.year ? (
                    <div key={y.year} className="flex items-center gap-1.5">
                        <input
                            autoFocus
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRename();
                                if (e.key === "Escape") { setRenamingYear(null); setRenameError(""); }
                            }}
                            className="w-16 rounded-none border border-[var(--color-hairline)] bg-white px-2 py-1 text-xs text-[var(--color-ink)]"
                        />
                        <button
                            onClick={handleRename}
                            disabled={renameBusy}
                            className="rounded-none bg-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
                        >
                            {renameBusy ? "Saving…" : "Save"}
                        </button>
                        <button onClick={() => { setRenamingYear(null); setRenameError(""); }} className={`text-xs ${cancelText}`}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div key={y.year} className="flex items-center gap-0.5">
                        <button
                            onClick={() => setActiveYear(y.year)}
                            className={`rounded-none px-3 py-1 text-xs font-medium transition-colors ${activeYear === y.year ? activePill : idlePill}`}
                        >
                            {y.year}
                        </button>
                        {!y.isBuiltIn && canCreate && (
                            <>
                                <button
                                    onClick={() => startRename(y.year)}
                                    title={`Rename ${y.year}`}
                                    className={`rounded-none p-1 transition-colors ${iconBtn}`}
                                >
                                    <PencilIcon className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={() => { setDeleteTarget(y.year); setDeleteError(""); }}
                                    title={`Delete ${y.year}`}
                                    className={`rounded-none p-1 transition-colors ${iconBtn}`}
                                >
                                    <TrashIcon className="h-3 w-3" />
                                </button>
                            </>
                        )}
                    </div>
                )
            )}

            {canCreate && !creating && (
                <button
                    onClick={() => setCreating(true)}
                    className={`rounded-none px-3 py-1 text-xs font-medium transition-colors ${newYearBtn}`}
                >
                    + New year
                </button>
            )}

            {creating && (
                <div className="flex items-center gap-1.5">
                    <input
                        autoFocus
                        value={yearInput}
                        onChange={(e) => setYearInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreate();
                            if (e.key === "Escape") { setCreating(false); setError(""); }
                        }}
                        placeholder="2025"
                        className="w-16 rounded-none border border-[var(--color-hairline)] bg-white px-2 py-1 text-xs text-[var(--color-ink)]"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={busy}
                        className="rounded-none bg-[var(--color-accent)] px-2.5 py-1 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
                    >
                        {busy ? "Creating…" : "Create"}
                    </button>
                    <button onClick={() => { setCreating(false); setError(""); }} className={`text-xs ${cancelText}`}>
                        Cancel
                    </button>
                </div>
            )}

            {error       && <span className="text-xs text-red-400">{error}</span>}
            {renameError && <span className="text-xs text-red-400">{renameError}</span>}

            {activeYear !== DEFAULT_YEAR && (
                <span className="inline-flex items-center gap-1.5 rounded-none bg-amber-400/15 px-2.5 py-1 text-[11px] font-medium text-amber-600">
                    Viewing {activeYear} — not the default year
                </span>
            )}

            {deleteTarget && (
                <ConfirmDialog
                    title={`Delete ${deleteTarget}?`}
                    message={`This permanently removes every section and the source/date details saved for ${deleteTarget}. This can't be undone.`}
                    confirmLabel={deleteBusy ? "Deleting…" : "Delete year"}
                    onConfirm={handleDelete}
                    onCancel={() => { if (!deleteBusy) setDeleteTarget(null); }}
                />
            )}
            {deleteError && <span className="text-xs text-red-400">{deleteError}</span>}
        </div>
    );
}
