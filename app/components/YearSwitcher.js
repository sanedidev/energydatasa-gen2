"use client";

import { useState } from "react";
import { useNEBData, DEFAULT_YEAR } from "@/app/context/NEBData";
import { usePermissions } from "@/app/context/permissions";
import { useAuth } from "@/app/context/auth";

export default function YearSwitcher() {
    const { availableYears, activeYear, setActiveYear, loadingYears, createYear } = useNEBData();
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const canCreate = canEdit("neb.years.create");

    const [creating, setCreating] = useState(false);
    const [yearInput, setYearInput] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

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

    if (loadingYears) return null;

    return (
        <div className="border-b border-slate-200 bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-400">Year</span>
                {availableYears.map((y) => (
                    <button
                        key={y.year}
                        onClick={() => setActiveYear(y.year)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            activeYear === y.year
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                        }`}
                    >
                        {y.year}
                    </button>
                ))}

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

                {error && <span className="text-xs text-red-600">{error}</span>}

                {activeYear !== DEFAULT_YEAR && (
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                        Viewing {activeYear} — not the default year
                    </span>
                )}
            </div>
        </div>
    );
}
