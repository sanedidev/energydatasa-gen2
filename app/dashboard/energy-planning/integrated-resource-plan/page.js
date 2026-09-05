import Link from "next/link";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "ep.integrated-resource-plan";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Integrated Resource Plan (IRP)", subtitle: "South Africa's electricity generation capacity plan" },
            "The **Integrated Resource Plan (IRP)** is South Africa's statutory electricity generation capacity plan, published by the **Department of Mineral Resources and Energy (DMRE)** under the Electricity Regulation Act (2006). Unlike the IEP which covers all energy carriers, the IRP deals exclusively with the electricity sector — projecting how much new capacity is needed, of which technology types, and over what time horizon.\n\nThe IRP is legally required to be reviewed every two years. The most recently gazetted version is the **IRP 2019**, which set out a build programme through to 2030. A **revised IRP 2023 draft** was released for public comment in early 2023 and remains under review. The IRP is implemented through the **REIPPP (Renewable Energy IPP Procurement Programme)** and Eskom capacity expansion, with NERSA licensing all new generation projects.",
            { type: "text", content: "**Planning horizon:** IRP 2019 covers 2019–2030 (short term) with indicative capacity requirements to 2050. IRP 2023 draft extends the high-confidence horizon to 2032 and provides a longer-term indicative trajectory. The plan is reviewed under a least-cost optimisation framework using the PLEXOS or similar capacity expansion models.", bg: "blue" },
            "The IRP is calibrated to a **least-cost electricity system** subject to constraints including:\n- Reliability criteria (reserve margin and energy adequacy)\n- Carbon emission limits (linked to NDC and carbon budget trajectories)\n- Technology constraints (maximum buildable capacity per year by type)\n- Just transition requirements (coal plant retirement pacing)\n- Water availability (cooling water constraints for thermal plants)\n- Grid stability (inertia, frequency response, ramping requirements)",
        ]),
    },
    {
        id: "capacity-outlook",
        label: "Capacity Outlook",
        defaultContent: JSON.stringify([
            { type: "title", title: "Capacity Outlook", subtitle: "New additions, decommissioning, and the transition trajectory" },
            "**Current installed capacity (2024):** South Africa has approximately 58 GW of installed nameplate capacity, of which:\n- **Eskom coal fleet:** ~38 GW nameplate, but only 24–28 GW available after deductions for planned and unplanned outages\n- **Nuclear (Koeberg):** 1.8 GW (Units 1 and 2); undergoing Life Extension Programme (LEP) to extend operation to 2044/2045\n- **Pumped storage:** 2.7 GW (Ingula, Drakensberg)\n- **Gas and diesel (OCGTs):** ~3.4 GW (Ankerlig, Gourikwa, Dedisa)\n- **REIPPP IPPs (wind + solar PV):** ~6–7 GW operational by end 2024\n- **Rooftop solar:** ~4–5 GW behind-the-meter (estimated, growing rapidly since 2021)",
            "**IRP 2019 build programme (2019–2030):**\n- Solar PV: 6,000 MW\n- Wind: 14,400 MW\n- Gas (new OCGTs): 3,000 MW\n- Gas (new CCGTs): 3,000 MW\n- Nuclear: 2,500 MW (beyond 2030)\n- Storage (battery): 1,500 MW\n- Coal: No new coal plants\n\n**IRP 2023 draft changes:**\n- Accelerates renewable procurement (faster solar and wind ramp)\n- Replaces some gas CCGT capacity with battery storage\n- Introduces hydrogen/gas turbines as long-term flexibility option\n- Pushes nuclear new build decision past 2030",
            { type: "text", content: "**Decommissioning:** The IRP 2019 schedules retirement of approximately 35 GW of Eskom coal capacity between 2022 and 2050, starting with the oldest units at Hendrina, Grootvlei, and Camden. However, due to the energy crisis, DMRE has issued Section 34 determinations to extend the life of several units beyond their planned retirement date.", bg: "amber" },
        ]),
    },
    {
        id: "technology-mix",
        label: "Technology Mix",
        defaultContent: JSON.stringify([
            { type: "title", title: "Technology Mix", subtitle: "Generation technology targets, costs, and grid share" },
            "**Solar PV** is the lowest-cost new-build technology in South Africa's resource environment. Utility-scale solar PV (ground-mounted) bid prices under REIPPP Bid Window 6 fell to R0.45–0.55/kWh, competitive with international benchmarks. The Northern Cape, North West, and Free State have the best irradiation profiles (GHI >2,000 kWh/m²/year).\n\n**Wind** is the second most cost-competitive technology. The best resources are concentrated in the Western Cape (Overberg, Boland) and Eastern Cape (Wild Coast, Bedford). Offshore wind potential has been identified but no formal procurement has begun.\n\n**Nuclear** — The IRP 2019 includes 2,500 MW of new nuclear (beyond 2030) but does not specify the vendor or site. The DMRE has commenced a Request for Information (RFI) process for new nuclear, with sites at Thyspunt and Duynefontein assessed. Koeberg's LEP is separate and funded by Eskom.",
            "**Gas-to-power** is planned as a flexibility and intermediate-load technology. The IRP envisages:\n- **OCGTs (Open Cycle Gas Turbines):** Fast-ramping peakers, suitable for backup and frequency regulation. High fuel cost but low capital cost.\n- **CCGTs (Combined Cycle Gas Turbines):** Higher efficiency, intermediate load, 50–60% thermal efficiency. Requires reliable gas supply — dependent on LNG import or Rompco gas.\n\n**Battery storage** has been added to the IRP to provide sub-4-hour shifting and frequency regulation services. The REIPPP Bid Window 5 emergency power procurement included battery storage projects. The IRP 2023 draft increases battery storage targets significantly.\n\n**Pumped hydro** provides longer-duration storage. The IRP 2019 includes 2,500 MW of new pumped storage beyond 2030. Studies have identified several potential sites in the Drakensberg escarpment.",
            { type: "text", content: "**LCOE comparison (2024 estimates, South Africa conditions):** Solar PV: R0.45–0.65/kWh · Wind: R0.60–0.80/kWh · New coal: R1.20–1.60/kWh · CCGT (imported LNG): R0.90–1.30/kWh · Nuclear (new build): R1.50–2.50/kWh · Battery (4h): R0.70–0.90/kWh (storage premium additional). Sources: CSIR, REIPPP bid results, IRENA.", bg: "gray" },
        ]),
    },
    {
        id: "assumptions",
        label: "Key Assumptions",
        defaultContent: JSON.stringify([
            { type: "title", title: "Key Assumptions", subtitle: "Demand, cost, carbon, and operational parameters in IRP modelling" },
            "**Demand growth scenarios:**\n- **IRP 2019 moderate growth:** Electricity demand grows from ~215 TWh/year (2019) to ~295 TWh/year by 2030, recovering from the load-shedding-depressed baseline\n- **Low demand:** Accounts for demand-side management, rooftop solar self-consumption, and slower economic growth\n- **High demand:** Reflects faster electrification, EV uptake, and new industrial loads (data centres, green hydrogen electrolysis)\n\nThe 2023 draft revised demand upward relative to 2019 in the medium term, reflecting reduced industrial self-curtailment now that grid supply is expected to improve.",
            "**Carbon budget:** The IRP 2023 draft uses a 2050 net-zero pathway consistent with the NDC. The carbon constraint tightens after 2030, forcing accelerated retirement of coal or addition of carbon capture. DMRE has not committed to a specific carbon price in the IRP but uses an implicit shadow price in the optimisation.\n\n**Technology cost curves:** The CSIR energy centre and IPP Office compile annual cost benchmarks. Solar PV module costs have fallen ~90% since 2010. The IRP updates cost assumptions with each revision; the 2023 draft used significantly lower solar and battery costs than 2019, which shifted the optimal mix materially away from gas toward renewables + storage.\n\n**Water constraints:** South Africa's water-scarce environment limits the deployment of wet-cooled thermal plants. Dry cooling adds 5–8% to capital cost and reduces thermal efficiency by 2–3 percentage points. This is a binding constraint on new coal and nuclear; it does not affect solar, wind, or battery storage.",
            { type: "text", content: "**Reserve margin:** The IRP targets a planning reserve margin of 15% above peak demand. South Africa's current effective reserve margin (accounting for Eskom's high unplanned outage rate, or EAF of ~55–60%) is materially negative — the primary cause of load-shedding. Restoration of the reserve margin by 2028–2030 is a central commitment in DMRE's energy action plan.", bg: "amber" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Primary data sources for IRP analysis and capacity planning" },
            "## Generation & Infrastructure\n- **Eskom Integrated Report & Sustainability Disclosure** — installed capacity, energy availability factor (EAF), unplanned outage rates, coal consumption, and peak demand\n- **IPP Office — REIPPP Bid Window Results** — contracted capacity, tariffs, and commercial operation dates by bid window (BW1–BW6+)\n- **NERSA Generation Licence Register** — all licensed generation projects (operational and approved) by technology and licensee\n- **Eskom Grid Development Plan** — transmission expansion required to integrate new capacity\n\n## Capacity Planning & Modelling\n- **CSIR Energy Research Reports** — independent modelling of least-cost capacity expansion, published annually; widely cited as validation of IRP assumptions\n- **UCT ERC SATIM/TIMES model** — long-run energy system optimisation, used for IEP scenarios and as cross-check for IRP\n- **IRENA Renewable Power Generation Costs** — global LCOE benchmarks used to calibrate South African cost assumptions\n- **Ember Global Electricity Review** — comparative data on renewable share and coal phase-out trajectories internationally\n\n## Policy & Regulatory\n- **IRP 2019 (gazetted, Government Gazette 42784)** — official current plan\n- **IRP 2023 Draft** — DMRE consultation document (released 2023); includes revised demand and technology cost assumptions\n- **NERSA — Regulatory Clearing Account (RCA) determinations** — pass-through fuel cost and capacity charge determinations affecting Eskom tariff structure\n- **Section 34 Ministerial Determinations** — formal procurement decisions for each generation technology tranche",
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
                <span className="font-medium text-slate-900">Integrated Resource Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Planning"
                defaultTitle="Integrated Resource Plan (IRP)"
                defaultDesc="South Africa's electricity generation capacity plan — outlining technology mix, build timelines, and the transition pathway away from coal."
            />

            <EditableSections
                pageKey={PAGE_KEY}
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
