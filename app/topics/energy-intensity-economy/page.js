import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Energy Intensity of the Economy" };

const DEFAULT_SECTIONS = [
    { id: "overview",      label: "Overview" },
    { id: "why-it-matters",label: "Why It Matters" },
    { id: "measurement",   label: "Measurement & Methodology" },
    { id: "trends",        label: "SA Trends & International Comparisons" },
    { id: "efficiency",    label: "Energy Efficiency Programmes" },
    { id: "visualisations",label: "Visualisations" },
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
