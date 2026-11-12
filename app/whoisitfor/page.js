"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import { upsertPageContent, createContentRecord, deleteContentRecord } from "@/app/lib/manageContent";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import { usePermissions } from "@/app/context/permissions";
import MediaFill from "@/app/components/ui/MediaFill";
import { RippleIcon } from "@/app/components/ui/icons/AnimatedIcons";

const HIDDEN_SLUG = "whoisitfor.hidden";
const WHOISITFOR_PAGE_KEYS = ["whoisitfor.__index__", "audience.*"];

function slugify(str) {
    return str.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const DEFAULT_LOGO_FALLBACK = (
    <div className="flex h-full w-full items-center justify-center text-[var(--color-ink-soft)]/40">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    </div>
);

function AudienceLogo({ logo, title }) {
    return (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-none bg-[var(--color-cream-2)]">
            <MediaFill value={logo} alt={title} fallback={DEFAULT_LOGO_FALLBACK} />
        </div>
    );
}

export default function WhoIsItForIndex() {
    const router = useRouter();
    const { isAdmin, canEdit } = usePermissions();
    const canManage = isAdmin || canEdit("whoisitfor.__index__") || canEdit("audience.*");
    const canSeeHidden = canManage;
    const [audiences, setAudiences] = useState([]);
    const [loading, setLoading] = useState(true);

    // manage mode (toggles add form + delete buttons)
    const [managing,    setManaging]    = useState(false);

    // new audience form
    const [newTitle,    setNewTitle]    = useState("");
    const [newSubtitle, setNewSubtitle] = useState("");
    const [newSlug,     setNewSlug]     = useState("");
    const [slugEdited,  setSlugEdited]  = useState(false);
    const [creating,    setCreating]    = useState(false);
    const [createErr,   setCreateErr]   = useState("");

    // delete state
    const [deletingId,    setDeletingId]    = useState(null);
    const [confirmTarget, setConfirmTarget] = useState(null); // { id, title }

    // hidden IDs
    const [hiddenIds,    setHiddenIds]    = useState(new Set());
    const [hiddenRecord, setHiddenRecord] = useState(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const [audiencesRes, hiddenRes] = await Promise.all([
                    client.models.AudienceProfile.list({ authMode: "apiKey" }),
                    client.models.PageContent.pageContentBySlug({ slug: HIDDEN_SLUG }, { authMode: "apiKey" }),
                ]);
                const items = audiencesRes?.data ?? [];
                const hiddenItem = hiddenRes?.data?.[0] ?? null;
                if (!cancelled) {
                    setAudiences(items.filter(Boolean));
                    setHiddenRecord(hiddenItem);
                    try { setHiddenIds(new Set(JSON.parse(hiddenItem?.content ?? "[]"))); } catch {}
                }
            } catch (err) {
                console.error("Failed to load audiences", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    async function handleToggleHide(id) {
        const next = new Set(hiddenIds);
        next.has(id) ? next.delete(id) : next.add(id);
        const content = JSON.stringify([...next]);
        try {
            const saved = await upsertPageContent({ slug: HIDDEN_SLUG, content, pageKeys: WHOISITFOR_PAGE_KEYS, historyLabel: "Who is it for — Hidden" });
            setHiddenRecord(saved ?? hiddenRecord);
            setHiddenIds(next);
        } catch (err) {
            console.error("Failed to update hidden state", err);
        }
    }

    function handleTitleChange(val) {
        setNewTitle(val);
        if (!slugEdited) setNewSlug(slugify(val));
    }

    async function handleCreate(e) {
        e.preventDefault();
        const title = newTitle.trim();
        const slug  = newSlug.trim();
        if (!title || !slug) return;
        setCreating(true); setCreateErr("");
        try {
            const data = await createContentRecord({
                model: "AudienceProfile",
                data: { title, slug, subtitle: newSubtitle.trim() || "" },
                pageKeys: WHOISITFOR_PAGE_KEYS,
                historyLabel: `Audience — ${title}`,
            });
            if (data) router.push(`/whoisitfor/${data.slug}`);
        } catch (err) {
            console.error(err);
            setCreateErr("Failed to create. Slug may already be taken.");
            setCreating(false);
        }
    }

    async function handleDelete() {
        if (!confirmTarget) return;
        const { id } = confirmTarget;
        setDeletingId(id);
        try {
            await deleteContentRecord({ model: "AudienceProfile", id, pageKeys: WHOISITFOR_PAGE_KEYS, historyLabel: "Audience — delete" });
            setAudiences((prev) => prev.filter((a) => a.id !== id));
            setConfirmTarget(null);
        } catch (err) {
            console.error("Failed to delete", err);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-2">
                <Link href="/" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">← Home</Link>
            </div>
            <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[var(--color-ink)] md:text-3xl">Audiences</h1>
                        <RippleIcon className="hidden sm:block h-6 w-6 text-[var(--color-ink-soft)]/50" />
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-2xl">
                        Energy Data SA is built for a wide range of users—whether you&apos;re studying, planning, investing, or simply curious.
                    </p>
                </div>
                {canManage && (
                    <button
                        type="button"
                        onClick={() => { setManaging((v) => !v); setConfirmTarget(null); setCreateErr(""); }}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-none border px-4 py-2 text-sm font-medium transition-all ${
                            managing
                                ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                                : "border-[var(--color-hairline)] bg-white text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]"
                        }`}
                    >
                        {managing ? (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Done
                            </>
                        ) : (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add / Delete
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* New audience form */}
            {canManage && managing && (
                <form onSubmit={handleCreate} className="mb-10 rounded-none border border-dashed border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]/40 p-6 space-y-4">
                    <p className="text-sm font-semibold text-[var(--color-ink-soft)]">Create new audience</p>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-ink-soft)] mb-1">Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="e.g. Industry & Investors"
                                required
                                className="w-full rounded-none border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]/70"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-ink-soft)] mb-1">Slug <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={newSlug}
                                onChange={(e) => { setNewSlug(e.target.value); setSlugEdited(true); }}
                                placeholder="url-slug"
                                required
                                className="w-full rounded-none border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm font-mono text-[var(--color-ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]/70"
                            />
                            <p className="mt-1 text-xs text-[var(--color-ink-soft)]/70">URL: /whoisitfor/<strong>{newSlug || "slug"}</strong></p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-ink-soft)] mb-1">Subtitle <span className="text-[var(--color-ink-soft)]/70">(optional)</span></label>
                            <input
                                type="text"
                                value={newSubtitle}
                                onChange={(e) => setNewSubtitle(e.target.value)}
                                placeholder="Short description…"
                                className="w-full rounded-none border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]/70"
                            />
                        </div>
                    </div>
                    {createErr && <p className="text-xs text-red-500">{createErr}</p>}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={creating || !newTitle.trim() || !newSlug.trim()}
                            className="rounded-none bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
                        >
                            {creating ? "Creating…" : "Create & open"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setManaging(false); setNewTitle(""); setNewSlug(""); setNewSubtitle(""); setSlugEdited(false); setCreateErr(""); }}
                            className="rounded-none border border-[var(--color-hairline)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-all hover:bg-[var(--color-cream-2)]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {confirmTarget && (
                <ConfirmDialog
                    title="Delete audience?"
                    message={`Are you sure you would like to delete "${confirmTarget.title}"? This cannot be undone.`}
                    confirmLabel={deletingId ? "Deleting…" : "Yes, delete"}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmTarget(null)}
                />
            )}

            {/* Audience grid */}
            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-none bg-[var(--color-cream-2)] animate-pulse p-6 h-28" />
                    ))}
                </div>
            ) : audiences.length === 0 ? (
                <p className="text-sm text-[var(--color-ink-soft)]/70">No audience profiles yet.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {audiences
                        .filter((a) => canSeeHidden || !hiddenIds.has(a.id))
                        .map((a) => {
                        const isHidden = hiddenIds.has(a.id);
                        return (
                            <div key={a.id} className={`group relative ${isHidden ? "opacity-40" : ""}`}>
                                {/* Admin controls — only visible in manage mode */}
                                {canManage && managing && (
                                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleHide(a.id)}
                                            title={isHidden ? "Show audience" : "Hide audience"}
                                            className="inline-flex h-7 items-center gap-1 rounded-none bg-white/90 px-2 text-[11px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)] transition-all"
                                        >
                                            {isHidden ? "Show" : "Hide"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmTarget({ id: a.id, title: a.title })}
                                            title="Delete audience"
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-none bg-white/90 text-[var(--color-ink-soft)]/70 hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <Link
                                    href={`/whoisitfor/${a.slug}`}
                                    className="flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-6 border border-[var(--color-hairline)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40"
                                >
                                    <AudienceLogo logo={a.logo} title={a.title} />
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                                            {a.title}
                                        </h2>
                                        {a.subtitle && (
                                            <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-soft)]">{a.subtitle}</p>
                                        )}
                                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
                                            Explore
                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
