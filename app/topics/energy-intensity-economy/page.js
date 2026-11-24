import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Energy Intensity of the Economy" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Intensity of the Economy", subtitle: "How much energy South Africa burns to produce a unit of economic output" },
            "Energy intensity measures how much energy an economy consumes per unit of GDP it produces — a lower number means more economic output per unit of energy. South Africa is consistently described as one of the more energy-intensive economies in the world, a legacy of its mining- and heavy-industry-led growth model (ferrochrome, platinum group metals, aluminium smelting, Sasol's coal-to-liquids complex) combined with historically cheap, coal-based electricity that discouraged efficiency investment.",
            { type: "text", content: "**A genuine data-coverage gap, stated honestly:** this platform could not find a current, clean, officially-published IEA or World Bank headline figure in MJ per unit of GDP for South Africa during this research pass. The figures below are the best currently available proxies, each clearly attributed to its own source — treat them as directionally informative rather than as a single precise, citable number.", bg: "amber" },
        ]),
    },
    {
        id: "why-it-matters", label: "Why It Matters",
        defaultContent: JSON.stringify([
            { type: "title", title: "Why Energy Intensity Matters" },
            "Energy intensity matters for three connected reasons. First, **economic efficiency** — falling intensity means the economy produces more value from the same energy input, lowering costs and emissions per unit of GDP. Second, **infrastructure planning** — a highly energy-intensive economy needs proportionally more generation and grid capacity to sustain growth, which matters directly for a country whose grid has only recently stabilised after years of load shedding. Third, **climate commitments** — South Africa's Nationally Determined Contribution (NDC) and its Just Energy Transition both depend on reducing energy intensity in parallel with switching to lower-carbon fuels, not fuel-switching alone.",
            "Mining, chemicals (Sasol), ferro-alloys, and iron & steel remain the sectors with the highest energy intensity and the largest efficiency potential — the same sectors tracked in this platform's [National Energy Planning → Industry Sector](/dashboard/energy-balance/methodology) methodology.",
        ]),
    },
    {
        id: "measurement", label: "Measurement & Methodology",
        defaultContent: JSON.stringify([
            { type: "title", title: "Measurement & Methodology" },
            "Energy intensity is typically calculated as Total Primary Energy Supply (TPES) or Total Final Energy Consumption (TFEC) divided by GDP (usually PPP-adjusted, constant prices, to allow international comparison). South Africa's own energy-supply data comes from the **South African National Energy Balance**, compiled with reference to SANEDI and the UCT Energy Research Centre (see this platform's [National Energy Planning methodology](/dashboard/energy-balance/methodology) page for the full data-source breakdown); GDP data comes from Stats SA and the South African Reserve Bank.",
            { type: "text", content: "**Key caveat:** intensity is heavily shaped by an economy's sectoral mix, not efficiency alone — a more industrial, mining-heavy economy like South Africa's will structurally show higher intensity than a services-dominated economy even at identical technical efficiency. Comparing intensity across countries without adjusting for industrial structure can overstate how much of the gap is genuinely about waste versus about what the economy actually produces.", bg: "gray" },
        ]),
    },
    {
        id: "trends", label: "SA Trends & International Comparisons",
        defaultContent: JSON.stringify([
            { type: "title", title: "Trends & International Comparisons" },
            "The clearest recent, sourced data point: Enerdata's August 2025 South Africa energy report found **final energy consumption stabilised at around 70 Mtoe in 2025**, still dominated by oil and coal, with **total primary energy supply roughly flat since 2023 at around 135 Mtoe** — i.e. a plateau rather than the older, often-repeated claim of a steady 1.5–2%/year intensity decline through the 2000s–2010s, which this platform could not independently verify for the current period.",
            "## International comparison — use with caution\n- The Global Economy's World Bank-derived series puts South Africa's energy use at roughly **140–155 kg of oil equivalent per US$1,000 of GDP** across 2021–2022 (155.29 in 2021, 140.79 in 2022) — a series that has moved only modestly over recent years, not improved sharply.\n- An older IEA country-profile figure (undated within the source) put South Africa at **0.179 ktoe per unit of GDP (2015 USD PPP)**, against a world average of **0.111** — roughly 60% above the global average.\n- Business Day's October 2026 commentary (Neva Makgetla) states more conservatively that South Africa uses **\"more than twice the international average\"** energy per dollar of GDP — a larger gap than the IEA figure implies, and the two sources were not reconciled during this research pass. Readers should treat \"roughly 1.6x to 2x-plus the global average\" as the honest range rather than picking a single multiple.",
        ]),
    },
    {
        id: "efficiency", label: "Energy Efficiency Programmes",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Efficiency Programmes" },
            "South Africa's main efficiency levers include the **12L Tax Incentive** (Section 12L of the Income Tax Act — a per-kWh-saved tax allowance for verified energy savings, administered with SANEDI's measurement-and-verification involvement), Eskom's **Energy Efficiency Demand Side Management (EEDSM)** programme, and the **National Energy Efficiency Strategy** (a National Treasury/DOEE document — see the gazetted strategy referenced in sources below). This platform could not confirm specific, current uptake statistics (GWh saved per year, sector-level breakdowns) for these programmes during this research pass, and does not want to repeat the old placeholder's unsourced specific figures (e.g. an unconfirmed \"R0.95/kWh\" 12L rate) as fact.",
            { type: "text", content: "For authoritative, current programme statistics, check SANEDI's own 12L reporting and the National Energy Efficiency Strategy document directly (linked in Sources below) rather than relying on this summary for exact figures.", bg: "gray" },
        ]),
    },
    {
        id: "visualisations", label: "Visualisations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Visualisations" },
            "Suggested charts for this page: South Africa's total primary energy supply and final consumption trend (Mtoe, 2023–present, per Enerdata); energy use per US$1,000 of GDP over time (The Global Economy / World Bank series); and a sector-level energy-intensity breakdown drawing on this platform's own [National Energy Planning](/dashboard/energy-balance) data by sector.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Enerdata, [South Africa energy report](https://www.enerdata.net/estore/energy-market/south-africa) (August 2025) — final consumption and primary supply figures.\n2. The Global Economy, [Energy per GDP — South Africa](https://www.theglobaleconomy.com/South-Africa/Energy_per_GDP/) — World Bank-derived energy-use-per-GDP series.\n3. IEA, [E4 Country Profile: Energy Efficiency in South Africa](https://www.iea.org/articles/e4-country-profile-energy-efficiency-in-south-africa).\n4. Business Day, [Neva Makgetla: South Africa's coal reliance slows its energy transition](https://www.businessday.co.za/opinion/2026-10-20-neva-makgetla-south-africas-coal-reliance-slows-its-energy-transition/) (20 October 2026).\n5. National Energy Efficiency Strategy (gazetted document), [via Parliamentary Monitoring Group](https://static.pmg.org.za/261030Nationalenergyefficiencystrategy_.pdf).\n6. This platform's own [National Energy Planning methodology](/dashboard/energy-balance/methodology) page — South African National Energy Balance data sources.",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":
        "Energy intensity measures how much primary energy (or final energy) is consumed per unit of GDP — typically expressed in MJ per constant-price USD or ZAR. South Africa is one of the most energy-intensive economies in the world. In 2022, SA's primary energy intensity was approximately 5–6 MJ per USD of GDP (PPP-adjusted), compared to a global average of around 4.3 MJ/USD. This high intensity reflects the dominance of mining and heavy industry in the economy, the inefficiency of an ageing coal fleet, and historically low energy prices that discouraged efficiency investment. Add current intensity figure and trend.",

    "why-it-matters":
        "Energy intensity is a critical indicator for three reasons. First, it reflects economic efficiency — a declining intensity means the economy is producing more output per unit of energy consumed, reducing costs and environmental impact. Second, it informs infrastructure planning — high intensity means South Africa needs more energy supply to grow, making capacity constraints more acute. Third, it underpins climate targets — SA's 2030 NDC and net-zero 2050 pathway both require significant reductions in energy intensity alongside fuel switching. Industries with high intensity (mining, chemicals, aluminium smelting) are priority targets for efficiency programmes. Add sector-level intensity breakdowns.",

    "measurement":
        "Energy intensity is calculated as: Total Primary Energy Supply (TPES) or Total Final Energy Consumption (TFEC) ÷ GDP (constant prices, PPP-adjusted). SA's energy data comes from the South African National Energy Balance (SANEB), published by the Department of Mineral Resources and Energy (DMRE). GDP data comes from Stats SA and the South African Reserve Bank (SARB). Internationally, the IEA and World Bank publish comparable energy intensity series. Key caveats: intensity differs significantly by sectoral composition (a more industrial economy will naturally have higher intensity), and PPP adjustment affects international comparisons substantially. Add data vintage and calculation notes.",

    "trends":
        "South Africa's energy intensity improved moderately from 2000 to 2014, declining approximately 1.5–2% per year, as the economy shifted somewhat toward services and load shedding inadvertently reduced industrial energy use. Since 2015, progress has stalled. International comparison (IEA 2022 data): SA's energy intensity is approximately 2x Australia, 3x the EU average, and comparable to some Gulf oil states. Within Africa, SA's intensity is higher than most peers due to its mining and heavy manufacturing base. South Africa performs better on energy intensity per unit of industrial output than the economy-wide figure suggests. Add year-on-year intensity data and sector breakdown.",

    "efficiency":
        "South Africa has several active energy efficiency programmes: the Energy Efficiency Demand Side Management (EEDSM) programme (Eskom-administered, targeting 1,500 MW demand reduction); the 12L Tax Incentive (Section 12L of the Income Tax Act, providing a R0.95/kWh allowance for verified energy savings — administered by SANEDI); the South African Energy Development Institute (SAEDI); and the National Energy Efficiency Action Plan (NEEAP). The industrial sector has the largest efficiency potential. Results from the 12L incentive show strong uptake in food and beverages, chemicals, and paper sectors. Add programme statistics: energy saved (GWh/year), cost-benefit ratios, and uptake by sector.",

    "visualisations":
        "Add charts showing: South Africa's primary energy intensity 2000–present (MJ/USD GDP); comparison with BRICS, Sub-Saharan Africa, and OECD average; energy intensity by sector (industry, transport, residential, commercial); energy intensity vs GDP growth scatter plot. Data sources: IEA World Energy Balances, World Bank World Development Indicators, Stats SA energy accounts, SANEB.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Energy Intensity of the Economy" },
            ]} />

            <EditablePageHeader
                pageKey="topic.energy-intensity-economy"
                defaultLabel="Topic"
                defaultTitle="Energy Intensity of the Economy"
                defaultDesc="How much energy South Africa requires to produce economic output — a key indicator of efficiency and structural change over time."
            />

            <EditableSections
                pageKey="topic.energy-intensity-economy"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
