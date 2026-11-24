import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Municipalities with Energy Data" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Municipalities with Energy Data", subtitle: "How electricity is bought, resold, and lost at the local-government level" },
            "Most South Africans buy electricity from their local municipality, not directly from Eskom. Municipalities purchase bulk electricity from Eskom and resell it to residents and businesses at a markup, which commonly also cross-subsidises other municipal services such as roads and water. This makes municipal energy data — sales volumes, revenue, losses, and debt to Eskom — a direct indicator of both electricity reliability and municipal financial health, which are increasingly linked problems in South Africa.",
        ]),
    },
    {
        id: "data-coverage", label: "Data Coverage",
        defaultContent: JSON.stringify([
            { type: "title", title: "What This Data Covers" },
            "Municipal electricity data typically covers: bulk purchase volumes from Eskom, resale volumes and revenue by customer category, the municipal markup applied, distribution losses (technical and non-technical), municipal debt owed to Eskom, and Free Basic Electricity provision to indigent households.",
            { type: "text", content: "**Municipal debt to Eskom reached R110.5 billion as of March 2026** (up from R94.6bn at end-2025) — metros contributed R2.3bn of the recent increase, non-metro municipalities R13.6bn. Eskom has publicly warned this could reach R300 billion by 2030 without intervention, and has described municipal debt as the single greatest threat to its own financial sustainability.", bg: "amber" },
        ]),
    },
    {
        id: "use-cases", label: "Use Cases",
        defaultContent: JSON.stringify([
            { type: "title", title: "Use Cases" },
            "Municipal-level energy data supports: local energy and infrastructure planning; monitoring service-delivery failures (prolonged outages, billing disputes); benchmarking one municipality's losses or markup against peers; tracking the build-up of municipal debt to Eskom as an early-warning indicator for supply risk; and regulatory oversight by NERSA and National Treasury of municipal tariff applications.",
        ]),
    },
    {
        id: "key-metrics", label: "Key Metrics",
        defaultContent: JSON.stringify([
            { type: "title", title: "Key Metrics — Worked Examples" },
            "## Eskom's own distribution network (for context)\nEskom's distribution losses — technical plus non-technical, across its own licence area — worsened slightly from 10.42% to 10.54% in FY2026. Non-technical losses (theft and meter tampering, as distinct from ordinary technical line loss) cost Eskom R6.6 billion that year, down from R7.1 billion the year before.\n\n## Two illustrative metro examples\n- **City Power (Johannesburg)**, Jul–Sep 2025 quarter: bought 2,982,511,319 kWh from Eskom, sold only 1,728,203,856 kWh to customers — a loss rate of roughly **42%** for that single quarter.\n- **Nelson Mandela Bay**: losses reported above **27%** — more than four times the generally accepted ~6% technical-loss threshold — with the metro reporting a R1.4 billion loss on electricity in the 2024/25 financial year.",
            { type: "text", content: "These two metros are illustrative, not necessarily representative of all 257 South African municipalities — this platform could not source a single comprehensive metro-by-metro comparison during this research pass. For a full comparison, consult individual municipalities' annual financial statements or National Treasury's municipal finance data directly.", bg: "gray" },
        ]),
    },
    {
        id: "visualisations", label: "Visualisations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Visualisations" },
            "Suggested charts for this page: municipal debt to Eskom over time (R billion); distribution loss rate by municipality where reported; markup ratio (resale price ÷ Eskom bulk price) across municipalities; and bulk-purchase volume trends.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. ITWeb, [Eskom's R30bn profit can't outrun R6bn electricity theft](https://www.itweb.co.za/article/eskoms-r30bn-profit-cant-outrun-r6bn-electricity-theft/nWJadMbN3agMbjO1) — FY2026 Eskom distribution-loss figures.\n2. TimesLive, [Municipalities owe Eskom R120bn as debt threatens viability](https://www.timeslive.co.za/news/south-africa/2026-09-23-municipalities-owe-eskom-r120bn-as-debt-threatens-viability/) (23 September 2026).\n3. TimesLive, [Crippled by debt and crime, City Power needs urgent reform, says report](https://www.timeslive.co.za/news/2025-12-13-crippled-by-debt-and-crime-city-power-needs-urgent-reform-says-report/) (13 December 2025) — City Power quarterly purchase/sale volumes.\n4. BusinessTech, [Eskom warns its R110 billion headache could reach R300 billion in 5 years](https://businesstech.co.za/news/energy/854286/eskom-warns-its-r110-billion-headache-could-reach-r300-billion-in-5-years/) (1 October 2025).\n5. Engineering News, [Municipalities owe Eskom R110.5 billion for electricity](https://www.engineeringnews.co.za/print-version/municipalities-owe-eskom-r1105-billion-for-electricity-2026-03-27) (27 March 2026).\n6. Daily Maverick, Nelson Mandela Bay electricity-loss and business-chamber coverage.",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":       "Municipal energy data captures how electricity is distributed, consumed, and managed at a local government level — sales, customers, infrastructure, and supply reliability.",
    "data-coverage":  "Add what the datasets cover: electricity sales by customer category, number of connections, municipal electricity revenue, supply areas, distribution responsibilities, and energy losses.",
    "use-cases":      "Add practical applications of this data — local energy planning, infrastructure investment, service delivery monitoring, inter-municipal benchmarking, and regulatory oversight.",
    "key-metrics":    "Add the most important indicators: total electricity sold (GWh), revenue collected (R), non-technical losses (%), number of connected households, and availability metrics.",
    "visualisations": "Add charts showing consumption by municipality, revenue and sales trends, geographic distribution of supply areas, and connection growth over time.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Municipalities with Energy Data" },
            ]} />

            <EditablePageHeader
                pageKey="topic.municipal-energy-data"
                defaultLabel="Topic"
                defaultTitle="Municipalities with Energy Data"
                defaultDesc="Energy data at municipal level — supporting local planning, service delivery analysis, and regional comparisons across South Africa."
            />

            <EditableSections
                pageKey="topic.municipal-energy-data"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
