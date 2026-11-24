import Link from "next/link";
import NEBBackLink from "@/app/components/ui/NEBBackLink";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "neb.methodology";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "What is the National Energy Balance?", subtitle: "Structure, methodology, and sign conventions" },
            "The **South Africa National Energy Balance (NEB) 2024** is a comprehensive statistical framework that accounts for all energy flows in the country — from primary extraction and imports, through transformation processes such as power generation and refining, to final consumption across all economic sectors.\n\nCompiled by **SANEDI (South African National Energy Development Institute)** in partnership with the **UCT Energy Research Centre (ERC)**, the NEB follows the methodology of the **International Energy Agency (IEA)** and is designed to be consistent with international reporting standards.",
            { type: "text", content: "**Sign convention:** All values are in Petajoules (PJ). Negative values indicate energy consumed or exported (outflows). Positive values indicate energy produced or imported (inflows). The total for each section balances inputs against outputs.", bg: "blue" },
            "The balance is structured in three stages:\n1. **Primary Energy Supply** — extraction, imports, exports, and stock changes. Total TPES = 5,661 PJ (2024).\n2. **Conversion & Transformation** — power generation, refining, and coal-to-liquids. Net electricity generated = 671 PJ.\n3. **Final Consumption** — energy actually used by Agriculture, Commerce, Industry, Residential, and Transport sectors. Total TFC = 2,199 PJ.",
        ]),
    },
    {
        id: "primary-supply",
        label: "Primary Energy Supply",
        defaultContent: JSON.stringify([
            { type: "title", title: "Primary Energy Supply Methodology", subtitle: "Data sources behind the Total Primary Energy Supply figure above" },
            "**Coal** accounts for over 70% of South Africa's primary energy supply. Production data is sourced from the **DMPR (Department of Mineral and Petroleum Resources — the minerals/petroleum successor to the former DMRE, split from 2024)** Mineral Economics Directorate, which collects monthly returns from all registered collieries. Export volumes are verified against **SARS customs statistics**.\n\n**Crude oil and refined products** are tracked through importer declarations to the **Central Energy Fund (CEF)** and **SARS** import/export data. Key importers include Sasol, TotalEnergies, and various commodity trading companies operating through SA's coastal refineries and import terminals.",
            "**Nuclear energy** input is reported directly by **Eskom** from Koeberg Nuclear Power Station. The thermal equivalent methodology converts net electricity generation into a primary energy figure using a standard conversion, consistent with IEA practice — hence the symmetric input/output figures for nuclear in the conversion section.\n\n**Renewable energy** (solar PV, wind, hydro) primary supply figures are derived from generation data compiled by **Eskom** and the **IPP Office** (Independent Power Producers Procurement Programme). For non-thermal sources, primary input is set equal to electricity output.",
            { type: "text", content: "**Stock changes** represent the difference between opening and closing energy inventories. For coal, Eskom reports its strategic coal reserve changes annually. Oil product stocks are tracked through the CEF and the Strategic Fuel Fund (SFF).", bg: "gray" },
        ]),
    },
    {
        id: "conversion",
        label: "Conversion & Transformation",
        defaultContent: JSON.stringify([
            { type: "title", title: "Conversion & Transformation Methodology", subtitle: "Power generation, refineries, and coal-to-liquids" },
            "**Power generation** data comes from **Eskom's annual reports and sustainability disclosures** and the **IPP Office**. For each generation type the NEB records both fuel input and electricity output. Thermal efficiency for coal power plants is approximately 32–33%, reflecting the age and condition of Eskom's coal fleet.\n\n**CHP (Combined Heat and Power)** plants are reported through **DMPR Energy Use Surveys** and direct company submissions. Three CHP categories are tracked: Chemicals (Sasolburg), Pulp & Paper, and Sugar (bagasse-fired). CHP outputs include both electricity and useful process heat.",
            "**Crude oil refining** data comes from **Natref** (National Petroleum Refiners, a Sasol/TotalEnergies JV in Sasolburg) and **Engen's Durban refinery**. Inputs are imported crude oil; outputs are gasoline, diesel, LPG, kerosene, and heavy fuel oil.\n\n**Sasol CTL (Coal-to-Liquids)** at the Secunda complex is the world's largest single-site CTL operation. Coal input and synfuels output are reported directly by **Sasol in their annual sustainability disclosures**. Conversion efficiency is approximately 53%, reflecting the thermodynamic cost of Fischer-Tropsch synthesis.",
            { type: "text", content: "**T&D (Transmission & Distribution) losses** are reported by Eskom and municipal distributors. The NEB records approximately 137 PJ (~17% of gross generation) as network losses, consistent with South Africa's aging and under-maintained grid infrastructure.", bg: "amber" },
        ]),
    },
    {
        id: "industry",
        label: "Industry Sector",
        defaultContent: JSON.stringify([
            { type: "title", title: "Industry Sector Methodology", subtitle: "9 subsectors · 910 PJ final consumption · 41% of TFC" },
            "Industry is South Africa's largest energy-consuming sector. Data is collected through a combination of **direct company surveys**, **industry association submissions**, and the **DMPR Energy Efficiency Survey**.\n\nNine subsectors are tracked:\n- **Chemicals & Petrochemicals** — Sasol operations at Sasolburg and Secunda\n- **Ferro-Alloys** — ferrochrome, ferromanganese (ICDA and AFSA member data)\n- **Iron & Steel** — ArcelorMittal SA, Highveld Steel (SEIFSA data)\n- **Non-Metallic Minerals** — cement (PPC, AfriSam via PAMSA), glass, ceramics\n- **Platinum Group Metals (PGMs)** — Anglo American Platinum, Impala, Sibanye-Stillwater\n- **Pulp & Paper** — Sappi and Mondi (PAMSA reporting)\n- **General Manufacturing** — Stats SA Manufacturing Survey (broader coverage)\n- **Mining (non-PGM)** — DMPR survey, Minerals Council South Africa member data\n- **Food & Beverages** — Stats SA, Agri SA, food sector associations",
            { type: "text", content: "**Electricity** dominates industry consumption at 322 PJ. Coal (bituminous + coking) for process heat and steam is second at approximately 341 PJ combined. Biomass — mainly bagasse co-firing in sugar processing — contributes 91 PJ.", bg: "gray" },
        ]),
    },
    {
        id: "residential",
        label: "Residential Sector",
        defaultContent: JSON.stringify([
            { type: "title", title: "Residential Sector Methodology", subtitle: "3 income segments · 241 PJ final consumption" },
            "Residential energy use is tracked across **three income segments** — Low, Middle, and High — reflecting South Africa's highly unequal household energy patterns.\n\n**Electricity** data is derived from **Eskom billing data** and municipal utility records. The split between income groups uses Stats SA's Living Standards Measure (LSM) in conjunction with electrification rate data from the DoE.\n\n**Fuelwood and biomass** are estimated from the **Stats SA General Household Survey (GHS)**, the **HEEA (Household Energy and Environment Activity)** surveys, and SANEDI community energy studies. Wood and charcoal are primarily used in low-income rural and peri-urban households for cooking and space heating.\n\n**LPG** consumption is tracked through importer and distributor data (TotalEnergies, Afrox, Oryx). LPG uptake has grown in middle-income households as a substitute for electricity during load-shedding periods.",
            { type: "text", content: "**Known data gap:** Rooftop solar PV generation in high-income households is not yet fully reflected in the NEB. With rapid installation growth since 2021 driven by load-shedding, this gap is growing and may represent 3–8 PJ or more of unaccounted generation annually.", bg: "amber" },
        ]),
    },
    {
        id: "transport",
        label: "Transport Sector",
        defaultContent: JSON.stringify([
            { type: "title", title: "Transport Sector Methodology", subtitle: "Road, rail, aviation, and pipeline · 800 PJ final consumption" },
            "Transport is South Africa's second-largest consuming sector, dominated by **road transport liquid fuels** (diesel and gasoline).\n\n**Road transport** — Fuel volumes are tracked through the **Central Energy Fund's** petroleum product levy system and **SARS** excise duty returns. However, the split between passenger and freight is *modelled* rather than directly measured, using **NAAMSA** vehicle fleet composition data and **SANRAL** traffic count data.\n\n**Aviation** — **ACSA (Airports Company SA)** tracks jet fuel uplifted at all major airports. The domestic/international allocation uses Civil Aviation Authority (CAA) flight data.\n\n**Rail** — Energy use figures come from **Transnet's** annual sustainability reports, covering both freight (coal, iron ore, containers, general freight) and passenger (PRASA) operations.\n\n**Pipeline** — Fuel transported through the Sasol pipeline network is tracked via **Sasol disclosures**.",
            { type: "text", content: "**Known data gap:** The D-form (fuel use declaration) compliance rate is low among smaller transport operators. The freight-passenger fuel split therefore relies on vehicle fleet modelling and carries associated uncertainty, particularly for the diesel split between truck freight and private diesel vehicles.", bg: "amber" },
        ]),
    },
    {
        id: "agriculture",
        label: "Agriculture Sector",
        defaultContent: JSON.stringify([
            { type: "title", title: "Agriculture Sector Methodology", subtitle: "Traction, irrigation, and heating · 67 PJ final consumption" },
            "Agricultural energy use covers three main end-uses: **traction** (tractors, harvesters, sprayers — predominantly diesel), **irrigation** (electric pump sets), and **heating** (grain drying, poultry houses, controlled-environment greenhouse heating).\n\n**Diesel** is the dominant agricultural fuel. The agricultural share of national diesel sales is estimated from **Agri SA** and **Grain SA** surveys, annual tractor and farm machinery statistics, and fuel use records held by the **Department of Agriculture, Land Reform and Rural Development (DALRRD)**.\n\n**Electricity** for irrigation is identified through **Eskom's agricultural tariff** customer category (Large and Small Agricultural tariffs). Municipal supply to farms is compiled from municipal energy reports.\n\n**LPG and kerosene** are used in controlled-environment agriculture (greenhouses, poultry farms). Estimates are derived from distributor surveys and DALRRD industry studies.",
            { type: "text", content: "**Known data gap:** Small-scale, subsistence, and communal farming is poorly captured in formal statistics. Fuelwood and biomass use in subsistence agriculture is extrapolated from household survey data and is likely understated.", bg: "amber" },
        ]),
    },
    {
        id: "commerce",
        label: "Commerce Sector",
        defaultContent: JSON.stringify([
            { type: "title", title: "Commerce Sector Methodology", subtitle: "Commercial and public buildings · 182 PJ final consumption" },
            "The commerce sector covers energy used in **commercial and public-sector buildings**: offices, retail centres, schools, hospitals, hotels, and government facilities.\n\n**Electricity** dominates at approximately 75% of commercial consumption. Data comes from **Eskom's commercial tariff** customer records and municipal commercial consumption reports. **SANEDI's Building Energy Performance Certificate (EPC)** programme provides benchmark intensity data for key building types.\n\n**Natural gas** is consumed in commercial buildings served by Sasol's Western Cape reticulation network. Gas volumes are reported by **Sasol**.\n\n**Other fuels** — kerosene and LPG for backup generation and catering; HFO for large commercial boilers; wood and charcoal in food service — are estimated from the **DMPR Commercial Energy Survey** and industry association data.",
            { type: "text", content: "**Boundary note:** The line between commercial and industrial energy use is not always clear. Large hospitals and universities are classified under commerce; enterprises with on-site auto-generation are classified under industry, with their generation appearing in the conversion section.", bg: "gray" },
        ]),
    },
    {
        id: "data-sources",
        label: "Data Sources",
        defaultContent: JSON.stringify([
            { type: "title", title: "Data Sources", subtitle: "Primary references used in the 2024 NEB compilation" },
            "## Government & Regulatory\n- **DMPR** (Dept of Mineral and Petroleum Resources, the minerals/petroleum successor to the former DMRE) — coal production statistics, petroleum levy data, mineral economics returns\n- **DOEE** (Dept of Electricity and Energy, the electricity-policy successor to the former DMRE) — electricity regulation, generation licensing, and transmission planning context\n- **DALRRD** (Dept of Agriculture, Land Reform and Rural Development) — agricultural energy use surveys\n- **Stats SA** — Manufacturing Survey, General Household Survey, Living Standards Measure\n- **SARS Customs & Excise** — energy commodity import/export trade statistics, fuel levy data\n- **National Energy Regulator (NERSA)** — licensed generator and distributor data\n\n## State-Owned Entities\n- **Eskom Annual Report & Sustainability Disclosure** — electricity generation by source, T&D losses, coal fuel use, Koeberg nuclear input\n- **IPP Office** — renewable energy generation data for all REIPPPP bid-window projects\n- **Transnet Annual Report** — rail freight and passenger energy consumption\n- **ACSA (Airports Company SA)** — jet fuel uplifted at all licensed commercial airports\n- **CEF (Central Energy Fund)** — petroleum product levy, strategic fuel fund data\n- **Strategic Fuel Fund (SFF)** — crude and product stock changes\n\n## Industry & Associations\n- **Sasol Annual Sustainability Report** — CTL coal input/output, chemicals, gas distribution, refinery\n- **NAAMSA** — new vehicle registrations by fuel type, national vehicle fleet composition\n- **SEIFSA** — steel and engineering sector energy use\n- **PAMSA** — cement industry energy intensity and consumption\n- **Sappi / Mondi** — pulp and paper energy reporting (direct and indirect)\n- **ICDA / AFSA** — ferro-alloy sector energy data\n\n## Research Programmes\n- **UCT Energy Research Centre** — NEB compilation methodology, LEAP/TIMES energy modelling\n- **SANEDI Building EPC Programme** — commercial building energy intensity benchmarks\n- **DMPR / SANEDI Energy Efficiency Survey** — industrial and commercial sector direct surveys\n- **Stats SA General Household Survey** — residential fuel mix, access to energy services",
        ]),
    },
    {
        id: "annual-update",
        label: "Annual Update Workflow",
        defaultContent: JSON.stringify([
            { type: "title", title: "Annual Update Workflow", subtitle: "How to update this platform when a new NEB is published" },
            { type: "text", content: "This section is for platform administrators. It documents the actual steps, and actual UI, used to add a new National Energy Balance year on this platform — rewritten against the live site rather than a generic description, since an earlier version of this section named buttons and panels that don't exist here.", bg: "blue" },
            "## Step 1 — Obtain the new NEB data\n- Source the new year's figures from SANEDI / UCT Energy Research Centre directly, or from the Department of Electricity and Energy where electricity-specific figures are involved.\n- Confirm the unit (PJ) and sign convention (negative = consumption, positive = production/supply/import) match the existing format before entering anything.\n\n## Step 2 — Create the year\n- Go to any National Energy Balance page (e.g. **Dashboard → National Energy Planning**).\n- In the dark hero section, find the year switcher and click **+ New year**, type the year (e.g. `2025`), and click **Create**. This creates an empty year — every section starts blank.\n\n## Step 3 — Populate each section's data\nThere are 8 sections to fill in: Primary Supply, Conversion & Transformation, Final Supply, and the 5 sector pages (Agriculture, Commerce, Industry, Residential, Transport). For each section, two ways to enter data (both write to the same underlying record, so pick whichever is more convenient per section):\n- **Inline editing** — open the section's **Edit** control and type values directly into the data table, cell by cell.\n- **CSV import** — each section has its own **Export** / **Import CSV** controls. Export an existing year as a starting template (to keep the row/column structure correct), fill in the new year's values, then import. Import always shows a **before/after diff preview** before anything is saved — malformed files are rejected with an error rather than silently reshaped.\n\n## Step 4 — Update year-specific context\n- Edit the **Source** line in the hero (hover it, click the pencil icon) to reflect the new year's source and date.\n- If the Sankey diagram's title should change for the new year, edit it the same way (hover the title, click the pencil icon).\n\n## Step 5 — Verify the data\n- Switch to the new year using the year switcher and spot-check key totals across pages: Total Primary Energy Supply, Electricity Generated, Total Final Consumption by sector.\n- Cross-check against your source document.\n- Confirm each section's CSV export round-trips correctly (export, re-import, no unexpected diff).\n\n## Step 6 — Update reference content\n- Update the **NEB & Reference Documents** section on the Integrated Energy Plan page to point at the new year's source.\n- If anything in this methodology description itself has changed (a new data source, a restructured sector), update the relevant section above.\n\nIf a year turns out to have been created in error, or there's genuinely not enough reliable data for it, it can be removed entirely via the trash icon next to that year in the year switcher (the default year can't be deleted this way) — this permanently removes all 8 sections' data plus the year's metadata, so use it deliberately.",
        ]),
    },
    {
        id: "data-gaps",
        label: "Known Data Gaps",
        defaultContent: JSON.stringify([
            { type: "title", title: "Known Data Gaps", subtitle: "Limitations disclosed in the SANEDI 2024 NEB report" },
            { type: "text", content: "The following gaps are acknowledged by SANEDI and represent areas where the 2024 NEB data may be incomplete or based on estimation. Future editions of the NEB aim to address these through improved data collection and survey coverage.", bg: "amber" },
            "## 1. Rooftop and Embedded Solar PV\nGeneration from behind-the-meter solar installations (residential, commercial, and small industrial) is not fully captured in the NEB. The rapid growth of rooftop solar since 2021 — driven by load-shedding — means this gap is material and increasing. Estimates suggest 3–8 PJ annually may be unaccounted, with uptake concentrated in high-income residential and commercial segments.\n\n## 2. D-Form (Fuel Use Declaration) Coverage\nThe D-form system requires registered fuel consumers to declare end-use by sector, but compliance among smaller fleet operators and commercial consumers is low. As a result, the road transport fuel split between passenger and freight vehicles is modelled rather than directly observed, and carries statistical uncertainty.\n\n## 3. Jet Fuel Allocation\nACSA tracks total jet fuel uplifted at each airport but the domestic/international allocation is approximate, especially for charter, private aviation, and positioning flights not captured in scheduled airline data.\n\n## 4. Fuelwood and Biomass in Rural and Informal Areas\nBiomass consumption in low-income and rural households is survey-based (General Household Survey, HEEA). These surveys have sampling limitations and likely understate informal biomass use — particularly charcoal production from indigenous wood and its informal trade and consumption.\n\n## 5. Small-Scale and Subsistence Agriculture\nFuel and electricity use by smallholder, subsistence, and communal farmers is not captured in formal DMPR or agricultural association statistics. Estimates are extrapolated from communal farming area assessments and carry significant uncertainty.\n\n## 6. Municipal Electricity Distribution Data\nMunicipal electricity distributors report with varying timeliness and completeness to Eskom and NERSA. Some smaller municipalities have multi-year data gaps. T&D losses at the municipal level are estimated for non-reporting municipalities using regional average loss factors.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "This page describes the methodology behind this platform's own National Energy Balance dataset, compiled with reference to SANEDI and the UCT Energy Research Centre's published work and the international framework both follow. A specific, stable public download link for the compiled 2024 South Africa National Energy Balance report itself was not confirmed during this research pass — check SANEDI's and the UCT Energy Research Centre's own publications pages directly, or the Department of Electricity and Energy, for the current document.",
            "1. International Energy Agency, [Understanding and Using the Energy Balance](https://www.iea.org/commentaries/understanding-and-using-the-energy-balance) — the IEA's own explanation of energy balance methodology, the framework this platform's balance follows.\n2. South African National Energy Development Institute (SANEDI), [official website](https://sanedi.org.za/) — the institute responsible for compiling the underlying National Energy Balance.\n3. University of Cape Town Energy Systems Research Group, [official website](https://www.esrg.uct.ac.za/) — SANEDI's compilation partner.",
        ]),
    },
];

export default function MethodologyPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
                <Link href="/dashboard" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">Dashboard</Link>
                <span className="text-[var(--color-ink-soft)]/40">/</span>
                <NEBBackLink href="/dashboard/energy-balance" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">National Energy Planning</NEBBackLink>
                <span className="text-[var(--color-ink-soft)]/40">/</span>
                <span className="font-medium text-[var(--color-ink)]">Methodology</span>
            </nav>

            {/* Editable header */}
            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="National Energy Planning · 2024"
                defaultTitle="Methodology & Data Sources"
                defaultDesc="How the 2024 South Africa National Energy Balance was compiled — data sources, sector methodology, sign conventions, and known gaps."
            />

            {/* Editable sections with pre-filled methodology content */}
            <EditableSections
                pageKey={PAGE_KEY}
                defaultSections={DEFAULT_SECTIONS}
            />

        </div>
    );
}
