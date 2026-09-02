"use client";

import { useState } from "react";
import Image from "next/image";
import DragHandle from "../ui/DragHandle";
import { applyFormat, getBlockBg, isHiddenBlock, resolveImageUrl } from "./blockHelpers";

// ── Primitives ────────────────────────────────────────────────────────────────
export function TBtn({ children, title, onClick }) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            className="inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
            {children}
        </button>
    );
}

export function Sep() {
    return <span className="mx-1 h-4 w-px shrink-0 bg-slate-300" />;
}

export function DropZone({ dragging, isActive, onDragOver, onDrop }) {
    return (
        <div
            onDragOver={(e) => { e.preventDefault(); onDragOver(); }}
            onDrop={onDrop}
            className={`relative flex items-center transition-all duration-150 ${
                isActive ? "h-10 my-0.5" : dragging ? "h-4" : "h-2"
            }`}
        >
            {isActive && (
                <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-1">
                    <div className="h-0.5 flex-1 rounded-full bg-green-500" />
                    <span className="shrink-0 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white leading-tight">Insert here</span>
                    <div className="h-0.5 flex-1 rounded-full bg-green-500" />
                </div>
            )}
        </div>
    );
}

export function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-6 max-w-sm w-full space-y-4">
                <p className="text-sm font-semibold text-slate-900">{message}</p>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="button" onClick={onConfirm} className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">Delete</button>
                </div>
            </div>
        </div>
    );
}

// ── Shared drag badge helpers ─────────────────────────────────────────────────
function SwapBadge() {
    return (
        <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center z-10">
            <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">↕ Swap positions</span>
        </div>
    );
}

function HiddenBadge() {
    return (
        <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center z-10">
            <span className="rounded-full bg-slate-400 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">Hidden</span>
        </div>
    );
}

function HideToggleBtn({ isHidden, onToggleHide }) {
    const label = isHidden ? "Show block" : "Hide block";
    return (
        <button
            type="button"
            title={isHidden ? "Show block (visible to all users)" : "Hide block (invisible to non-admins)"}
            aria-label={label}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onToggleHide(); }}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                isHidden ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
    );
}

function DeleteBtn({ onDelete, title = "Delete block" }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    );
}

function DragHandleBtn({ setDraggable }) {
    return (
        <div
            role="button"
            title="Drag to reorder"
            aria-label="Drag to reorder"
            onMouseDown={() => setDraggable(true)}
            onMouseUp={() => setDraggable(false)}
            className="flex cursor-grab active:cursor-grabbing items-center text-slate-300 hover:text-slate-500"
        >
            <DragHandle />
        </div>
    );
}

function draggableCardClass(isDragging, isSwapTarget, isHidden, extra = "") {
    return `relative rounded-xl border bg-white shadow-sm transition-all select-none
        ${isDragging   ? "opacity-40 scale-[0.98]" : ""}
        ${isSwapTarget ? "border-orange-400 ring-2 ring-orange-200" : "border-slate-200"}
        ${isHidden     ? "opacity-50" : ""}
        ${extra}`;
}

// ── Text block editor ─────────────────────────────────────────────────────────
const BG_SWATCHES = [
    { value: "gray",  cls: "bg-slate-200",                                   title: "Grey background (default)" },
    { value: "white", cls: "bg-white border border-slate-300",               title: "White background" },
    { value: "none",  cls: "bg-white border border-dashed border-slate-300", title: "No background" },
    { value: "green", cls: "bg-green-200",                                   title: "Green background" },
    { value: "blue",  cls: "bg-blue-200",                                    title: "Blue background" },
    { value: "amber", cls: "bg-amber-200",                                   title: "Amber background" },
];

export function BlockEditor({
    index, total, value, onChange, onDelete, onMergePrev,
    isHidden, onToggleHide, blockBg, onSetBg,
    refs, registerTextarea, blocks, setBlocks, placeholder,
    isDragging, isSwapTarget,
    onDragStart, onDragOver, onDrop, onDragEnd,
}) {
    const [draggable, setDraggable] = useState(false);
    const fmt = (type) => applyFormat(blocks, setBlocks, refs, index, type);

    function handleKeyDown(e) {
        if (e.key === "Backspace" && onMergePrev && e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
            e.preventDefault();
            onMergePrev();
        }
    }

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={(e) => { setDraggable(false); onDragEnd(e); }}
            className={`relative rounded-xl border bg-white shadow-sm transition-all
                ${isDragging   ? "opacity-40 scale-[0.98]" : ""}
                ${isSwapTarget ? "border-orange-400 ring-2 ring-orange-200" : "border-slate-200"}
                ${isHidden     ? "opacity-50" : ""}
            `}
        >
            {isSwapTarget && <SwapBadge />}
            {isHidden && <HiddenBadge />}

            <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5 rounded-t-xl">
                <div
                    title="Drag to reorder"
                    onMouseDown={() => setDraggable(true)}
                    onMouseUp={() => setDraggable(false)}
                    className="mr-1 flex cursor-grab active:cursor-grabbing items-center text-slate-300 hover:text-slate-500"
                >
                    <DragHandle />
                </div>
                <Sep />
                <TBtn title="Heading 1" onClick={() => fmt("h1")}>H1</TBtn>
                <TBtn title="Heading 2" onClick={() => fmt("h2")}>H2</TBtn>
                <TBtn title="Heading 3" onClick={() => fmt("h3")}>H3</TBtn>
                <TBtn title="Normal paragraph" onClick={() => fmt("normal")}>¶</TBtn>
                <Sep />
                <TBtn title="Bold (wraps selection)" onClick={() => fmt("bold")}><span className="font-bold">B</span></TBtn>
                <TBtn title="Italic (wraps selection)" onClick={() => fmt("italic")}><span className="italic">I</span></TBtn>
                <Sep />
                <TBtn title="Bullet list" onClick={() => fmt("ul")}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                </TBtn>
                <TBtn title="Numbered list" onClick={() => fmt("ol")}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h1v4m0 0H4m1 0h1M4 12h1.5M4 18h2m9-12h4M9 12h9M9 18h9" /></svg>
                </TBtn>
                {onMergePrev && (
                    <>
                        <Sep />
                        <TBtn title="Merge with block above (or press Backspace at start)" onClick={onMergePrev}>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M12 3v5m0 8v5m-4-5l4 4 4-4" /></svg>
                        </TBtn>
                    </>
                )}
                <Sep />
                <div className="flex items-center gap-1" title="Block background colour">
                    {BG_SWATCHES.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            title={opt.title}
                            onMouseDown={(e) => { e.preventDefault(); onSetBg(opt.value); }}
                            className={`h-4 w-4 rounded-full transition-all ${opt.cls} ${blockBg === opt.value ? "ring-2 ring-offset-1 ring-green-500 scale-110" : "hover:scale-110"}`}
                        />
                    ))}
                </div>
                <HideToggleBtn isHidden={isHidden} onToggleHide={onToggleHide} />
                <button
                    type="button"
                    title={total === 1 ? "Clear block" : "Delete block"}
                    onMouseDown={(e) => { e.preventDefault(); onDelete(); }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>

            <textarea
                ref={registerTextarea}
                draggable={false}
                className="w-full rounded-b-xl bg-white p-3 font-mono text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-inset transition-all resize-y select-text"
                rows={6}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={index === 0 ? placeholder : "Continue writing…"}
                autoFocus={index === 0}
            />
        </div>
    );
}

// ── Image block editor ────────────────────────────────────────────────────────
const ALIGN_OPTS = [
    { value: "left",   label: "Left",
      icon: <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 6h18M3 10h10M3 14h18M3 18h10"/></svg> },
    { value: "center", label: "Center",
      icon: <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 6h18M7 10h10M3 14h18M7 18h10"/></svg> },
    { value: "right",  label: "Right",
      icon: <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M3 6h18M11 10h10M3 14h18M11 18h10"/></svg> },
];

export function ImageBlockEditor({
    block, onDelete, onChangeImage, onUpdate,
    isHidden, onToggleHide,
    isDragging, isSwapTarget,
    onDragStart, onDragOver, onDrop, onDragEnd,
}) {
    const [draggable, setDraggable] = useState(false);
    const src       = resolveImageUrl(block.key);
    const width     = block.width     ?? 100;
    const maxHeight = block.maxHeight ?? 400;
    const align     = block.align     ?? "center";

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={(e) => { setDraggable(false); onDragEnd(e); }}
            className={draggableCardClass(isDragging, isSwapTarget, isHidden)}
        >
            {isSwapTarget && <SwapBadge />}
            {isHidden && <HiddenBadge />}

            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
                <DragHandleBtn setDraggable={setDraggable} />
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                </svg>
                <span className="text-xs font-medium text-slate-500">Image</span>
                <button type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onChangeImage(); }} className="text-xs text-green-700 hover:text-green-900 underline underline-offset-2">
                    Change
                </button>
                <div className="ml-auto flex items-center gap-1">
                    <HideToggleBtn isHidden={isHidden} onToggleHide={onToggleHide} />
                    <DeleteBtn onDelete={onDelete} title="Remove image block" />
                </div>
            </div>

            <div className="p-3">
                <div className={`flex ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start"}`}>
                    {src
                        ? <div className="relative rounded-lg overflow-hidden" style={{ width: `${width}%`, height: `${maxHeight}px` }}>
                              <Image src={src} alt="Image block" fill className="object-cover" sizes="(max-width: 768px) 100vw, 80vw" />
                          </div>
                        : <div className="flex h-20 w-full items-center justify-center text-xs text-slate-400">Image unavailable</div>
                    }
                </div>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-3 border-t border-slate-100 bg-slate-50/70 px-4 py-3">
                <span className="text-[11px] font-medium text-slate-500">Width</span>
                <input type="range" min={10} max={100} step={5} value={width} onChange={(e) => onUpdate({ width: Number(e.target.value) })} className="w-full h-1.5 accent-green-600 cursor-pointer py-2" />
                <span className="w-10 text-right text-[11px] font-mono text-slate-600">{width}%</span>

                <span className="text-[11px] font-medium text-slate-500">Height</span>
                <input type="range" min={100} max={800} step={25} value={maxHeight} onChange={(e) => onUpdate({ maxHeight: Number(e.target.value) })} className="w-full h-1.5 accent-green-600 cursor-pointer py-2" />
                <span className="w-10 text-right text-[11px] font-mono text-slate-600">{maxHeight}px</span>

                <span className="text-[11px] font-medium text-slate-500">Align</span>
                <div className="flex items-center gap-1 col-span-2">
                    {ALIGN_OPTS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            title={opt.label}
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onUpdate({ align: opt.value }); }}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded transition-colors ${align === opt.value ? "bg-green-100 text-green-700" : "text-slate-400 hover:bg-slate-200 hover:text-slate-700"}`}
                        >
                            {opt.icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Title block editor ────────────────────────────────────────────────────────
export function TitleBlockEditor({
    block, onUpdate, onDelete,
    isHidden, onToggleHide,
    isDragging, isSwapTarget,
    onDragStart, onDragOver, onDrop, onDragEnd,
}) {
    const [draggable, setDraggable] = useState(false);

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={(e) => { setDraggable(false); onDragEnd(e); }}
            className={draggableCardClass(isDragging, isSwapTarget, isHidden)}
        >
            {isSwapTarget && <SwapBadge />}
            {isHidden && <HiddenBadge />}

            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
                <DragHandleBtn setDraggable={setDraggable} />
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-xs font-medium text-slate-500">Title block</span>
                <div className="ml-auto flex items-center gap-1">
                    <HideToggleBtn isHidden={isHidden} onToggleHide={onToggleHide} />
                    <DeleteBtn onDelete={onDelete} title="Delete title block" />
                </div>
            </div>

            <div className="p-3 space-y-2">
                <input
                    type="text"
                    draggable={false}
                    value={block.title ?? ""}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="Title"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 select-text"
                />
                <textarea
                    draggable={false}
                    value={block.subtitle ?? ""}
                    onChange={(e) => onUpdate({ subtitle: e.target.value })}
                    placeholder="Subtitle / description (optional)"
                    rows={2}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none select-text"
                />
            </div>
        </div>
    );
}

// ── Section block editor ──────────────────────────────────────────────────────
export function SectionBlockEditor({
    block, onUpdate, onDelete,
    isHidden, onToggleHide,
    isDragging, isSwapTarget,
    onDragStart, onDragOver, onDrop, onDragEnd,
}) {
    const [draggable, setDraggable] = useState(false);

    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={(e) => { setDraggable(false); onDragEnd(e); }}
            className={draggableCardClass(isDragging, isSwapTarget, isHidden)}
        >
            {isSwapTarget && <SwapBadge />}
            {isHidden && <HiddenBadge />}

            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
                <DragHandleBtn setDraggable={setDraggable} />
                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs font-medium text-slate-500">Section block</span>
                <div className="ml-auto flex items-center gap-1">
                    <HideToggleBtn isHidden={isHidden} onToggleHide={onToggleHide} />
                    <DeleteBtn onDelete={onDelete} title="Delete section block" />
                </div>
            </div>

            <div className="p-3">
                <input
                    type="text"
                    draggable={false}
                    value={block.label ?? ""}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    placeholder="Section heading"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 select-text"
                />
            </div>
        </div>
    );
}
