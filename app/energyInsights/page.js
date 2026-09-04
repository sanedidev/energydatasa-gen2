"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import MediaLibrary from "@/app/components/MediaLibrary";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import { usePermissions } from "@/app/context/permissions";
import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";

const HIDDEN_SLUG = "energyinsights.hidden";

function slugify(str) {
    return str.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function CoverImage({ imageKey, alt }) {
    const src = useResolvedImageUrl(imageKey);
    if (!src) return null;
    return (
        <div className="relative aspect-video overflow-hidden">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
            />
        </div>
    );
}

function NewArticleCoverPreview({ imageKey }) {
    const src = useResolvedImageUrl(imageKey);
    if (!src) return null;
    return <Image src={src} alt="cover" fill className="object-cover" sizes="80px" unoptimized />;
}

export default function EnergyInsightsIndex() {
    const router = useRouter();
    const { isAdmin, canEdit } = usePermissions();
    const canManage = isAdmin || canEdit("energyinsights.__index__") || canEdit("insight.*");
    // Hidden items are still shown (faded) to anyone who can manage this page
    const canSeeHidden = canManage;
    const [articles, setArticles] = useState([]);
    const [loading,  setLoading]  = useState(true);

    // manage mode (toggles add form + delete buttons)
    const [managing,   setManaging]   = useState(false);

    // new article form
    const [newTitle,    setNewTitle]    = useState("");
    const [newExcerpt,  setNewExcerpt]  = useState("");
    const [newSlug,     setNewSlug]     = useState("");
    const [newImageKey, setNewImageKey] = useState("");
    const [slugEdited,  setSlugEdited]  = useState(false);
    const [creating,    setCreating]    = useState(false);
    const [createErr,   setCreateErr]   = useState("");
    const [createMediaOpen, setCreateMediaOpen] = useState(false);

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
                const [articlesRes, hiddenRes] = await Promise.all([
                    client.models.InsightArticle.list({ authMode: "apiKey" }),
                    client.models.PageContent.pageContentBySlug({ slug: HIDDEN_SLUG }, { authMode: "apiKey" }),
                ]);
                const items = articlesRes?.data ?? [];
                const hiddenItem = hiddenRes?.data?.[0] ?? null;
                if (!cancelled) {
                    setArticles(items.filter(Boolean));
                    setHiddenRecord(hiddenItem);
                    try { setHiddenIds(new Set(JSON.parse(hiddenItem?.content ?? "[]"))); } catch {}
                }
            } catch (err) {
                console.error("Failed to load insights", err);
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
            const { data, errors } = await client.models.InsightArticle.create({
                title, slug,
                excerpt: newExcerpt.trim() || "",
                body: "",
                imageKey: newImageKey || "",
                publishedAt: new Date().toISOString().split("T")[0],
            });
            if (errors?.length) throw errors[0];
            if (data) {
                router.push(`/energyInsights/${data.slug}`);
            } else {
                throw new Error("No data returned");
            }
        } catch (err) {
            const msg = err?.message || err?.errorMessage || "";
            const isDuplicate = msg.toLowerCase().includes("conditional") || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already");
            setCreateErr(isDuplicate ? "That slug is already taken — choose a different one." : "Failed to create article. Please try again.");
            setCreating(false);
        }
    }

    async function handleDelete() {
        if (!confirmTarget) return;
        const { id } = confirmTarget;
        setDeletingId(id);
        try {
            await client.models.InsightArticle.delete({ id });
            setArticles((prev) => prev.filter((a) => a.id !== id));
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
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-600">Latest</p>
                    <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Energy Insights &amp; Updates</h1>
                    <p className="mt-2 text-sm text-slate-500 max-w-2xl">In-depth analysis and updates on South Africa&apos;s energy landscape.</p>
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

            {/* Media library for new article image */}
            {createMediaOpen && (
                <MediaLibrary
                    onSelect={(key) => { setNewImageKey(key); setCreateMediaOpen(false); }}
                    onClose={() => setCreateMediaOpen(false)}
                />
            )}

            {/* New article form */}
            {canManage && managing && (
                <form onSubmit={handleCreate} className="mb-10 rounded-2xl border border-dashed border-green-300 bg-green-50/40 p-6 space-y-4">
                    <p className="text-sm font-semibold text-slate-700">Create new article</p>
                    <div className="flex gap-4 items-start">
                        {/* Cover image picker */}
                        <div className="shrink-0">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Cover image</label>
                            <button
                                type="button"
                                onClick={() => setCreateMediaOpen(true)}
                                className="group relative h-20 w-20 overflow-hidden rounded-xl border-2 border-dashed border-green-300 bg-white transition-all hover:border-green-400"
                                title="Choose cover image"
                            >
                                {newImageKey ? (
                                    <NewArticleCoverPreview imageKey={newImageKey} />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-300">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                                        </svg>
                                        <span className="text-[10px]">Add</span>
                                    </div>
                                )}
                                {newImageKey && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-semibold text-white">Change</span>
                                    </div>
                                )}
                            </button>
                            {newImageKey && (
                                <button type="button" onClick={() => setNewImageKey("")} className="mt-1 text-[11px] text-slate-400 hover:text-red-500 transition-colors w-full text-center">Remove</button>
                            )}
                        </div>

                        {/* Text fields */}
                        <div className="flex-1 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Title <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Article title…"
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
                                <p className="mt-1 text-xs text-slate-400">URL: /energyInsights/<strong>{newSlug || "slug"}</strong></p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Excerpt <span className="text-slate-400">(optional)</span></label>
                                <textarea
                                    value={newExcerpt}
                                    onChange={(e) => setNewExcerpt(e.target.value)}
                                    placeholder="Short description shown on the index page…"
                                    rows={2}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none"
                                />
                            </div>
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
                            onClick={() => { setManaging(false); setNewTitle(""); setNewSlug(""); setNewExcerpt(""); setNewImageKey(""); setSlugEdited(false); setCreateErr(""); }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {confirmTarget && (
                <ConfirmDialog
                    title="Delete article?"
                    message={`Are you sure you would like to delete "${confirmTarget.title}"? This cannot be undone.`}
                    confirmLabel={deletingId ? "Deleting…" : "Yes, delete"}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmTarget(null)}
                />
            )}

            {/* Articles grid */}
            {loading ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl bg-slate-50 animate-pulse overflow-hidden">
                            <div className="aspect-video bg-slate-100" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 w-3/4 rounded-full bg-slate-100" />
                                <div className="h-3 w-full rounded-full bg-slate-100" />
                                <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : articles.length === 0 ? (
                <p className="text-sm text-slate-400">No articles yet.</p>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {articles
                        .filter((a) => canSeeHidden || !hiddenIds.has(a.id))
                        .map((article) => {
                        const isHidden = hiddenIds.has(article.id);
                        return (
                            <article
                                key={article.id}
                                className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md ${isHidden ? "opacity-40" : ""}`}
                            >
                                {/* Admin controls — only visible in manage mode */}
                                {canManage && managing && (
                                    <div className="absolute top-2 right-2 z-10 flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleHide(article.id)}
                                            title={isHidden ? "Show article" : "Hide article"}
                                            className="inline-flex h-7 items-center gap-1 rounded-lg bg-white/90 px-2 text-[11px] font-medium text-slate-500 shadow hover:bg-slate-100 hover:text-slate-800 transition-all"
                                        >
                                            {isHidden ? "Show" : "Hide"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmTarget({ id: article.id, title: article.title })}
                                            title="Delete article"
                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-400 shadow hover:bg-red-50 hover:text-red-500 transition-all"
                                        >
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {article.imageKey && (
                                    <Link href={`/energyInsights/${article.slug}`} className="block overflow-hidden">
                                        <CoverImage imageKey={article.imageKey} alt={article.title} />
                                    </Link>
                                )}
                                <div className="flex flex-1 flex-col p-6">
                                    <Link href={`/energyInsights/${article.slug}`}>
                                        <h2 className="text-base font-semibold leading-snug text-slate-900 transition-colors hover:text-green-700">
                                            {article.title}
                                        </h2>
                                    </Link>
                                    {article.excerpt && (
                                        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
                                    )}
                                    <Link
                                        href={`/energyInsights/${article.slug}`}
                                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                                    >
                                        Read more
                                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </article>
                        );
                    })
                    }
                </div>
            )}
        </div>
    );
}
