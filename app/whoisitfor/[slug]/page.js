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
    { id: "sources",         label: "Sources & References" },
];

const PLACEHOLDERS = {
    "overview":        "Describe who this audience is and why Energy Data SA is relevant to them.",
    "use-cases":       "Add specific ways this audience uses the platform.",
    "datasets":        "List the most relevant datasets for this audience.",
    "tools":           "Add tools, apps, or dashboards most useful to this audience.",
    "insights":        "Add links to energy insights articles relevant to this audience.",
    "getting-started": "Add a short guide for this audience — where to start, what to explore first.",
    "sources":         "Add sources and references used for this audience page.",
};

// ── Per-audience real content ──────────────────────────────────────────────
// Rendered via defaultContent (a fallback only used while no admin-entered
// PageContent record exists for a given section — see EditableContent.js).
// Keyed by the 5 real AudienceProfile slugs confirmed live on this site.
const CONTENT_BY_SLUG = {
    "general-public": {
        overview: [
            "If you pay an electricity bill, switch on a geyser, or have watched your municipality's lights flicker over the last decade, South Africa's energy system already affects you directly. This platform exists to make the real, sourced numbers behind that system — generation, tariffs, load shedding, renewables — available to anyone, not just utilities and regulators.",
            "The headline good news: Eskom has now gone **546 consecutive days without load shedding** (as of 16 November 2026, counting from 16 May 2025), with its year-to-date Energy Availability Factor (EAF) — the share of its fleet actually available to generate — at **68.2%**, the highest in six years. That's a real, verifiable turnaround from the Stage 6 blackouts of 2022–2023, not a promise.",
        ],
        "use-cases": [
            "- **Check the current state of the grid** — the [Current Load Shedding Stage](/topics/current-load-shedding-stage) topic page tracks Eskom's own reported status and EAF trend, rather than relying on social-media rumour.\n- **Understand why your bill keeps rising** — [Electricity Tariffs & Pricing](/topics/electricity-tariffs-pricing) breaks down NERSA's determinations (including the 8.76% Eskom direct-customer increase and 9.01% municipal increase both effective in 2026) and why municipal mark-ups push your actual bill higher than Eskom's own tariff.\n- **Follow rooftop solar and renewables growth** — [Installed Renewable Capacity](/topics/installed-renewable-capacity) tracks utility-scale and embedded (rooftop/behind-the-meter) solar and wind growth, relevant if you're considering your own installation or just want to know how much of the grid is now renewable.",
        ],
        datasets: [
            "Start with the **Topics** cards on the homepage — Total Electricity Generated, Electricity Tariffs & Pricing, Installed Renewable Capacity, Energy Intensity of the Economy, CO₂ Emissions, and Just Energy Transition are written for a general reader, each with real figures and sources rather than jargon.\n\nFor more detail on how electricity is actually generated, see **Datasets → Energy Carriers → Electricity**, which covers Eskom's coal, nuclear (Koeberg), hydro, and gas fleet, plus non-Eskom and private generation.",
        ],
        tools: [
            "The **Maps** section plots South Africa's power stations geographically — useful if you want to see what's generating electricity near you, including Eskom's coal stations, Koeberg, and major renewable projects.",
        ],
        insights: [
            "The **Insights** section carries shorter, news-style pieces on specific developments (tariffs, load shedding, renewables) aimed at a general reader — a lighter-weight complement to the full Topics pages.",
        ],
        "getting-started": [
            "1. Start at **Datasets → Energy Carriers → Electricity** for the basics of how your power is generated.\n2. Check the **Current Load Shedding Stage** and **Electricity Tariffs & Pricing** topic pages for what's happening right now.\n3. Browse **Insights** for shorter updates as they're published.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. SAnews / South African Government News Agency, [Eskom turns to sustaining gains](https://www.sanews.gov.za/node/85531) — 546 consecutive days without load shedding and 68.2% year-to-date EAF, reported 16 November 2026.\n2. EWN, [Eskom targets end to load reduction after 540 days free of load shedding](https://www.ewn.co.za/eskom-targets-end-to-load-reduction-after-540-days-free-of-load-shedding/).\n3. Engineering News, [Nersa approves higher electricity hikes for 2026/27 after R54.7bn error](https://www.engineeringnews.co.za/article/nersa-approves-higher-electricity-hikes-for-202627-after-r547bn-error-2026-03-10) — the 8.76% Eskom direct-customer and 9.01% municipal tariff increases cited above.",
        ],
    },

    "industry-investors": {
        overview: [
            "For capital allocation, site selection, or regulatory-risk modelling in South African energy, the relevant inputs are the official generation plan, the procurement pipeline actually delivering against it, the tariff trajectory, and the carbon cost schedule — all of which this platform tracks with primary sources rather than press-release framing.",
            "The current official generation plan is **IRP 2025** (cabinet-approved 15 October 2025, gazetted 28 October 2025), targeting roughly 105 GW of build-out to 2039 at an estimated R2.23 trillion — see the [Integrated Resource Plan](/dashboard/energy-planning/integrated-resource-plan) page for the full target breakdown by technology and year.",
        ],
        "use-cases": [
            "- **Track REIPPPP delivery against IRP targets** — Bid Window 7 has grown in stages to **3,940 MW** of contracted solar PV capacity across 18 projects as of December 2025, after wind bids fell short and capacity was reallocated to solar; see [Installed Renewable Capacity](/topics/installed-renewable-capacity) for the bid-window-by-bid-window history.\n- **Model tariff trajectory into financial projections** — NERSA approved an **8.76%** increase for Eskom direct customers from April 2026 and **9.01%** for municipal customers from July 2026, both steeper than MYPD6's original figures after a R54.7bn regulatory asset base error was corrected; see [Electricity Tariffs & Pricing](/topics/electricity-tariffs-pricing).\n- **Budget for carbon tax exposure** — South Africa's headline carbon tax rate rose from R236/tCO₂e (2025) to **R308/tCO₂e (2026)**, a 31% increase and the largest since the tax began in 2019, though the *effective* rate most liable companies pay remains far lower (as low as R46.20/tCO₂e for combustion emissions) due to phased-down allowances; see [CO₂ Emissions (Energy Sector)](/topics/co2-emissions-energy-sector).",
        ],
        datasets: [
            "**Energy Planning** (Dashboard → Energy Efficiency & Planning) carries the IRP, Integrated Energy Plan, Gas Master Plan, and Liquid Fuels Master Plan — the four documents that set South Africa's medium-to-long-term energy investment environment.\n\n**Energy Carriers → Electricity → Generation** and **→ Market & Pricing** cover the existing generation fleet and current pricing structures your investment case would sit alongside.",
        ],
        tools: [
            "**Maps** shows the geographic distribution of existing generation assets — useful context when evaluating grid-connection feasibility for a new project, alongside the grid-capacity constraints discussed on the renewable capacity topic page.",
        ],
        insights: [
            "Check **Insights** for shorter updates on specific procurement rounds, tariff determinations, and policy developments between major plan revisions.",
        ],
        "getting-started": [
            "1. Read **Integrated Resource Plan** under Energy Planning for the official 2025–2039 generation targets.\n2. Cross-check against **Installed Renewable Capacity** for what's actually been procured and connected so far.\n3. Review **Electricity Tariffs & Pricing** and **CO₂ Emissions (Energy Sector)** for the cost side of the model.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. Engineering News, [Renewable Energy Independent Power Producer Procurement Programme — Bid Window 7, South Africa — update](https://www.engineeringnews.co.za/article/renewable-energy-independent-power-producer-procurement-programme-bid-window-7-south-africa-update-2025-07-25).\n2. PV Magazine, [South Africa adds 890 MW of solar to seventh renewables bid window](https://www.pv-magazine.com/2025/12/17/south-africa-adds-890-mw-of-solar-to-seventh-renewables-bid-window/) — the cumulative 3,940 MW / 18-project figure.\n3. Engineering News, [Nersa approves higher electricity hikes for 2026/27 after R54.7bn error](https://www.engineeringnews.co.za/article/nersa-approves-higher-electricity-hikes-for-202627-after-r547bn-error-2026-03-10).\n4. Anthesis Group, [2026 Budget Speech Highlights — South African carbon tax update](https://www.anthesisgroup.com/za/insights/south-african-carbon-tax-update-2026/) — headline and effective carbon tax rates.\n5. This platform's own **Integrated Resource Plan** page (Energy Planning) for the IRP 2025 gazette date and full target table.",
        ],
    },

    "municipalities": {
        overview: [
            "Most South Africans buy electricity from their municipality, not directly from Eskom — which means municipal distribution performance, bulk tariff pass-through, and Eskom-owed debt are the three numbers that most directly determine both service delivery and a municipality's own financial health.",
            "Eskom's own financial filings put municipal arrears at **R110.5 billion** as of March 2026, which Eskom has repeatedly flagged as the single greatest threat to its financial sustainability — a dynamic every municipal electricity department now operates inside, whether or not it's the direct cause.",
        ],
        "use-cases": [
            "- **Benchmark your own distribution losses** — Eskom's own network-wide distribution losses (technical plus non-technical) worsened slightly from 10.42% to 10.54% in FY2026. Individual metros can run far worse: City Power (Johannesburg) reported losses of roughly **42%** for the July–September 2025 quarter, and Nelson Mandela Bay reported losses above **27%** — more than four times the generally accepted ~6% technical threshold — costing that metro an estimated R1.4 billion in 2024/25. See [Municipal Energy Data](/topics/municipal-energy-data) for the full picture and known data gaps.\n- **Plan for the bulk tariff pass-through** — NERSA's approved municipal bulk tariff increase is **9.01%** from 1 July 2026, on top of whatever markup your municipality applies on resale; see [Electricity Tariffs & Pricing](/topics/electricity-tariffs-pricing).\n- **Understand the debt context shaping National Treasury and Eskom's posture toward municipalities** — including proposed distribution agency agreements — when negotiating payment arrangements or service-delivery agreements.",
        ],
        datasets: [
            "[Municipal Energy Data](/topics/municipal-energy-data) is the primary topic page for this audience — electricity sales, connections, revenue, and loss-benchmarking context. [Electricity Tariffs & Pricing](/topics/electricity-tariffs-pricing) covers the regulatory process (NERSA, MYPD) your bulk tariff flows from.",
        ],
        tools: [
            "**Maps** shows generation assets and can help contextualise supply constraints in your distribution area.",
        ],
        insights: [
            "**Insights** carries shorter pieces on municipal-specific developments, including loss benchmarking across metros, as they're published.",
        ],
        "getting-started": [
            "1. Read **Municipal Energy Data** for coverage, known gaps, and benchmarking context.\n2. Check **Electricity Tariffs & Pricing** for the current and upcoming bulk tariff determinations.\n3. Use the loss-rate figures above as an external benchmark against your own reported technical and non-technical losses.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. Engineering News, [Municipalities owe Eskom R110.5 billion for electricity](https://www.engineeringnews.co.za/print-version/municipalities-owe-eskom-r1105-billion-for-electricity-2026-03-27).\n2. ITWeb, [Eskom's R30bn profit can't outrun R6bn electricity theft](https://www.itweb.co.za/article/eskoms-r30bn-profit-cant-outrun-r6bn-electricity-theft/nWJadMbN3agMbjO1) — Eskom's FY2026 distribution loss rate (10.42% → 10.54%).\n3. Daily Maverick, [Nelson Mandela Bay risks defaulting on Eskom payments, warns business chamber](https://www.dailymaverick.co.za/article/nelson-mandela-bay-risks-defaulting-on-eskom-payments-warns-business-chamber) — Nelson Mandela Bay's loss rate and 2024/25 financial impact.\n4. Engineering News, [Nersa approves higher electricity hikes for 2026/27 after R54.7bn error](https://www.engineeringnews.co.za/article/nersa-approves-higher-electricity-hikes-for-202627-after-r547bn-error-2026-03-10) — the 9.01% municipal bulk tariff increase.\n\nThe City Power (Johannesburg) quarterly loss figure is as reported in municipal-debt coverage during 2026; check City Power's own published quarterly reports for the authoritative figure, as this platform could not independently verify it against a primary City Power filing during this research pass.",
        ],
    },

    "students-researchers": {
        overview: [
            "Energy Data SA is built to be checkable, not just readable: every Topics page, every Energy Carriers and Energy Planning page, and the National Energy Balance methodology page itself now ends in a **Sources & References** section naming the original publisher and, where one exists, a direct link — specifically so a student or researcher can verify a claim against its primary source rather than taking this platform's word for it.",
            "Where this platform cites South Africa's own National Energy Balance, the underlying compilation work is done by **SANEDI** (South African National Energy Development Institute) with the **UCT Energy Systems Research Group** as its academic partner, following the international energy-balance methodology set out by the IEA.",
        ],
        "use-cases": [
            "- **Cite primary sources directly** rather than this platform — every page's Sources & References section is written so you can go straight to SANEDI, DFFE, NERSA, Stats SA, or the relevant news coverage yourself.\n- **Export the National Energy Balance as data** — the National Energy Planning dashboard's Sankey diagram and per-sector breakdowns (Primary Supply, Conversion, Final Supply, and the five sector pages) each have CSV export/import controls, letting you pull the underlying PJ-denominated figures directly into your own analysis rather than reading them off a chart.\n- **Check methodology, not just numbers** — the [National Energy Planning methodology page](/dashboard/energy-balance/methodology) documents how the NEB is actually compiled, including known data gaps (rooftop solar undercounting, D-form compliance issues, informal biomass use) that matter for any downstream analysis.",
        ],
        datasets: [
            "**National Energy Planning** (Dashboard) is the primary research dataset on this platform — switch between years using the year selector, and export any section as CSV. The **methodology page** underneath it documents data provenance and limitations in more depth than most public energy-balance publications.\n\nThe **Topics** pages (Total Electricity Generated, CO₂ Emissions, Energy Intensity of the Economy, etc.) are useful for contextualising NEB figures against the broader national conversation, each with its own sourced figures.",
        ],
        tools: [
            "The CSV export/import feature on every National Energy Balance section (accessible from Dashboard → National Energy Planning) is the most directly useful tool here — it's a genuine data-extraction path, not just a chart.",
        ],
        insights: [
            "**Insights** can be useful as a secondary-source pointer to current developments, but for citation purposes, follow through to its own Sources & References rather than citing the Insights piece itself.",
        ],
        "getting-started": [
            "1. Start at **National Energy Planning** (Dashboard) and read the **methodology page** before using any NEB figure in your own work.\n2. Use the CSV export on the section(s) you need.\n3. Cross-reference any Topics-page figure against its own Sources & References section before citing it externally.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. International Energy Agency, [Understanding and Using the Energy Balance](https://www.iea.org/commentaries/understanding-and-using-the-energy-balance) — the methodology framework the National Energy Balance follows.\n2. South African National Energy Development Institute (SANEDI), [official website](https://sanedi.org.za/).\n3. University of Cape Town Energy Systems Research Group, [official website](https://www.esrg.uct.ac.za/) — SANEDI's NEB compilation partner.\n4. This platform's own [National Energy Planning methodology page](/dashboard/energy-balance/methodology) for full data-provenance and known-gaps detail.",
        ],
    },

    "policy-government": {
        overview: [
            "Energy policy in South Africa is unusually fast-moving right now — a new generation plan, an institutional split of the former energy ministry, a renewable procurement programme running multiple concurrent bid windows, and an internationally financed coal-transition programme are all live simultaneously. This platform tracks each with sourced, dated detail rather than treating any one of them as settled.",
            "The former **Department of Mineral Resources and Energy (DMRE)** was split from 2024 into the **Department of Mineral and Petroleum Resources (DMPR)** and the **Department of Electricity and Energy (DOEE)** — the latter now carrying electricity policy, the Electricity Regulation Act, the National Energy Regulator Act, and the Nuclear Energy Act. See this platform's **Energy Planning** and **National Energy Planning methodology** pages for how this split affects data-source attribution throughout the site.",
        ],
        "use-cases": [
            "- **Track IRP 2025 delivery against REIPPPP's actual procurement pace** — IRP 2025 (gazetted 28 October 2025) targets ~105 GW of build-out to 2039; Bid Window 7 has reached 3,940 MW contracted as of December 2025 against a programme originally designed for up to 5,000 MW in this window alone, illustrating the gap between plan and delivery pace. See [Installed Renewable Capacity](/topics/installed-renewable-capacity).\n- **Monitor Just Energy Transition financing** — international partner financing has grown from the original $8.5 billion (COP26, 2021) to a pledged **$11.6 billion**, though disbursement pace continues to draw criticism; a October 2026 Climate Investment Fund approval under the Accelerating Coal Transition Investment Plan is among the most recent concrete milestones. See [Just Energy Transition](/topics/just-energy-transition).\n- **Track the carbon tax escalation schedule** — the headline rate rose from R236/tCO₂e (2025) to R308/tCO₂e (2026), with R347 and R385 scheduled for 2027 and 2028 respectively, en route to R462 by 2030 — relevant to both revenue projections and industry-engagement planning. See [CO₂ Emissions (Energy Sector)](/topics/co2-emissions-energy-sector).",
        ],
        datasets: [
            "**Energy Planning** (Dashboard → Energy Efficiency & Planning) carries the IRP, Integrated Energy Plan, Gas Master Plan, and Liquid Fuels Master Plan. The **Just Energy Transition** and **CO₂ Emissions (Energy Sector)** topic pages track the climate-finance and carbon-pricing dimensions respectively.",
        ],
        tools: [
            "**Maps** provides a geographic view of the existing generation fleet relevant to siting and transmission-planning policy discussions.",
        ],
        insights: [
            "**Insights** is useful for tracking specific policy developments (bid window results, tariff determinations, financing milestones) between major document revisions.",
        ],
        "getting-started": [
            "1. Read **Integrated Resource Plan** and **Just Energy Transition** for the current generation-mix and financing picture.\n2. Check **CO₂ Emissions (Energy Sector)** for the carbon tax schedule and NDC context.\n3. Use **National Energy Planning methodology** to understand how the DMPR/DOEE institutional split affects data attribution across the rest of the site.",
        ],
        sources: [
            { type: "title", title: "Sources & References" },
            "1. UK Government, [12-month Just Energy Transition Partnership Leaders Update 2026](https://www.gov.uk/government/news/12-month-just-energy-transition-partnership-leaders-update-2026) — JET-IP financing scale and the October 2026 Climate Investment Fund approval.\n2. PV Magazine, [South Africa adds 890 MW of solar to seventh renewables bid window](https://www.pv-magazine.com/2025/12/17/south-africa-adds-890-mw-of-solar-to-seventh-renewables-bid-window/) — Bid Window 7's cumulative 3,940 MW.\n3. Anthesis Group, [2026 Budget Speech Highlights — South African carbon tax update](https://www.anthesisgroup.com/za/insights/south-african-carbon-tax-update-2026/) — carbon tax rate schedule.\n4. This platform's own **Integrated Resource Plan** and **National Energy Planning methodology** pages for the IRP 2025 gazette date and the DMRE→DMPR/DOEE split detail.",
        ],
    },
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
                defaultSections={sections}
                placeholders={PLACEHOLDERS}
                editMode={editMode}
            />
        </div>
    );
}
