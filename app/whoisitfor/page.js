"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import { usePermissions } from "@/app/context/permissions";
import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";

const HIDDEN_SLUG = "whoisitfor.hidden";

function slugify(str) {
    return str.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function AudienceLogo({ logo, title }) {
    const src = useResolvedImageUrl(logo);
    if (!src) {
        return (
            <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
        );
    }
    return (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image src={src} alt={title} width={56} height={56} className="h-full w-full object-cover" unoptimized />
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
            if (hiddenRecord) {
                const { data } = await client.models.PageContent.update({ id: hiddenRecord.id, content });
                setHiddenRecord(data);
            } else {
                const { data } = await client.models.PageContent.create({ slug: HIDDEN_SLUG, content });
                setHiddenRecord(data);
            }
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
            const { data, errors } = await client.models.AudienceProfile.create({
                title, slug,
                subtitle: newSubtitle.trim() || "",
            });
            if (errors?.length) throw errors[0];
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
            await client.models.AudienceProfile.delete({ id });
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
                <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">← Home</Link>
            </div>
            <div className="mb-10 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-600">Audiences</p>
                    <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Audiences</h1>
                    <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                        Energy Data SA is built for a wide range of users—whether you&apos;re studying, planning, investing, or simply curious.
                    </p>
                </div>
                {canManage && (
                    <button
                        type="button"
                        onClick={() => { setManaging((v) => !v); setConfirmTarget(null); setCreateErr(""); }}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                            managing
                                ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                <form onSubmit={handleCreate} className="mb-10 rounded-2xl border border-dashed border-green-300 bg-green-50/40 p-6 space-y-4">
                    <p className="text-sm font-semibold text-slate-700">Create new audience</p>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Title <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="e.g. Industry & Investors"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Slug <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                value={newSlug}
                                onChange={(e) => { setNewSlug(e.target.value); setSlugEdited(true); }}
                                placeholder="url-slug"
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                            />
                            <p className="mt-1 text-xs text-slate-400">URL: /whoisitfor/<strong>{newSlug || "slug"}</strong></p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Subtitle <span className="text-slate-400">(optional)</span></label>
                            <input
                                type="text"
                                value={newSubtitle}
                                onChange={(e) => setNewSubtitle(e.target.value)}
                                placeholder="Short description…"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                            />
                        </div>
                    </div>
                    {createErr && <p className="text-xs text-red-500">{createErr}</p>}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={creating || !newTitle.trim() || !newSlug.trim()}
                            className="rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-800 disabled:opacity-50"
                        >
                            {creating ? "Creating…" : "Create & open"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setManaging(false); setNewTitle(""); setNewSlug(""); setNewSubtitle(""); setSlugEdited(false); setCreateErr(""); }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
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
                        <div key={i} className="rounded-2xl bg-slate-50 animate-pulse p-6 h-28" />
                    ))}
                </div>
            ) : audiences.length === 0 ? (
                <p className="text-sm text-slate-400">No audience profiles yet.</p>
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
                                            className="inline-flex h-7 items-center gap-1 rounded-lg bg-white/90 px-2 text-[11px] font-medium text-slate-500 shadow hover:bg-slate-100 hover:text-slate-800 transition-all"
                                        >
                                            {isHidden ? "Show" : "Hide"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmTarget({ id: a.id, title: a.title })}
                                            title="Delete audience"
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-400 shadow hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                <Link
                                    href={`/whoisitfor/${a.slug}`}
                                    className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <AudienceLogo logo={a.logo} title={a.title} />
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-green-700">
                                            {a.title}
                                        </h2>
                                        {a.subtitle && (
                                            <p className="mt-1 text-xs leading-relaxed text-slate-500">{a.subtitle}</p>
                                        )}
                                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-green-700">
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
