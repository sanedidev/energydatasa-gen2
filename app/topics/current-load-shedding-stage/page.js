import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Current Load Shedding Stage" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Current Load Shedding Stage" },
            "Load shedding is a controlled, rotational reduction of electricity supply, implemented by Eskom when national demand exceeds available generation capacity, in stages numbered 1 (lowest impact) through 8 (most severe). Each stage represents an additional increment of roughly **1,000 MW** of demand reduction nationally, scheduled in rotating blocks by municipality or Eskom distribution area.\n\n**Load shedding is distinct from \"load reduction\"** — a separate, smaller-scale and more localised curtailment mechanism Eskom also uses, typically targeted at specific substations or feeders experiencing technical overload (for example, informal-settlement areas with high levels of illegal connections), rather than a nationwide stage applied nationally. The two are frequently and incorrectly used interchangeably in casual reporting; this page tracks nationwide load shedding stages specifically.",
        ]),
    },
    {
        id: "current-status", label: "Current Status",
        defaultContent: JSON.stringify([
            { type: "title", title: "Current Status" },
            { type: "text", content: "As of Eskom's most recent public update (16 November 2026): **546 consecutive days without load shedding**, with the streak dating back to 16 May 2025. This is a point-in-time snapshot — check eskom.co.za or Eskom's official social media for the live current stage, since this can and does change.", bg: "blue" },
            "Behind that streak, Eskom's **year-to-date Energy Availability Factor (EAF) reached 68.2% as of October/November 2026** — its highest level in six years — under the utility's Generation Recovery Plan, which Eskom says has restored approximately 6,527 MW of previously unavailable generation capacity to the grid over the past three years. The **CSIR separately reported load shedding fell 82% in the first half of 2025 alone**, driven by a combination of easing electricity demand and steadier Eskom generation output.\n\nEskom's current stated focus has shifted from eliminating load shedding (already achieved for well over a year) to **ending \"load reduction\"** — the separate, localised mechanism described above — as the next milestone in its recovery programme.",
        ]),
    },
    {
        id: "stage-breakdown", label: "Stage Definitions",
        defaultContent: JSON.stringify([
            { type: "title", title: "Stage Definitions" },
            "Load shedding stages scale roughly linearly: each stage sheds approximately 1,000 MW more than the stage below it nationally (so Stage 4 sheds roughly 4,000 MW, Stage 6 roughly 6,000 MW, and so on up to Stage 8). In practice, a given customer typically experiences one or two scheduled outage blocks of around 2–4 hours each per day at the lower stages, rising to multiple blocks and longer cumulative outage time per day at higher stages — the exact schedule depends on which municipal or Eskom distribution block a customer falls into, published via Eskom's and each municipality's own load-shedding schedules (apps such as EskomSePush aggregate these).\n\nStages above 6 have been formally defined in Eskom's planning but were rarely or never implemented in practice prior to the system's 2026 recovery; the worst sustained real-world experience during the 2022–2023 crisis period was in the Stage 4–6 range on most days.",
        ]),
    },
    {
        id: "trends", label: "Historical Trends",
        defaultContent: JSON.stringify([
            { type: "title", title: "Historical Trends" },
            "South Africa has experienced load shedding intermittently since 2008, with the situation deteriorating sharply from 2021–2023 as Eskom's coal fleet aged and Energy Availability Factor (EAF) fell below 55% at its worst. 2023 is widely reported as the worst year of outages in South African history.\n\nThe recovery began in 2024 and has been sustained and extended through 2025–2026: the **CSIR recorded an 82% reduction in load shedding in H1 2025** alone, and Eskom's own tracked streak reached **546 consecutive days without load shedding by 16 November 2026**. This recovery tracks closely with the EAF improvement described on the [Total Electricity Generated](/topics/total-electricity-generated) page, and with the continued growth of embedded generation reducing peak grid demand (see [Installed Renewable Capacity](/topics/installed-renewable-capacity)).\n\nA precise year-by-year total of load shedding hours/days for 2021–2026 was not independently compiled from an official single source during this research pass — Eskom's own published system status reports and the CSIR's periodic utility statistics reports are the authoritative sources for that series.",
        ]),
    },
    {
        id: "visualisations", label: "Visualisations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Visualisations" },
            "Charts planned for this section: load shedding days/stage-hours by year since 2008; Eskom Energy Availability Factor trend overlaid against load shedding incidence; the length of the current no-load-shedding streak against prior record streaks.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. EWN, [Eskom targets end to load reduction after 540 days free of load shedding](https://www.ewn.co.za/eskom-targets-end-to-load-reduction-after-540-days-free-of-load-shedding/) (November 2026) — current streak, EAF, Generation Recovery Plan progress, and the load shedding/load reduction distinction.\n2. South African Government News Agency (SAnews), [Eskom reports on generation recovery](https://www.sanews.gov.za/node/85531) and [No load shedding in over 500 days, says Eskom](https://www.sanews.gov.za/node/84735) (2026).\n3. CSIR, [Loadshedding down 82% in H1 2025 as demand eases and EAF edges up, but tariffs still exceed inflation](https://www.csir.co.za/media-hub/media-room/loadshedding-down-82-in-h1-2025-as-demand-eases-and-eaf-edges-up-but-tariffs) (September 2025).\n4. Engineering News, [Loadshedding fell 82% in first half amid demand drop, steady Eskom output](https://www.engineeringnews.co.za/article/loadshedding-fell-82-in-first-half-amid-demand-drop-steady-eskom-output-2025-09-26) (26 September 2025).",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":        "Load shedding is a controlled process used to reduce demand on the national electricity grid when supply is constrained. Stages range from Stage 1 (lowest impact) to Stage 8 (severe impact).",
    "current-status":  "Add the latest officially reported load shedding stage, updated frequency, and source. Describe the current system adequacy context.",
    "stage-breakdown": "Add definitions for each load shedding stage — how many MW of load reduction each represents, typical duration patterns, and which areas are affected.",
    "trends":          "Add historical load shedding data — total hours per year, frequency by stage, and comparison across years since 2008.",
    "visualisations":  "Add charts showing historical load shedding stages over time, frequency heatmaps, and duration summaries.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Current Load Shedding Stage" },
            ]} />

            <EditablePageHeader
                pageKey="topic.current-load-shedding-stage"
                defaultLabel="Topic"
                defaultTitle="Current Load Shedding Stage"
                defaultDesc="South Africa has gone 546 consecutive days without load shedding as of Eskom's 16 November 2026 update — this page covers the current status, stage definitions, and the historical recovery."
            />

            <EditableSections
                pageKey="topic.current-load-shedding-stage"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
