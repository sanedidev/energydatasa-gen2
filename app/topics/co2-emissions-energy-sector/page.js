import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "CO₂ Emissions (Energy Sector)" };

const DEFAULT_SECTIONS = [
    { id: "overview",         label: "Overview" },
    { id: "emissions-sources",label: "Key Emissions Sources" },
    { id: "carbon-tax",       label: "Carbon Tax" },
    { id: "ndcs-targets",     label: "NDCs & Reduction Targets" },
    { id: "visualisations",   label: "Visualisations" },
    { id: "datasets",         label: "Related Datasets" },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa is one of the world's most carbon-intensive economies relative to its size, primarily due to its heavy dependence on coal for electricity generation. Total greenhouse gas (GHG) emissions were approximately 470–510 Mt CO₂ equivalent per year in 2019–2022 (latest inventory data). The energy sector accounts for roughly 80% of this total (~380–410 Mt CO₂eq), making it the dominant driver of South Africa's climate impact. Per-capita emissions of approximately 8–9 tCO₂eq/year place SA well above the African average and comparable to some European nations, despite being an upper-middle income country. Add current emissions data and comparison context.",

    "emissions-sources":
        "The electricity sector is the largest source, contributing approximately 200–220 Mt CO₂ per year from Eskom's coal fleet. Road transport is the second largest (~55–65 Mt CO₂), followed by industrial processes including Sasol's coal-to-liquids and gas-to-liquids operations at Secunda (~50–60 Mt CO₂ — one of the world's single largest point-source emitters). Fugitive emissions from coal mining add another ~15–20 Mt. Residential energy use (cooking and heating with coal, paraffin, and wood) accounts for ~20–30 Mt. Add breakdown with percentage shares and sector-level trend data.",

    "carbon-tax":
        "South Africa introduced a carbon tax in June 2019 under the Carbon Tax Act (No. 15 of 2019). The tax initially applied at R120/tCO₂eq (~$6.50/tCO₂), rising to R159/tCO₂eq by 2023. Phase 1 (2019–2022) included generous allowances reducing the effective tax rate to R6–R48/tCO₂. Phase 2 (from 2023) is increasing the effective tax rate and broadening coverage. Revenues fund the Energy Efficiency Demand Side Management programme and other climate finance. Most economists consider the current rate too low to drive significant behavioural change. The tax is administered by SARS. Add current tax rate, allowances, and revenue collected.",

    "ndcs-targets":
        "South Africa's Nationally Determined Contribution (NDC), updated in 2021, targets a peak-plateau-decline trajectory: emissions must peak no later than 2025, plateau through 2035, and then decline to 350–420 Mt CO₂eq by 2030. This is a significant tightening from the original 2015 NDC. The NDC's 2030 range is conditional on receiving international climate finance — primarily through the Just Energy Transition (JET) partnership ($8.5 billion committed). South Africa's Long-Term Low Emissions Development Strategy (LT-LEDS) sets a net-zero target for 2050. Add progress tracking against the NDC trajectory and JET implementation status.",

    "visualisations":
        "Add charts showing: total GHG emissions 2000–present (Mt CO₂eq); energy sector emissions by source (stacked bar — electricity, transport, industry, fugitive); electricity generation carbon intensity (gCO₂/kWh) trend; carbon tax revenue collected; SA emissions vs peers (Brazil, India, Australia). Data sources: Department of Forestry, Fisheries and the Environment (DFFE) National GHG Inventory, IEA, Climate Watch, and the South African National Energy Balance.",

    "datasets":
        "Key data sources: DFFE National Greenhouse Gas Inventory (biennial update), South African National Energy Balance (Stats SA), IEA South Africa CO₂ emissions data, Climate Watch NDC data, SARS carbon tax revenue, and Eskom Integrated Reports (Scope 1 emissions). Link to relevant datasets on this platform.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "CO₂ Emissions (Energy Sector)" },
            ]} />

            <EditablePageHeader
                pageKey="topic.co2-emissions-energy-sector"
                defaultLabel="Topic"
                defaultTitle="CO₂ Emissions (Energy Sector)"
                defaultDesc="Carbon dioxide emissions from electricity generation, fuel combustion, and other energy-related activities in South Africa."
            />

            <EditableSections
                pageKey="topic.co2-emissions-energy-sector"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
