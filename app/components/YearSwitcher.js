"use client";

import { useState } from "react";
import { useNEBData, DEFAULT_YEAR } from "@/app/context/NEBData";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";

function PencilIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
        </svg>
    );
}

export default function YearSwitcher() {
    const { availableYears, activeYear, setActiveYear, loadingYears, createYear, renameYear } = useNEBData();
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const canCreate = canEdit("neb.years.create");

    const [creating, setCreating] = useState(false);
    const [yearInput, setYearInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    const [renamingYear, setRenamingYear] = useState(null);
    const [renameInput,  setRenameInput]  = useState("");
    const [renameBusy,   setRenameBusy]   = useState(false);
    const [renameError,  setRenameError]  = useState("");

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

    if (loadingYears) return null;

    return (
        <div className="border-b border-[var(--color-hairline)] bg-[var(--color-cream-2)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-400">Year</span>
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
                                className="w-16 rounded-md border border-slate-300 px-2 py-1 text-xs"
                            />
                            <button
                                onClick={handleRename}
                                disabled={renameBusy}
                                className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                            >
                                {renameBusy ? "Saving…" : "Save"}
                            </button>
                            <button
                                onClick={() => { setRenamingYear(null); setRenameError(""); }}
                                className="text-xs text-slate-400 hover:text-slate-600"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div key={y.year} className="flex items-center gap-0.5">
                            <button
                                onClick={() => setActiveYear(y.year)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    activeYear === y.year
                                        ? "bg-[var(--color-ink)] text-white"
                                        : "bg-white text-slate-600 border border-[var(--color-hairline)] hover:bg-slate-100"
                                }`}
                            >
                                {y.year}
                            </button>
                            {!y.isBuiltIn && canCreate && (
                                <button
                                    onClick={() => startRename(y.year)}
                                    title={`Rename ${y.year}`}
                                    className="rounded-full p-1 text-slate-300 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                >
                                    <PencilIcon className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    )
                )}

                {canCreate && !creating && (
                    <button
                        onClick={() => setCreating(true)}
                        className="rounded-full px-3 py-1 text-xs font-medium text-violet-600 ring-1 ring-violet-200 ring-dashed hover:bg-violet-50 transition-colors"
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
                            className="w-16 rounded-md border border-slate-300 px-2 py-1 text-xs"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={busy}
                            className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                        >
                            {busy ? "Creating…" : "Create"}
                        </button>
                        <button
                            onClick={() => { setCreating(false); setError(""); }}
                            className="text-xs text-slate-400 hover:text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {error       && <span className="text-xs text-red-600">{error}</span>}
                {renameError && <span className="text-xs text-red-600">{renameError}</span>}

                {activeYear !== DEFAULT_YEAR && (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                        Viewing {activeYear} — not the default year
                    </span>
                )}
            </div>
        </div>
    );
}
