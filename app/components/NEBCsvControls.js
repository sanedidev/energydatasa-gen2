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

const BTN_CLASS = "inline-flex items-center gap-1.5 rounded-none bg-white border border-[var(--color-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] transition-colors";

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
                    <div className="w-full max-w-lg rounded-none bg-white border border-[var(--color-hairline)]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-hairline)]">
                            <p className="font-semibold text-[var(--color-ink)]">Import rejected</p>
                            <button onClick={() => setErrors(null)} className="text-[var(--color-ink-soft)]/60 hover:text-[var(--color-ink)] text-lg leading-none">✕</button>
                        </div>
                        <div className="p-6">
                            <p className="text-xs text-[var(--color-ink-soft)] mb-3">
                                The file doesn&apos;t match this section&apos;s expected format. Nothing was changed.
                            </p>
                            <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                                {errors.map((e, i) => (
                                    <li key={i} className="text-xs text-red-600 bg-red-50 rounded-none px-3 py-2">{e}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="px-6 py-4 border-t border-[var(--color-hairline)] flex justify-end">
                            <button
                                onClick={() => setErrors(null)}
                                className="rounded-none bg-[var(--color-ink)] px-4 py-2 text-xs font-medium text-[var(--color-cream)] hover:bg-[var(--color-ink-soft)] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {preview && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-16 px-4 pb-10 overflow-y-auto">
                    <div className="w-full max-w-2xl rounded-none bg-white border border-[var(--color-hairline)]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-hairline)]">
                            <div>
                                <p className="font-semibold text-[var(--color-ink)]">Review import — {section.label}</p>
                                <p className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                                    {preview.changes.length === 0
                                        ? "No cells differ from what's currently saved."
                                        : `${preview.changes.length} cell${preview.changes.length === 1 ? "" : "s"} will change.`}
                                </p>
                            </div>
                            <button onClick={() => setPreview(null)} className="text-[var(--color-ink-soft)]/60 hover:text-[var(--color-ink)] text-lg leading-none">✕</button>
                        </div>

                        {preview.changes.length > 0 && (
                            <div className="max-h-96 overflow-y-auto">
                                <table className="min-w-full text-xs">
                                    <thead>
                                        <tr className="bg-[var(--color-cream-2)] border-b border-[var(--color-hairline)] sticky top-0">
                                            <th className="px-4 py-2 text-left font-semibold text-[var(--color-ink-soft)]">Row</th>
                                            <th className="px-3 py-2 text-left font-semibold text-[var(--color-ink-soft)]">Column</th>
                                            <th className="px-3 py-2 text-right font-semibold text-[var(--color-ink-soft)]">Before</th>
                                            <th className="px-3 py-2 text-right font-semibold text-[var(--color-ink-soft)]">After</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--color-hairline)]">
                                        {preview.changes.slice(0, 200).map((c, i) => (
                                            <tr key={i} className="hover:bg-[var(--color-cream-2)]">
                                                <td className="px-4 py-1.5 text-[var(--color-ink-soft)]">{c.rowLabel}</td>
                                                <td className="px-3 py-1.5 text-[var(--color-ink-soft)]/70">{columnLabel(c.column)}</td>
                                                <td className="px-3 py-1.5 text-right font-mono text-[var(--color-ink-soft)]/70">{fmtCell(c.before)}</td>
                                                <td className="px-3 py-1.5 text-right font-mono font-semibold text-[var(--color-accent)]">{fmtCell(c.after)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {preview.changes.length > 200 && (
                                    <p className="px-4 py-2 text-xs text-[var(--color-ink-soft)]/70">+{preview.changes.length - 200} more changes not shown</p>
                                )}
                            </div>
                        )}

                        <div className="px-6 py-4 border-t border-[var(--color-hairline)] flex items-center justify-end gap-3">
                            {saveError && <span className="text-xs text-red-600 mr-auto">{saveError}</span>}
                            <button
                                onClick={() => setPreview(null)}
                                disabled={saving}
                                className="rounded-none px-4 py-2 text-xs font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] disabled:opacity-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={saving}
                                className="rounded-none bg-[var(--color-accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
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
