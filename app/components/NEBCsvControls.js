"use client";

import { useRef, useState } from "react";
import { useAuth } from "@/app/context/auth";
import { COMMODITY_ID_MAP } from "@/app/context/NEBData";
import { downloadSectionCsv, parseSectionCsv, diffSectionRows } from "@/app/lib/nebCsv";

function columnLabel(col) {
    return col === "total" ? "Total" : (COMMODITY_ID_MAP[col] ?? col);
}

function fmtCell(v) {
    return v === null || v === undefined ? "—" : v.toLocaleString("en-ZA", { maximumFractionDigits: 2 });
}

const BTN_CLASS = "inline-flex items-center gap-1.5 rounded-lg bg-white ring-1 ring-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors";

// Shared Export/Import CSV controls for a NEB section - replaces each
// page's own duplicated, display-narrowed CSV export with a full
// 23-commodity-column round trip. Import is reject-and-report (never
// silently reshapes a malformed file) and always previews a before/after
// diff before anything is written - it feeds the same saveSectionData path
// manual editing uses, gated by the same canEdit(pageKey), no new
// permission key.
export default function NEBCsvControls({ section, year, canEdit, saveSectionData }) {
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [errors, setErrors]   = useState(null);
    const [preview, setPreview] = useState(null); // { rows, changes }
    const [saving, setSaving]   = useState(false);
    const [saveError, setSaveError] = useState("");
    const [justImported, setJustImported] = useState(false);

    function handleExport() {
        downloadSectionCsv(section, year);
    }

    function handleImportClick() {
        setErrors(null);
        setJustImported(false);
        fileInputRef.current?.click();
    }

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        setErrors(null);
        setJustImported(false);
        const text = await file.text();
        const result = parseSectionCsv({ text, sectionId: section.id });
        if (!result.ok) {
            setErrors(result.errors);
            return;
        }
        const changes = diffSectionRows(section.rows, result.rows);
        setPreview({ rows: result.rows, changes });
    }

    async function handleConfirm() {
        if (!preview) return;
        setSaving(true);
        setSaveError("");
        try {
            await saveSectionData({
                year, sectionId: section.id, rows: preview.rows, userEmail: user?.email,
                historyLabel: `NEB ${year} — CSV import (${section.id})`,
            });
            setPreview(null);
            setJustImported(true);
        } catch {
            setSaveError("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <button onClick={handleExport} className={BTN_CLASS}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export CSV
            </button>

            {canEdit && (
                <>
                    <button onClick={handleImportClick} className={BTN_CLASS}>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3m0 0L7.5 7.5M12 3l4.5 4.5M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5" />
                        </svg>
                        Import CSV
                    </button>
                    <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileChange} />
                    {justImported && <span className="text-xs font-medium text-emerald-600">Imported</span>}
                </>
            )}

            {errors && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-20 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <p className="font-semibold text-slate-900">Import rejected</p>
                            <button onClick={() => setErrors(null)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-slate-500 mb-3">
                                The file doesn&apos;t match this section&apos;s expected format. Nothing was changed.
                            </p>
                            <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                                {errors.map((e, i) => (
                                    <li key={i} className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{e}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setErrors(null)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {preview && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-16 px-4 pb-10 overflow-y-auto">
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div>
                                <p className="font-semibold text-slate-900">Review import — {section.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {preview.changes.length === 0
                                        ? "No cells differ from what's currently saved."
                                        : `${preview.changes.length} cell${preview.changes.length === 1 ? "" : "s"} will change.`}
                                </p>
                            </div>
                            <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                        </div>

                        {preview.changes.length > 0 && (
                            <div className="max-h-96 overflow-y-auto">
                                <table className="min-w-full text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 sticky top-0">
                                            <th className="px-4 py-2 text-left font-semibold text-slate-600">Row</th>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-600">Column</th>
                                            <th className="px-3 py-2 text-right font-semibold text-slate-600">Before</th>
                                            <th className="px-3 py-2 text-right font-semibold text-slate-600">After</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {preview.changes.slice(0, 200).map((c, i) => (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-4 py-1.5 text-slate-700">{c.rowLabel}</td>
                                                <td className="px-3 py-1.5 text-slate-500">{columnLabel(c.column)}</td>
                                                <td className="px-3 py-1.5 text-right font-mono text-slate-400">{fmtCell(c.before)}</td>
                                                <td className="px-3 py-1.5 text-right font-mono font-semibold text-violet-700">{fmtCell(c.after)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {preview.changes.length > 200 && (
                                    <p className="px-4 py-2 text-xs text-slate-400">+{preview.changes.length - 200} more changes not shown</p>
                                )}
                            </div>
                        )}

                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            {saveError && <span className="text-xs text-red-600 mr-auto">{saveError}</span>}
                            <button
                                onClick={() => setPreview(null)}
                                disabled={saving}
                                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={saving}
                                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? "Saving…" : "Confirm & Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
