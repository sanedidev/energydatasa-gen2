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
// Real, sourced content for the 3 articles that exist today. Two of the
// three original headlines/excerpts carried an unverifiable statistic
// (an "18% Gauteng rooftop growth" figure) or implied an improvement trend
// that the actual current reporting doesn't support (municipal losses are
// mostly worsening, not improving) — rather than invent numbers to match
// those headlines, the body content below says so plainly and reports the
// real, sourced data instead.
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
            { type: "title", title: "IRP 2025: what actually changed, and what it costs" },
            "South Africa's new **Integrated Resource Plan (IRP 2025)** was approved by Cabinet on 15 October 2025 and gazetted on 28 October 2025 (Government Gazette No. 53596), formally replacing the outdated IRP 2019. It sets out roughly **105 GW of generation build-out to 2039**, requiring an estimated **R2.23 trillion in investment** — the long-term electricity plan every household's future bill is ultimately shaped by.",
        ],
        context: [
            "IRP 2019 had become badly outdated: it predated Eskom's recent generation recovery, the collapse in renewable energy costs, and the emerging \"gas cliff\" as Mozambican gas supply to South Africa declines later this decade. IRP 2025 sets a **2030 target** of 11,270 MW of additional solar PV, 7,340 MW of wind, and 6,000 MW of gas-to-power capacity — with **no new coal or nuclear capacity** by 2030. Looking further out, the **2039 target** is 34 GW of wind, 25 GW of solar, 16,000 MW of gas, 5.2 GW of new nuclear (with a possible stretch to 10 GW), and 8,500 MW of battery storage. By 2039, the plan envisages a generation mix of roughly 27% coal, 24% wind, and 18% solar.",
        ],
        analysis: [
            "Separately from the long-term IRP, NERSA's **2026/27 tariff determination** — an 8.76% increase for Eskom's direct customers (to roughly 240.28 c/kWh) from 1 April 2026, and a 9.01% increase for municipal customers from 1 July 2026 — was driven largely by a **R54.7 billion error** NERSA made calculating Eskom's regulatory asset base, which a High Court ruling forced it to correct upward from the originally planned 5.36%/6.19% figures. That follows a 12.74% increase the year before (2025/26). A further 8.83% Eskom increase is already approved for 2027/28.\n\nThe key point for households: these near-term tariff increases are **not primarily caused by the IRP 2025 build-out** — they're driven by a regulatory correction and ongoing debt service — but households are nonetheless paying both for the system they have today and, over time, for the one IRP 2025 is building.",
        ],
        "key-data": [
            "- **IRP 2025:** ~105 GW total build to 2039; R2.23 trillion investment\n- **2030 targets:** 11,270 MW solar PV, 7,340 MW wind, 6,000 MW gas-to-power, 0 new coal/nuclear\n- **2039 targets:** 34 GW wind, 25 GW solar, 16,000 MW gas, 5.2 GW (up to 10 GW) nuclear, 8,500 MW storage\n- **2039 generation mix:** ~27% coal, ~24% wind, ~18% solar\n- **Tariffs:** 2025/26 +12.74%; 2026/27 Eskom direct +8.76% (≈240.28 c/kWh) from 1 April 2026; 2026/27 municipal +9.01% from 1 July 2026; 2027/28 Eskom direct +8.83% (already approved)",
        ],
        implications: [
            "For households, near-term bills will likely keep rising faster than inflation regardless of the generation-mix transition, since the current increases trace back to a regulatory asset-base correction and debt service rather than new-build costs. In the medium-to-long term, IRP 2025's gas-to-power and storage targets are intended to reduce reliance on expensive diesel-fired open-cycle gas turbines — the peaking fuel source most directly responsible for the cost spikes of the load-shedding era. Households able to invest in their own generation (see the companion article on embedded generation growth) are increasingly insulated from these tariff increases, which widens the gap between households that can and can't afford to self-generate.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "A specific, stable public link to Government Gazette No. 53596 itself was not confirmed during this research pass — check the gov.za gazette archive or the Department of Electricity and Energy directly for the current IRP 2025 document.",
            "1. Engineering News, [Nersa approves higher electricity hikes for 2026/27 after R54.7bn error](https://www.engineeringnews.co.za/article/nersa-approves-higher-electricity-hikes-for-202627-after-r547bn-error-2026-03-10) (10 March 2026).\n2. IOL, [Eskom's 8.76% electricity tariff increase: What it means for South Africans](https://iol.co.za/news/south-africa/2026-03-16-eskoms-876-electricity-tariff-increase-what-it-means-for-south-africans/) (16 March 2026).\n3. TechCentral, [Eskom tariffs to surge on 1 April as Nersa blunder hits home](https://techcentral.co.za/eskom-tariffs-to-surge-on-1-april-as-nersa-blunder-hits-home/278754/).",
        ],
    },

    "municipal-energy-losses": {
        overview: [
            { type: "title", title: "A mixed and mostly worsening picture, not a clean improvement story" },
            { type: "text", content: "This article's original framing implied a clear improvement trend across metros. The current reporting doesn't support that: Eskom's own distribution losses actually rose in its most recent financial year, and the two metro-level examples with recent public data are both running losses far above acceptable technical thresholds. The honest story is that some figures (non-technical/theft losses in rand terms) are improving while the overall picture is stagnant-to-worse.", bg: "amber" },
        ],
        context: [
            "Distribution losses are electricity that's generated and sent into the grid but never billed. **Technical losses** are physical — energy dissipated in lines and transformers, and are expected even in a well-run network (generally considered acceptable up to around 6%). **Non-technical losses** are electricity lost to theft, meter tampering, and unbilled or unmetered use. Both represent revenue a utility never collects, which deepens the same debt spiral already squeezing Eskom and many municipalities.",
        ],
        analysis: [
            "**Eskom-wide**, overall distribution losses (technical plus non-technical combined) rose slightly from **10.42% to 10.54%** in its FY2026 results — a worsening, not an improvement. Within that total, non-technical losses in rand terms did fall, from **R7.1 billion to R6.6 billion** year-on-year — the one genuinely improving number found in this research, even though the overall loss percentage still crept up.\n\nAt the metro level: **City Power (Johannesburg)** bought 2,982,511,319 kWh but sold only 1,728,203,856 kWh in the July–September 2025 quarter — a **42.06% loss rate**, among the worst of any major metro with recently reported figures. **Nelson Mandela Bay** is reported running losses **above 27%** — more than four times the roughly 6% technical-loss threshold generally considered acceptable — which a local business chamber estimated cost the metro **R1.4 billion in the 2024/25 financial year**.",
        ],
        "key-data": [
            "- **Eskom distribution losses:** 10.42% (FY2025) → 10.54% (FY2026) — worsened\n- **Eskom non-technical losses:** R7.1 billion (FY2025) → R6.6 billion (FY2026) — improved\n- **City Power (Johannesburg), Jul–Sep 2025:** 42.06% losses\n- **Nelson Mandela Bay:** >27% losses; an estimated R1.4 billion lost in 2024/25\n- **Municipal debt to Eskom:** R110.5 billion as of March 2026, growing by roughly R15.9 billion over the prior year (metros +R2.3bn, non-metros +R13.6bn)",
        ],
        implications: [
            "Eskom has repeatedly flagged municipal debt as the single greatest threat to its own financial sustainability and the biggest obstacle to the planned legal separation of its distribution business. Rising or stagnant distribution losses and growing uncollected municipal debt are two sides of the same structural problem — revenue that should fund grid maintenance and debt repayment simply isn't being collected. For residents, this most likely means continued above-inflation tariff increases to cover both generation costs and distribution-side revenue leakage, regardless of whether they're billed directly by Eskom or through their municipality.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "The exact original article URLs for the City Power and Nelson Mandela Bay quarterly figures specifically were not retained during this research pass — both are attributed to TimesLive/Daily Maverick municipal-finance reporting from late 2025; check those outlets' municipal/Eskom coverage archives directly to re-verify the exact figures before citing them further.",
            "1. ITWeb, [Eskom's R30bn profit can't outrun R6bn electricity theft](https://www.itweb.co.za/article/eskoms-r30bn-profit-cant-outrun-r6bn-electricity-theft/nWJadMbN3agMbjO1).\n2. TimesLive, [Municipalities owe Eskom R120bn as debt threatens viability](https://www.timeslive.co.za/news/south-africa/2026-09-23-municipalities-owe-eskom-r120bn-as-debt-threatens-viability/) (23 September 2026).\n3. Engineering News, [Municipalities owe Eskom R110.5-billion for electricity](https://www.engineeringnews.co.za/print-version/municipalities-owe-eskom-r1105-billion-for-electricity-2026-03-27) (27 March 2026).\n4. BusinessTech, [Eskom warns its R110 billion headache could reach R300 billion in 5 years](https://businesstech.co.za/news/energy/854286/eskom-warns-its-r110-billion-headache-could-reach-r300-billion-in-5-years/).",
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
