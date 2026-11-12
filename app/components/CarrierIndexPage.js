"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import { usePermissions } from "@/app/context/permissions";
import Breadcrumbs from "@/app/components/breadcrumbs";
import CarrierPicker, { DEFAULT_SECTION_CONFIG, EE_SECTION_CONFIG, EP_SECTION_CONFIG } from "@/app/components/CarrierPicker";
import CarrierMovePicker from "@/app/components/CarrierMovePicker";
import DragHandle from "@/app/components/ui/DragHandle";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import { upsertPageContent } from "@/app/lib/manageContent";
import { BatteryIcon } from "@/app/components/ui/icons/AnimatedIcons";


function parseCards(content) {
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return null;
}

function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function ArrowIcon() {
    return (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
}

function FolderIcon({ open }) {
    return open ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
    ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    );
}



function CardForm({ initial, onSave, onCancel, saveLabel = "Save", isFolder = false }) {
    const [draft, setDraft] = useState(initial);
    function set(k, v) { setDraft((d) => ({ ...d, [k]: v })); }
    const valid = draft.title.trim() && (isFolder || draft.href.trim());
    return (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-4 space-y-3">
            <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Title</label>
                <input className="w-full rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Card title" />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Description</label>
                <input className="w-full rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" value={draft.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Short description…" />
            </div>
            {!isFolder && (
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Link (href)</label>
                    <input className="w-full rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-sm font-mono outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" value={draft.href ?? ""} onChange={(e) => set("href", e.target.value)} placeholder="/dashboard/energy-carriers/…" />
                </div>
            )}
            <div className="flex gap-2 pt-1">
                <button onClick={() => valid && onSave(draft)} disabled={!valid} className="rounded-none bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40">{saveLabel}</button>
                <button onClick={onCancel} className="rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]">Cancel</button>
            </div>
        </div>
    );
}

function DynamicItemForm({ type, pathname, onSave, onCancel, saving }) {
    const [draft, setDraft] = useState({ title: "", desc: "" });
    function set(k, v) { setDraft((d) => ({ ...d, [k]: v })); }
    const slug = slugify(draft.title);
    const urlPreview = slug ? `${pathname}/${slug}` : null;
    const valid = draft.title.trim();
    const saveLabel = saving ? "Creating…" : (type === "carrier" ? "Create carrier" : "Create file");
    return (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white p-4 space-y-3">
            <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Title</label>
                <input
                    className="w-full rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                    value={draft.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder={type === "carrier" ? "Carrier name…" : "File title…"}
                    autoFocus
                />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">Description</label>
                <input
                    className="w-full rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                    value={draft.desc}
                    onChange={(e) => set("desc", e.target.value)}
                    placeholder="Short description…"
                />
            </div>
            {urlPreview && (
                <p className="text-[11px] text-[var(--color-ink-soft)]/70 font-mono bg-[var(--color-cream-2)] rounded-none px-3 py-1.5 truncate">
                    {urlPreview}
                </p>
            )}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={() => valid && !saving && onSave(draft)}
                    disabled={!valid || saving}
                    className="rounded-none bg-[var(--color-accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-40"
                >
                    {saveLabel}
                </button>
                <button onClick={onCancel} disabled={saving} className="rounded-none border border-[var(--color-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] disabled:opacity-40">Cancel</button>
            </div>
        </div>
    );
}

const CardDragHandle = () => <DragHandle className="h-3.5 w-3.5" />;

const COLS_CLASS = {
    1: "",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
};

function GridToggle({ value, onChange }) {
    const opts = [
        {
            n: 1,
            label: "1 column",
            icon: (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <rect x="2" y="2" width="12" height="3.5" rx="1" />
                    <rect x="2" y="6.25" width="12" height="3.5" rx="1" />
                    <rect x="2" y="10.5" width="12" height="3.5" rx="1" />
                </svg>
            ),
        },
        {
            n: 2,
            label: "2 columns",
            icon: (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <rect x="2" y="2" width="5.5" height="5.5" rx="1" />
                    <rect x="8.5" y="2" width="5.5" height="5.5" rx="1" />
                    <rect x="2" y="8.5" width="5.5" height="5.5" rx="1" />
                    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" />
                </svg>
            ),
        },
        {
            n: 3,
            label: "3 columns",
            icon: (
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                    <rect x="1" y="2" width="4" height="5.5" rx="1" />
                    <rect x="6" y="2" width="4" height="5.5" rx="1" />
                    <rect x="11" y="2" width="4" height="5.5" rx="1" />
                    <rect x="1" y="8.5" width="4" height="5.5" rx="1" />
                    <rect x="6" y="8.5" width="4" height="5.5" rx="1" />
                    <rect x="11" y="8.5" width="4" height="5.5" rx="1" />
                </svg>
            ),
        },
    ];
    return (
        <div className="flex items-center gap-0.5 rounded-none border border-[var(--color-hairline)] bg-white p-0.5">
            {opts.map(({ n, label, icon }) => (
                <button
                    key={n}
                    type="button"
                    title={label}
                    onClick={() => onChange(n)}
                    className={`rounded-none p-1.5 transition-colors ${
                        value === n
                            ? "bg-[var(--color-ink)] text-white"
                            : "text-[var(--color-ink-soft)]/70 hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink-soft)]"
                    }`}
                >
                    {icon}
                </button>
            ))}
        </div>
    );
}

/**
 * Reusable managed card-grid index page for any Energy Carriers sub-section.
 *
 * Props:
 *   pageSlug     – unique PageContent slug, e.g. "ec.renewable-energy.__cards__"
 *   defaultCards – [{id, href, title, desc, hidden?}]
 *   crumbs       – [{label, href?}] breadcrumb items
 *   label        – optional green eyebrow label above the h1
 *   title        – page h1
 *   description  – subtitle paragraph
 *   cols         – grid column count: 2 | 3 | 4  (default 3)
 */
export default function CarrierIndexPage({
    pageSlug,
    defaultCards,
    crumbs,
    label,
    title,
    description,
    cols = 3,
}) {
    const { isAdmin, canEdit } = usePermissions();
    // Accept both the full key (ec.foo.__cards__) and the short key (ec.foo) so
    // admins can grant permission via either format in the permissions editor.
    const canManage = isAdmin || canEdit(pageSlug) || canEdit(pageSlug.replace(/\.__cards__$/, ""));
    const pathname = usePathname();
    const pathKey = pathname.replace(/^\//, "").replace(/\//g, ".");

    const [activeCols, setActiveCols]             = useState(cols);

    // Shared per-section key so all carrier pages within the same section use the same grid
    const sectionColsKey = `grid-cols:${pathname.split("/")[2] ?? "section"}`;

    useEffect(() => {
        function restore() {
            const saved = localStorage.getItem(sectionColsKey);
            if (saved) setActiveCols(Number(saved));
        }
        restore();
    }, [sectionColsKey]);

    function handleColChange(n) {
        setActiveCols(n);
        localStorage.setItem(sectionColsKey, String(n));
    }

    const [cards, setCards]                       = useState(null);
    const [record, setRecord]                     = useState(null);
    const [loading, setLoading]                   = useState(true);
    const [editMode, setEditMode]                 = useState(false);
    const [saving, setSaving]                     = useState(false);
    const [editingIdx, setEditingIdx]             = useState(null);
    // "carrier" | "file" | "link" | null
    const [addType, setAddType]                   = useState(null);
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
    const [creatingNode, setCreatingNode]         = useState(false);
    const [movingIdx, setMovingIdx]               = useState(null);

    // Drag-to-reorder state (edit mode only)
    // dropTarget: { type:"swap", idx } | { type:"insert", afterIdx } | null
    const [dragIdx,      setDragIdx]      = useState(null);
    const [dropTarget,   setDropTarget]   = useState(null);
    const [draggableIdx, setDraggableIdx] = useState(null);

    function resetDrag() { setDragIdx(null); setDropTarget(null); setDraggableIdx(null); }

    function handleCardDragOver(e, idx) {
        if (dragIdx === null || dragIdx === idx) return;
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = (e.clientX - rect.left) / rect.width;
        if (fraction < 0.28) {
            setDropTarget({ type: "insert", afterIdx: idx - 1 });
        } else if (fraction > 0.72) {
            setDropTarget({ type: "insert", afterIdx: idx });
        } else {
            setDropTarget({ type: "swap", idx });
        }
    }

    function handleCardDrop(e) {
        e.preventDefault();
        if (dragIdx === null || dropTarget === null) { resetDrag(); return; }
        const next = [...(cards ?? [])];
        if (dropTarget.type === "swap") {
            if (dragIdx !== dropTarget.idx) [next[dragIdx], next[dropTarget.idx]] = [next[dropTarget.idx], next[dragIdx]];
        } else {
            const target = dropTarget.afterIdx + 1;
            if (target !== dragIdx && target !== dragIdx + 1) {
                const [moved] = next.splice(dragIdx, 1);
                next.splice(target > dragIdx ? target - 1 : target, 0, moved);
            }
        }
        persist(next);
        resetDrag();
    }

    // Folder-specific state
    const [expandedFolders, setExpandedFolders]   = useState(new Set());
    const [editingChild, setEditingChild]         = useState(null); // { fi, ci }
    const [addChildOpenIdx, setAddChildOpenIdx]   = useState(null); // folder index
    const [confirmDeleteChild, setConfirmDeleteChild] = useState(null); // { fi, ci }

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: pageSlug }, { authMode: "apiKey" });
                const item = res?.data?.[0] ?? null;
                if (!cancelled) { setRecord(item); setCards(parseCards(item?.content) ?? defaultCards); }
            } catch {
                if (!cancelled) setCards(defaultCards);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [pageSlug]);

    async function persist(updated) {
        setSaving(true);
        const content = JSON.stringify(updated);
        try {
            const saved = await upsertPageContent({
                slug: pageSlug,
                content,
                pageKeys: [pageSlug, pageSlug.replace(/\.__cards__$/, "")],
                historyLabel: `${pageSlug} — Cards`,
            });
            setRecord(saved ?? record);
            setCards(updated);
        } finally {
            setSaving(false);
        }
    }

    function handleToggleHide(idx) { persist(cards.map((c, i) => i === idx ? { ...c, hidden: !c.hidden } : c)); }
    function handleEdit(idx, draft) { persist(cards.map((c, i) => i === idx ? { ...c, ...draft } : c)); setEditingIdx(null); }
    function handleDelete(idx) { persist(cards.filter((_, i) => i !== idx)); setConfirmDeleteIdx(null); }

    function handleAdd(draft) {
        const id = slugify(draft.title);
        persist([...cards, { id, ...draft, hidden: false }]);
        setAddType(null);
    }

    async function handleCreateDynamic(draft, type) {
        setCreatingNode(true);
        try {
            const slug = slugify(draft.title);
            const itemPath = pathname + "/" + slug;
            const nodeConfigSlug = "dyn.node." + pathKey + "." + slug;
            // crumbs' last entry is this page itself, without an href (it's
            // the active crumb). Replace it with an href'd version instead
            // of appending, or it duplicates this page's label and leaves
            // the href-less copy in the middle of the trail.
            const childCrumbs = [
                ...(crumbs ?? []).slice(0, -1),
                { label: title, href: pathname },
                { label: draft.title },
            ];
            const nodeContent = JSON.stringify({ type, title: draft.title, desc: draft.desc, crumbs: childCrumbs });
            // Deleting a card only removes it from this index's card list -
            // the dyn.node config record for its slug is left behind (same
            // as the original app: the delete confirmation says as much).
            // Recreating a card with the same title reuses that slug, so
            // this must update the existing record instead of blindly
            // creating a second one with the same slug - a raw create()
            // here left two records under one slug, and pageContentBySlug
            // non-deterministically returned whichever (often the stale one).
            await upsertPageContent({
                slug: nodeConfigSlug,
                content: nodeContent,
                pageKeys: [pageSlug, pageSlug.replace(/\.__cards__$/, "")],
                historyLabel: `${nodeConfigSlug} — Node config`,
            });
            await persist([...cards, { id: slug, title: draft.title, desc: draft.desc, href: itemPath, hidden: false }]);
            setAddType(null);
        } catch (e) {
            console.error(e);
        } finally {
            setCreatingNode(false);
        }
    }

    // ── Child card handlers ───────────────────────────────────────────────────
    function updateFolder(fi, patch) {
        persist(cards.map((c, i) => i === fi ? { ...c, ...patch } : c));
    }

    function handleAddChild(fi, draft) {
        const id = slugify(draft.title);
        const children = [...(cards[fi].children ?? []), { id, ...draft, hidden: false }];
        updateFolder(fi, { children });
        setAddChildOpenIdx(null);
    }

    function handleEditChild(fi, ci, draft) {
        const children = (cards[fi].children ?? []).map((c, i) => i === ci ? { ...c, ...draft } : c);
        updateFolder(fi, { children });
        setEditingChild(null);
    }

    function handleDeleteChild(fi, ci) {
        const children = (cards[fi].children ?? []).filter((_, i) => i !== ci);
        updateFolder(fi, { children });
        setConfirmDeleteChild(null);
    }

    function handleToggleChildHide(fi, ci) {
        const children = (cards[fi].children ?? []).map((c, i) => i === ci ? { ...c, hidden: !c.hidden } : c);
        updateFolder(fi, { children });
    }

    function toggleFolder(id) {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }

    function toggleEdit() {
        setEditMode((v) => {
            if (v) { setEditingIdx(null); setAddType(null); setConfirmDeleteIdx(null); setEditingChild(null); setAddChildOpenIdx(null); setConfirmDeleteChild(null); setMovingIdx(null); resetDrag(); }
            return !v;
        });
    }

    const visible = cards ? (editMode ? cards : cards.filter((c) => !c.hidden)) : [];
    const colClass = COLS_CLASS[activeCols] ?? COLS_CLASS[cols] ?? COLS_CLASS[3];

    const sectionName = pathname.split("/")[2] ?? "";
    const PICKER_SECTION_CONFIGS = {
        "energy-carriers":   DEFAULT_SECTION_CONFIG,
        "energy-efficiency": EE_SECTION_CONFIG,
        "energy-planning":   EP_SECTION_CONFIG,
    };
    const pickerSectionConfig = PICKER_SECTION_CONFIGS[sectionName] ?? DEFAULT_SECTION_CONFIG;

    return (
        <div className="space-y-8">
            {confirmDeleteIdx !== null && (
                <ConfirmDialog
                    title={`Delete "${cards[confirmDeleteIdx]?.title}"?`}
                    message="This removes the card from this index page. The actual section pages are not affected."
                    confirmLabel="Delete"
                    onConfirm={() => handleDelete(confirmDeleteIdx)}
                    onCancel={() => setConfirmDeleteIdx(null)}
                />
            )}
            {confirmDeleteChild !== null && (
                <ConfirmDialog
                    title={`Delete "${cards[confirmDeleteChild.fi]?.children?.[confirmDeleteChild.ci]?.title}"?`}
                    message="This removes the card from this index page. The actual section pages are not affected."
                    confirmLabel="Delete"
                    onConfirm={() => handleDeleteChild(confirmDeleteChild.fi, confirmDeleteChild.ci)}
                    onCancel={() => setConfirmDeleteChild(null)}
                />
            )}

            <Breadcrumbs items={crumbs} />

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    {label && <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">{label}</p>}
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
                        <BatteryIcon className="hidden sm:block h-6 w-6 text-[var(--color-ink-soft)]/40" />
                    </div>
                    {description && <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{description}</p>}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                    <GridToggle value={activeCols} onChange={handleColChange} />
                    {canManage && (
                        <button
                            onClick={toggleEdit}
                            className={`inline-flex items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs font-medium transition-all ${
                                editMode
                                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                                    : "border-[var(--color-hairline)] bg-white text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink-soft)]"
                            }`}
                        >
                            {editMode ? (
                                <>
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Done editing
                                </>
                            ) : (
                                <>
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    Edit page
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {editMode && (
                <div className="rounded-none bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/25 px-4 py-2.5 text-xs text-[var(--color-accent)] font-medium">
                    Editing — changes save immediately. Hidden cards are invisible to non-admins.
                    {saving && <span className="ml-2 opacity-60">Saving…</span>}
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div className={`grid gap-4 ${colClass} animate-pulse`}>
                    {[...Array(Math.max(visible.length || 3, 3))].map((_, i) => (
                        <div key={i} className="h-28 rounded-none bg-[var(--color-cream-2)]" />
                    ))}
                </div>
            ) : (
                <>
                    <div className={`grid gap-4 ${colClass}`}>
                        {visible.map((card, idx) => {
                            if (editingIdx === idx) {
                                return (
                                    <CardForm
                                        key={card.id ?? idx}
                                        initial={{ title: card.title, desc: card.desc ?? "", href: card.href ?? "" }}
                                        isFolder={!!card.folder}
                                        onSave={(draft) => handleEdit(idx, draft)}
                                        onCancel={() => setEditingIdx(null)}
                                        saveLabel={saving ? "Saving…" : "Save"}
                                    />
                                );
                            }

                            // ── Folder card ──────────────────────────────────
                            if (card.folder) {
                                const isOpen = expandedFolders.has(card.id);
                                const children = card.children ?? [];
                                const visibleChildren = editMode ? children : children.filter((c) => !c.hidden);

                                return (
                                    <div
                                        key={card.id ?? idx}
                                        className={`col-span-full rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] transition-all ${card.hidden ? "opacity-40" : ""}`}
                                    >
                                        {/* Folder header */}
                                        <button
                                            type="button"
                                            onClick={() => !editMode && toggleFolder(card.id)}
                                            className={`w-full flex items-center gap-3 p-5 text-left ${!editMode ? "cursor-pointer hover:bg-[var(--color-cream-2)]/60 transition-colors" : "cursor-default"} rounded-none`}
                                        >
                                            <span className={`shrink-0 ${isOpen || editMode ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]/70"} transition-colors`}>
                                                <FolderIcon open={isOpen || editMode} />
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-sm font-semibold text-[var(--color-ink)]">{card.title}</h2>
                                                {card.desc && <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-ink-soft)]">{card.desc}</p>}
                                            </div>
                                            {!editMode && (
                                                <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
                                                    {isOpen ? "Close" : `Open (${visibleChildren.length})`}
                                                    <svg className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </span>
                                            )}
                                            {editMode && (
                                                <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={() => setEditingIdx(idx)} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">Edit</button>
                                                    <button onClick={() => handleToggleHide(idx)} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">{card.hidden ? "Show" : "Hide"}</button>
                                                    <button onClick={() => setConfirmDeleteIdx(idx)} className="rounded-none px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">Delete</button>
                                                </div>
                                            )}
                                        </button>

                                        {/* Children — visible when expanded (view) or always in edit mode */}
                                        {(isOpen || editMode) && (
                                            <div className="border-t border-[var(--color-hairline)] px-5 pb-5 pt-4">
                                                <div className={`grid gap-3 ${colClass}`}>
                                                    {visibleChildren.map((child, ci) => (
                                                        editingChild?.fi === idx && editingChild?.ci === ci ? (
                                                            <CardForm
                                                                key={child.id ?? ci}
                                                                initial={{ title: child.title, desc: child.desc ?? "", href: child.href ?? "" }}
                                                                onSave={(draft) => handleEditChild(idx, ci, draft)}
                                                                onCancel={() => setEditingChild(null)}
                                                                saveLabel={saving ? "Saving…" : "Save"}
                                                            />
                                                        ) : (
                                                            <div
                                                                key={child.id ?? ci}
                                                                className={`group relative flex flex-col rounded-none bg-[var(--color-cream-2)] border border-[var(--color-hairline)] transition-all ${
                                                                    child.hidden ? "opacity-40" : (!editMode ? "hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40" : "")
                                                                }`}
                                                            >
                                                                {!editMode && !child.hidden ? (
                                                                    <Link href={child.href} className="flex flex-col flex-1">
                                                                        <div className="flex-1 p-4">
                                                                            <h3 className="text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">{child.title}</h3>
                                                                            {child.desc && <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{child.desc}</p>}
                                                                        </div>
                                                                        <div className="flex items-center justify-end border-t border-[var(--color-hairline)] px-4 py-2">
                                                                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-accent)]">Open <ArrowIcon /></span>
                                                                        </div>
                                                                    </Link>
                                                                ) : (
                                                                    <div className="flex flex-col flex-1">
                                                                        <div className="flex-1 p-4">
                                                                            <h3 className="text-xs font-semibold text-[var(--color-ink)]">{child.title}</h3>
                                                                            {child.desc && <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">{child.desc}</p>}
                                                                        </div>
                                                                        {editMode && (
                                                                            <div className="flex items-center gap-1 border-t border-[var(--color-hairline)] px-3 py-1.5">
                                                                                <button onClick={() => setEditingChild({ fi: idx, ci })} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">Edit</button>
                                                                                <button onClick={() => handleToggleChildHide(idx, ci)} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">{child.hidden ? "Show" : "Hide"}</button>
                                                                                <button onClick={() => setConfirmDeleteChild({ fi: idx, ci })} className="ml-auto rounded-none px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">Delete</button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    ))}

                                                    {/* Add child button */}
                                                    {editMode && addChildOpenIdx !== idx && (
                                                        <button
                                                            onClick={() => setAddChildOpenIdx(idx)}
                                                            className="flex flex-col items-center justify-center gap-1.5 rounded-none border-2 border-dashed border-[var(--color-accent)]/25 p-4 text-[var(--color-accent)] hover:border-[var(--color-accent)]/70 hover:bg-[var(--color-accent-soft)] transition-colors min-h-20"
                                                        >
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                            </svg>
                                                            <span className="text-[11px] font-medium">Add card</span>
                                                        </button>
                                                    )}
                                                </div>

                                                {editMode && addChildOpenIdx === idx && (
                                                    <div className="mt-3">
                                                        <CardForm
                                                            initial={{ title: "", desc: "", href: "" }}
                                                            onSave={(draft) => handleAddChild(idx, draft)}
                                                            onCancel={() => setAddChildOpenIdx(null)}
                                                            saveLabel={saving ? "Saving…" : "Add card"}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // ── Regular card ─────────────────────────────────
                            const isSwapTarget  = editMode && dropTarget?.type === "swap"   && dropTarget?.idx === idx && dragIdx !== idx;
                            const isInsertBefore = editMode && dropTarget?.type === "insert" && dropTarget?.afterIdx === idx - 1;
                            const isInsertAfter  = editMode && dropTarget?.type === "insert" && dropTarget?.afterIdx === idx;
                            return (
                                <div
                                    key={card.id ?? idx}
                                    draggable={editMode && draggableIdx === idx}
                                    onDragStart={() => setDragIdx(idx)}
                                    onDragOver={(e) => handleCardDragOver(e, idx)}
                                    onDrop={handleCardDrop}
                                    onDragEnd={resetDrag}
                                    style={
                                        isInsertBefore ? { boxShadow: "-4px 0 0 0 #16a34a" } :
                                        isInsertAfter  ? { boxShadow:  "4px 0 0 0 #16a34a" } :
                                        undefined
                                    }
                                    className={`group relative flex flex-col rounded-none bg-white transition-all
                                        ${card.hidden ? "opacity-40" : (!editMode ? "hover:-translate-y-0.5" : "")}
                                        ${editMode && dragIdx === idx ? "opacity-40 scale-[0.98]" : ""}
                                        ${isSwapTarget ? "ring-2 ring-orange-400 border border-transparent" : "border border-[var(--color-hairline)]"}
                                    `}
                                >
                                    {/* Drag handle — visible in edit mode */}
                                    {editMode && (
                                        <div
                                            title="Drag to reorder"
                                            onMouseDown={() => setDraggableIdx(idx)}
                                            onMouseUp={() => setDraggableIdx(null)}
                                            className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing text-[var(--color-ink-soft)]/40 hover:text-[var(--color-ink-soft)]"
                                        >
                                            <CardDragHandle />
                                        </div>
                                    )}
                                    {!editMode && !card.hidden ? (
                                        <Link href={card.href} className="flex flex-col flex-1">
                                            <div className="flex-1 p-5">
                                                <h2 className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">{card.title}</h2>
                                                {card.desc && <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-soft)]">{card.desc}</p>}
                                            </div>
                                            <div className="flex items-center justify-end border-t border-[var(--color-hairline)] px-5 py-2.5">
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">Open <ArrowIcon /></span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col flex-1">
                                            <div className="flex-1 p-5">
                                                <h2 className="text-sm font-semibold text-[var(--color-ink)]">{card.title}</h2>
                                                {card.desc && <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-soft)]">{card.desc}</p>}
                                            </div>
                                            {editMode && (
                                                <div className="flex items-center gap-1 border-t border-[var(--color-hairline)] px-4 py-2">
                                                    <button onClick={() => setEditingIdx(idx)} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">Edit</button>
                                                    <button onClick={() => handleToggleHide(idx)} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">{card.hidden ? "Show" : "Hide"}</button>
                                                    <button onClick={() => setMovingIdx(idx)} className="rounded-none px-2 py-1 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-colors">Move</button>
                                                    <button onClick={() => setConfirmDeleteIdx(idx)} className="ml-auto rounded-none px-2 py-1 text-[11px] font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Add carrier / Add file / Add link buttons */}
                        {editMode && addType === null && (
                            <>
                                <button
                                    onClick={() => setAddType("carrier")}
                                    disabled={creatingNode}
                                    className="flex flex-col items-center justify-center gap-2 rounded-none border-2 border-dashed border-[var(--color-hairline)] p-6 text-[var(--color-ink-soft)]/70 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors min-h-28 disabled:opacity-40"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                                    </svg>
                                    <span className="text-xs font-medium">Add carrier</span>
                                </button>
                                <button
                                    onClick={() => setAddType("file")}
                                    disabled={creatingNode}
                                    className="flex flex-col items-center justify-center gap-2 rounded-none border-2 border-dashed border-[var(--color-hairline)] p-6 text-[var(--color-ink-soft)]/70 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors min-h-28 disabled:opacity-40"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    <span className="text-xs font-medium">Add file</span>
                                </button>
                                <button
                                    onClick={() => setAddType("link")}
                                    disabled={creatingNode}
                                    className="flex flex-col items-center justify-center gap-2 rounded-none border-2 border-dashed border-[var(--color-hairline)] p-6 text-[var(--color-ink-soft)]/70 hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] transition-colors min-h-28 disabled:opacity-40"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                    <span className="text-xs font-medium">Add link</span>
                                </button>
                            </>
                        )}
                    </div>

                    {editMode && (addType === "carrier" || addType === "file") && (
                        <DynamicItemForm
                            type={addType}
                            pathname={pathname}
                            onSave={(draft) => handleCreateDynamic(draft, addType)}
                            onCancel={() => setAddType(null)}
                            saving={creatingNode}
                        />
                    )}
                    {editMode && addType === "link" && (
                        <CarrierPicker
                            sectionConfig={pickerSectionConfig}
                            excludeHrefs={cards.map((c) => c.href).filter(Boolean)}
                            onSelect={(picked) => handleAdd({ title: picked.title, desc: picked.desc, href: picked.href })}
                            onCancel={() => setAddType(null)}
                            pageKeys={[pageSlug, pageSlug.replace(/\.__cards__$/, "")]}
                        />
                    )}
                    {movingIdx !== null && (
                        <CarrierMovePicker
                            card={cards[movingIdx]}
                            sectionConfig={pickerSectionConfig}
                            pageKeys={[pageSlug, pageSlug.replace(/\.__cards__$/, "")]}
                            onCancel={() => setMovingIdx(null)}
                            onMoved={() => {
                                persist(cards.filter((_, i) => i !== movingIdx));
                                setMovingIdx(null);
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
}
