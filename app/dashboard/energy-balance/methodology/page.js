import Link from "next/link";
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
            { type: "title", title: "Primary Energy Supply Methodology", subtitle: "Data sources for South Africa's TPES of 5,661 PJ (2024)" },
            "**Coal** accounts for over 70% of South Africa's primary energy supply. Production data is sourced from the **DMRE (Department of Mineral Resources and Energy)** Mineral Economics Directorate, which collects monthly returns from all registered collieries. Export volumes are verified against **SARS customs statistics**.\n\n**Crude oil and refined products** are tracked through importer declarations to the **Central Energy Fund (CEF)** and **SARS** import/export data. Key importers include Sasol, TotalEnergies, and various commodity trading companies operating through SA's coastal refineries and import terminals.",
            "**Nuclear energy** input is reported directly by **Eskom** from Koeberg Nuclear Power Station. The thermal equivalent methodology converts net electricity generation into a primary energy figure using a standard conversion, consistent with IEA practice — hence the symmetric input/output figures for nuclear in the conversion section.\n\n**Renewable energy** (solar PV, wind, hydro) primary supply figures are derived from generation data compiled by **Eskom** and the **IPP Office** (Independent Power Producers Procurement Programme). For non-thermal sources, primary input is set equal to electricity output.",
            { type: "text", content: "**Stock changes** represent the difference between opening and closing energy inventories. For coal, Eskom reports its strategic coal reserve changes annually. Oil product stocks are tracked through the CEF and the Strategic Fuel Fund (SFF).", bg: "gray" },
        ]),
    },
    {
        id: "conversion",
        label: "Conversion & Transformation",
        defaultContent: JSON.stringify([
            { type: "title", title: "Conversion & Transformation Methodology", subtitle: "Power generation, refineries, and coal-to-liquids" },
            "**Power generation** data comes from **Eskom's annual reports and sustainability disclosures** and the **IPP Office**. For each generation type the NEB records both fuel input and electricity output. Thermal efficiency for coal power plants is approximately 32–33%, reflecting the age and condition of Eskom's coal fleet.\n\n**CHP (Combined Heat and Power)** plants are reported through the **DoE Energy Use Surveys** and direct company submissions. Three CHP categories are tracked: Chemicals (Sasolburg), Pulp & Paper, and Sugar (bagasse-fired). CHP outputs include both electricity and useful process heat.",
            "**Crude oil refining** data comes from **Natref** (National Petroleum Refiners, a Sasol/TotalEnergies JV in Sasolburg) and **Engen's Durban refinery**. Inputs are imported crude oil; outputs are gasoline, diesel, LPG, kerosene, and heavy fuel oil.\n\n**Sasol CTL (Coal-to-Liquids)** at the Secunda complex is the world's largest single-site CTL operation. Coal input and synfuels output are reported directly by **Sasol in their annual sustainability disclosures**. Conversion efficiency is approximately 53%, reflecting the thermodynamic cost of Fischer-Tropsch synthesis.",
            { type: "text", content: "**T&D (Transmission & Distribution) losses** are reported by Eskom and municipal distributors. The NEB records approximately 137 PJ (~17% of gross generation) as network losses, consistent with South Africa's aging and under-maintained grid infrastructure.", bg: "amber" },
        ]),
    },
    {
        id: "industry",
        label: "Industry Sector",
        defaultContent: JSON.stringify([
            { type: "title", title: "Industry Sector Methodology", subtitle: "9 subsectors · 910 PJ final consumption · 41% of TFC" },
            "Industry is South Africa's largest energy-consuming sector. Data is collected through a combination of **direct company surveys**, **industry association submissions**, and the **DoE Energy Efficiency Survey**.\n\nNine subsectors are tracked:\n- **Chemicals & Petrochemicals** — Sasol operations at Sasolburg and Secunda\n- **Ferro-Alloys** — ferrochrome, ferromanganese (ICDA and AFSA member data)\n- **Iron & Steel** — ArcelorMittal SA, Highveld Steel (SEIFSA data)\n- **Non-Metallic Minerals** — cement (PPC, AfriSam via PAMSA), glass, ceramics\n- **Platinum Group Metals (PGMs)** — Anglo American Platinum, Impala, Sibanye-Stillwater\n- **Pulp & Paper** — Sappi and Mondi (PAMSA reporting)\n- **General Manufacturing** — Stats SA Manufacturing Survey (broader coverage)\n- **Mining (non-PGM)** — DMRE survey, Chamber of Mines member data\n- **Food & Beverages** — Stats SA, Agri SA, food sector associations",
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
            "The commerce sector covers energy used in **commercial and public-sector buildings**: offices, retail centres, schools, hospitals, hotels, and government facilities.\n\n**Electricity** dominates at approximately 75% of commercial consumption. Data comes from **Eskom's commercial tariff** customer records and municipal commercial consumption reports. **SANEDI's Building Energy Performance Certificate (EPC)** programme provides benchmark intensity data for key building types.\n\n**Natural gas** is consumed in commercial buildings served by Sasol's Western Cape reticulation network. Gas volumes are reported by **Sasol**.\n\n**Other fuels** — kerosene and LPG for backup generation and catering; HFO for large commercial boilers; wood and charcoal in food service — are estimated from the **DoE Commercial Energy Survey** and industry association data.",
            { type: "text", content: "**Boundary note:** The line between commercial and industrial energy use is not always clear. Large hospitals and universities are classified under commerce; enterprises with on-site auto-generation are classified under industry, with their generation appearing in the conversion section.", bg: "gray" },
        ]),
    },
    {
        id: "data-sources",
        label: "Data Sources",
        defaultContent: JSON.stringify([
            { type: "title", title: "Data Sources", subtitle: "Primary references used in the 2024 NEB compilation" },
            "## Government & Regulatory\n- **DMRE** (Dept of Mineral Resources and Energy) — coal production statistics, petroleum levy data, mineral economics returns\n- **DALRRD** (Dept of Agriculture, Land Reform and Rural Development) — agricultural energy use surveys\n- **Stats SA** — Manufacturing Survey, General Household Survey, Living Standards Measure\n- **SARS Customs & Excise** — energy commodity import/export trade statistics, fuel levy data\n- **National Energy Regulator (NERSA)** — licensed generator and distributor data\n\n## State-Owned Entities\n- **Eskom Annual Report & Sustainability Disclosure** — electricity generation by source, T&D losses, coal fuel use, Koeberg nuclear input\n- **IPP Office** — renewable energy generation data for all REIPPPP bid-window projects\n- **Transnet Annual Report** — rail freight and passenger energy consumption\n- **ACSA (Airports Company SA)** — jet fuel uplifted at all licensed commercial airports\n- **CEF (Central Energy Fund)** — petroleum product levy, strategic fuel fund data\n- **Strategic Fuel Fund (SFF)** — crude and product stock changes\n\n## Industry & Associations\n- **Sasol Annual Sustainability Report** — CTL coal input/output, chemicals, gas distribution, refinery\n- **NAAMSA** — new vehicle registrations by fuel type, national vehicle fleet composition\n- **SEIFSA** — steel and engineering sector energy use\n- **PAMSA** — cement industry energy intensity and consumption\n- **Sappi / Mondi** — pulp and paper energy reporting (direct and indirect)\n- **ICDA / AFSA** — ferro-alloy sector energy data\n\n## Research Programmes\n- **UCT Energy Research Centre** — NEB compilation methodology, LEAP/TIMES energy modelling\n- **SANEDI Building EPC Programme** — commercial building energy intensity benchmarks\n- **DoE / SANEDI Energy Efficiency Survey** — industrial and commercial sector direct surveys\n- **Stats SA General Household Survey** — residential fuel mix, access to energy services",
        ]),
    },
    {
        id: "annual-update",
        label: "Annual Update Workflow",
        defaultContent: JSON.stringify([
            { type: "title", title: "Annual Update Workflow", subtitle: "How to update this platform when a new NEB is published" },
            { type: "text", content: "This section is for platform administrators. It documents the steps to ingest a new National Energy Balance year into the Energy Data SA platform.", bg: "blue" },
            "## Step 1 — Obtain the new NEB data\n- Download the latest NEB report from the **DMRE Energy Balances portal** (dmre.gov.za) or directly from **SANEDI / UCT ERC**.\n- Confirm the data year, unit (PJ), and sign convention (negative = consumption) match the existing format.\n- If the new NEB uses a different structure or adds new commodities, check with the platform administrator before proceeding.\n\n## Step 2 — Prepare the CSV upload file\n- Navigate to **Dashboard → National Energy Balance** while logged in as an admin.\n- Click **Template CSV** to download the blank upload template with all required columns and row IDs.\n- Fill in the new year's PJ values in the template. Match the `row_id` and `section_id` columns exactly — these are used to identify which cell each value belongs to.\n- Do not add or rename rows without updating the underlying data model. Leave cells blank (not zero) for genuinely absent data.\n\n## Step 3 — Upload via the Year Manager\n- On the energy balance page, scroll to the **Year Manager** panel (admin only).\n- Select the data year (e.g., 2025) and upload your completed CSV.\n- Review the preview step — check that totals look reasonable before confirming.\n- Click **Save Year** to store the new dataset. It will appear immediately in the year selector.\n\n## Step 4 — Verify the data\n- Switch to the new year in the year selector and spot-check key totals: TPES, electricity generation, TFC by sector.\n- Cross-check against the published NEB PDF or summary table.\n- Test the CSV and JSON download buttons for the new year.\n- Check the CO₂ overlay on sector pages — large unexpected changes may indicate a data entry error.\n\n## Step 5 — Update reference content\n- Update the NEB & Reference Documents section on the **Integrated Energy Plan** page to reference the new NEB.\n- Update the methodology page source date if methodology has changed.\n- If tariff rates have changed, update `app/apps/electricity-tariff-calculator/page.js` and `app/apps/solar-roi-calculator/page.js` with new NERSA-approved rates.",
        ]),
    },
    {
        id: "data-gaps",
        label: "Known Data Gaps",
        defaultContent: JSON.stringify([
            { type: "title", title: "Known Data Gaps", subtitle: "Limitations disclosed in the SANEDI 2024 NEB report" },
            { type: "text", content: "The following gaps are acknowledged by SANEDI and represent areas where the 2024 NEB data may be incomplete or based on estimation. Future editions of the NEB aim to address these through improved data collection and survey coverage.", bg: "amber" },
            "## 1. Rooftop and Embedded Solar PV\nGeneration from behind-the-meter solar installations (residential, commercial, and small industrial) is not fully captured in the NEB. The rapid growth of rooftop solar since 2021 — driven by load-shedding — means this gap is material and increasing. Estimates suggest 3–8 PJ annually may be unaccounted, with uptake concentrated in high-income residential and commercial segments.\n\n## 2. D-Form (Fuel Use Declaration) Coverage\nThe D-form system requires registered fuel consumers to declare end-use by sector, but compliance among smaller fleet operators and commercial consumers is low. As a result, the road transport fuel split between passenger and freight vehicles is modelled rather than directly observed, and carries statistical uncertainty.\n\n## 3. Jet Fuel Allocation\nACSA tracks total jet fuel uplifted at each airport but the domestic/international allocation is approximate, especially for charter, private aviation, and positioning flights not captured in scheduled airline data.\n\n## 4. Fuelwood and Biomass in Rural and Informal Areas\nBiomass consumption in low-income and rural households is survey-based (General Household Survey, HEEA). These surveys have sampling limitations and likely understate informal biomass use — particularly charcoal production from indigenous wood and its informal trade and consumption.\n\n## 5. Small-Scale and Subsistence Agriculture\nFuel and electricity use by smallholder, subsistence, and communal farmers is not captured in formal DMRE or agricultural association statistics. Estimates are extrapolated from communal farming area assessments and carry significant uncertainty.\n\n## 6. Municipal Electricity Distribution Data\nMunicipal electricity distributors report with varying timeliness and completeness to Eskom and NERSA. Some smaller municipalities have multi-year data gaps. T&D losses at the municipal level are estimated for non-reporting municipalities using regional average loss factors.",
        ]),
    },
];

export default function MethodologyPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">Dashboard</Link>
                <span className="text-slate-300">/</span>
                <Link href="/dashboard/energy-balance" className="text-slate-500 hover:text-slate-900 transition-colors">National Energy Planning</Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-900">Methodology</span>
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
