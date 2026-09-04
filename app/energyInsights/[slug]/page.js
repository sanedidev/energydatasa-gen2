"use client";

import { use as usePromise, useEffect, useState } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import Image from "next/image";
import Breadcrumbs from "@/app/components/breadcrumbs";
import EditableSections from "@/app/components/EditableSections";
import { usePermissions } from "@/app/context/permissions";
import MediaLibrary from "@/app/components/MediaLibrary";
import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";

// ── Default sections ──────────────────────────────────────────────────────────
const DEFAULT_SECTIONS = [
    { id: "overview",     label: "Overview" },
    { id: "context",      label: "Context & Background" },
    { id: "analysis",     label: "Analysis" },
    { id: "key-data",     label: "Key Data" },
    { id: "implications", label: "Implications" },
];

const PLACEHOLDERS = {
    "overview":     "Summarise the key topic and why it matters for South Africa's energy landscape.",
    "context":      "Add background context — historical trends, policy environment, and relevant actors.",
    "analysis":     "Add detailed analysis, methodology notes, and interpretation of the evidence.",
    "key-data":     "Add the most important data points, figures, and statistics supporting the insight.",
    "implications": "Add what this means for policy, industry, households, or the energy transition.",
};


// ── Page ──────────────────────────────────────────────────────────────────────
export default function Page({ params }) {
    const { slug } = usePromise(params);
    const { isAdmin } = usePermissions();

    const [article,     setArticle]     = useState(null);
    const [loading,     setLoading]     = useState(true);
    const [editMode,    setEditMode]    = useState(false);

    // header editing - both requested flags are derived against editMode
    // below (not reset via effect) so turning edit mode off always closes
    // them, even if it was toggled off mid-edit.
    const [editingHeaderRequested, setEditingHeader] = useState(false);
    const [headerDraft,   setHeaderDraft]   = useState({ title: "", excerpt: "", imageKey: "" });
    const [savingHeader,  setSavingHeader]  = useState(false);
    const [headerSavedRequested, setHeaderSaved] = useState(false);
    const editingHeader = editMode && editingHeaderRequested;
    const headerSaved   = editMode && headerSavedRequested;

    // image media library
    const [mediaOpen, setMediaOpen] = useState(false);

    const currentSrc = useResolvedImageUrl(article?.imageKey);
    const draftSrc    = useResolvedImageUrl(headerDraft.imageKey);
    const editPreviewSrc = draftSrc ?? currentSrc;

    // ── Load article ──────────────────────────────────────────────────────────
    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await client.models.InsightArticle.insightArticleBySlug({ slug }, { authMode: "apiKey" });
                const item = res?.data?.[0] ?? null;
                if (!cancelled) setArticle(item);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [slug]);

    // ── Header save ───────────────────────────────────────────────────────────
    async function saveHeader() {
        if (!article?.id) return;
        setSavingHeader(true);
        try {
            await client.models.InsightArticle.update({
                id: article.id,
                title: headerDraft.title,
                excerpt: headerDraft.excerpt || "",
                imageKey: headerDraft.imageKey || "",
            });
            setArticle((p) => ({ ...p, title: headerDraft.title, excerpt: headerDraft.excerpt, imageKey: headerDraft.imageKey }));
            setEditingHeader(false);
            setHeaderSaved(true);
            setTimeout(() => setHeaderSaved(false), 2500);
        } catch (err) {
            console.error("Failed to save header", err);
        } finally {
            setSavingHeader(false);
        }
    }

    function handleImageSelect(key) {
        setMediaOpen(false);
        setHeaderDraft((d) => ({ ...d, imageKey: key }));
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-4 w-1/3 rounded-full bg-slate-100" />
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-100" />
                    <div className="space-y-2 flex-1">
                        <div className="h-6 w-1/2 rounded-full bg-slate-100" />
                        <div className="h-4 w-2/3 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>
        );
    }

    const title   = article?.title   ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const excerpt = article?.excerpt ?? null;

    return (
        <div className="space-y-8">
            {/* Master edit toggle */}
            {isAdmin && (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setEditMode((v) => !v)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                            editMode
                                ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                        {editMode ? (
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
                    {editMode && headerSaved && (
                        <span className="text-xs text-green-600 font-medium">Changes saved</span>
                    )}
                </div>
            )}

            {/* Edit mode banner */}
            {editMode && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-700">
                    Editing — changes are saved immediately when you click Save.
                </div>
            )}

            {/* Media library */}
            {mediaOpen && (
                <MediaLibrary
                    onSelect={handleImageSelect}
                    onClose={() => setMediaOpen(false)}
                />
            )}

            <Breadcrumbs items={[
                { label: "Home",            href: "/" },
                { label: "Energy Insights", href: "/energyInsights" },
                { label: title },
            ]} />

            {/* Header */}
            {editMode && editingHeader ? (
                <div className="flex items-start gap-5">
                    {/* Image edit */}
                    <div className="shrink-0">
                        <button
                            type="button"
                            onClick={() => setMediaOpen(true)}
                            className="group relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-dashed border-green-300 bg-slate-50 transition-all hover:border-green-400"
                            title="Change image"
                        >
                            {editPreviewSrc ? (
                                <Image
                                    src={editPreviewSrc}
                                    alt="cover"
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-300">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                <span className="text-[10px] font-semibold text-white">Change</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Insights</p>
                        <input
                            value={headerDraft.title}
                            onChange={(e) => setHeaderDraft((d) => ({ ...d, title: e.target.value }))}
                            className="w-full rounded-xl border border-green-200 bg-white px-3 py-1.5 text-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200"
                            placeholder="Article title"
                        />
                        <input
                            value={headerDraft.excerpt}
                            onChange={(e) => setHeaderDraft((d) => ({ ...d, excerpt: e.target.value }))}
                            className="w-full rounded-xl border border-green-200 bg-white px-3 py-1.5 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                            placeholder="Subtitle / description (optional)"
                        />
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={saveHeader}
                                disabled={savingHeader}
                                className="rounded-xl bg-green-700 px-4 py-1.5 text-xs font-medium text-white hover:bg-green-800 disabled:opacity-50"
                            >
                                {savingHeader ? "Saving…" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingHeader(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-5">
                    {/* Cover image */}
                    <div className={`shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm ${editMode ? "ring-2 ring-green-200" : ""}`}>
                        {currentSrc ? (
                            <Image src={currentSrc} alt={title} width={80} height={80} className="object-cover" unoptimized />
                        ) : (
                            <div className="h-20 w-20 flex items-center justify-center text-slate-300">
                                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Insights</p>
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                        {excerpt && <p className="mt-1 text-sm text-slate-500 max-w-2xl">{excerpt}</p>}
                        {editMode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setHeaderDraft({ title, excerpt: excerpt ?? "", imageKey: article?.imageKey ?? "" });
                                    setEditingHeader(true);
                                }}
                                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit title &amp; image
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Editable sections */}
            <EditableSections
                pageKey={`insight.${slug}`}
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
                editMode={editMode}
            />
        </div>
    );
}
