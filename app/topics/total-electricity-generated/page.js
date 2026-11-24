import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Total Electricity Generated" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Total Electricity Generated", subtitle: "South Africa's national generation mix and recent output" },
            "South Africa's national gross electricity generation was approximately **242.8 TWh in 2025**, down 2.9% from 250.1 TWh in 2024 (Ember estimate; Statistics South Africa's generation index also shows a 2.0% decline in 2025 after a 4.9% rise in 2024). Eskom supplied roughly **88% of this** in 2025, with independent power producers (IPPs) contributing around 9% and imports (mainly Cahora Bassa hydro from Mozambique) around 3%, per Eskom's own 2025 annual report. Eskom's own sales volumes were 189.7 TWh in 2025.\n\nCoal remains dominant, at roughly **81% of generation in 2025** (Ember) — Statistics South Africa put coal's share at 83% in 2024, when coal output rose 7% year-on-year to 177.9 TWh (CSIR). Add the newer exact 2025/2026 coal-share figure once Eskom's full-year generation report or the next CSIR Utility Statistics Report is published; precise recent nuclear and renewables GWh splits are not yet confirmed from an official source and are noted as approximate below.",
            { type: "text", content: "**Note on methodology:** \"Generation\" (gross output, including IPPs and imports) and \"sales\" (what Eskom bills) are different measures and are not interchangeable — several of the figures below mix sources that use one or the other, and this is flagged wherever it applies.", bg: "gray" },
        ]),
    },
    {
        id: "by-source", label: "Generation by Source",
        defaultContent: JSON.stringify([
            { type: "title", title: "Generation by Source" },
            "**Coal** — approximately 81% of generation in 2025 (Ember), 83% in 2024 (Statistics South Africa). Coal output rose 7% year-on-year to 177.9 TWh in 2024 (CSIR). Coal remains the overwhelming base of South Africa's electricity supply despite the renewables build-out described below.\n\n**Nuclear** — Koeberg Nuclear Power Station (Western Cape) is South Africa's only nuclear plant, with a combined capacity of approximately 1,860–1,934 MW across its two units (sources vary slightly on the exact net figure). Both units now have confirmed 20-year operating licence extensions: Unit 1 to 21 July 2044 (reconnected October 2025 after long-term-operation refurbishment work) and Unit 2 to November 2044/2045 (returned to service December 2024). An approximate 2024 nuclear output figure of around 7.8 TWh appears in CSIR data but is not independently confirmed here — treat it as indicative rather than official.\n\n**Independent Power Producers (IPPs)** — around 9% of 2025 generation per Eskom's own annual report, spanning REIPPPP wind/solar/CSP projects and other licensed IPPs.\n\n**Imports** — around 3% of 2025 generation, primarily hydropower imported from Mozambique's Cahora Bassa scheme via the Southern African Power Pool.",
            { type: "text", content: "A precise current percentage breakdown for wind, solar PV, hydro, and gas/diesel individually (rather than bundled into the ~9% IPP share above) was not confirmed from an official 2025/2026 source during this research pass. Check Eskom's latest Integrated Report or the CSIR Utility Statistics Report for the exact current split.", bg: "amber" },
        ]),
    },
    {
        id: "trends", label: "Historical Trends",
        defaultContent: JSON.stringify([
            { type: "title", title: "Historical Trends" },
            "Generation fell in both 2023 (-4.4%) and 2025 (-2.0%), with a rise in between in 2024 (+4.9%) (Statistics South Africa generation index). The 2025 decline happened despite — not because of — supply constraints: it reflects softer demand and the continued growth of behind-the-meter embedded generation (see the [Installed Renewable Capacity](/topics/installed-renewable-capacity) page) reducing grid draw, not a return of outages.\n\n**Eskom's Energy Availability Factor (EAF)** — the share of Eskom's fleet capacity actually available to generate — has been the single biggest driver of South Africa's generation story this decade. EAF fell below 55% at its worst (around 2022) and has since recovered to a **year-to-date 68.2% as of October/November 2026**, its highest level in six years, under Eskom's Generation Recovery Plan. Eskom reports approximately 6,527 MW of previously unavailable generation capacity has been restored to the grid over the past three years of that plan.\n\n**Loadshedding fell 82% in the first half of 2025** alone, according to the CSIR, driven by a combination of easing demand and steadier Eskom output — see the dedicated [Current Load Shedding Stage](/topics/current-load-shedding-stage) page for the full status and the distinction between \"load shedding\" and the separate, lesser \"load reduction\" mechanism.",
        ]),
    },
    {
        id: "loadshedding", label: "Load Shedding Impact",
        defaultContent: JSON.stringify([
            { type: "title", title: "Load Shedding Impact on Generation" },
            "Load shedding is the controlled, rotational reduction of electricity supply when demand exceeds available generation capacity, implemented in stages 1–8, each representing roughly 1,000 MW of additional demand reduction nationally. At its worst (2023), South Africa experienced record outages, which — alongside the economic damage widely reported at the time — directly suppressed measured generation and sales figures for that period.\n\nAs of Eskom's **16 November 2026 update, the utility has gone 546 consecutive days without load shedding**, a streak that began on 16 May 2025. Eskom is now focused on ending the separate \"load reduction\" mechanism (a smaller-scale, localised curtailment tool distinct from nationwide load shedding stages) — do not conflate the two. This recovery is the context behind the EAF and generation figures above: as Eskom's fleet became more available, less forced curtailment was needed, and the correlation between the two series is the clearest real driver of the generation trends on this page.",
            { type: "text", content: "For the full current status, stage definitions, and the load-shedding/load-reduction distinction, see the dedicated [Current Load Shedding Stage](/topics/current-load-shedding-stage) topic page.", bg: "blue" },
        ]),
    },
    {
        id: "visualisations", label: "Visualisations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Visualisations" },
            "Charts planned for this section: total annual electricity generation (GWh) over time; generation mix by source; Eskom Energy Availability Factor trend; load shedding days/hours by year. These will draw on this platform's own [National Energy Balance](/dashboard/energy-balance) dataset alongside the external sources cited below.",
        ]),
    },
    {
        id: "datasets", label: "Related Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Related Datasets" },
            "Explore related data on this platform: the [National Energy Balance](/dashboard/energy-balance) (primary supply, conversion, and final consumption by sector), and the [Energy Carriers → Electricity](/dashboard/energy-carriers/electricity) section for generation, demand, transmission, and pricing detail by source.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Eskom, [2025 Annual Financial Statements](https://www.eskom.co.za/wp-content/uploads/2025/09/Eskom-annual-financial-statements-2025-1.pdf) (September 2025) — Eskom's ~88% generation share, IPP ~9%, imports ~3%.\n2. MyBroadband, [Eskom generation figures reported via Ember data](https://mybroadband.co.za/news/?p=652011) (2026) — 2025 national gross generation of 242.8 TWh vs 250.1 TWh in 2024, coal ~81% share.\n3. Statistics South Africa, [Electricity generated and available for distribution (P4141)](https://www.statssa.gov.za/publications/P4141/P4141December2025.pdf) — annual generation index and coal share (83% in 2024).\n4. CSIR, [Loadshedding down 82% in H1 2025 as demand eases and EAF edges up](https://www.csir.co.za/media-hub/media-room/loadshedding-down-82-in-h1-2025-as-demand-eases-and-eaf-edges-up-but-tariffs) (September 2025) — coal output 177.9 TWh in 2024, H1 2025 load shedding reduction.\n5. EWN, [Eskom targets end to load reduction after 540 days free of load shedding](https://www.ewn.co.za/eskom-targets-end-to-load-reduction-after-540-days-free-of-load-shedding/) (November 2026) — 546-day no-load-shedding streak from 16 May 2025, year-to-date EAF 68.2%, ~6,527 MW restored under the Generation Recovery Plan.\n6. SAnews (South African Government News Agency), [Eskom reports on generation recovery and system performance](https://www.sanews.gov.za/node/85531) (2026) — EAF and Generation Recovery Plan progress updates.",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa generated approximately 200,000–215,000 GWh of electricity per year in 2022–2024, down from a peak of around 240,000 GWh in 2007. Eskom produces roughly 90% of national output across its coal, nuclear, hydro, and gas-fired fleet, with independent power producers (IPPs) supplying the remainder. Chronic capacity constraints — driven by Eskom's ageing coal fleet and delayed Medupi and Kusile builds — have led to widespread load shedding since 2008, with 2023 recording the worst year of outages in SA history. Add current generation figures and recent trends.",

    "by-source":
        "Coal dominates South Africa's electricity mix, contributing approximately 80–85% of total generation (2023 data). Nuclear accounts for roughly 4–5% (Koeberg's 1,860 MW). Pumped-storage hydro (Drakensberg, Ingula) provides 2–3%. Imported hydro from Cahora Bassa (Mozambique) contributes approximately 5%. Wind and solar PV — driven by the REIPPP programme — now supply around 5–8% and growing rapidly. Open Cycle Gas Turbines (OCGTs) are used for peaking but at high cost. Add latest generation mix percentages by source with MW capacity.",

    "trends":
        "Generation peaked at ~240,000 GWh in 2007 before declining as Eskom's Energy Availability Factor (EAF) deteriorated. By 2022, EAF fell below 55% — meaning Eskom's fleet was producing at barely half its nominal capacity. 2023 saw record load shedding totalling over 7,000 hours of Stage 2+ outages nationwide. Since mid-2024, load shedding has reduced significantly following emergency procurement, improved plant maintenance, and the rapid growth of embedded solar PV reducing grid demand. Add year-on-year generation data and EAF trends.",

    "loadshedding":
        "Load shedding is the controlled, rotational reduction of electricity supply when demand exceeds available generation capacity. Eskom implements stages 1–8, each representing increments of approximately 1,000 MW of demand reduction. Stage 6 — the worst experienced routinely — means 6,000 MW of load is shed, cutting power to rotating blocks for up to 12 hours per day. The 2023 load shedding crisis caused an estimated R1 billion in daily economic losses. The end of rotational load shedding in late 2024 followed improved Eskom EAF (reaching ~60%), embedded solar growth surpassing 5 GW, and Kusile Unit 6 coming online. Add cumulative load shedding hours by year and economic impact estimates.",

    "visualisations":
        "Add charts showing: total annual electricity generation (GWh) 2000–present; generation mix by source (pie/stacked bar); Eskom Energy Availability Factor over time; monthly generation trends; load shedding hours per year. Data source: Eskom Integrated Reports, Stats SA energy accounts, CSIR Energy Centre load shedding tracker.",

    "datasets":
        "Key data sources: Eskom Integrated Annual Reports (eskom.co.za), Stats SA energy accounts, CSIR Energy Centre (real-time and historical load shedding data), IEA South Africa electricity statistics, NERSA generation statistics, and the SA Energy Data SA Energy Balance datasets on this platform.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Total Electricity Generated" },
            ]} />

            <EditablePageHeader
                pageKey="topic.total-electricity-generated"
                defaultLabel="Topic"
                defaultTitle="Total Electricity Generated"
                defaultDesc="South Africa generated approximately 242.8 TWh of electricity in 2025 (Ember estimate) — broken down by source, with context on Eskom's recovering availability and the growing contribution of renewables and embedded generation."
            />

            <EditableSections
                pageKey="topic.total-electricity-generated"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
