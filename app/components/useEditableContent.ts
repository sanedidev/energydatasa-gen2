"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Dispatch, type MutableRefObject, type RefObject, type SetStateAction } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { logEdit } from "@/app/lib/editHistory";
import {
    type Block,
    blockHasContent,
    getBlockBg,
    getBlockText,
    isHiddenBlock,
    isImageBlock,
    isSectionBlock,
    isTitleBlock,
    parseBlocks,
    serializeBlocks,
} from "./editableContent/blockHelpers";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PageContentRecord = { id: string; slug: string; content: string } | null;

type DropTarget =
    | { type: "swap"; idx: number }
    | { type: "insert"; afterIdx: number };

export interface UseEditableContentParams {
    slug: string;
    defaultContent?: string | null;
    preloadedRecord?: PageContentRecord | undefined;
    onFirstBlockIsTitle?: ((isTitle: boolean) => void) | null;
    onSave?: ((slug: string, record: PageContentRecord) => void) | null;
    userEmail?: string | null;
    sectionLabel?: string | null;
    ref?: unknown;
}

export interface UseEditableContentReturn {
    record: PageContentRecord;
    loading: boolean;
    isEditing: boolean;
    blocks: Block[];
    saving: boolean;
    error: string;
    draftRestored: boolean;
    textareaRefs: MutableRefObject<HTMLTextAreaElement[]>;
    pickerRef: RefObject<HTMLElement | null>;
    dragIdx: number | null;
    setDragIdx: Dispatch<SetStateAction<number | null>>;
    dropTarget: DropTarget | null;
    setDropTarget: Dispatch<SetStateAction<DropTarget | null>>;
    confirmDeleteIdx: number | null;
    setConfirmDeleteIdx: Dispatch<SetStateAction<number | null>>;
    mediaOpen: boolean;
    setMediaOpen: Dispatch<SetStateAction<boolean>>;
    pendingImgIdx: number | null;
    setPendingImgIdx: Dispatch<SetStateAction<number | null>>;
    showBlockPicker: boolean;
    setShowBlockPicker: Dispatch<SetStateAction<boolean>>;
    handleSave: () => Promise<void>;
    handleCancel: () => void;
    handleStartEdit: () => void;
    addBlock: () => void;
    addTitleBlock: () => void;
    addSectionBlock: () => void;
    deleteBlock: (idx: number) => void;
    updateBlock: (idx: number, value: Block | string) => void;
    toggleBlockHide: (idx: number) => void;
    updateBlockBg: (idx: number, bg: string) => void;
    handleDrop: (e?: React.DragEvent | null) => void;
    mergeBlocks: (idx: number) => void;
    openAddImage: () => void;
    openChangeImage: (idx: number) => void;
    handleImageSelect: (key: string) => void;
    setBlocks: Dispatch<SetStateAction<Block[]>>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useEditableContent({
    slug,
    defaultContent = null,
    preloadedRecord = undefined,
    onFirstBlockIsTitle = null,
    onSave = null,
    userEmail = null,
    sectionLabel = null,
    ref,
}: UseEditableContentParams): UseEditableContentReturn {
    const hasPreload = preloadedRecord !== undefined;
    const [record,   setRecord]   = useState<PageContentRecord>(hasPreload ? (preloadedRecord ?? null) : null);
    const [loading,  setLoading]  = useState(!hasPreload);
    const [isEditing, setIsEditing] = useState(false);
    const [blocks,   setBlocks]   = useState<Block[]>(() => hasPreload ? parseBlocks(preloadedRecord?.content) : [""]);
    const [saving,   setSaving]   = useState(false);
    const [error,    setError]    = useState("");

    const textareaRefs = useRef<HTMLTextAreaElement[]>([]);

    const [dragIdx,    setDragIdx]    = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);

    const [mediaOpen,     setMediaOpen]     = useState(false);
    const [pendingImgIdx, setPendingImgIdx] = useState<number | null>(null);

    const [showBlockPicker, setShowBlockPicker] = useState(false);
    const pickerRef = useRef<HTMLElement | null>(null);

    const [draftRestored, setDraftRestored] = useState(false);
    const draftKey = `draft:${slug}`;

    // Stable ref so the notify effect doesn't depend on the callback identity
    const onFirstBlockIsTitleRef = useRef(onFirstBlockIsTitle);
    useEffect(() => { onFirstBlockIsTitleRef.current = onFirstBlockIsTitle; });

    // Warn before navigating away with unsaved edits
    useEffect(() => {
        if (!isEditing) return;
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            e.preventDefault();
            e.returnValue = "";
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isEditing]);

    // Autosave draft to localStorage while editing
    useEffect(() => {
        if (!isEditing) return;
        const timer = setTimeout(() => {
            try { localStorage.setItem(draftKey, JSON.stringify(blocks)); } catch { /* quota */ }
        }, 500);
        return () => clearTimeout(timer);
    }, [blocks, isEditing, draftKey]);

    // Close block-type picker on outside click
    useEffect(() => {
        if (!showBlockPicker) return;
        function handleOutside(e: MouseEvent) {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowBlockPicker(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [showBlockPicker]);

    // Notify parent whether first visible block is a title block
    useEffect(() => {
        if (loading || !onFirstBlockIsTitleRef.current) return;
        const saved = parseBlocks(record?.content ?? defaultContent);
        const first = saved.find((b) => blockHasContent(b) && !(typeof b === "object" && (b as { hidden?: boolean })?.hidden === true));
        onFirstBlockIsTitleRef.current(isTitleBlock(first));
    }, [record?.content, loading]);

    // Fetch — skipped when parent batch-loaded the record. authMode: "apiKey"
    // so anonymous visitors (not just signed-in editors) can view content -
    // matches the schema's allow.publicApiKey().to(['read']) rule.
    useEffect(() => {
        if (hasPreload) return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug }, { authMode: "apiKey" });
                const item = res.data?.[0] ?? null;
                if (!cancelled) {
                    setRecord(item);
                    setBlocks((prev) => {
                        if (prev.length > 1 || (prev.length === 1 && prev[0] !== "")) return prev;
                        return parseBlocks(item?.content);
                    });
                }
            } catch { /* silently fail */ }
            finally { if (!cancelled) setLoading(false); }
        }
        load();
        return () => { cancelled = true; };
    }, [slug]);

    // ── Imperative API for EditableSections quick-add ─────────────────────────
    useImperativeHandle(ref as any, () => ({
        quickAdd(type: string) {
            setIsEditing(true);
            if (type === "image") {
                setPendingImgIdx(null);
                setMediaOpen(true);
            } else if (type === "title") {
                setBlocks((prev) => {
                    const isDefault = prev.length === 1 && typeof prev[0] === "string" && !(prev[0] as string).trim();
                    return isDefault
                        ? [{ type: "title", title: "", subtitle: "" }]
                        : [...prev, { type: "title", title: "", subtitle: "" }];
                });
            } else if (type === "section") {
                setBlocks((prev) => [...prev, { type: "section", label: "" }]);
            }
        },
    }));

    // ── Save / cancel ─────────────────────────────────────────────────────────
    async function handleSave() {
        setSaving(true); setError("");
        const before   = record?.content ?? null;
        const content  = serializeBlocks(blocks);
        const isUpdate = !!record?.id;
        try {
            let saved: PageContentRecord;
            // Amplify's generated client types incorrectly widen plain string
            // fields to string[] project-wide whenever *any* model has an
            // .array() field (verified: reproduces on unrelated models too,
            // e.g. EskomCoalPowerStation, and the generated parameter type
            // itself has a broken `{ [x: string]: string[] }` index signature)
            // - a Gen2 typegen bug, not a real mismatch. `as any` on the call
            // is the only thing that actually bypasses it; runtime behavior
            // (and the real Schema-derived return type below) is unaffected.
            const pageContentClient = client.models.PageContent as any;
            if (isUpdate) {
                const res = await pageContentClient.update({ id: record!.id, content });
                saved = res.data ?? record;
            } else {
                const res = await pageContentClient.create({ slug, content });
                saved = res.data ?? null;
            }
            setRecord(saved);
            setIsEditing(false);
            setDraftRestored(false);
            try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
            onSave?.(slug, saved);
            logEdit(client, {
                slug,
                label:  sectionLabel || slug,
                email:  userEmail,
                action: isUpdate ? "update" : "create",
                before,
                after:  content,
            });
        } catch (e) {
            console.error(e);
            setError("Failed to save. Please try again.");
        } finally { setSaving(false); }
    }

    function handleCancel() {
        setBlocks(parseBlocks(record?.content ?? defaultContent));
        setIsEditing(false);
        setError("");
        setDraftRestored(false);
        try { localStorage.removeItem(draftKey); } catch { /* ignore */ }
    }

    function handleStartEdit() {
        const fresh = parseBlocks(record?.content ?? defaultContent);
        let restored = false;
        try {
            const saved = localStorage.getItem(draftKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setBlocks(parsed as Block[]);
                    restored = true;
                }
            }
        } catch { /* ignore */ }
        if (!restored) setBlocks(fresh);
        setDraftRestored(restored);
        setIsEditing(true);
    }

    // ── Block mutations ───────────────────────────────────────────────────────
    function addBlock()       { setBlocks((prev) => [...prev, ""]); }
    function addTitleBlock()  { setBlocks((prev) => [...prev, { type: "title", title: "", subtitle: "" }]); }
    function addSectionBlock(){ setBlocks((prev) => [...prev, { type: "section", label: "" }]); }

    function deleteBlock(idx: number) {
        setBlocks((prev) => prev.length === 1 ? [""] : prev.filter((_, i) => i !== idx));
    }

    function updateBlock(idx: number, value: Block | string) {
        setBlocks((prev) => {
            const next = [...prev];
            const existing = next[idx];
            if (typeof existing === "object" && (existing as any)?.type === "text" && typeof value === "string") {
                next[idx] = { ...existing as object, content: value } as Block;
            } else {
                next[idx] = value as Block;
            }
            return next;
        });
    }

    function toggleBlockHide(idx: number) {
        setBlocks((prev) => {
            const next = [...prev];
            const b = next[idx];
            if (isImageBlock(b) || isTitleBlock(b) || isSectionBlock(b)) {
                next[idx] = { ...b, hidden: !b.hidden };
            } else {
                const text = getBlockText(b);
                const bg = getBlockBg(b);
                const nowHidden = !isHiddenBlock(b);
                if (!nowHidden && bg === "gray") {
                    next[idx] = text;
                } else {
                    next[idx] = { type: "text", content: text, ...(nowHidden ? { hidden: true } : {}), ...(bg !== "gray" ? { bg } : {}) };
                }
            }
            return next;
        });
    }

    function updateBlockBg(idx: number, bg: string) {
        setBlocks((prev) => {
            const next = [...prev];
            const b = next[idx];
            if (isImageBlock(b)) return prev;
            const text = getBlockText(b);
            const hidden = isHiddenBlock(b);
            if (bg === "gray" && !hidden) {
                next[idx] = text;
            } else {
                next[idx] = { type: "text", content: text, ...(hidden ? { hidden: true } : {}), ...(bg !== "gray" ? { bg } : {}) };
            }
            return next;
        });
    }

    function handleDrop(e?: React.DragEvent | null) {
        e?.preventDefault?.();
        if (dragIdx === null || dropTarget === null) { setDragIdx(null); setDropTarget(null); return; }
        const next = [...blocks];
        if (dropTarget.type === "swap") {
            const si = dropTarget.idx;
            if (dragIdx !== si) [next[dragIdx], next[si]] = [next[si], next[dragIdx]];
        } else {
            const targetPos = dropTarget.afterIdx + 1;
            if (targetPos !== dragIdx && targetPos !== dragIdx + 1) {
                const [moved] = next.splice(dragIdx, 1);
                const adj = targetPos > dragIdx ? targetPos - 1 : targetPos;
                next.splice(adj, 0, moved);
            }
        }
        setBlocks(next);
        setDragIdx(null);
        setDropTarget(null);
    }

    function mergeBlocks(idx: number) {
        if (idx === 0) return;
        setBlocks((prev) => {
            if (isImageBlock(prev[idx - 1]) || isImageBlock(prev[idx]) ||
                isTitleBlock(prev[idx - 1]) || isTitleBlock(prev[idx]) ||
                isSectionBlock(prev[idx - 1]) || isSectionBlock(prev[idx])) return prev;
            const next = [...prev];
            next[idx - 1] = getBlockText(next[idx - 1]) + "\n\n" + getBlockText(next[idx]);
            next.splice(idx, 1);
            return next;
        });
        requestAnimationFrame(() => {
            const el = textareaRefs.current[idx - 1];
            if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
        });
    }

    function openAddImage()        { setPendingImgIdx(null); setMediaOpen(true); }
    function openChangeImage(idx: number)  { setPendingImgIdx(idx);  setMediaOpen(true); }

    function handleImageSelect(key: string) {
        setMediaOpen(false);
        if (pendingImgIdx === null) {
            setBlocks((prev) => {
                const existingIdx = prev.findIndex(isImageBlock);
                if (existingIdx !== -1) {
                    return prev.map((b, i) => i === existingIdx ? { type: "image", key } : b);
                }
                const isDefault = prev.length === 1 && typeof prev[0] === "string" && !(prev[0] as string).trim();
                return isDefault ? [{ type: "image", key }] : [...prev, { type: "image", key }];
            });
        } else {
            setBlocks((prev) => prev.map((b, i) => i === pendingImgIdx ? { type: "image", key } : b));
        }
        setPendingImgIdx(null);
    }

    return {
        // state
        record, loading, isEditing, blocks, saving, error,
        draftRestored,
        textareaRefs, pickerRef,
        dragIdx, setDragIdx,
        dropTarget, setDropTarget,
        confirmDeleteIdx, setConfirmDeleteIdx,
        mediaOpen, setMediaOpen,
        pendingImgIdx, setPendingImgIdx,
        showBlockPicker, setShowBlockPicker,
        // actions
        handleSave, handleCancel, handleStartEdit,
        addBlock, addTitleBlock, addSectionBlock,
        deleteBlock, updateBlock,
        toggleBlockHide, updateBlockBg,
        handleDrop, mergeBlocks,
        openAddImage, openChangeImage, handleImageSelect,
        // derived
        setBlocks,
    };
}
