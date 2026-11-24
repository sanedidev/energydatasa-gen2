"use client";

import { use as usePromise, useEffect, useState } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { updateContentRecord } from "@/app/lib/manageContent";
import Breadcrumbs from "@/app/components/breadcrumbs";
import EditableSections from "@/app/components/EditableSections";
import { usePermissions } from "@/app/context/permissions";
import MediaLibrary from "@/app/components/MediaLibrary";
import MediaFill from "@/app/components/ui/MediaFill";

// ── Default sections ──────────────────────────────────────────────────────────
const DEFAULT_SECTIONS = [
    { id: "overview",     label: "Overview" },
    { id: "context",      label: "Context & Background" },
    { id: "analysis",     label: "Analysis" },
    { id: "key-data",     label: "Key Data" },
    { id: "implications", label: "Implications" },
    { id: "sources",      label: "Sources & References" },
];

const PLACEHOLDERS = {
    "overview":     "Summarise the key topic and why it matters for South Africa's energy landscape.",
    "context":      "Add background context — historical trends, policy environment, and relevant actors.",
    "analysis":     "Add detailed analysis, methodology notes, and interpretation of the evidence.",
    "key-data":     "Add the most important data points, figures, and statistics supporting the insight.",
    "implications": "Add what this means for policy, industry, households, or the energy transition.",
    "sources":      "Add the sources this article draws on, with links where available.",
};

// ── Per-article content ─────────────────────────────────────────────────────
// Real, sourced content for the 3 articles that exist today. The
// `irp-impact-households` and `municipal-energy-losses` slugs were
// repurposed onto different, deliberately non-critical topics (Eskom's
// generation recovery, and renewable capacity growth) at the site owner's
// request — the site's audience includes Eskom and government readers, and
// stories framed around a regulator's error or worsening utility losses,
// while factually accurate, weren't the right tone for this platform.
// `rooftop-solar-gauteng-2025` still carries a caveat about its original
// headline's unverifiable statistic, replaced with the real sourced trend.
const CONTENT_BY_SLUG = {
    "rooftop-solar-gauteng-2025": {
        overview: [
            { type: "title", title: "A caveat on the headline, then the real numbers" },
            { type: "text", content: "This article's original headline cited an 18% rooftop-solar growth figure specific to Gauteng in 2025. No source for that specific, province-and-technology-specific number could be confirmed during this research pass, so it should not be treated as fact. What follows instead is the real, sourced national picture of small-scale and embedded generation growth — which is itself a genuinely large and well-documented increase, just not the exact figure in the original headline.", bg: "amber" },
            "South Africa's registered small-scale and embedded generation capacity has grown sharply since 2023. NERSA (the National Energy Regulator) registered **597 generation facilities totalling 7.46 GW** in 2025 alone — worth an estimated **R158 billion** in investment — up from **476 facilities and 4.16 GW** in 2024. That's national data across all registration categories, not a Gauteng-only or rooftop-only figure, but it's the real trend behind the story this article originally tried to tell.",
        ],
        context: [
            "Years of load shedding through 2023–2024 pushed many households, farms, and businesses to install their own generation — mostly rooftop solar PV, often paired with batteries — as backup against outages. Since Eskom's generation recovery took hold (see Key Data below), the driver has shifted: with load shedding largely over, new registrations are increasingly motivated by **avoiding rising electricity costs** rather than blackout protection.\n\nNERSA tightened the registration rules in February 2026: systems of 100 kW or less with a grid connection register with the local distributor (Eskom or the relevant municipality); larger grid-tied systems register directly with NERSA; off-grid systems are exempt entirely.",
        ],
        analysis: [
            "The most recent quarterly data (July–September 2026, NERSA's Q2 of FY2026/27) shows **144 new generation facilities registered, totalling 3,129 MW** — a single quarter bigger than the whole of 2024. Of those, 68 connected to municipal distribution networks (adding a combined 50 MW) and the remaining facilities connected to Eskom's network (adding roughly 3,079 MW).\n\nThat scale and connection pattern is an important nuance against a \"rooftop solar\" framing: most of the recently registered capacity looks like utility- or commercial-scale projects registering through NERSA's larger-system pathway, not small residential rooftop systems going through municipal/Eskom small-scale registration. NERSA itself has also cautioned that **registered capacity is not the same as built capacity** — it has said it lacks the systems to track how many registered projects have actually been completed and connected.",
        ],
        "key-data": [
            "- **2025 (full year):** 597 facilities registered, 7.46 GW, ~R158 billion in investment\n- **2024 (full year):** 476 facilities registered, 4.16 GW\n- **H1 2026 (Jan–Jun):** 236 facilities, 2.13 GW\n- **Q4 FY2025/26 (Jan–Mar 2026):** 112 facilities, 1,327 MW\n- **Q1 FY2026/27 (Apr–Jun 2026):** 124 facilities, 804 MW (63 municipal-connected, 47 MW; 61 Eskom-connected, 757 MW)\n- **Q2 FY2026/27 (Jul–Sep 2026):** 144 facilities, 3,129 MW (68 municipal-connected, 50 MW; remainder Eskom-connected)",
        ],
        implications: [
            "For households, growing self-generation capacity alongside NERSA's approved 2026/27 tariff hikes (8.76% for Eskom direct customers, 9.01% for municipal customers — see the companion article on IRP 2025 and tariffs) makes the economics of solar more attractive even now that blackout risk has receded. For the grid, the scale of recent registrations — combined with the Presidency's figures citing close to 16 GW of installed renewable capacity nationally and roughly 32 GW more in the grid-connection queue — reinforces that **transmission and grid-connection capacity, not generation itself, is now the binding constraint** on South Africa's renewable build-out.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "This article could not independently verify the original \"18% rooftop solar growth in Gauteng\" claim; it is not repeated as fact above. The figures used instead are drawn from NERSA's own published registration data.",
            "1. Engineering News, [NERSA clarifies regulatory requirements for small-scale embedded generation registrations](https://www.engineeringnews.co.za/article/nersa-clarifies-regulatory-requirements-for-small-scale-embedded-generation-registrations-2026-02-02) (2 February 2026).\n2. Mining Weekly, [NERSA confirms 2,692 generator registrations](https://www.miningweekly.com/article/nersa-confirms-2-692-generator-registrations-2026-09-11) (11 September 2026).\n3. Engineering News, [Approval of further 124 generation facilities supports transition to renewables-based electricity sector – NERSA](https://www.engineeringnews.co.za/article/approval-of-further-124-generation-facilities-supports-transition-to-renewable-based-electricity-sector-nersa-2026-08-20) (20 August 2026).\n4. Engineering News, [NERSA registered 144 generation facilities in the September quarter](https://engineeringnews.co.za/article/nersa-registered-144-generation-facilities-in-the-september-quarter-2026-11-06) (6 November 2026).\n5. EWN, [NERSA registered 144 new electricity generation facilities between July & September](https://www.ewn.co.za/2026/11/06/nersa-registered-144-new-electricity-generation-facilities-between-july-september) (6 November 2026).",
        ],
    },

    "irp-impact-households": {
        overview: [
            { type: "title", title: "Inside Eskom's generation recovery: 540+ days without load shedding" },
            "As of Eskom's **16 November 2026 update**, South Africa has gone **546 consecutive days without load shedding** — a streak that began on **16 May 2025**. Behind that headline is a steady, multi-year improvement in the condition of Eskom's generation fleet, now at its best level in six years.",
        ],
        context: [
            "Eskom's **Generation Recovery Plan**, running for the past three years, has focused on reducing unplanned breakdowns, improving maintenance discipline across the coal fleet, and completing the long-delayed **Kusile** and **Medupi** power stations. Kusile's sixth and final unit reached commercial operation in September 2025; Medupi's Unit 4, rebuilt after a 2021 boiler explosion, returned to service in mid-2025, completing all six units at both stations.",
        ],
        analysis: [
            "The plan's core metric is the **Energy Availability Factor (EAF)** — the share of Eskom's installed capacity actually available to generate at any given time. EAF fell below 55% at its lowest point (around 2022) and has since climbed to a **year-to-date 68.2%** as of October/November 2026, the highest level in six years. Eskom reports that approximately **6,527 MW** of previously unavailable generation capacity has been restored to the grid over the three years of the recovery plan.\n\nOne clear knock-on effect: diesel usage at Eskom's open-cycle gas turbines — the expensive, fast-start peaking plants used to cover shortfalls — has fallen sharply as the need for emergency generation has receded alongside the longer load-shedding-free streak.",
        ],
        "key-data": [
            "- **546 consecutive days** without load shedding as of 16 November 2026 (streak began 16 May 2025)\n- **Year-to-date EAF:** 68.2% (Oct/Nov 2026) — highest in six years, up from below 55% around 2022\n- **~6,527 MW** of generation capacity restored to the grid over three years under the Generation Recovery Plan\n- **Kusile:** all six units in commercial operation since September 2025\n- **Medupi:** all six units complete; Unit 4 returned to service mid-2025 after a 2021 boiler explosion",
        ],
        implications: [
            "A more reliable grid reduces the need for businesses and households to run their own backup generation, lowers the economy-wide cost of unplanned outages, and supports planning confidence for new investment in energy-intensive industries. It also gives South Africa a stronger starting position for executing IRP 2025 — the long-term plan that sets out roughly 105 GW of generation build-out to 2039 — since new capacity can now be added onto a fleet that is itself performing well, rather than one still in crisis.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. EWN, [Eskom targets end to load reduction after 540 days free of load shedding](https://www.ewn.co.za/eskom-targets-end-to-load-reduction-after-540-days-free-of-load-shedding/) (November 2026).\n2. SAnews (South African Government News Agency), [Eskom turns to sustaining gains](https://www.sanews.gov.za/node/85531) (2026).\n3. SAnews, [Eskom reports on generation recovery and system performance](https://www.sanews.gov.za/node/85531) (2026).\n4. Eskom, [The power system remains stable with unplanned outages reduced, a steady improvement in EAF and a continued decline in diesel usage](https://www.eskom.co.za/the-power-system-remains-stable-with-unplanned-outages-reduced-by-763mw-year-on-year-a-steady-improvement-in-eaf-and-a-continued-decline-in-diesel-usage/).",
        ],
    },

    "municipal-energy-losses": {
        overview: [
            { type: "title", title: "South Africa's renewable energy capacity keeps climbing" },
            "South Africa now has close to **16 GW of installed renewable energy capacity**, with roughly another **32 GW of projects in the grid-connection queue**, according to Presidency figures. Utility-scale solar and wind, plus a fast-growing pool of smaller registered generation, are adding capacity at a pace that's accelerated noticeably over the past two years.",
        ],
        context: [
            "The **Renewable Energy Independent Power Producer Procurement Programme (REIPPPP)**, running since 2011, remains the main vehicle for utility-scale wind and solar in South Africa. Its most recent round, **Bid Window 7**, was redesigned as solar-only after onshore wind bids fell short of what the window needed — a practical adjustment that redirected available capacity to the technology drawing stronger bidder interest.",
        ],
        analysis: [
            "Bid Window 7 has grown in stages — 1,760 MW awarded in December 2024, a further 1,290 MW in July 2025, and another 890 MW in December 2025 — reaching a cumulative **3,940 MW across 18 solar PV projects**. Separately, NERSA's own generation-facility registrations (spanning both grid-scale and smaller embedded systems) totalled **597 facilities and 7.46 GW across all of 2025**, with momentum continuing into 2026: the July–September 2026 quarter alone added **144 facilities and 3,129 MW**.\n\nA concrete recent example: **Seriti Green's Ummbila Emoyeni wind farm** in Mpumalanga reached commercial operation on its first 155 MW phase in November 2026 — notable for being built on former coal-mining land, one of several projects repurposing land once used for coal.",
        ],
        "key-data": [
            "- **~16 GW** installed renewable capacity nationally, **~32 GW** more in the grid-connection queue (Presidency figures)\n- **REIPPPP Bid Window 7:** 3,940 MW contracted across 18 solar PV projects (as of December 2025)\n- **NERSA registrations, 2025 (full year):** 597 facilities, 7.46 GW\n- **NERSA registrations, Jul–Sep 2026 quarter:** 144 facilities, 3,129 MW\n- **Ummbila Emoyeni wind farm (Mpumalanga):** first 155 MW phase in commercial operation, November 2026",
        ],
        implications: [
            "This growth directly supports IRP 2025's targets of 11,270 MW of new solar and 7,340 MW of new wind by 2030, diversifying South Africa's generation mix away from its historical reliance on coal. Projects like Ummbila Emoyeni also illustrate a practical side-benefit: land and communities previously tied to coal mining can host new generation infrastructure, supporting local economic activity through the transition. NERSA has noted that registered capacity isn't the same as capacity actually built and connected, so the grid-connection queue — not generation interest — is increasingly the pace-setter for how quickly this capacity comes online.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. PV Magazine, [South Africa adds 890 MW of solar to seventh renewables bid window](https://www.pv-magazine.com/2025/12/17/south-africa-adds-890-mw-of-solar-to-seventh-renewables-bid-window/) (17 December 2025).\n2. Engineering News, [Renewable Energy Independent Power Producer Procurement Programme – Bid Window 7, South Africa – update](https://www.engineeringnews.co.za/article/renewable-energy-independent-power-producer-procurement-programme-bid-window-7-south-africa-update-2026-05-22) (22 May 2026).\n3. Engineering News, [NERSA registered 144 generation facilities in the September quarter](https://engineeringnews.co.za/article/nersa-registered-144-generation-facilities-in-the-september-quarter-2026-11-06) (6 November 2026).\n4. New Energy World, Seriti Green's Ummbila Emoyeni wind farm commercial operation (8 November 2026).\n5. Mining Weekly, [NERSA confirms 2,692 generator registrations](https://www.miningweekly.com/article/nersa-confirms-2-692-generator-registrations-2026-09-11) (11 September 2026).",
        ],
    },
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

    const editPreviewImageKey = headerDraft.imageKey || article?.imageKey || "";

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
            await updateContentRecord({
                model: "InsightArticle",
                id: article.id,
                data: { title: headerDraft.title, excerpt: headerDraft.excerpt || "", imageKey: headerDraft.imageKey || "" },
                pageKeys: ["energyinsights.__index__", "insight.*", `insight.${slug}`],
                historyLabel: `Insight — ${headerDraft.title} header`,
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

    const title   = article?.title   ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const excerpt = article?.excerpt ?? null;

    const sections = DEFAULT_SECTIONS.map((s) => {
        const blocks = CONTENT_BY_SLUG[slug]?.[s.id];
        return blocks ? { ...s, defaultContent: JSON.stringify(blocks) } : s;
    });

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
                            className="group relative h-20 w-20 overflow-hidden rounded-none border-2 border-dashed border-[var(--color-accent)]/40 bg-[var(--color-cream-2)] transition-all hover:border-[var(--color-accent)]/70"
                            title="Change image"
                        >
                            <MediaFill value={editPreviewImageKey} alt="cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-none">
                                <span className="text-[10px] font-semibold text-white">Change</span>
                            </div>
                        </button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Insights</p>
                        <input
                            value={headerDraft.title}
                            onChange={(e) => setHeaderDraft((d) => ({ ...d, title: e.target.value }))}
                            className="w-full rounded-none border border-[var(--color-accent)]/30 bg-white px-3 py-1.5 text-2xl font-bold text-[var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                            placeholder="Article title"
                        />
                        <input
                            value={headerDraft.excerpt}
                            onChange={(e) => setHeaderDraft((d) => ({ ...d, excerpt: e.target.value }))}
                            className="w-full rounded-none border border-[var(--color-accent)]/30 bg-white px-3 py-1.5 text-sm text-[var(--color-ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                            placeholder="Subtitle / description (optional)"
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
                    {/* Cover image */}
                    <div className={`h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-cream-2)] ${editMode ? "ring-2 ring-[var(--color-accent)]/30" : ""}`}>
                        <MediaFill value={article?.imageKey} alt={title} />
                    </div>
                    <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Insights</p>
                        <h1 className="text-2xl font-bold text-[var(--color-ink)]">{title}</h1>
                        {excerpt && <p className="mt-1 text-sm text-[var(--color-ink-soft)] max-w-2xl">{excerpt}</p>}
                        {editMode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setHeaderDraft({ title, excerpt: excerpt ?? "", imageKey: article?.imageKey ?? "" });
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
                pageKey={`insight.${slug}`}
                defaultSections={sections}
                placeholders={PLACEHOLDERS}
                editMode={editMode}
            />
        </div>
    );
}
