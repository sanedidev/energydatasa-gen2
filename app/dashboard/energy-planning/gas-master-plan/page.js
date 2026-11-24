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
            "The **Gas Master Plan (GMP)** is South Africa's policy framework for the development and use of natural gas across the economy — supply sources, transmission and distribution infrastructure, end-use demand, and the regulatory and pricing environment. First published in draft form in 2019, the GMP **remains in draft as of late 2026**, alongside the related Gas Bill and Upstream Petroleum Resources Development Act (UPRDA) regulations, which are also still being finalised.\n\nSouth Africa's gas supply has historically depended heavily on a single source: natural gas piped from the **Pande and Temane fields in Mozambique**, which have supplied roughly **90% of South Africa's gas**, via the Rompco pipeline to Sasol's Secunda complex.",
            { type: "text", content: "This is not a stable baseline to plan around: Mozambique's Pande and Temane field output is widely expected to decline sharply from around **2027–2028** as the fields deplete, and Sasol has indicated it may stop supplying industrial customers from around **July 2028** without a replacement source in place — a widely-discussed \"gas cliff\" that the still-unfinished GMP has not yet resolved.", bg: "amber" },
        ]),
    },
    {
        id: "infrastructure",
        label: "Infrastructure & Supply",
        defaultContent: JSON.stringify([
            { type: "title", title: "Infrastructure & Supply", subtitle: "The Mozambique pipeline, LNG import plans, and the looming supply gap" },
            "**Rompco pipeline:** The Republic of Mozambique Pipeline Company (Rompco) operates the high-pressure pipeline carrying gas from Temane, Mozambique, to Secunda, Mpumalanga. It is owned jointly by Sasol, the Mozambique government (via ENH), and iGas (a CEF subsidiary). This pipeline is the delivery route for the Pande/Temane gas that currently dominates South African supply.\n\n**The supply gap:** With Mozambique field output declining, Sasol and Eskom signed a Memorandum of Understanding to jointly explore liquefied natural gas (LNG) as a replacement supply. Sasol's own leadership has struck a more measured tone than some industry commentary — stating gas is not expected to run out immediately, while a bridging supply (methane-rich gas, at a higher price) is explored for the transition period.",
            "**LNG import terminal — Richards Bay:** The leading response is the **Zululand Energy Terminal (ZET)**, a joint venture between **Vopak** and **Transnet**. ZET signed a 25-year terminal operator agreement with **Transnet National Ports Authority in February 2025**, and has signed a Heads of Agreement with **ExxonMobil South Africa LNG** to advance supply arrangements. However, a **final investment decision has been postponed**, pending clarity on Eskom's own planned **3,000 MW gas-to-power project at Richards Bay** — which itself now requires a new environmental-authorisation process.",
            { type: "text", content: "Industry commentary (including the gas-users' association IGUA-SA) has warned that LNG import infrastructure is unlikely to be ready before Sasol's current Mozambique gas supply runs down, and has called for minimum LNG demand commitments to be locked in to make the Richards Bay project bankable.", bg: "gray" },
        ]),
    },
    {
        id: "demand-outlook",
        label: "Demand Outlook",
        defaultContent: JSON.stringify([
            { type: "title", title: "Demand Outlook", subtitle: "Gas-to-power under IRP 2025, and industrial demand" },
            "**Power generation** is the largest projected growth market for gas. IRP 2025 (the current gazetted electricity plan — see the Integrated Resource Plan page) targets **6,000 MW of gas-to-power capacity by 2030, rising to 16,000 MW by 2039** — a substantially larger role for gas than earlier draft plans envisaged, reflecting gas's role as dispatchable, flexible capacity to firm up a growing share of variable solar and wind.\n\nThis target now sits in direct tension with the supply picture above: meeting it depends on the Richards Bay LNG terminal (or an equivalent new supply source) being built and operating well before the 2030s capacity is needed, at a point where that project's final investment decision has not yet been taken.",
            "**Industrial demand** for gas is concentrated in a small number of large users:\n- **Sasol** is by far the dominant industrial gas consumer, using gas both as fuel and as chemical feedstock at Secunda.\n- **Other heavy industry** (paper and pulp, mining, ceramics and glass) has some potential for coal-to-gas fuel switching, but uptake is constrained by gas price and the same supply uncertainty affecting the power sector.\n- **Residential and commercial** gas use remains a minor, geographically limited market (mainly Sasol's reticulated network in parts of the Western Cape); LPG by cylinder remains the more practical option outside areas with existing gas infrastructure.",
            { type: "text", content: "**Jobs at risk:** Industry and media commentary during 2026 has put the number of jobs potentially at risk from an unmanaged gas-supply decline as high as 70,000, concentrated in gas-dependent industrial users — though estimates of both the timing and scale of the \"gas cliff\" vary across sources, and should be treated as contested rather than settled.", bg: "amber" },
        ]),
    },
    {
        id: "pricing",
        label: "Pricing & Regulation",
        defaultContent: JSON.stringify([
            { type: "title", title: "Pricing & Regulation", subtitle: "Legislative framework and the still-unfinished Gas Bill" },
            "**Regulatory framework:** The **Gas Act (Act 48 of 2001)** and the **Petroleum Pipelines Act (2003)** form the current legislative basis for gas regulation. **NERSA** licenses gas transmission, storage and distribution, and regulates third-party access to pipelines including the regulated Rompco tariff.\n\n**Gas Bill:** A long-proposed reform package — including mandatory open access to gas infrastructure and provisions to support LNG import development — has been through multiple drafts over several years and, as of late 2026, **still has not been finalised or gazetted**, alongside related UPRDA regulations.\n\n**Pricing:** South Africa has no domestic natural gas price benchmark; Rompco-sourced gas is priced under a long-term, not-publicly-disclosed contract. Any future LNG-import-based supply would instead be exposed to international LNG benchmarks (such as European TTF or Asian JKM pricing), which are materially more volatile than the current pipeline-gas arrangement — a key reason industry has pushed for demand-aggregation and minimum-offtake commitments to make import infrastructure bankable.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Key data sources for gas sector analysis" },
            "## Supply & Infrastructure\n- **NERSA gas pipeline and licensing data** — throughput and licensing information for Rompco and other gas infrastructure.\n- **Sasol Annual Sustainability Report** — Rompco-sourced volumes, Sasol Gas distribution customer numbers, and Secunda operations.\n- **CEF / iGas** — South African government's participation in Rompco and LNG development.\n\n## Market & Pricing\n- **ICE TTF Natural Gas Futures** and **Platts JKM** — European and Asian LNG price benchmarks, relevant once import-based supply begins.\n- **NERSA Gas Tariff Decisions** — approved tariffs for regulated gas transmission and distribution.\n\n## Policy & Regulation\n- **Gas Master Plan (draft, 2019, still unfinished)** — the primary reference for supply, infrastructure and demand outlook, pending finalisation.\n- **Gas Act (Act 48 of 2001)** and the still-unfinalised **Gas Bill** — legislative framework.\n- **IRP 2025** — determines the gas-to-power capacity targeted (see the Integrated Resource Plan page).\n- **NEB — Natural Gas section** — current gas consumption by sector on this platform.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. IGUA-SA, [*Industry's Gas Roadmap Targets Supply Crisis and Economic Growth*](https://igua-sa.org/industry-gas-roadmap/).\n2. Engineering News, [*More Intentional Effort and Coordination Needed to Avert Gas Crisis*](https://www.engineeringnews.co.za/article/more-intentional-effort-and-coordination-needed-to-avert-gas-crisis-2026-04-10) (10 April 2026).\n3. AllAfrica, [*South Africa Will Run Out of Industrial Gas by 2028 and 70,000 Jobs Could Be Lost*](https://allafrica.com/stories/202603180027.html) (18 March 2026).\n4. IOL Business Report, [*South Africa Eyes Energy Security with R15bn Energy Project That Could Reshape Richards Bay*](https://iol.co.za/business/2026-06-21-south-africa-eyes-energy-security-with-r15bn-energy-project-that-could-reshape-richards-bay/) (21 June 2026).\n5. IOL Business Report, [*Sasol Extends Gas Production Timeline to Support South Africa's LNG Transition*](https://iol.co.za/business-report/companies/2025-08-30-sasol-extends-gas-production-timeline-to-support-south-africas-lng-transition/) (30 August 2025).\n6. Engineering News, [*Sasol and Eskom to Explore Demand Anchors for LNG as Part of Effort to Avert 'Gas Cliff'*](https://www.engineeringnews.co.za/article/sasol-and-eskom-to-explore-demand-anchors-for-lng-as-part-of-effort-to-avert-gas-cliff-2024-09-20) (20 September 2024).\n7. Engineering News, [*Roadmap Outlined to Turn Gas Supply Crisis into Transformative Opportunity*](https://www.engineeringnews.co.za/article/roadmap-outlined-to-turn-gas-supply-crisis-into-transformative-opportunity-2026-10-23) (23 October 2026).\n8. TimesLIVE, [*A Sharp Fall in Gas Supplies in 2028 Threatens South Africa's Economy*](https://www.timeslive.co.za/opinion/2026-07-24-a-sharp-fall-in-gas-supplies-in-2028-threatens-south-africas-economy-how-to-manage-the-fallout/) (24 July 2026).",
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
                <span className="font-medium text-[var(--color-ink)]">Gas Master Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Efficiency & Planning"
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
