import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Peak Demand (MW)" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "annual-peaks",
        label: "Annual Peaks",
        defaultContent: JSON.stringify([
            "South Africa's national peak demand has been on a sustained downward trend for over a decade from the levels seen before the generation capacity crisis that emerged from 2007 onward. That earlier decline was widely attributed to constrained supply (demand effectively suppressed by load-shedding) rather than falling underlying energy need.\n\n**More recently, a different driver has taken over.** Eskom's 2026 system status reporting recorded an annual dispatchable-generation peak of **29,081 MW (8 June 2026)** and an RSA contracted peak of **30,075 MW (10 June 2026)** — both noticeably below 2021 peak levels (reported in the 32,000–35,000 MW range across various measures) and below March 2025's 28,905 MW reading (March 2026 came in at 26,500 MW). With load shedding now largely absent (see the system-stress note below), commentary attributes the continuing decline mainly to growing customer **self-generation — principally rooftop solar paired with battery storage** — rather than demand suppression.",
            { type: "text", content: "Different reports measure slightly different things (dispatchable generation peak vs. RSA contracted peak vs. residual grid demand), so treat exact MW figures from different sources as not directly comparable without checking which measure each one uses.", bg: "gray" },
        ]),
    },
    {
        id: "seasonal-patterns",
        label: "Seasonal Patterns",
        defaultContent: JSON.stringify([
            "**Winter evenings** produce the sharpest demand peaks nationally, driven by residential heating and lighting load coinciding with the return-from-work period — typically in the range of 17:00 to 20:00 — compounded by commercial and industrial load that hasn't yet wound down for the day. **Summer peaks** are generally lower and flatter, though air conditioning load has become an increasingly significant contributor to summer demand, particularly in Gauteng and inland metros, as cooling appliance ownership has grown.",
        ]),
    },
    {
        id: "system-stress",
        label: "System Stress Indicators",
        defaultContent: JSON.stringify([
            { type: "text", content: "**Reserve margin** — the buffer of available generation capacity above forecast peak demand — remains the single most important underlying indicator of system stress, regardless of whether load-shedding is currently occurring.", bg: "gray" },
            "**The situation has changed substantially from the 2021–2023 crisis period.** Eskom reported over 540 consecutive days without load-shedding and an Energy Availability Factor (EAF) of roughly 68% as of November 2026, up from the low-to-mid 50s% during the worst of the crisis. This recovery is attributed to Eskom's Generation Recovery Plan — improved planned-maintenance execution and reduced unplanned breakdowns — rather than new capacity additions resolving the underlying shortfall.\n\nA related but distinct measure, **municipal load reduction** (localised power limiting in specific areas, not nationwide load-shedding), has not been fully eliminated — Eskom has targeted its complete removal by **March 2027**.",
            { type: "text", content: "**OCGT diesel dispatch hours and spend** remain a useful proxy for system stress even without load-shedding: heavy reliance on expensive diesel peaking capacity signals the coal fleet is still being pushed to cover shortfalls, whereas a healthy system meets peak demand from cheaper baseload and scheduled dispatch alone.", bg: "amber" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. National Transmission Company South Africa (NTCSA), [Weekly System Status Report, Week 29 2026](https://www.ntcsa.co.za/wp-content/uploads/2026/07/Weekly_System_Status_Report_2026_w29.pdf).\n2. Min-Met, [Eskom's Energy Availability Factor Declined in March 2026 to 66.8%](https://min-met.com/blog/eskoms-energy-availability-factor-declined-in-march-2026-to-66-8/).\n3. ESI-Africa, [Eskom Power System Enters 2026 with Key Performance Gains](https://www.esi-africa.com/news/eskom-power-system-enters-2026-with-key-performance-gains/).\n4. Eskom, [Improved Generation Performance Strengthens Grid Stability and Extends South Africa's Record Reliable Supply Period](https://www.eskom.co.za/improved-generation-performance-strengthens-grid-stability-and-extends-south-africas-record-reliable-supply-period/).\n5. Government of South Africa, [Eskom Marks 300 Days Without Loadshedding](https://www.gov.za/news/media-statements/eskom-marks-300-days-without-loadshedding-13-mar-2026) (13 March 2026).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Demand", href: `${ROOT}/electricity/demand` },
                { label: "Peak Demand (MW)" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Peak Demand (MW)</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Annual peaks, seasonal patterns, and system stress indicators.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.demand.peak-demand-mw"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
