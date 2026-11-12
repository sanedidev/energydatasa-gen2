"use client";

import { use as usePromise, useEffect, useState } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { updateContentRecord } from "@/app/lib/manageContent";
import Breadcrumbs from "@/app/components/breadcrumbs";
import EditableSections from "@/app/components/EditableSections";
import { usePermissions } from "@/app/context/permissions";
import MediaLibrary from "@/app/components/MediaLibrary";
import MediaFill from "@/app/components/ui/MediaFill";

const DEFAULT_SECTIONS = [
    { id: "overview",         label: "Overview" },
    { id: "use-cases",        label: "Use Cases" },
    { id: "datasets",         label: "Relevant Datasets" },
    { id: "tools",            label: "Tools & Applications" },
    { id: "insights",         label: "Insights & Analysis" },
    { id: "getting-started",  label: "Getting Started" },
];

const PLACEHOLDERS = {
    "overview":        "Describe who this audience is and why Energy Data SA is relevant to them.",
    "use-cases":       "Add specific ways this audience uses the platform.",
    "datasets":        "List the most relevant datasets for this audience.",
    "tools":           "Add tools, apps, or dashboards most useful to this audience.",
    "insights":        "Add links to energy insights articles relevant to this audience.",
    "getting-started": "Add a short guide for this audience — where to start, what to explore first.",
};


export default function Page({ params }) {
    const { slug } = usePromise(params);
    const { isAdmin } = usePermissions();

    const [profile,      setProfile]      = useState(null);
    const [loading,      setLoading]      = useState(true);
    const [editMode,     setEditMode]     = useState(false);

    // header editing - both requested flags are derived against editMode
    // below (not reset via effect) so turning edit mode off always closes
    // them, even if it was toggled off mid-edit.
    const [editingHeaderRequested, setEditingHeader] = useState(false);
    const [headerDraft,   setHeaderDraft]   = useState({ title: "", subtitle: "", logo: "" });
    const [savingHeader,  setSavingHeader]  = useState(false);
    const [headerSavedRequested, setHeaderSaved] = useState(false);
    const editingHeader = editMode && editingHeaderRequested;
    const headerSaved   = editMode && headerSavedRequested;

    // logo media library
    const [mediaOpen, setMediaOpen] = useState(false);

    const editPreviewLogo = headerDraft.logo || profile?.logo || "";

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        async function load() {
            setLoading(true);
            try {
                const res = await client.models.AudienceProfile.audienceProfileBySlug({ slug }, { authMode: "apiKey" });
                const item = res?.data?.[0] ?? null;
                if (!cancelled) setProfile(item);
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [slug]);

    async function saveHeader() {
        if (!profile?.id) return;
        setSavingHeader(true);
        try {
            await updateContentRecord({
                model: "AudienceProfile",
                id: profile.id,
                data: { title: headerDraft.title, subtitle: headerDraft.subtitle || "", logo: headerDraft.logo || "" },
                pageKeys: ["whoisitfor.__index__", "audience.*", `audience.${slug}`],
                historyLabel: `Audience — ${headerDraft.title} header`,
            });
            setProfile((p) => ({ ...p, title: headerDraft.title, subtitle: headerDraft.subtitle, logo: headerDraft.logo }));
            setEditingHeader(false);
            setHeaderSaved(true);
            setTimeout(() => setHeaderSaved(false), 2500);
        } catch (err) {
            console.error("Failed to save header", err);
        } finally {
            setSavingHeader(false);
        }
    }

    function handleLogoSelect(key) {
        setMediaOpen(false);
        setHeaderDraft((d) => ({ ...d, logo: key }));
    }

    // ── Loading ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-4 w-1/3 rounded-full bg-[var(--color-cream-2)]" />
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-none bg-[var(--color-cream-2)]" />
                    <div className="space-y-2 flex-1">
                        <div className="h-6 w-1/2 rounded-full bg-[var(--color-cream-2)]" />
                        <div className="h-4 w-2/3 rounded-full bg-[var(--color-cream-2)]" />
                    </div>
                </div>
            </div>
        );
    }

    const title    = profile?.title    ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const subtitle = profile?.subtitle ?? null;

    return (
        <div className="space-y-8">
            {/* Master edit toggle */}
            {isAdmin && (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <button
                        type="button"
                        onClick={() => setEditMode((v) => !v)}
                        className={`inline-flex items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs font-medium transition-all ${
                            editMode
                                ? "border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                                : "border-[var(--color-hairline)] bg-white text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]"
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
                        <span className="text-xs text-[var(--color-accent)] font-medium">Changes saved</span>
                    )}
                </div>
            )}

            {/* Edit mode banner */}
            {editMode && (
                <div className="rounded-none bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 px-4 py-2.5 text-xs text-[var(--color-accent)]">
                    Editing — changes are saved immediately when you click Save.
                </div>
            )}

            {/* Media library */}
            {mediaOpen && (
                <MediaLibrary
                    onSelect={handleLogoSelect}
                    onClose={() => setMediaOpen(false)}
                />
            )}

            <Breadcrumbs items={[
                { label: "Home",      href: "/" },
                { label: "Audiences", href: "/whoisitfor" },
                { label: title },
            ]} />

            {/* Header */}
            {editMode && editingHeader ? (
                <div className="flex items-start gap-5">
                    {/* Logo edit */}
                    <div className="shrink-0">
                        <button
                            type="button"
                            onClick={() => setMediaOpen(true)}
                            className="group relative h-20 w-20 overflow-hidden rounded-none border-2 border-dashed border-[var(--color-accent)]/40 bg-[var(--color-cream-2)] transition-all hover:border-[var(--color-accent)]/70"
                            title="Change image"
                        >
                            <MediaFill value={editPreviewLogo} alt="logo" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-none">
                                <span className="text-[10px] font-semibold text-white">Change</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Audiences</p>
                        <input
                            value={headerDraft.title}
                            onChange={(e) => setHeaderDraft((d) => ({ ...d, title: e.target.value }))}
                            className="w-full rounded-none border border-[var(--color-accent)]/30 bg-white px-3 py-1.5 text-2xl font-bold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                            placeholder="Title"
                        />
                        <input
                            value={headerDraft.subtitle}
                            onChange={(e) => setHeaderDraft((d) => ({ ...d, subtitle: e.target.value }))}
                            className="w-full rounded-none border border-[var(--color-accent)]/30 bg-white px-3 py-1.5 text-sm text-[var(--color-ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                            placeholder="Subtitle (optional)"
                        />
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={saveHeader}
                                disabled={savingHeader}
                                className="rounded-none bg-[var(--color-accent)] px-4 py-1.5 text-xs font-medium text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50"
                            >
                                {savingHeader ? "Saving…" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingHeader(false)}
                                className="rounded-none border border-[var(--color-hairline)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-5">
                    {/* Logo */}
                    <div className={`h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-cream-2)] ${editMode ? "ring-2 ring-[var(--color-accent)]/30" : ""}`}>
                        <MediaFill value={profile?.logo} alt={title} />
                    </div>
                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Audiences</p>
                        <h1 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
                        {subtitle && <p className="mt-1 text-sm text-[var(--color-ink-soft)] max-w-2xl">{subtitle}</p>}
                        {editMode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setHeaderDraft({ title, subtitle: subtitle ?? "", logo: profile?.logo ?? "" });
                                    setEditingHeader(true);
                                }}
                                className="mt-2 inline-flex items-center gap-1 rounded-none border border-[var(--color-hairline)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] transition-colors"
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
                pageKey={`audience.${slug}`}
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
                editMode={editMode}
            />
        </div>
    );
}
