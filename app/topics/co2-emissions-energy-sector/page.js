import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "CO₂ Emissions (Energy Sector)" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "CO₂ Emissions (Energy Sector)", subtitle: "South Africa's carbon footprint, its energy-sector drivers, and the policy response" },
            "South Africa remains one of the world's most carbon-intensive economies relative to its size, driven overwhelmingly by coal-fired electricity and Sasol's coal-to-liquids operations. There is no single confirmed **current official** total to quote with confidence — South Africa's full National GHG Inventory is published on a lag and the most recent detailed breakdown is still in draft form. What's confirmed: the Department of Forestry, Fisheries and the Environment (DFFE)'s last **completed** National GHG Inventory Report (covering 2000–2022, published November 2024) put **net** emissions (after accounting for land use/forestry carbon sinks) at 446 Mt CO₂eq in 2000, declining to 442 Mt CO₂eq by 2020. Separately, the independent EDGAR database (via Climate Scorecard/Worldometers — **not** a DFFE figure) estimates South Africa's **gross** GHG emissions (excluding land use/forestry) at approximately 555 Mt CO₂eq in 2023 and 570 Mt CO₂eq in 2024, with fossil CO₂ alone at roughly 427 Mt and 440 Mt respectively. These two series measure different things (net-of-sinks vs gross) and shouldn't be read as a single consistent trend line.",
            { type: "text", content: "A still-draft Second Biennial Transparency Report (2024 data, published for comment in the Government Gazette) gives the clearest recent sector breakdown available: CO₂ makes up 82.5% of South Africa's total emissions (excluding land use/forestry), the energy sector accounts for 78.6% of total national emissions, methane contributes 12.7%, and agriculture alone totalled 52,744 Gg (52.7 Mt) CO₂eq in 2024. Because this report is still a first-order draft, treat these shares as indicative rather than final.", bg: "amber" },
        ]),
    },
    {
        id: "emissions-sources", label: "Key Emissions Sources",
        defaultContent: JSON.stringify([
            "Eskom's coal fleet is, by a wide margin, the dominant point source of South Africa's energy-sector emissions — the fleet's national installed coal capacity is around 47–48 GW (Eskom's own 2026 figures), with national electricity generation capacity of roughly 63 GW overall of which coal is about 69%. Eskom plans to retire roughly 7.4 GW of coal capacity by 2030, though several retirements (Hendrina, Grootvlei, Camden) have already been pushed back because the gas-fired replacement capacity that was meant to arrive first is running behind schedule.\n\n**Sasol's Secunda complex** (coal-to-liquids and gas-to-liquids) is widely cited as one of the single largest point-source industrial CO₂ emitters in the world, though an exact current Mt figure for Secunda specifically was not independently confirmed in this research pass — Sasol's own sustainability disclosures are the authoritative source. Road transport and residential solid-fuel use (coal, paraffin, wood for cooking and heating in lower-income households) are the next largest categories nationally, though — as above — a precise current percentage breakdown awaits DFFE's finalised inventory.",
        ]),
    },
    {
        id: "carbon-tax", label: "Carbon Tax",
        defaultContent: JSON.stringify([
            { type: "title", title: "Carbon Tax" },
            "South Africa's carbon tax (Carbon Tax Act, No. 15 of 2019) has risen sharply in its headline rate over the past two years: **R190/tCO₂eq in 2024 → R236/tCO₂eq in 2025** (a 24% jump) **→ R308/tCO₂eq in 2026** (a further 31% increase — the largest single-year jump since the tax began in 2019). The Carbon Tax Act's own schedule takes the headline rate to R347 (2027), R385 (2028), and R462 (2030).\n\nMost liable companies pay far below the headline rate because of tax-free allowances, which are being phased down over time rather than removed immediately. A 2026 effective-rate table (Webber Wentzel) puts the **effective** rate — after maximum allowances — at roughly **R46.20/tCO₂eq** for combustion emissions and **R15.40/tCO₂eq** for process and fugitive emissions; some businesses receive rebates of up to 95% on their carbon tax liability. A related carbon fuel levy rises to 19c/litre on petrol and 23c/litre on diesel from 1 April 2026.",
            { type: "text", content: "The tax's future has been politically contested: Electricity and Energy Minister Kgosientsho Ramokgopa reportedly pushed for it to be suspended, citing the cost pressure on Eskom and energy-intensive industry, but the February 2026 Budget kept the tax in place. The tax is administered by SARS; revenue supports broader climate and energy-efficiency finance.", bg: "gray" },
        ]),
    },
    {
        id: "ndcs-targets", label: "NDCs & Reduction Targets",
        defaultContent: JSON.stringify([
            { type: "title", title: "NDCs & Reduction Targets" },
            "South Africa submitted its **second Nationally Determined Contribution (NDC 3.0)** to the UNFCCC on 24 October 2025, ahead of COP30 — this supersedes the earlier 2021-updated first NDC as the current official target. The new NDC covers the 2031–2035 commitment period and targets **320–380 Mt CO₂eq by 2035**. For comparison, the 2021 NDC it replaces had targeted 398–510 Mt CO₂eq by 2025 and 350–420 Mt CO₂eq by 2030 under a peak-plateau-decline trajectory (peak by 2025, plateau to 2035). IRP 2025 (the current official electricity capacity plan) projects roughly 44 GW of new renewable capacity by 2035 as part of how the NDC's mitigation target is meant to be met.",
            { type: "text", content: "South Africa's Long-Term Low Emissions Development Strategy (LT-LEDS) still sets an overall net-zero-by-2050 ambition. Meeting the NDC's 2035 range is explicitly linked to receiving international climate finance — chiefly through the Just Energy Transition Partnership, whose International Partners Group has grown its pledged financing from an initial $8.5 billion (announced at COP26, November 2021) to $11.6 billion pledged as of a 2026 UK government progress update — though grants remain a small share of that total, with an increasing emphasis on mobilising private capital instead.", bg: "blue" },
        ]),
    },
    {
        id: "visualisations", label: "Visualisations",
        defaultContent: JSON.stringify([
            "Suggested charts for this section: total GHG emissions 2000–present (Mt CO₂eq, net vs gross basis labelled separately); energy-sector emissions by source; electricity generation carbon intensity (gCO₂/kWh) trend as Eskom's coal fleet ages and renewables/gas enter the mix; carbon tax headline vs effective rate over time; South Africa's NDC trajectory (2021 NDC vs NDC 3.0) against actual emissions.",
        ]),
    },
    {
        id: "datasets", label: "Related Datasets",
        defaultContent: JSON.stringify([
            "Key data sources for this topic: the DFFE National Greenhouse Gas Inventory Report (most recently completed edition covers 2000–2022, published November 2024) and its in-progress Biennial Transparency Reports; the South African National Energy Balance (this platform's own dataset, see **Dashboard → National Energy Planning**); SARS carbon tax administration pages; and Eskom's own Integrated Reports for Scope 1 generation emissions.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Anthesis Group, [South African carbon tax update: 2025 budget highlights](https://www.anthesisgroup.com/za/insights/south-african-carbon-tax-update-2025-budget-highlights/) and [2026 Budget Speech Highlights](https://www.anthesisgroup.com/za/insights/south-african-carbon-tax-update-2026/).\n2. KPMG, [South Africa increases VAT registration thresholds, carbon taxes](https://kpmg.com/us/en/taxnewsflash/news/2026/02/south-africa-increases-vat-registration-thresholds-carbon-taxes.html) (February 2026).\n3. Daily Maverick, [South Africa's carbon tax survives budget but debates on its future continue](https://www.dailymaverick.co.za/article/2026-03-01-south-africas-carbon-tax-survives-budget-but-debates-on-its-future-continue) (1 March 2026).\n4. Webber Wentzel, [From headline to effective: Navigating phase two with offsets as a tax asset](https://webberwentzel.com/News/Pages/from-headline-to-effective-navigating-phase-two-with-offsets-as-a-tax-asset.aspx).\n5. South African Revenue Service, [Carbon Tax — Phase 2](https://www.sars.gov.za/legal-lprep-dp-2024-03-phase-two-of-the-carbon-tax).\n6. UNFCCC, South Africa's Second Nationally Determined Contribution (NDC 3.0), submitted 24 October 2025 — [climate-laws.org summary](https://climate-laws.org/document/south-africa-nationally-determined-contribution-ndc3-0_16ac).\n7. Enerdata, [South Africa aims to reduce GHG emissions to 320–380 MtCO2eq by 2035](https://www.enerdata.net/publications/daily-energy-news/south-africa-aims-reduce-ghg-emissions-320-380-mtco2eq-2035.html).\n8. Climate Scorecard, [South Africa: Current Emission Levels](https://www.climatescorecard.org/2026/09/south-africa-current-emission-levels/) (EDGAR-derived estimates — not an official DFFE figure).\n9. Department of Forestry, Fisheries and the Environment, National Greenhouse Gas Inventory Report, South Africa 2000–2022 (published November 2024) — [PMG document archive](https://pmg.org.za/files/240502greenhousegasinventoryreport9-7-7_1.pdf).\n10. Engineering News, [South Africa set to run coal stations longer as gas projects lag](https://www.engineeringnews.co.za/article/south-africa-set-to-run-coal-stations-longer-as-gas-projects-lag-2026-06-12) (June 2026).",
        ]),
    },
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
