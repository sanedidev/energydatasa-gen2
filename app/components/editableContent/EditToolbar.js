"use client";

import { isImageBlock } from "./blockHelpers";

export default function EditToolbar({
    saving, error, draftRestored,
    pickerRef, showBlockPicker, setShowBlockPicker,
    handleSave, handleCancel,
    addBlock, addTitleBlock, addSectionBlock,
    openAddImage, openChangeImage,
    blocks,
}) {
    return (
        <>
            <p className="mt-2 text-[11px] text-slate-400">
                Supports <strong>**bold**</strong>, <em>*italic*</em>, <code className="rounded bg-slate-100 px-1"># H1</code> / <code className="rounded bg-slate-100 px-1">## H2</code> / <code className="rounded bg-slate-100 px-1">### H3</code>, and <code className="rounded bg-slate-100 px-1">- bullet</code> / <code className="rounded bg-slate-100 px-1">1. numbered</code> lists.
            </p>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-800 disabled:opacity-60"
                >
                    {saving ? "Saving…" : "Save"}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50"
                >
                    Cancel
                </button>
                {draftRestored && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unsaved draft restored
                    </span>
                )}

                <div className="ml-auto relative" ref={pickerRef}>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={showBlockPicker}
                        onClick={() => setShowBlockPicker((v) => !v)}
                        disabled={saving}
                        className={`inline-flex items-center gap-1.5 rounded-xl border border-dashed px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                            showBlockPicker
                                ? "border-green-400 bg-green-50 text-green-700"
                                : "border-slate-300 bg-white text-slate-500 hover:border-green-400 hover:text-green-700"
                        }`}
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add block
                        <svg className={`h-3 w-3 transition-transform ${showBlockPicker ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showBlockPicker && (
                        <div role="menu" aria-label="Add block" className="absolute bottom-full right-0 mb-2 z-20 w-52 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-100 overflow-hidden">
                            <button
                                role="menuitem"
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); addBlock(); setShowBlockPicker(false); }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                                <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
                                Add text block
                            </button>
                            <button
                                role="menuitem"
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); addTitleBlock(); setShowBlockPicker(false); }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                            >
                                <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                                Add title block
                            </button>
                            <button
                                role="menuitem"
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); addSectionBlock(); setShowBlockPicker(false); }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                            >
                                <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                Add section block
                            </button>
                            <button
                                role="menuitem"
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const firstImgIdx = blocks.findIndex(isImageBlock);
                                    if (firstImgIdx !== -1) { openChangeImage(firstImgIdx); }
                                    else                    { openAddImage(); }
                                    setShowBlockPicker(false);
                                }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                            >
                                <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" /></svg>
                                {blocks.some(isImageBlock) ? "Change image" : "Add image"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
