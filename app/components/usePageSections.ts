"use client";

import { useEffect, useRef, useState, type Dispatch, type MutableRefObject, type RefObject, type SetStateAction } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { usePermissions } from "../context/permissions";
import { usePageEditMode } from "../context/pageEditMode";
import { useAuth } from "../context/auth";
import { logEdit } from "../lib/editHistory";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Section = {
    id: string;
    label: string;
    hidden?: boolean;
    titleHidden?: boolean;
    defaultContent?: string;
};

export type PageContentRecord = { id: string; slug: string; content: string } | null;

type DropTarget =
    | { type: "swap"; idx: number }
    | { type: "insert"; afterIdx: number };

type QuickAddHandle = { quickAdd: (type: string) => void } | null;

export interface UsePageSectionsParams {
    pageKey: string;
    defaultSections: Section[];
    editMode?: boolean | null;
    initialItems?: Array<{ id: string; slug: string; content: string }> | null;
}

export interface UsePageSectionsReturn {
    canEdit: (key: string) => boolean;
    user: { email?: string } | null | undefined;
    isControlled: boolean;
    internalEditMode: boolean;
    setInternalEditMode: Dispatch<SetStateAction<boolean>>;
    effectiveEditMode: boolean;
    canEditThisPage: boolean;
    sections: Section[] | null;
    tocVisible: boolean;
    sectionsRecord: PageContentRecord;
    contentCache: Record<string, PageContentRecord | null | undefined> | undefined;
    loading: boolean;
    saving: boolean;
    renamingIdx: number | null;
    renameValue: string;
    setRenameValue: Dispatch<SetStateAction<string>>;
    renameInputRef: RefObject<HTMLInputElement | null>;
    dragIdx: number | null;
    setDragIdx: Dispatch<SetStateAction<number | null>>;
    dropTarget: DropTarget | null;
    setDropTarget: Dispatch<SetStateAction<DropTarget | null>>;
    draggableIdx: number | null;
    setDraggableIdx: Dispatch<SetStateAction<number | null>>;
    confirmDeleteIdx: number | null;
    setConfirmDeleteIdx: Dispatch<SetStateAction<number | null>>;
    reloadKeys: Record<string, number>;
    leadingTitle: Record<string, boolean>;
    setLeadingTitle: Dispatch<SetStateAction<Record<string, boolean>>>;
    sectionRefs: MutableRefObject<Record<string, QuickAddHandle>>;
    toggleToc: () => void;
    quickAddSection: () => void;
    quickAddSectionWithBlock: (type: string) => void;
    deleteSection: (idx: number) => void;
    toggleSectionHide: (idx: number) => void;
    toggleSectionTitleHide: (idx: number) => void;
    mergeSections: (idx: number) => Promise<void>;
    handleDrop: (e?: React.DragEvent | null) => void;
    startRename: (idx: number) => void;
    commitRename: () => void;
    handleRenameKeyDown: (e: React.KeyboardEvent) => void;
    handleContentSave: (slug: string, savedRecord: PageContentRecord) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseConfig(raw: string | null | undefined): { sections: Section[]; tocVisible: boolean } | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return { sections: parsed as Section[], tocVisible: true };
        }
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.sections)) {
            return {
                sections: parsed.sections as Section[],
                tocVisible: parsed.tocVisible !== false,
            };
        }
    } catch { /* not JSON */ }
    return null;
}

function parseBlocksForMerge(raw: string | null | undefined): unknown[] {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return raw ? [raw] : [];
}

// ── Hook ──────────────────────────────────────────────────────────────────────
// editMode = null  → self-managed
// editMode = true  → controlled ON
// editMode = false → controlled OFF
export function usePageSections({ pageKey, defaultSections, editMode = null, initialItems = null }: UsePageSectionsParams): UsePageSectionsReturn {
    const { canEdit } = usePermissions();
    const { user } = useAuth();
    const isControlled = editMode !== null;

    const [internalEditMode, setInternalEditMode] = useState(false);
    const effectiveEditMode = isControlled ? editMode! : internalEditMode;

    const { setEditMode: setPageEditMode } = usePageEditMode();
    useEffect(() => { (setPageEditMode as (v: boolean) => void)(effectiveEditMode); }, [effectiveEditMode, setPageEditMode]);

    const canEditThisPage = canEdit(pageKey) && effectiveEditMode;

    // Amplify's generated client types incorrectly widen plain string fields
    // to string[] project-wide whenever any model has an .array() field
    // (verified against unrelated models too) - a confirmed Gen2 typegen
    // bug, not a real mismatch. Runtime is unaffected.
    const pageContentClient = client.models.PageContent as any;

    const [sections, setSections]             = useState<Section[] | null>(null);
    const [tocVisible, setTocVisible]         = useState(true);
    const [sectionsRecord, setSectionsRecord] = useState<PageContentRecord>(null);
    const [contentCache, setContentCache]     = useState<Record<string, PageContentRecord | null | undefined> | undefined>(undefined);
    const [loading, setLoading]               = useState(true);
    const [saving, setSaving]                 = useState(false);

    const [renamingIdx, setRenamingIdx] = useState<number | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const renameInputRef = useRef<HTMLInputElement | null>(null);

    const [dragIdx,      setDragIdx]      = useState<number | null>(null);
    const [dropTarget,   setDropTarget]   = useState<DropTarget | null>(null);
    const [draggableIdx, setDraggableIdx] = useState<number | null>(null);

    // Derived, not stored: turning off effectiveEditMode clears any pending
    // delete confirmation automatically - no reset effect needed, same
    // pattern as EditablePageHeader/PageBody/useEditableContent.
    const [confirmDeleteIdxRequested, setConfirmDeleteIdx] = useState<number | null>(null);
    const confirmDeleteIdx = effectiveEditMode ? confirmDeleteIdxRequested : null;

    const [reloadKeys, setReloadKeys]             = useState<Record<string, number>>({});
    const [leadingTitle, setLeadingTitle]         = useState<Record<string, boolean>>({});

    const sectionRefs = useRef<Record<string, QuickAddHandle>>({});

    const [pendingQuickAdd, setPendingQuickAdd] = useState<{ id: string; type: string } | null>(null);

    const configSlug = `${pageKey}.__sections__`;

    // ── Batch fetch ───────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (initialItems !== null) {
                // Hydrate from SSR data — skip network fetch
                const items = initialItems;
                const configItem = items.find((i) => i.slug === configSlug) ?? null;
                const cache = Object.fromEntries(
                    items.filter((i) => i.slug !== configSlug).map((i) => [i.slug, i])
                );
                if (!cancelled) {
                    setSectionsRecord(configItem);
                    const config = parseConfig(configItem?.content);
                    setSections(config?.sections ?? defaultSections);
                    setTocVisible(config?.tocVisible ?? true);
                    setContentCache(cache);
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            try {
                // apiKey so anonymous visitors (not just signed-in editors) can view.
                const res = await pageContentClient.list(
                    { filter: { slug: { beginsWith: `${pageKey}.` } }, limit: 200 },
                    { authMode: "apiKey" }
                );
                const items = res?.data ?? [];
                if (!cancelled) {
                    const configItem = items.find((i: any) => i.slug === configSlug) ?? null;
                    const cache = Object.fromEntries(
                        items.filter((i: any) => i.slug !== configSlug).map((i: any) => [i.slug, i])
                    );
                    setSectionsRecord(configItem);
                    const config = parseConfig(configItem?.content);
                    setSections(config?.sections ?? defaultSections);
                    setTocVisible(config?.tocVisible ?? true);
                    setContentCache(cache);
                }
            } catch {
                if (!cancelled) { setSections(defaultSections); setContentCache({}); }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [pageKey, initialItems]);

    // Fire pending quick-add once the new section mounts
    useEffect(() => {
        if (!pendingQuickAdd) return;
        const ref = sectionRefs.current[pendingQuickAdd.id];
        if (ref) {
            ref.quickAdd(pendingQuickAdd.type);
            setPendingQuickAdd(null);
        }
    }, [sections, pendingQuickAdd]);

    // ── Persist config ────────────────────────────────────────────────────────
    async function persist(updated: Section[], toc = tocVisible) {
        setSaving(true);
        const before  = sectionsRecord?.content ?? null;
        const content = JSON.stringify({ sections: updated, tocVisible: toc });
        try {
            if (sectionsRecord?.id) {
                const res = await pageContentClient.update({ id: sectionsRecord.id, content });
                setSectionsRecord(res?.data ?? sectionsRecord);
            } else {
                const res = await pageContentClient.create({ slug: configSlug, content });
                setSectionsRecord(res?.data ?? null);
            }
            logEdit(client, {
                slug:   configSlug,
                label:  `${pageKey} — Sections`,
                email:  (user as any)?.email,
                action: sectionsRecord?.id ? "update" : "create",
                before,
                after:  content,
            });
        } catch (e) {
            console.error("Failed to save sections", e);
        } finally {
            setSaving(false);
        }
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    function toggleToc() {
        const next = !tocVisible;
        setTocVisible(next);
        persist(sections ?? [], next);
    }

    function quickAddSection() {
        const id = uniqueId(sections ?? []);
        const updated: Section[] = [{ id, label: "New section" }, ...(sections ?? [])];
        setSections(updated);
        persist(updated);
        setContentCache((prev) => prev ? { ...prev, [`${pageKey}.${id}`]: null } : prev);
        setRenamingIdx(0);
        setRenameValue("New section");
        setTimeout(() => renameInputRef.current?.select(), 50);
    }

    function quickAddSectionWithBlock(type: string) {
        const id = uniqueId(sections ?? []);
        const updated: Section[] = [{ id, label: "New section" }, ...(sections ?? [])];
        setSections(updated);
        persist(updated);
        setContentCache((prev) => prev ? { ...prev, [`${pageKey}.${id}`]: null } : prev);
        setPendingQuickAdd({ id, type });
    }

    function deleteSection(idx: number) {
        const updated = (sections ?? []).filter((_, i) => i !== idx);
        setSections(updated);
        persist(updated);
        setConfirmDeleteIdx(null);
    }

    function toggleSectionHide(idx: number) {
        const updated = [...(sections ?? [])];
        updated[idx] = { ...updated[idx], hidden: !updated[idx].hidden };
        setSections(updated);
        persist(updated);
    }

    function toggleSectionTitleHide(idx: number) {
        const updated = [...(sections ?? [])];
        updated[idx] = { ...updated[idx], titleHidden: !updated[idx].titleHidden };
        setSections(updated);
        persist(updated);
    }

    async function mergeSections(idx: number) {
        if (idx === 0 || !sections) return;
        const upper = sections[idx - 1];
        const lower = sections[idx];
        const upperSlug = `${pageKey}.${upper.id}`;
        const lowerSlug = `${pageKey}.${lower.id}`;
        setSaving(true);
        try {
            const [upperRes, lowerRes] = await Promise.all([
                pageContentClient.pageContentBySlug({ slug: upperSlug }, { authMode: "apiKey" }),
                pageContentClient.pageContentBySlug({ slug: lowerSlug }, { authMode: "apiKey" }),
            ]);
            const upperItem = upperRes?.data?.[0] ?? null;
            const lowerItem = lowerRes?.data?.[0] ?? null;
            const merged = [
                ...parseBlocksForMerge(upperItem?.content),
                "\n\n",
                ...parseBlocksForMerge(lowerItem?.content),
            ];
            const content = JSON.stringify(merged);
            if (upperItem?.id) {
                await pageContentClient.update({ id: upperItem.id, content });
            } else {
                await pageContentClient.create({ slug: upperSlug, content });
            }
            if (lowerItem?.id) {
                await pageContentClient.delete({ id: lowerItem.id });
            }
            const updatedSections = sections.filter((_, i) => i !== idx);
            setSections(updatedSections);
            persist(updatedSections);
            setContentCache((prev) => {
                if (!prev) return prev;
                const { [lowerSlug]: _removed, ...rest } = prev;
                return { ...rest, [upperSlug]: { ...(prev[upperSlug] ?? {}), content } } as typeof prev;
            });
            setReloadKeys((prev) => ({ ...prev, [upper.id]: (prev[upper.id] ?? 0) + 1 }));
        } catch (e) {
            console.error("Failed to merge sections", e);
        } finally {
            setSaving(false);
        }
    }

    function handleDrop(e?: React.DragEvent | null) {
        e?.preventDefault?.();
        if (dragIdx === null || dropTarget === null) {
            setDragIdx(null); setDropTarget(null); setDraggableIdx(null); return;
        }
        const next = [...(sections ?? [])];
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
        setSections(next);
        persist(next);
        setDragIdx(null); setDropTarget(null); setDraggableIdx(null);
    }

    function startRename(idx: number) {
        setRenamingIdx(idx);
        setRenameValue((sections ?? [])[idx]?.label ?? "");
        requestAnimationFrame(() => renameInputRef.current?.select());
    }

    function commitRename() {
        if (renamingIdx === null) return;
        const label = renameValue.trim();
        if (label) {
            const updated = [...(sections ?? [])];
            updated[renamingIdx] = { ...updated[renamingIdx], label };
            setSections(updated);
            persist(updated);
        }
        setRenamingIdx(null);
    }

    function handleRenameKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") { e.preventDefault(); commitRename(); }
        if (e.key === "Escape") setRenamingIdx(null);
    }

    // Called by EditableContent after a successful save — keeps cache fresh
    function handleContentSave(slug: string, savedRecord: PageContentRecord) {
        setContentCache((prev) => prev ? { ...prev, [slug]: savedRecord } : prev);
    }

    return {
        // permissions / auth
        canEdit, user, isControlled,
        internalEditMode, setInternalEditMode,
        effectiveEditMode, canEditThisPage,
        // data
        sections, tocVisible, sectionsRecord, contentCache,
        loading, saving,
        // rename
        renamingIdx, renameValue, setRenameValue, renameInputRef,
        // drag
        dragIdx, setDragIdx,
        dropTarget, setDropTarget,
        draggableIdx, setDraggableIdx,
        // misc
        confirmDeleteIdx, setConfirmDeleteIdx,
        reloadKeys, leadingTitle, setLeadingTitle,
        sectionRefs,
        // actions
        toggleToc,
        quickAddSection, quickAddSectionWithBlock,
        deleteSection,
        toggleSectionHide, toggleSectionTitleHide,
        mergeSections,
        handleDrop,
        startRename, commitRename, handleRenameKeyDown,
        handleContentSave,
    };
}

// ── Private util ──────────────────────────────────────────────────────────────
function uniqueId(sections: Section[]): string {
    const base = "new-section";
    const existing = sections.map((s) => s.id);
    let id = base, n = 2;
    while (existing.includes(id)) id = `${base}-${n++}`;
    return id;
}
