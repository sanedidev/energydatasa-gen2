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
            "The **Liquid Fuels Master Plan (LFMP)** sets out South Africa's strategic direction for the production, importation, storage, and distribution of liquid fuels — petroleum products including gasoline, diesel, jet fuel, LPG, and heavy fuel oil. The plan is developed by the **DMRE** and addresses the structural shift in South Africa's liquid fuels landscape following the closure of several domestic refineries.\n\nSouth Africa's refining sector has contracted significantly: **Sapref** (South Africa's largest refinery, 180,000 bpd, operated by Shell and BP in Durban) was shut in 2022 and has not restarted; **ENREF** (Engen's Durban refinery, 105,000 bpd) was converted to an import terminal in 2021. Remaining operational refineries are **Natref** (National Petroleum Refiners, Sasol/TotalEnergies JV, Sasolburg, 108,000 bpd) and **Astron Energy's Cape Town refinery** (~100,000 bpd, formerly Chevron). The closure of Sapref and ENREF means South Africa now imports a substantial and growing share of its liquid fuels requirements.",
            { type: "text", content: "**Import dependency:** With Sapref and ENREF closed, South Africa's domestic refining capacity has fallen from ~700,000 bpd to ~200,000 bpd. Against consumption of ~500,000–550,000 bpd, approximately 55–65% of refined product requirements are now met by imports, primarily from Middle East and Asian refineries. This represents a significant structural increase in import dependence versus the pre-2021 position.", bg: "amber" },
        ]),
    },
    {
        id: "supply-chain",
        label: "Refinery & Import Strategy",
        defaultContent: JSON.stringify([
            { type: "title", title: "Refinery & Import Strategy", subtitle: "Domestic refining capacity, crude imports, and strategic fuel fund" },
            "**Natref** (National Petroleum Refiners) at Sasolburg is the only fully operational crude-oil refinery as of 2024. It is a joint venture between **Sasol (63.64%)** and **TotalEnergies (36.36%)**. Natref processes approximately 100,000 bpd of crude oil into gasoline, diesel, LPG, kerosene, and heavy fuel oil. Crude oil is received via a pipeline from the Durban port and ocean terminal (NMPP — New Multi-Product Pipeline). Natref is an inland refinery and does not have direct marine access.\n\n**Astron Energy's Cape Town refinery** (formerly Chevron, acquired by Glencore/Astron in 2018) processes ~100,000 bpd. It serves the Western Cape market, which has limited pipeline access from the east coast. The refinery is a simple hydroskimming configuration, which limits its ability to process heavier crude grades.\n\n**Sasol CTL** at Secunda is technically the world's largest synthetic fuels facility, producing approximately 160,000 bpd of synfuels from coal via Fischer-Tropsch synthesis. However, it is not a petroleum refinery and its feedstock (coal) is not crude oil. Sasol CTL products (mostly diesel, naphthas, and chemicals) are a major domestic supply source and effectively substitute for crude oil imports.",
            "**Crude oil imports:** South Africa imports crude oil from multiple origins, primarily:\n- **Middle East:** Saudi Arabia (Arab Light/Arab Medium), Kuwait, Abu Dhabi\n- **West Africa:** Nigeria (Bonny Light), Angola (Girassol, Cabinda)\n- **North Africa:** Occasional Libyan crude when markets are open\nCrude is imported via supertanker (VLCC) to the Single Point Mooring (SPM) facility off Durban, then pumped to Natref via the Transnet crude pipeline (410 km). Cape Town receives crude directly at its harbour terminal.\n\n**Product imports:** Following Sapref and ENREF closures, refined product imports have grown sharply. Diesel accounts for the largest volume, followed by gasoline and jet fuel. Key import origins include India (Reliance and Nayara refineries), Saudi Arabia, Kuwait, and Singapore. Durban harbour and Cape Town are the main entry points.",
            { type: "text", content: "**Strategic Fuel Fund (SFF):** The SFF, a subsidiary of the Central Energy Fund (CEF), holds South Africa's strategic crude and product reserves. The SFF is required to maintain a minimum of 21 days equivalent of net imports in strategic stock. SFF storage includes Milnerton (Cape Town), Ogies (Mpumalanga), and the Saldanha Bay crude oil terminal (approximately 45 million barrels capacity).", bg: "blue" },
        ]),
    },
    {
        id: "product-specs",
        label: "Product Specifications",
        defaultContent: JSON.stringify([
            { type: "title", title: "Product Specifications", subtitle: "Fuel grades, sulphur limits, and the Clean Fuels 2 roadmap" },
            "South Africa's fuel specifications are set by the **South African Bureau of Standards (SABS)** and administered by the **DMRE** under the Petroleum Products Act (1977). The current specifications are governed by the **Clean Fuels 2 (CF2)** standard, which brought South Africa into alignment with **Euro 5 / Euro 6 equivalent** specifications.\n\n**Current gasoline grades:**\n- **95 ULP (unleaded petrol):** Standard grade sold at most retail forecourts; 95 RON, <10 ppm sulphur (CF2)\n- **93 ULP:** Lower-octane grade historically sold in inland areas (higher altitude requires lower RON for equivalent engine performance); phasing out under CF2\n\n**Current diesel grade:**\n- **500 ppm sulphur diesel** was the pre-CF2 standard\n- **50 ppm diesel (CF2):** Gazetted and phased in from 2017 onwards; now the standard for new retail sales, required for Euro 5/6 light and heavy duty vehicles\n- **Backyard/agricultural diesel:** Ultra-low-sulphur requirements apply at retail but enforcement in off-road sectors is more limited",
            "**Clean Fuels 2 implementation:** The CF2 programme required all South African refineries and blending facilities to upgrade to produce <10 ppm sulphur gasoline and <50 ppm sulphur diesel. This required significant capital investment (desulphurisation units). The timeline was extended multiple times due to refinery capital constraints. With Sapref and ENREF closures, the CF2 upgrade burden has shifted to Natref and importers, who source CF2-compliant product from modern overseas refineries.\n\n**Bioethanol and biodiesel:** South Africa has a Biofuels Industrial Strategy (2007) that targeted 2% blending of biofuels into liquid fuels. Implementation has been limited due to feedstock availability, competition with food uses (maize, sorghum), and the cost differential with fossil fuels. The DMRE has reviewed blending mandates but no mandatory blending programme has been implemented at scale.",
            { type: "text", content: "**Regulatory note:** The Petroleum Products Act requires all fuel sold at retail forecourts to comply with current SABS specifications. The DMRE's Petroleum Products Technical Advisory Committee (PPTAC) monitors compliance and investigates fuel quality complaints. The recent growth in imported product has created new challenges for specification enforcement, as imported fuel must be tested at the port of entry.", bg: "gray" },
        ]),
    },
    {
        id: "security-logistics",
        label: "Supply Security & Logistics",
        defaultContent: JSON.stringify([
            { type: "title", title: "Supply Security & Logistics", subtitle: "Stockholding requirements, pipeline network, and port capacity" },
            "**Mandatory stockholding:** The Petroleum Products Act requires holders of retail licences and wholesalers to maintain minimum stock levels. The SFF supplements commercial stocks. In practice, South Africa's commercial stockholding (held by majors including TotalEnergies, Engen, Shell, Astron/Caltex) is approximately 30–45 days of consumption for key products.\n\n**Transnet Pipelines:** South Africa's liquid fuels logistics rely heavily on the Transnet Pipelines (formerly PETRONET) network:\n- **NMPP (New Multi-Product Pipeline):** 555 km pipeline from Durban harbour to Johannesburg (via Natref at Sasolburg). Opened 2011. Capacity approximately 4 billion litres/year. Operates on a common-carrier basis, accessible to third-party shippers.\n- **Durban–Johannesburg Pipeline (DJP):** Older existing pipeline parallel to the NMPP. Used for crude and products.\n- **Cape Town inland distribution:** No long-haul pipeline to inland provinces from the Western Cape. Distribution relies on road tanker.\n\n**TAZAMA pipeline:** A 1,710 km crude oil pipeline from Dar es Salaam (Tanzania) to Ndola (Zambia). South Africa has a historical interest in TAZAMA but it does not directly serve domestic South African refineries.",
            "**Port capacity:** Durban (Richards Bay) is South Africa's primary liquid fuels import gateway:\n- **Durban Harbour (Point and Island View terminals):** Handles gasoline, diesel, jet fuel, LPG, and heavy products; managed by Transnet National Ports Authority (TNPA) and private terminal operators (VOPAK, Grindrod, Engen, Total)\n- **Cape Town (Table Bay):** Secondary import point for the Western Cape; serves Astron's refinery and the city's fuel distribution market\n- **Saldanha Bay:** Dedicated crude oil storage terminal (SFF strategic reserve); not routinely used for product imports\n\nPort congestion at Durban has been a recurrent supply chain risk. Long dwell times for tankers, Transnet crane reliability, and rail logistics from the harbour to storage terminals have all been identified as vulnerabilities in LFMP planning.",
            { type: "text", content: "**Supply disruption risk:** The structural shift to import-dependence has increased South Africa's exposure to global tanker markets, refinery outages overseas, and port logistics disruptions. The 2021 KwaZulu-Natal unrest demonstrated the fragility of the Durban port corridor — approximately 6–8 days of stock were drawn down in some product categories during the distribution disruption. The SFF's Saldanha Bay crude reserves are not readily convertible to products without a functioning coastal refinery.", bg: "amber" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Key data sources for liquid fuels planning and analysis" },
            "## Production & Trade\n- **DMRE Liquid Fuels Data** — monthly fuel production by refinery, imports by product and port, exports, and stock changes. Published in the DMRE Energy Data portal and Annual Statistical Tables.\n- **SARS Customs & Excise** — fuel import and export statistics by tariff code (HTS 2710 for petroleum products; 2709 for crude oil)\n- **SAPIA (South African Petroleum Industry Association)** — industry-compiled annual fuel sales and production data by product and province\n- **BAS (Basic Accounting System) returns** — refiners and importers submit product-level data to DMRE under the Petroleum Products Act\n\n## Infrastructure & Logistics\n- **Transnet Annual Report** — pipeline throughput volumes, port liquid bulk statistics, and NMPP performance data\n- **TNPA (Transnet National Ports Authority) Port Statistics** — vessel calls, liquid bulk tonnes handled, and berth occupancy by port\n- **SFF Strategic Fuel Fund disclosures** — crude and product reserve levels (CEF Annual Report)\n\n## Price & Market\n- **DMRE Basic Fuel Price (BFP) gazette** — monthly published BFP and retail price structure, including refinery gate, transport levy, wholesale margin, and retail margin components\n- **Platts Dated Brent and Singapore MOPS** — crude and product spot price benchmarks used in BFP calculation\n- **CEF Fuel Price history** — historical regulated retail pump prices by product and location (inland, coastal)\n\n## Policy & Regulation\n- **Petroleum Products Act (Act 120 of 1977)** and subsequent amendments — licensing framework, mandatory stockholding, specifications\n- **Liquid Fuels Master Plan (LFMP) Draft** — DMRE strategic framework\n- **SABS SANS 342 (Unleaded Petrol)** and **SANS 1598 (Automotive Diesel)** — South African National Standards for fuel specifications\n- **NEB 2024 — Liquid Fuels sections** — domestic production, imports, exports, stock changes, and final consumption by sector",
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
                <span className="font-medium text-slate-900">Liquid Fuels Master Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Planning"
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
