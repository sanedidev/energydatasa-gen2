"use client";

import { memo } from "react";
import DragHandle from "../ui/DragHandle";

function SectionCard({
    id, title, children,
    hideTitle, isTitleHidden, onToggleTitleHide,
    isManaging, isRenaming, renameValue,
    onDelete, onStartRename, onRenameChange, onRenameCommit, onRenameKeyDown,
    onMergeWithAbove, isHidden, onToggleHide,
    isDragging, isSwapTarget, isDraggable,
    onDragStart, onDragOver, onDrop, onDragEnd,
    onHandleMouseDown, onHandleMouseUp,
    renameInputRef,
}) {
    return (
        <section
            id={id}
            draggable={isManaging && isDraggable}
            onDragStart={isManaging && isDraggable ? onDragStart : undefined}
            onDragOver={isManaging ? onDragOver : undefined}
            onDrop={isManaging ? onDrop : undefined}
            onDragEnd={isManaging ? onDragEnd : undefined}
            className={`relative scroll-mt-24 rounded-2xl bg-white ring-1 shadow-sm p-6 transition-all
                ${isManaging && isDragging   ? "opacity-40 scale-[0.99]" : ""}
                ${isManaging && isSwapTarget ? "ring-orange-400 ring-2" : "ring-slate-100"}
                ${isManaging && isHidden     ? "opacity-50" : ""}
            `}
        >
            {isManaging && isSwapTarget && (
                <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center z-10">
                    <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                        ↕ Swap positions
                    </span>
                </div>
            )}
            {isManaging && isHidden && !isSwapTarget && (
                <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center z-10">
                    <span className="rounded-full bg-slate-400 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                        Hidden
                    </span>
                </div>
            )}
            <div className={`flex items-center gap-2 ${!isManaging && hideTitle ? "hidden" : ""}`}>
                {isManaging && (
                    <div
                        role="button"
                        title="Drag to reorder"
                        aria-label="Drag to reorder"
                        onMouseDown={onHandleMouseDown}
                        onMouseUp={onHandleMouseUp}
                        className="shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500"
                    >
                        <DragHandle />
                    </div>
                )}

                {isManaging && isRenaming ? (
                    <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={onRenameChange}
                        onBlur={onRenameCommit}
                        onKeyDown={onRenameKeyDown}
                        className="flex-1 rounded-lg border border-green-300 bg-white px-2 py-0.5 text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                ) : !hideTitle ? (
                    <h2 className="flex-1 text-base font-semibold text-slate-900">{title}</h2>
                ) : (
                    <span className="flex-1" />
                )}

                {isManaging && !isRenaming && (
                    <button
                        type="button"
                        title="Rename section"
                        aria-label="Rename section"
                        onClick={onStartRename}
                        className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}

                {isManaging && onMergeWithAbove && (
                    <button
                        type="button"
                        title="Merge with section above (content is joined with a blank line separator)"
                        onClick={onMergeWithAbove}
                        className="shrink-0 inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M12 3v5m0 8v5m-4-5l4 4 4-4" />
                        </svg>
                        Merge ↑
                    </button>
                )}

                {isManaging && (
                    <button
                        type="button"
                        title={isTitleHidden ? "Show section title" : "Hide section title"}
                        onClick={onToggleTitleHide}
                        className={`shrink-0 inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium transition-colors ${
                            isTitleHidden
                                ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        {isTitleHidden ? "Show title" : "Hide title"}
                    </button>
                )}

                {isManaging && (
                    <button
                        type="button"
                        title={isHidden ? "Show section (visible to all users)" : "Hide section (invisible to non-admins)"}
                        aria-label={isHidden ? "Show section" : "Hide section"}
                        onClick={onToggleHide}
                        className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                            isHidden
                                ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                    >
                        {isHidden ? (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                )}

                {isManaging && (
                    <button
                        type="button"
                        title="Delete section"
                        aria-label="Delete section"
                        onClick={onDelete}
                        className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="mt-3 text-sm text-slate-600 leading-relaxed">{children}</div>
        </section>
    );
}

export default memo(SectionCard);
