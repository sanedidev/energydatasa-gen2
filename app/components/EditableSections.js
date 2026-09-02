"use client";

import { Fragment } from "react";
import { usePageSections } from "./usePageSections";
import EditableContent from "./EditableContent";
import SectionCard from "./editableSections/SectionCard";
import SectionToolbar from "./editableSections/SectionToolbar";
import ConfirmDialog from "./ui/ConfirmDialog";

// ── Section drop zone (insert between sections) ───────────────────────────────
function SectionDropZone({ dragging, isActive, onDragOver, onDrop }) {
    return (
        <div
            onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
            onDrop={onDrop}
            className={`relative flex items-center transition-all duration-150 ${
                isActive ? "h-12 my-0.5" : dragging ? "h-5" : "h-4"
            }`}
        >
            {isActive && (
                <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-1">
                    <div className="h-0.5 flex-1 rounded-full bg-green-500" />
                    <span className="shrink-0 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white leading-tight">
                        Insert here
                    </span>
                    <div className="h-0.5 flex-1 rounded-full bg-green-500" />
                </div>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
// pageKey  — unique prefix, e.g. "ec.station.arnot"
// defaultSections — [{id, label}] shown until user customises
// placeholders — {[id]: string} hint text per section
// editMode = null  → self-managed
// editMode = true/false → parent-controlled
export default function EditableSections({ pageKey, defaultSections, placeholders = {}, editMode = null, initialItems = null }) {
    const ps = usePageSections({ pageKey, defaultSections, editMode, initialItems });

    // ── Loading skeleton ───────────────────────────────────────────────────────
    if (ps.loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-2xl bg-slate-50 animate-pulse" />
                ))}
            </div>
        );
    }

    const list = ps.sections ?? [];
    const confirmSection = ps.confirmDeleteIdx !== null ? list[ps.confirmDeleteIdx] : null;

    return (
        <div className="flex flex-col">
            {/* Self-managed "Edit page" toggle */}
            {!ps.isControlled && ps.canEdit(pageKey) && (
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => ps.setInternalEditMode((v) => !v)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                            ps.internalEditMode
                                ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                    >
                        {ps.internalEditMode ? (
                            <>
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Done editing
                            </>
                        ) : (
                            <>
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit page
                            </>
                        )}
                    </button>
                    {ps.internalEditMode && (
                        <span className="text-xs text-slate-400">Drag handles to reorder · rename or delete sections · changes save immediately</span>
                    )}
                </div>
            )}

            {confirmSection && (
                <ConfirmDialog
                    title="Delete section?"
                    message={`Are you sure you would like to delete the "${confirmSection.label}" section? The content inside will be lost.`}
                    confirmLabel="Yes, delete"
                    onConfirm={() => ps.deleteSection(ps.confirmDeleteIdx)}
                    onCancel={() => ps.setConfirmDeleteIdx(null)}
                />
            )}

            {/* Quick-add toolbar */}
            {ps.canEditThisPage && (
                <SectionToolbar
                    onAddImage={() => ps.quickAddSectionWithBlock("image")}
                    onAddTitle={() => ps.quickAddSectionWithBlock("title")}
                    onAddSection={ps.quickAddSection}
                />
            )}

            {/* TOC */}
            {(ps.tocVisible || ps.canEditThisPage) && (
                <div
                    id="on-this-page"
                    className={`mb-4 rounded-2xl ring-1 p-5 transition-opacity ${
                        ps.tocVisible
                            ? "bg-slate-50 ring-slate-100"
                            : "bg-slate-50/50 ring-slate-100 opacity-40"
                    }`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">On this page</p>
                        {ps.canEditThisPage && (
                            <button
                                type="button"
                                onClick={ps.toggleToc}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                                {ps.tocVisible ? (
                                    <>
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                        Hide
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Show
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {list.filter((f) => !f.hidden || ps.canEditThisPage).map((f) => (
                            <a key={f.id} href={`#${f.id}`}
                                className="rounded-lg bg-white ring-1 ring-slate-100 px-3 py-2 text-sm text-slate-600 hover:text-green-700 hover:ring-green-100 transition-all"
                            >
                                {f.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Section list with drop zones */}
            <SectionDropZone
                dragging={ps.canEditThisPage && ps.dragIdx !== null}
                isActive={ps.dropTarget?.type === "insert" && ps.dropTarget?.afterIdx === -1}
                onDragOver={() => ps.canEditThisPage && ps.setDropTarget({ type: "insert", afterIdx: -1 })}
                onDrop={ps.handleDrop}
            />

            {list.map((f, idx) => {
                if (f.hidden && !ps.canEditThisPage) return null;
                return (
                    <Fragment key={f.id}>
                        <SectionCard
                            id={f.id}
                            title={f.label}
                            hideTitle={!!ps.leadingTitle[f.id] || !!f.titleHidden}
                            isTitleHidden={!!f.titleHidden}
                            onToggleTitleHide={() => ps.toggleSectionTitleHide(idx)}
                            isManaging={ps.canEditThisPage}
                            isRenaming={ps.renamingIdx === idx}
                            renameValue={ps.renameValue}
                            onDelete={() => ps.setConfirmDeleteIdx(idx)}
                            onStartRename={() => ps.startRename(idx)}
                            onRenameChange={(e) => ps.setRenameValue(e.target.value)}
                            onRenameCommit={ps.commitRename}
                            onRenameKeyDown={ps.handleRenameKeyDown}
                            renameInputRef={ps.renamingIdx === idx ? ps.renameInputRef : null}
                            onMergeWithAbove={idx > 0 ? () => ps.mergeSections(idx) : null}
                            isHidden={!!f.hidden}
                            onToggleHide={() => ps.toggleSectionHide(idx)}
                            isDragging={ps.dragIdx === idx}
                            isSwapTarget={ps.dropTarget?.type === "swap" && ps.dropTarget?.idx === idx && ps.dragIdx !== idx}
                            isDraggable={ps.draggableIdx === idx}
                            onHandleMouseDown={() => ps.setDraggableIdx(idx)}
                            onHandleMouseUp={() => ps.setDraggableIdx(null)}
                            onDragStart={() => ps.setDragIdx(idx)}
                            onDragOver={(e) => { e.preventDefault(); ps.setDropTarget({ type: "swap", idx }); }}
                            onDrop={ps.handleDrop}
                            onDragEnd={() => { ps.setDragIdx(null); ps.setDropTarget(null); ps.setDraggableIdx(null); }}
                        >
                            <EditableContent
                                key={`${pageKey}.${f.id}.${ps.reloadKeys[f.id] ?? 0}`}
                                ref={(el) => { ps.sectionRefs.current[f.id] = el; }}
                                slug={`${pageKey}.${f.id}`}
                                placeholder={placeholders[f.id] ?? "Add content for this section."}
                                canEdit={ps.canEditThisPage}
                                defaultContent={f.defaultContent ?? null}
                                preloadedRecord={ps.contentCache ? (ps.contentCache[`${pageKey}.${f.id}`] ?? null) : undefined}
                                onFirstBlockIsTitle={(isTitle) => ps.setLeadingTitle((prev) => ({ ...prev, [f.id]: isTitle }))}
                                onSave={ps.handleContentSave}
                                userEmail={ps.user?.email}
                                sectionLabel={`${pageKey} — ${f.label}`}
                            />
                        </SectionCard>

                        <SectionDropZone
                            dragging={ps.canEditThisPage && ps.dragIdx !== null}
                            isActive={ps.dropTarget?.type === "insert" && ps.dropTarget?.afterIdx === idx}
                            onDragOver={() => ps.canEditThisPage && ps.setDropTarget({ type: "insert", afterIdx: idx })}
                            onDrop={ps.handleDrop}
                        />
                    </Fragment>
                );
            })}
        </div>
    );
}
