import Link from "next/link";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "ep.liquid-fuels-master-plan";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Liquid Fuels Master Plan (LFMP)", subtitle: "Refinery strategy, import security, and product specifications for South Africa" },
            "The **Liquid Fuels Master Plan (LFMP)** is intended to set out South Africa's strategic direction for the production, importation, storage, and distribution of liquid fuels — petrol, diesel, jet fuel, LPG, and heavy fuel oil. As with the Gas Master Plan, **no finalised, gazetted LFMP has been confirmed** as of this research pass; a related **draft Strategic Petroleum Stocks Policy**, aimed at modernising the liquid fuels value chain and long-term fuel security, was published in the Government Gazette in July 2026.\n\nLiquid fuels policy now sits primarily with the **Department of Mineral and Petroleum Resources (DMPR)** — the minerals-and-petroleum half of the former Department of Mineral Resources and Energy (DMRE), which was split into the DMPR and the Department of Electricity and Energy (DOEE) from 2024. (Electricity and gas policy, covered elsewhere on this platform, now sits with DOEE.)",
            { type: "text", content: "South Africa's refining base has roughly halved since 2020: of the major refineries, only **Natref** (Sasolburg) and **Astron Energy's Cape Town refinery** remain in regular operation. **Sapref** (Durban, previously the country's largest refinery) has been idle since 2022; **Engen's Durban refinery (ENREF)** was converted to an import terminal; and **PetroSA's Mossel Bay GTL plant** has been mothballed after failing to secure a new gas feedstock source.", bg: "amber" },
        ]),
    },
    {
        id: "supply-chain",
        label: "Refinery & Import Strategy",
        defaultContent: JSON.stringify([
            { type: "title", title: "Refinery & Import Strategy", subtitle: "Domestic refining capacity, crude imports, and a stalled revival plan" },
            "**Natref** (National Petroleum Refiners) at Sasolburg is a joint venture between **Sasol** (majority shareholder) and **TotalEnergies**, and is an inland refinery supplied by pipeline from Durban rather than direct marine access.\n\n**Astron Energy's Cape Town refinery** (formerly Chevron) serves the Western Cape, a market with limited pipeline connectivity to the rest of the country; it has undergone periodic planned maintenance shutdowns, with the company securing import cover during those periods.\n\n**Sapref's ownership has changed:** in 2024, former owners **BP and Shell sold Sapref to the state-owned Central Energy Fund (CEF) for a nominal R1**. A refinery revival plan — reportedly requiring in the order of **US$8 billion or more** to restore both Sapref and upgrade Natref — has been discussed in industry and media coverage during 2026, but as of this research pass has **no confirmed Treasury funding and no settled crude-sourcing strategy**.\n\n**Sasol's Secunda coal-to-liquids (CTL) plant** continues to be a major domestic liquid-fuels source, converting coal (via Fischer-Tropsch synthesis) rather than crude oil into diesel, petrol components and chemical feedstocks — not a conventional refinery, but a critical part of South Africa's liquid-fuels self-sufficiency.",
            "With most refining capacity gone, South Africa now depends heavily on **imported crude** (for the refineries still operating) and **imported refined product** (to cover the gap left by Sapref, ENREF and Mossel Bay GTL). Reporting during 2026 put the cumulative lost refining throughput at over **260,000 barrels per day** compared with pre-2020 capacity, with crude increasingly sourced from West Africa alongside traditional Middle Eastern suppliers.",
            { type: "text", content: "**Strategic Fuel Fund (SFF):** a Central Energy Fund subsidiary holding South Africa's strategic crude and product reserves, including the Saldanha Bay crude storage terminal. The precise mandatory stockholding requirement is under active policy review as part of the 2026 draft Strategic Petroleum Stocks Policy, so treat any specific day-count figure as provisional pending that policy's finalisation.", bg: "blue" },
        ]),
    },
    {
        id: "product-specs",
        label: "Product Specifications",
        defaultContent: JSON.stringify([
            { type: "title", title: "Product Specifications", subtitle: "Fuel grades and the repeatedly-delayed Clean Fuels 2 standard" },
            "South Africa's fuel specifications are set by the **South African Bureau of Standards (SABS)** under the **Petroleum Products Act (Act 120 of 1977)**. The country's current retail fuel remains at the **older specification** (up to 500 ppm sulphur diesel; higher-sulphur petrol) — **not** the cleaner **Clean Fuels 2 (CF2)** standard (which would bring South Africa into line with Euro 5/6-equivalent limits of around 10 ppm sulphur).",
            { type: "text", content: "**CF2 has been postponed multiple times.** Originally targeted for 2017, the regulations have been pushed back repeatedly and, as of the most recent 2025–2026 reporting, are scheduled to take effect on **1 July 2027**. Industry commentary has described ongoing economic and regulatory constraints — including the lack of confirmed investment support for refinery upgrades — as putting this timeline, and broader fuel supply security, at risk.", bg: "amber" },
            "Some fuel retailers and refiners have begun investing in CF2-related upgrades, cleaner logistics, and complementary biofuels/hydrogen pilot projects ahead of the 2027 deadline, without waiting for a final, settled government support package. A long-standing **Biofuels Industrial Strategy (2007)** targeted a 2% biofuels blending rate; implementation has remained limited, constrained by feedstock cost and availability.",
        ]),
    },
    {
        id: "security-logistics",
        label: "Supply Security & Logistics",
        defaultContent: JSON.stringify([
            { type: "title", title: "Supply Security & Logistics", subtitle: "Pipeline network, port capacity, and growing import exposure" },
            "**Transnet Pipelines** carry the bulk of inland liquid-fuels logistics, principally the **New Multi-Product Pipeline (NMPP)** running from Durban harbour to the Johannesburg area via Sasolburg, operating on a common-carrier basis open to third-party shippers. The Western Cape, by contrast, has no long-haul product pipeline link to the rest of the country and relies on road (and some rail) distribution from Cape Town's own import/refining point.\n\n**Durban** remains South Africa's primary liquid-fuels import gateway, handling the bulk of petrol, diesel, jet fuel and LPG imports via Transnet National Ports Authority and private terminal operators. **Cape Town** serves as the secondary import point, mainly for the Western Cape market.",
            { type: "text", content: "The combination of reduced domestic refining and a liquid-fuels specification upgrade (CF2) still pending has increased South Africa's exposure to global shipping, overseas refinery outages, and port-logistics disruption — all identified as live risk factors in the 2026 refinery-revival and strategic-stocks policy discussions, rather than settled, resolved issues.", bg: "amber" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Key data sources for liquid fuels planning and analysis" },
            "## Production & Trade\n- **DMPR Liquid Fuels Data** — fuel production, imports, exports and stock changes (the petroleum-side successor to the former DMRE's energy data publications).\n- **SARS Customs & Excise** — fuel import/export statistics by tariff code.\n- **SAPIA (South African Petroleum Industry Association)** — industry-compiled fuel sales and production data.\n\n## Infrastructure & Logistics\n- **Transnet Annual Report** — pipeline throughput and port liquid-bulk statistics, including NMPP performance.\n- **TNPA (Transnet National Ports Authority) Port Statistics** — vessel calls and liquid bulk tonnes handled by port.\n- **Central Energy Fund (CEF) / Strategic Fuel Fund disclosures** — strategic crude and product reserve levels.\n\n## Price & Market\n- **DMPR Basic Fuel Price (BFP) gazette** — the monthly published BFP and retail price structure.\n- **Platts Dated Brent and Singapore MOPS** — crude and product spot-price benchmarks referenced in BFP calculation.\n\n## Policy & Regulation\n- **Petroleum Products Act (Act 120 of 1977)** — licensing framework, mandatory stockholding, and specifications.\n- **Draft Strategic Petroleum Stocks Policy (gazetted July 2026)** — the current active policy process most directly relevant to fuel-security planning.\n- **SABS fuel specification standards** (unleaded petrol and automotive diesel) — including the pending Clean Fuels 2 limits.\n- **NEB — Liquid Fuels sections** — domestic production, imports, exports, and final consumption by sector on this platform.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. South African Reserve Bank, [*Occasional Bulletin of Economic Notes — \"Running Empty\"*](https://www.resbank.co.za/content/dam/sarb/publications/occasional-bulletin-of-economic-notes/2026/oben-running-empty.pdf) (September 2026).\n2. Daily Investor, [*Three Facilities Stopping South Africa from Falling Off a Cliff*](https://dailyinvestor.com/energy/129726/three-facilities-stopping-south-africa-from-falling-off-a-cliff/).\n3. Discovery Alert, [*South Africa's Refinery Revival: Sapref's $7bn Funding Gap*](https://discoveryalert.com/analysis/south-africa-refinery-revival-sapref-september-2026/) (September 2026).\n4. Moneyweb, [*Jack Up Domestic Oil Refineries, Focus on Storage, or Move to Renewables?*](https://www.moneyweb.co.za/mineweb/energy/jack-up-domestic-oil-refineries-focus-on-storage-or-move-to-renewables/).\n5. Government of South Africa, [*Mineral and Petroleum Resources on Fuel Supply and Prices*](https://www.gov.za/news/media-statements/mineral-and-petroleum-resources-fuel-supply-and-prices-10-mar-2026) (10 March 2026).\n6. SGS Inspire, [*South Africa Delays New Fuel Specifications to July 2027*](https://inspire.sgs.com/content/100103337/south-africa-delays-new-fuel-specifications-to-july-2027).\n7. BusinessTech, [*Diesel Ban Still on the Cards for South Africa*](https://businesstech.co.za/news/energy/846500/diesel-ban-still-on-the-cards-for-south-africa/).\n8. Engineering News, [*Economic and Regulatory Constraints Are Putting South Africa's Fuel Supply at Risk*](https://www.engineeringnews.co.za/article/economic-and-regulatory-constraints-are-putting-south-africas-fuel-supply-at-risk-2025-08-22-1) (22 August 2025).\n9. Engineering News, [*Glencore's South African Refinery to Invest Up to R6bn to Produce Cleaner Fuels*](https://www.engineeringnews.co.za/article/glencores-south-african-refinery-to-invest-up-to-r6bn-to-produce-cleaner-fuels-2025-03-26) (26 March 2025).",
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
                <span className="font-medium text-[var(--color-ink)]">Liquid Fuels Master Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Efficiency & Planning"
                defaultTitle="Liquid Fuels Master Plan"
                defaultDesc="Refinery and import strategies, product specifications, supply security, and logistics planning for liquid fuels in South Africa."
            />

            <EditableSections
                pageKey={PAGE_KEY}
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
