import Link from "next/link";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "ep.integrated-energy-plan";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Integrated Energy Plan (IEP)", subtitle: "South Africa's long-term, all-carrier energy strategy" },
            "The **Integrated Energy Plan (IEP)** is intended to be South Africa's statutory long-term energy strategy, covering all energy carriers — electricity, liquid fuels, gas, coal, and renewables — over a multi-decade horizon. This is what distinguishes it from the IRP, which deals only with electricity generation capacity.\n\n**Legal basis:** Section 6 of the Energy Act places a legislative obligation on the responsible Minister to develop an IEP; this section commenced on 1 April 2024. An initial IEP was published for South Africa in 2016 (available via the IEA policy database), but — unlike the IRP — **South Africa has not yet gazetted a final, updated IEP.**\n\nIn August 2024, government indicated it was targeting finalisation of the inaugural (updated) IEP by the second quarter of the 2025/26 fiscal year; as of this writing there is no public confirmation that a final IEP has been gazetted, so that timeline should be treated as provisional.",
            { type: "text", content: "The IRP 2025 (gazetted 28 October 2025) covers the electricity-sector component of long-term energy planning in detail and is explicitly intended to feed into the still-pending IEP, rather than stand in for it.", bg: "blue" },
        ]),
    },
    {
        id: "energy-balance",
        label: "Energy Balance & Scenarios",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Balance & Scenarios", subtitle: "What the IEP is meant to model" },
            "Once finalised, the IEP is expected to project South Africa's total primary energy supply and final energy demand across multiple scenarios — typically a baseline ('current policies') case and one or more climate-aligned or accelerated-transition cases — in the same way the 2016 IEP did for its own planning horizon.\n\nThe **2024 South Africa National Energy Balance**, compiled by SANEDI and the UCT Energy Systems Research Group, is the primary real, published dataset this platform draws on for base-year supply and consumption figures (the Primary Energy Supply, Conversion & Transformation, and Final Consumption numbers found elsewhere on this site). Because no updated IEP has been gazetted, this NEB dataset — not a set of official IEP scenario projections — is the authoritative current source for South Africa's actual energy balance.",
            { type: "text", content: "Treat any specific 2030–2050 supply or demand *projection* figures you encounter elsewhere as scenario modelling from a particular research group or draft document, not as settled IEP policy, until a final gazetted IEP is published.", bg: "amber" },
        ]),
    },
    {
        id: "demand-drivers",
        label: "Demand Drivers",
        defaultContent: JSON.stringify([
            { type: "title", title: "Demand Drivers", subtitle: "The variables any South African long-term energy model has to account for" },
            "Whatever specific figures an eventual IEP adopts, long-term South African energy-demand modelling has to account for a consistent set of drivers:\n- **Economic growth** — the dominant driver of industrial and commercial energy demand; South Africa's GDP growth has been persistently below the levels assumed in earlier official energy-planning exercises, which is itself a reason successive drafts have needed revision.\n- **Population and household growth** — Statistics South Africa publishes regularly updated mid-year population estimates and projections used across government planning, including energy demand work; household formation (more, smaller households) tends to raise electricity-connection and appliance demand even where population growth itself is moderate.\n- **Electrification and fuel switching** — the pace at which remaining un-electrified and under-electrified households shift away from paraffin, candles and fuelwood toward grid or off-grid electricity.\n- **Industrial structure** — the outlook for energy-intensive sectors such as mining, chemicals and metals, where South Africa's largest single-site energy demands are concentrated.",
        ]),
    },
    {
        id: "policy-pathways",
        label: "Policy Pathways",
        defaultContent: JSON.stringify([
            { type: "title", title: "Policy Pathways", subtitle: "Decarbonisation, green hydrogen, and the just transition" },
            "**Decarbonisation:** South Africa's Nationally Determined Contribution (NDC) under the Paris Agreement commits to a peak-plateau-decline emissions trajectory, with emissions expected to peak before gradually declining. IRP 2025's shift of the electricity mix toward solar, wind, gas and new nuclear (see the Integrated Resource Plan page) is the clearest concrete policy instrument currently in place toward that trajectory.\n\n**Green hydrogen:** South Africa's **Hydrogen Society Roadmap** (launched February 2022, led by the then Department of Science and Innovation) sets out targets of **10 GW of electrolysis capacity in the Northern Cape by 2030** and **at least 15 GW nationally by 2040**, alongside a production target of roughly **500,000 tonnes of green hydrogen per year by 2030**. These are Roadmap targets, not IEP-confirmed figures — South Africa's renewable resource quality is the underlying rationale for pursuing green hydrogen as an export opportunity.\n\n**Just transition:** South Africa's coal sector directly employed approximately **92,670 people** according to the Minerals Council South Africa's most recent coal-specific figure (2022) — making coal the third-largest employer within mining, after platinum and gold. The Presidential Climate Commission's Just Transition Framework (2022) sets out the social and economic considerations for managing coal-sector decline, concentrated mainly in Mpumalanga.",
        ]),
    },
    {
        id: "neb-link",
        label: "NEB & Reference Documents",
        defaultContent: JSON.stringify([
            { type: "title", title: "NEB & Reference Documents", subtitle: "Key source documents and downloadable references" },
            "The **2024 South Africa National Energy Balance**, compiled by SANEDI and the UCT Energy Systems Research Group (ESRG), is the primary data source this platform draws on. All energy data elsewhere on this site — Primary Energy Supply, Conversion & Transformation, and Final Consumption by sector — is drawn directly from the 2024 NEB.",
            { type: "text", content: "A direct public download link for the 2024 NEB report was not confirmed as part of this research pass — once a stable, hosted link is available (e.g. via SANEDI or the Department of Electricity and Energy), it should be added here.", bg: "blue" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Primary sources for long-term energy planning" },
            "## Energy Balance & Statistics\n- **National Energy Balance (NEB)** — SANEDI / UCT ESRG; the authoritative current South African energy flow dataset.\n- **IEA country policy database** — tracks South Africa's energy policy instruments, including the 2016 IEP.\n\n## Macroeconomic & Demographic\n- **Stats SA Mid-Year Population Estimates** — official national and provincial population projections.\n- **National Treasury Medium-Term Expenditure Framework (MTEF)** — medium-term GDP, fiscal and investment projections.\n\n## Electricity & Infrastructure\n- **IRP 2025** — the current gazetted electricity capacity plan (see the Integrated Resource Plan page on this site).\n- **IPP Office — REIPPP Bid Window Results** — renewable procurement outcomes by bid window.\n\n## Policy & Planning\n- **South Africa's Nationally Determined Contribution (NDC)** — South Africa's Paris Agreement emissions commitments.\n- **Hydrogen Society Roadmap (2022)** — green hydrogen targets and implementation plan.\n- **Presidential Climate Commission, Just Transition Framework (2022)**.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Engineering News, [*Timeline for Inaugural IEP Announced as Govt Sets Year-End Target for Updated IRP*](https://www.engineeringnews.co.za/article/timeline-for-inaugural-iep-announced-as-govt-sets-year-end-target-for-updated-irp-2024-08-23) (23 August 2024).\n2. Cliffe Dekker Hofmeyr, [*Integrated Energy Planning: Commencement of Section 6 of the National Energy Act*](https://www.cliffedekkerhofmeyr.com/en/news/publications/2023/Practice/Corporate/corporate-and-commercial-alert-10-may-integrated-Energy-Planning-.html).\n3. International Energy Agency, [*Integrated Energy Plan for the Republic of South Africa*](https://www.iea.org/policies/4556-integrated-energy-plan-for-the-republic-of-south-africa).\n4. Department of Energy (2016), [*Integrated Energy Plan Report*](https://www.energy.gov.za/files/iep/2016/integrated-energy-plan-report.pdf).\n5. ESI-Africa, [*Cabinet Approves IRP 2025, SA's R2.23 Trillion Energy Map*](https://www.esi-africa.com/news/cabinet-approves-irp-2025-sas-r2-23-trillion-energy-map/).\n6. Baker McKenzie, [*South African Hydrogen Society Roadmap*](https://resourcehub.bakermckenzie.com/-/media/hydrogen/documents/south_african_hydrogen_society_roadmapv1.pdf) (2022).\n7. International Energy Agency, [*Hydrogen Society Roadmap (policy entry)*](https://www.iea.org/policies/16974).\n8. Mining Weekly, [*Minerals Council Details Contribution to the Economy, Livelihoods*](https://www.miningweekly.com/article/minerals-council-details-contribution-to-the-economy-livelihoods-2025-11-03) (3 November 2025) — on current Minerals Council employment reporting.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
                <Link href="/dashboard" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">Datasets</Link>
                <span className="text-slate-300">/</span>
                <Link href="/dashboard/energy-efficiency-planning" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">Energy Efficiency &amp; Planning</Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-[var(--color-ink)]">Integrated Energy Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Efficiency & Planning"
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
