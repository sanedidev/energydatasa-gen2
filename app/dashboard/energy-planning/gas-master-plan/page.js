import Link from "next/link";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "ep.gas-master-plan";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Gas Master Plan (GMP)", subtitle: "South Africa's strategy for gas supply, infrastructure, and the energy transition" },
            "The **Gas Master Plan (GMP)** is South Africa's policy framework for the development and use of natural gas across the economy. Published in draft form by the **DMRE** in 2019 and under revision in 2023–2024, the GMP addresses gas supply sources, transmission and distribution infrastructure, end-use demand across sectors, and the regulatory and pricing environment.\n\nSouth Africa has historically been a minor gas user relative to its size. Current gas supply is dominated by natural gas imported via the **Rompco pipeline** from Mozambique (Temane and Pande gas fields), supplemented by Sasol's Secunda-based coal-derived gas (syngas) used internally. The GMP envisions a significant expansion of gas use — particularly for **gas-to-power** — as part of the transition away from coal-heavy electricity generation.",
            { type: "text", content: "**Current gas consumption (~2024):** Approximately 115 PJ/year of natural gas in the NEB. Dominated by Sasol industrial use and Sasol gas distribution to residential/commercial customers in the Western Cape. Excludes Sasol CTL syngas (which is an internal feedstock, not pipeline-distributed natural gas).", bg: "blue" },
            "The GMP is structured around three pillars:\n1. **Supply diversification** — reducing dependence on a single source (Mozambique pipeline) by developing LNG import infrastructure and exploring offshore and onshore domestic resources\n2. **Infrastructure expansion** — extending the national gas transmission and distribution grid beyond the current Gauteng–Western Cape corridor\n3. **Demand development** — growing gas use in power generation, industry, and potentially commercial/residential markets to justify infrastructure investment",
        ]),
    },
    {
        id: "infrastructure",
        label: "Infrastructure & Supply",
        defaultContent: JSON.stringify([
            { type: "title", title: "Infrastructure & Supply", subtitle: "Existing network, LNG import options, and supply security" },
            "**Rompco pipeline:** The Republic of Mozambique Pipeline Company (Rompco) is a 865 km, 26-inch high-pressure natural gas pipeline running from Temane in Mozambique to Secunda in Mpumalanga. The pipeline is owned jointly by **Sasol (50%)**, the **Mozambique government via ENH (25%)**, and **iGas (25%, a CEF subsidiary)**. Current throughput is approximately 4.5 billion cubic metres (BCM) per year, equivalent to ~167 PJ.\n\nThe Temane and Pande gas fields are operated by **Sasol Exploration and Production International**. Proven reserves are sufficient to sustain current throughput for approximately 15–20 years. The TotalEnergies-operated **Coral FLNG** project in northern Mozambique adds supply potential, though that gas is primarily destined for Asian LNG markets.",
            "**LNG import terminals:** The GMP identifies two priority LNG import terminal sites:\n- **Richards Bay (KwaZulu-Natal):** Preferred site for a large-scale import terminal. Richards Bay is South Africa's largest bulk port by tonnage. A Floating Storage and Regasification Unit (FSRU) is the most likely near-term solution, with capacity of 3–5 million tonnes per annum (MTPA) equivalent ~170–285 PJ/year. Infrastructure upgrades required include jetty deepening and pipeline connectivity.\n- **Coega/Port of Ngqura (Eastern Cape):** Secondary site. Better geographic position for serving Eastern Cape power and industrial demand. Site preparation has been assessed by Transnet.\n\nNo LNG import terminal has commenced construction as of 2024. Financing, offtake agreements, and environmental authorisation processes are ongoing.",
            { type: "text", content: "**Domestic gas exploration:** Offshore gas resources in the Outeniqua Basin (off the Southern Cape coast) have been known since the 1970s (the F-A, E-M, E-K fields). Total's **Brulpadda** and **Luiperd** offshore deepwater discoveries (announced 2019) represent potentially significant resources (~1 TCF and ~2.9 TCF respectively) but development economics remain uncertain at current gas prices.", bg: "gray" },
        ]),
    },
    {
        id: "demand-outlook",
        label: "Demand Outlook",
        defaultContent: JSON.stringify([
            { type: "title", title: "Demand Outlook", subtitle: "Gas demand projections by sector and the role of gas in the energy transition" },
            "**Power generation** is the largest projected growth market for gas in the GMP. The IRP 2019 includes 3,000 MW of OCGTs and 3,000 MW of CCGTs as part of the new capacity build programme. At ~50% capacity factor, 6,000 MW of gas-to-power would require approximately 80–100 PJ/year of additional gas supply — roughly double the current pipeline throughput.\n\nHowever, this outlook has moderated in the IRP 2023 draft, which substitutes some CCGT capacity with battery storage, reducing the projected gas demand uplift. The long-term role of gas remains contested — modelling by the CSIR and others suggests that the combination of solar PV + wind + battery storage may be cost-competitive with gas by 2030.",
            "**Industrial demand** for gas is primarily driven by:\n- **Chemicals and petrochemicals:** Sasol remains the dominant industrial gas consumer. Gas substitution for coal in process heating is possible but capital-intensive.\n- **Paper and pulp:** Interest in gas-fired CHP (combined heat and power) as an alternative to coal boilers; subject to gas price competitiveness\n- **Mining:** Potential for gas in mine heating, particularly in deep-level gold mines in Gauteng that currently use diesel or coal for underground ventilation heating\n- **Ceramics and glass manufacturing:** Moderate interest in fuel-switching from coal to gas for kiln firing\n\n**Residential and commercial:** The Sasol gas distribution network currently serves ~100,000 residential customers in the Western Cape. Expansion is limited by the cost of extending low-pressure distribution networks. LPG (delivered by cylinder) is the more economic option for areas not served by reticulated gas.",
            { type: "text", content: "**Gas as bridge fuel:** The GMP explicitly positions natural gas as a 'bridge fuel' — lower-carbon than coal (approximately 50% lower CO₂ per unit of electricity), flexible to back up variable renewables, and available at scale from LNG markets. Critics argue that methane leakage in the supply chain reduces the climate advantage and that LNG import prices (linked to global markets) introduce energy security risk.", bg: "amber" },
        ]),
    },
    {
        id: "pricing",
        label: "Pricing & Regulation",
        defaultContent: JSON.stringify([
            { type: "title", title: "Pricing & Regulation", subtitle: "Gas pricing frameworks, NERSA regulation, and cost competitiveness" },
            "**Gas regulation in South Africa:** The **Gas Act (2001)** and the **Petroleum Pipelines Act (2003)** provide the regulatory framework. **NERSA** licenses gas transmission, storage, and distribution and regulates third-party access to pipelines. The existing Rompco pipeline is subject to a regulated tariff.\n\nThe **Gas Amendment Bill (2019)** proposed significant reforms including mandatory open access to infrastructure, a more active role for the state in gas development (through SANGAS, a proposed state gas company), and provisions for the development of LNG import infrastructure. The Bill has been revised several times and had not been gazetted as of 2024.",
            "**Gas pricing:** South Africa has no domestic natural gas price benchmark. Rompco gas is priced under a long-term contract between Sasol and the Mozambique government, with terms not publicly disclosed. Sasol's downstream gas distribution pricing to industrial and residential customers is regulated by NERSA under a cost-of-service methodology.\n\n**LNG import economics:** International LNG spot prices are linked to TTF (European benchmark) or JKM (Asian benchmark). Prices averaged USD 30–50/GJ during the 2021–2023 energy crisis before normalising to USD 8–14/GJ in 2024. At these price levels, LNG-fired gas-to-power is competitive with Eskom's marginal cost of OCGT diesel generation but more expensive than new-build solar or wind.",
            { type: "text", content: "**Rompco contract:** The Rompco supply contract expires in the early 2030s. Negotiations for a supply extension or replacement gas source (potentially from Total's Coral FLNG or new Mozambique blocks) are a critical planning variable. Any gap between Rompco expiry and new supply would require LNG bridging or reduced gas-to-power capacity.", bg: "amber" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Key data sources for gas sector analysis" },
            "## Supply & Infrastructure\n- **Rompco throughput data** — NERSA pipeline throughput reports; annual volumes transported via the Mozambique–Secunda pipeline\n- **Sasol Annual Sustainability Report** — Rompco volumes, Sasol Gas distribution customer numbers and volumes, domestic gas production from Secunda syngas operations\n- **CEF / iGas** — South African government's participation in Rompco and LNG development activities\n- **TotalEnergies Mozambique** — Coral FLNG LNG production updates; Brulpadda and Luiperd exploration status\n\n## Market & Pricing\n- **ICE TTF Natural Gas Futures** — European gas price benchmark used as reference for LNG import pricing\n- **Platts JKM** — Asia-Pacific LNG spot price benchmark\n- **NERSA Gas Tariff Decisions** — approved tariffs for gas transmission and distribution\n- **BP Statistical Review of World Energy / bp Energy Outlook** — global LNG market projections and demand-supply balance\n\n## Policy & Regulation\n- **Gas Master Plan Draft (2019)** — DMRE consultation document; key reference for supply, infrastructure, and demand outlook\n- **Gas Act (Act 48 of 2001)** and **Gas Amendment Bill** — legislative framework\n- **IRP 2019 and IRP 2023 draft** — determines the gas-to-power capacity to be procured and the resulting gas demand requirement\n- **NERSA Licensed Projects Register** — gas transmission, storage, and distribution licences\n- **NEB 2024 — Natural Gas section** — current gas consumption by sector, transformation losses, and conversion statistics",
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
                <span className="font-medium text-slate-900">Gas Master Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Planning"
                defaultTitle="Gas Master Plan"
                defaultDesc="South Africa's strategy for gas infrastructure, supply security, demand growth, and the role of gas in the energy transition."
            />

            <EditableSections
                pageKey={PAGE_KEY}
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
