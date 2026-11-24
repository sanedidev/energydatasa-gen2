import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Balancing Supply & Demand — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Balancing Energy Supply and Demand", subtitle: "Demand-side management on a constrained grid" },
            "**Demand-side management (DSM)** covers the tools a utility uses to change *when* and *how much* electricity customers draw from the grid, rather than building new supply to meet every peak. In South Africa, DSM has been central to grid operation since the mid-2000s, when the gap between available generation capacity and demand first became acute.\n\nEskom ran its DSM effort from 2004 under the banner **Integrated Demand Management (IDM)**, funded in part by an environmental levy added to electricity tariffs. At its peak, the IDM programme is reported to have delivered roughly **4 GW** of demand reduction and energy savings between 2004 and 2013. Funding and institutional support subsequently declined, and the programme — excluding demand response — was transferred into Eskom Distribution.",
            { type: "text", content: "As of the most recent public information, Eskom's Distribution Demand Management Programme has been placed on hold pending a management review — check Eskom Distribution's own programme page for its current operating status before relying on specific programme terms.", bg: "amber" },
        ]),
    },
    {
        id: "dsm-measures",
        label: "DSM Measures",
        defaultContent: JSON.stringify([
            { type: "title", title: "DSM Measures", subtitle: "By sector" },
            "- **Industrial** — load curtailment agreements, compressed-air and motor-system optimisation (the same measures most commonly claimed under the Section 12L tax incentive), and process scheduling shifted away from peak periods.\n- **Commercial** — building management system upgrades, lighting retrofits, and participation in utility load-shifting programmes.\n- **Residential** — the **national solar water heater programme**, aiming to roll out around **one million solar water geysers**, subsidised at an estimated 20–30% of unit cost and funded through the electricity-tariff environmental levy; heat-pump water heating; and efficient-lighting distribution programmes.\n\nA persistent risk flagged in independent research on residential water heating is that backup electric elements in solar or heat-pump systems can still switch on during peak demand hours if not properly controlled, partly undermining the intended demand-shifting benefit.",
        ]),
    },
    {
        id: "peak-shaving",
        label: "Peak Shaving & Load Shifting",
        defaultContent: JSON.stringify([
            { type: "title", title: "Peak Shaving & Load Shifting" },
            "**Time-of-use (TOU) tariffs** are South Africa's main price-based demand-shifting tool, now covering roughly **80% of Eskom's electricity sales**. Eskom's residential **Homeflex** tariff applies steep peak-period rates and very low off-peak rates to encourage customers to shift consumption away from peak hours.\n\nThe Eskom evening peak period — the main target for load-shifting programmes — runs **18:00–20:00 in summer** and **17:00–19:00 in winter**.\n\nEskom has, at various points, proposed a **critical peak pricing** mechanism (charging a much higher rate on a small number of pre-announced high-risk days) requiring half-hourly time-of-use metering. NERSA's 2017 tariff determination acknowledged demand-side tools as worthwhile for system flexibility but did not approve a critical peak pricing pilot at that time.",
            { type: "text", content: "A side effect of steep TOU structures like Homeflex: because Eskom generally credits exported rooftop-solar energy at the same rate charged for consumption at that time of day, customers exporting during low-tariff off-peak periods receive comparatively little value for that energy.", bg: "gray" },
        ]),
    },
    {
        id: "programmes",
        label: "National Programmes",
        defaultContent: JSON.stringify([
            { type: "title", title: "National Programmes" },
            "- **EEDSM (Energy Efficiency and Demand-Side Management)** — the broader government funding mechanism, financed in part through an environmental levy on electricity tariffs, supporting municipal and sector-specific efficiency and demand-management projects.\n- **Eskom Integrated Demand Management (IDM), 2004–circa 2013** — Eskom's original flagship DSM programme; reported to have delivered approximately 4 GW of cumulative demand/energy savings at its height.\n- **Eskom Distribution Demand Management Programme (relaunched April 2023)** — reintroduced three sub-programmes (Residential Load Management, Energy Efficiency, and Load Management) targeting the evening peak, before being placed on hold pending review.\n- **National solar water heater programme** — a government-led rollout supported by Eskom and funded through EEDSM-linked tariff mechanisms.",
        ]),
    },
    {
        id: "visualisations",
        label: "Visualisations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Visualisations", subtitle: "Where to find the underlying data" },
            "This section does not embed live charts, but the following public sources carry the underlying data needed to build peak-demand, DSM-savings, and load-profile visualisations for South Africa:\n- **CSIR Utility Statistics Report** — regularly updated statistics on the South African electricity utility sector, including generation, demand and system performance data.\n- **Eskom's own Distribution Demand Management Programme materials** — programme-level participation and target data, published as Eskom updates its DSM offerings.\n- **NERSA tariff determinations** — the regulator's published decisions on Eskom's tariff structure, including TOU periods and rates.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Eskom, [Demand Management Programme — Distribution](https://www.eskom.co.za/distribution/demand-management-programme/).\n2. Eskom, [Distribution Demand Management Program](https://www.eskom.co.za/distribution/wp-content/uploads/2023/05/DDMP-Industry-engagement-Final.pdf) (2023).\n3. USAID / DMRE, [South Africa: Energy Efficiency Demand Side Management Experience (2004–2022)](https://www.savingenergy.org.za/reports/February%202024/USAID%20DMRE%20Report%201%20-%20DSM%202004-2022%20Experience-%20June2023%20Final.pdf).\n4. Eskom, [Tariff Restructuring Fact Sheet](https://www.eskom.co.za/eas/wp-content/uploads/2021/05/TARIFF-RESTRUCTURING-FACT-SHEET-Final-.pdf).\n5. Eskom, [Critical Peak Day Pricing Presentation](https://www.eskom.co.za/distribution/wp-content/uploads/2021/06/CriticalPeakDayPricingPresentation.pdf).\n6. Lawrence Berkeley National Laboratory, [South Africa Water Heating DSM — Executive Summary](https://eta-publications.lbl.gov/sites/default/files/final_executive_summary_-_south_africa_water_heating_dsm_5.28.2024.pdf) (May 2024).\n7. ITWeb, [Every Megawatt Counts](https://itweb.co.za/article/every-megawatt-counts/JN1gPvO23GpqjL6m) — on the national solar water heater programme.\n8. CSIR, [Utility Statistics Report](https://www.csir.co.za/sites/default/files/2025-11/UtilityStatisticsReportJan2025Final.pdf) (January 2025).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency & Planning", href: "/dashboard/energy-efficiency-planning" },
                { label: "Balancing Energy Supply and Demand" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Efficiency &amp; Planning</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Balancing Energy Supply and Demand</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-2xl">
                    Demand-side management, energy efficiency programmes, and peak-shaving strategies across South Africa&apos;s grid.
                </p>
            </div>

            <EditableSections
                pageKey="ee.balancing-energy-supply-and-demand"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
