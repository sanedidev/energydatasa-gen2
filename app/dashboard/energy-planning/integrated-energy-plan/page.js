import Link from "next/link";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "ep.integrated-energy-plan";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Integrated Energy Plan (IEP)", subtitle: "South Africa's long-term energy strategy and planning framework" },
            "The **Integrated Energy Plan (IEP)** is South Africa's statutory long-term energy strategy, developed by the **Department of Mineral Resources and Energy (DMRE)** under the National Energy Act (2008). It sets out the overarching vision for the energy sector over a 20–30 year horizon, covering all energy carriers — electricity, liquid fuels, gas, coal, and renewables — in contrast to the IRP which deals only with electricity generation capacity.\n\nThe IEP is intended to be updated every five years and serves as the parent framework under which sector-specific plans (the IRP, Gas Master Plan, and Liquid Fuels Master Plan) are developed. The first IEP was published in 2016; a revised draft was released for public comment in 2019 but has not yet been formally gazetted as a final policy.",
            { type: "text", content: "**Modelling platform:** The IEP uses the **SATIM (South African TIMES Model)** developed by the UCT Energy Research Centre. SATIM is a bottom-up technology-explicit optimisation model that minimises total energy system cost subject to energy service demand, resource availability, infrastructure, and policy constraints.", bg: "blue" },
            "The IEP addresses five strategic objectives:\n1. **Energy security** — reducing dependence on coal and imported oil; diversifying the supply mix\n2. **Universal access** — achieving universal electricity and clean cooking access by 2030\n3. **Environmental sustainability** — meeting South Africa's Nationally Determined Contribution (NDC) commitments under the Paris Agreement\n4. **Economic development** — supporting industrial growth and job creation through competitive energy prices\n5. **Just transition** — managing the socioeconomic impact of coal-sector restructuring on affected communities",
        ]),
    },
    {
        id: "energy-balance",
        label: "Energy Balance & Scenarios",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Balance & Scenarios", subtitle: "Primary energy supply, final demand projections, and modelled pathways" },
            "The IEP projects total primary energy supply (TPES) from the current base of approximately 5,661 PJ (2024 NEB) to a range of 6,200–8,400 PJ by 2050, depending on the growth and decarbonisation scenario. The divergence between scenarios widens after 2030 as fuel switching and efficiency gains compound.\n\nKey supply-side projections by scenario:\n- **Baseline (current policies):** Coal remains dominant (>55% of TPES in 2050). Gas grows to ~12% driven by gas-to-power. Renewables reach ~20%.\n- **Climate-aligned (NDC):** Coal falls below 30% by 2050. Renewables (solar + wind) exceed 40% of electricity generation. Hydrogen begins contributing after 2040.\n- **High-growth:** Total TPES rises rapidly, requiring accelerated addition of all generation types.",
            "**Final energy demand projections** by sector (2050 baseline):\n- **Industry:** Remains the largest sector (~38–42% of TFC), with growth in mining and minerals processing partially offset by energy efficiency improvements\n- **Transport:** Moderate growth through 2035; EV uptake and modal shift compress growth toward 2050\n- **Residential:** Electrification drives a shift from biomass and paraffin; total residential energy declines as households switch to more efficient electric services\n- **Commerce:** Steady growth tracking GDP; demand response and building efficiency measures key variables",
            { type: "text", content: "**SATIM scenario definitions:** The SATIM model runs a least-cost optimisation across each scenario. Scenarios differ in (a) GDP and population growth assumptions, (b) carbon price/budget trajectory, (c) technology cost curves, and (d) policy constraints such as coal plant retirement schedules and renewable procurement targets.", bg: "gray" },
        ]),
    },
    {
        id: "demand-drivers",
        label: "Demand Drivers",
        defaultContent: JSON.stringify([
            { type: "title", title: "Demand Drivers", subtitle: "Key variables driving South Africa's long-term energy demand in IEP modelling" },
            "**GDP growth** is the primary driver of energy demand, particularly for the industrial and commercial sectors. The IEP uses three GDP trajectories:\n- **Low growth:** 1.5–2.0% per annum — reflecting a scenario of continued structural challenges, load-shedding impacts, and constrained investment\n- **Central growth:** 2.5–3.5% per annum — consistent with MTEF forecasts and National Development Plan targets\n- **High growth:** 4.0–5.0% per annum — requires resolution of infrastructure constraints and significant investment inflows\n\nThe energy intensity of GDP is modelled to decline over time as services grow as a share of output and as efficiency investments are made.",
            "**Population growth** affects residential and transport demand. Stats SA projects South Africa's population to reach approximately 66 million by 2030 and 75 million by 2050 (medium variant). Household size is declining, which increases the number of households and hence electricity connections despite moderate population growth.\n\n**Electrification rates** are a significant driver of residential demand composition. As households electrify (current access ~90%), paraffin, fuelwood, and candle use declines. The IEP models full electrification (including informal settlements) by 2030 under the central scenario.\n\n**Industrial output** is dominated by energy-intensive sectors (mining, chemicals, metals). The outlook for platinum, chrome, and steel production is a key uncertainty — demand growth in these sectors drives large incremental energy requirements.",
            { type: "text", content: "**Fuel switching** is modelled explicitly in SATIM. Key switches include: biomass → electricity in residential cooking; petrol/diesel → EVs in transport after 2030; coal boilers → gas or electric heat in commercial buildings. The rate of switching depends on relative fuel prices, carbon pricing, and appliance cost trajectories.", bg: "blue" },
        ]),
    },
    {
        id: "policy-pathways",
        label: "Policy Pathways",
        defaultContent: JSON.stringify([
            { type: "title", title: "Policy Pathways", subtitle: "Decarbonisation options, fuel substitution, and just transition considerations" },
            "**Decarbonisation pathway:** South Africa committed under its NDC to peak emissions between 2025–2030, followed by a plateau and then decline. The IEP's climate-aligned scenario operationalises this through:\n- **Coal phase-out:** Scheduled decommissioning of older Eskom coal plants (>40 years old) from 2025 onwards. Medupi and Kusile have a longer operating life but may require carbon capture if long-run carbon budgets are met.\n- **Renewable scale-up:** 5,000–8,000 MW of new solar PV and wind per year from 2025 to 2035, then 3,000–5,000 MW per year thereafter. Total renewable capacity could reach 70–100 GW by 2050.\n- **Demand-side management:** Mandatory efficiency standards for appliances, buildings, and industrial processes. DSM potential estimated at 2,000–3,000 MW equivalent by 2030.",
            "**The role of gas** is contested in South Africa's energy transition. The IEP's baseline scenario sees gas (domestic Rompco supply plus LNG imports) expanding to 15–20% of the electricity mix by 2035 as a flexible, low-carbon 'bridge' to replace retiring coal. Critics argue that gas lock-in risks stranded assets as renewable costs fall. The IRP 2023 draft takes a more cautious view on gas capacity, emphasising battery storage as the preferred flexibility solution.\n\n**Hydrogen and green fuels** appear in post-2035 IEP modelling. South Africa's renewable resource (solar and wind) positions it as a potential green hydrogen exporter. DMRE and DTIC have published a Hydrogen Society Roadmap (2021) that envisages 10 GW of electrolysis capacity by 2050.",
            { type: "text", content: "**Just transition:** The IEP incorporates employment impact modelling for the coal sector, which employs approximately 92,000 people directly (Chamber of Mines) and supports 500,000+ livelihoods including indirect employment. The Presidential Climate Commission (PCC) has published a Just Transition Framework (2022) that informs the IEP's socioeconomic analysis for affected provinces (Mpumalanga, Limpopo, KwaZulu-Natal).", bg: "amber" },
        ]),
    },
    {
        id: "neb-link",
        label: "NEB & Reference Documents",
        defaultContent: JSON.stringify([
            { type: "title", title: "NEB & Reference Documents", subtitle: "Key source documents and downloadable references" },
            "The **2024 South Africa National Energy Balance** compiled by SANEDI and the UCT Energy Systems Research Group (ESRG) is the primary data source that feeds into the SATIM modelling underpinning the IEP. The NEB provides the base-year calibration for all energy flow projections in this platform.\n\nAll energy data on this platform — Primary Energy Supply, Conversion & Transformation, and Final Consumption by sector — is drawn directly from the 2024 NEB. The figures cited in IEP modelling contexts (TPES of 5,661 PJ, electricity generation of 671 PJ, etc.) refer to this dataset.",
            { type: "text", content: "**Download the 2024 NEB report:** The SANEDI/UCT ESRG published report is available from the DMRE Energy Balances portal (dmre.gov.za). Once a hosted link is available, it can be added here by editing this section.", bg: "blue" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Primary data sources underpinning the IEP and SATIM modelling" },
            "## Energy Balance & Statistics\n- **National Energy Balance (NEB)** — SANEDI/UCT ERC; annual energy flow data by source, carrier, and sector; forms the base year calibration for SATIM\n- **IEA World Energy Statistics** — international comparison and supplementary commodity data\n- **Stats SA Energy Account** — environmental-economic accounting framework; energy use by industry classification\n\n## Macroeconomic & Demographic\n- **Stats SA Mid-Year Population Estimates** — national and provincial population projections used in demand modelling\n- **National Treasury MTEF** — medium-term GDP, fiscal, and investment projections\n- **World Bank GDP growth scenarios** — used for long-run (2030–2050) economic trajectory assumptions\n\n## Electricity & Infrastructure\n- **Eskom Annual Report** — generation capacity, fuel consumption, and operational data\n- **IPP Office** — renewable energy procurement programme results (REIPPP) by bid window\n- **NERSA Generation Licence Register** — all licensed generating capacity by type and location\n- **CSIR Energy Centre** — independent capacity expansion modelling and load growth analysis\n\n## Policy & Planning\n- **IEP 2016 (gazetted)** and **IEP 2019 (draft)** — DMRE\n- **NDC (2021 updated)** — South Africa's Paris Agreement commitments and emissions trajectory\n- **Presidential Climate Commission Just Transition Framework (2022)**\n- **SATIM documentation** — UCT Energy Research Centre model documentation and scenario assumptions",
        ]),
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
                <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">Datasets</Link>
                <span className="text-slate-300">/</span>
                <Link href="/dashboard/energy-planning" className="text-slate-500 hover:text-slate-900 transition-colors">Energy Planning</Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-900">Integrated Energy Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Planning"
                defaultTitle="Integrated Energy Plan (IEP)"
                defaultDesc="South Africa's long-term energy strategy — balancing supply scenarios, demand projections, and policy pathways across all energy carriers."
            />

            <EditableSections
                pageKey={PAGE_KEY}
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
