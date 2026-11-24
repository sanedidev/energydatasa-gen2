import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Tariffs & Pricing" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Electricity Tariffs & Pricing", subtitle: "What households, businesses, and municipalities actually pay — and why it keeps rising faster than inflation" },
            "South Africa's electricity prices have risen sharply in the 2020s, consistently well above CPI inflation. Eskom's direct-customer tariff rose **12.74%** from 1 April 2025, then a further **8.76%** from 1 April 2026 — the latter revised upward from an originally planned 5.36% after South Africa's energy regulator, NERSA, discovered a **R54.7 billion error** in how it had calculated Eskom's regulatory asset base, forcing a court-ordered re-determination. Municipal bulk tariffs (what municipalities pay Eskom before reselling to residents) rose 11.32% from 1 July 2025 and a further 9.01% from 1 July 2026.",
            { type: "text", content: "**Figures genuinely conflict between sources on the exact current average rate.** One source puts Eskom's average direct-customer tariff at approximately 240.28 c/kWh from April 2026; another gives 241.64 c/kWh for 2025/26; a third gives a noticeably lower ~195.93 c/kWh (2025) rising to ~213.92 c/kWh (2026). The gap likely reflects differing treatment of a 2025 restructuring that unbundled Eskom's residential tariffs into separate energy, network, and retail charges — but this platform could not independently reconcile the discrepancy during this research pass. Treat any single average-tariff figure with caution and check Eskom's own tariff booklet for the authoritative number for a specific tariff category.", bg: "amber" },
        ]),
    },
    {
        id: "tariff-history", label: "Tariff History",
        defaultContent: JSON.stringify([
            { type: "title", title: "Recent Tariff History", subtitle: "NERSA's Multi-Year Price Determination (MYPD) process" },
            "NERSA sets Eskom's tariffs through the **Multi-Year Price Determination (MYPD)** process — Eskom files a revenue application, NERSA holds public hearings, and issues a binding determination covering several years at once. The current round, **MYPD6**, was thrown into disarray in 2026: NERSA's original forecast of **5.36%** for 2026/27 and **6.19%** for 2027/28 had to be revised upward to **8.76%** and **8.83%** respectively, after a High Court-ordered rehearing exposed the R54.7 billion regulatory-asset-base error.",
            "## Recent year-on-year increases (direct Eskom customers)\n- **2025/26**: +12.74% (from 1 April 2025)\n- **2026/27**: +8.76% (from 1 April 2026) — revised up from an originally approved 5.36%\n- **2027/28**: +8.83% (planned) — revised up from an originally approved 6.19%\n\n## Municipal bulk-purchase tariffs (what municipalities pay Eskom)\n- **2025/26**: +11.32% (from 1 July 2025)\n- **2026/27**: +9.01% (from 1 July 2026, running to 30 June 2027)\n\nA separate 2024 High Court ruling found NERSA's own methodology for approving *municipal* tariff increases unlawful, and a November 2025 Daily Maverick report says a further court finding called NERSA's municipal approval process unconstitutional, citing its consistent lateness. This is an active, unresolved regulatory dispute, not settled procedure.",
        ]),
    },
    {
        id: "tariff-structures", label: "Tariff Structures",
        defaultContent: JSON.stringify([
            { type: "title", title: "Tariff Structures", subtitle: "How different customers are charged" },
            { type: "text", content: "**Correction to a common misconception:** Eskom's residential tariffs no longer use an inclining block structure (IBT). Starting with the 2025/26 tariff year, Eskom unbundled its Homepower and Homelight residential tariffs into separate energy, network, and retail charges, and moved to a single flat cents-per-kWh rate for all consumption rather than rising-block pricing. The inclining-block model is still used by some municipal distributors — City Power in Johannesburg, for example, still bills residential customers on an inclining block, with rates reported to range from roughly R3.34 to R4.37/kWh including VAT across its blocks — but it is no longer how Eskom itself prices direct residential supply.", bg: "blue" },
            "## Main Eskom tariff categories\n- **Homepower / Homelight** — residential, now a single flat c/kWh rate (post-2025/26 unbundling) rather than a rising block.\n- **Businessrate** — small commercial customers.\n- **Nightsave** — time-of-use tariff aimed at medium commercial customers, cheaper overnight.\n- **Megaflex** — large industrial and commercial customers, full time-of-use pricing plus separate network (demand) charges.\n- **Miniflex** — a smaller-scale time-of-use option between Nightsave and Megaflex.\n\nExact current c/kWh rates per category and step are published in Eskom's own tariff booklet for the relevant year, which this platform could not fully extract into specific line-item figures during this research pass — check Eskom's '2026/27 Tariffs and Charges Booklet' directly (eskom.co.za/distribution) for authoritative per-category rates.",
        ]),
    },
    {
        id: "municipal-markups", label: "Municipal Markups",
        defaultContent: JSON.stringify([
            { type: "title", title: "Municipal Markups", subtitle: "Why most South Africans don't pay Eskom's tariff directly" },
            "Most South Africans buy electricity from their local municipality, not directly from Eskom. Municipalities buy bulk supply from Eskom and resell it at a markup, which also typically cross-subsidises other municipal services. An Energize study using 2020 data put the **average municipal markup at around 1.75x** the bulk purchase price, with the Western Cape's municipalities marking up the highest; individual municipalities ranged from roughly 1.5x to 2.5x. A December 2025 Bureau for Economic Research (BER) note argues Eskom's own steep recent hikes have actually squeezed municipalities' room to mark up further, reducing their gross margins on resale.",
            { type: "text", content: "**Municipal debt to Eskom is a connected, worsening problem.** Municipalities owed Eskom **R110.5 billion** as of March 2026 (up from R94.6bn at the end of 2025) — metros contributed R2.3bn of the recent increase, non-metro municipalities R13.6bn. Eskom has warned this could reach **R300 billion by 2030** without intervention, and describes municipal debt as the single greatest threat to its financial sustainability.", bg: "amber" },
            "## Distribution losses — a related but distinct problem\nLosses (electricity bought but not billed, through theft, faulty metering, or network inefficiency) are separate from the markup itself, but compound the revenue problem:\n- **Eskom's own distribution network**: losses worsened slightly from 10.42% to 10.54% in FY2026; non-technical losses (theft/meter tampering, as opposed to normal technical line loss) cost Eskom R6.6 billion that year, down from R7.1bn the year before.\n- **City Power (Johannesburg)**, Jul–Sep 2025 quarter: bought 2,982,511,319 kWh, sold only 1,728,203,856 kWh — a loss rate of roughly **42%** for that quarter.\n- **Nelson Mandela Bay**: losses reported above **27%**, more than four times the generally accepted 6% technical-loss threshold; the metro says it lost R1.4 billion on electricity in the 2024/25 financial year.",
        ]),
    },
    {
        id: "regulatory-process", label: "Regulatory Process",
        defaultContent: JSON.stringify([
            { type: "title", title: "Regulatory Process", subtitle: "Who sets tariffs, and the disputes currently underway" },
            "**NERSA (the National Energy Regulator of South Africa)** is the independent regulator responsible for approving Eskom's and municipalities' electricity tariffs under the Electricity Regulation Act and the National Energy Regulator Act. Since the 2024 split of the former Department of Mineral Resources and Energy, electricity policy — the Electricity Regulation Act, the National Energy Regulator Act, the National Energy Act, and the Nuclear Energy Act — now sits with the new **Department of Electricity and Energy (DOEE)**, while mining/minerals/petroleum policy sits with the separate **Department of Mineral and Petroleum Resources (DMPR)**.",
            { type: "text", content: "**NERSA's own approval process is currently under direct legal challenge on two fronts**, which is an unusual and newsworthy state for what is normally a routine annual process: (1) a 2024 High Court ruling found NERSA's prior methodology for approving municipal tariff increases unlawful, after SALGA and AfriForum jointly challenged it; (2) a further ruling reported by Daily Maverick in November 2025 found NERSA's municipal tariff-approval process unconstitutional, specifically citing how consistently late NERSA's decisions have been relative to municipalities' own budget cycles. The R54.7bn MYPD6 asset-base error (above) is a separate, third active dispute affecting direct Eskom customers. Readers should treat the regulatory process as actively contested right now, not settled.", bg: "amber" },
            "SALGA (the South African Local Government Association) has argued publicly that Eskom's tariff increases should be capped at the South African Reserve Bank's inflation target rather than the far larger increases NERSA has been approving.",
        ]),
    },
    {
        id: "datasets", label: "Related Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Related Datasets" },
            "Explore related data on this platform: [Electricity Market & Pricing](/dashboard/energy-carriers/electricity/market-and-pricing/tariffs-per-sector-over-time) (tariffs by sector), [Multi-Year Price Determination](/dashboard/energy-carriers/electricity/market-and-pricing/multi-year-price-determination), and [National Energy Planning](/dashboard/energy-balance).",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Engineering News, [Nersa approves higher electricity hikes for 2026/27 after R54.7bn error](https://www.engineeringnews.co.za/article/nersa-approves-higher-electricity-hikes-for-202627-after-r547bn-error-2026-03-10) (10 March 2026).\n2. TechCentral, [Eskom tariffs to surge on 1 April as Nersa blunder hits home](https://techcentral.co.za/eskom-tariffs-to-surge-on-1-april-as-nersa-blunder-hits-home/278754/).\n3. IOL, [Eskom's 8.76% electricity tariff increase: What it means for South Africans](https://iol.co.za/news/south-africa/2026-03-16-eskoms-876-electricity-tariff-increase-what-it-means-for-south-africans/) (16 March 2026).\n4. Eskom, [2025/26 Price Increase](https://www.eskom.co.za/distribution/2025-2026-price-increase/) and [2026/27 Tariff Increase](https://www.eskom.co.za/distribution/2026-2027-tariff-increase/) — official pages.\n5. Eskom, [Eskom to implement NERSA-approved FY2026 tariffs, removing unintended subsidies and introducing simplified, transparent tariffs effective 1 April 2025](https://www.eskom.co.za/eskom-to-implement-nersa-approved-financial-year-2026-tariffs-removing-unintended-subsidies-and-introducing-simplified-and-transparent-tariffs-effective-1-april-2025/) — official notice on the Homepower/Homelight unbundling.\n6. Energize, [A look at municipal electricity markups in South Africa](https://www.energize.co.za/article/a-look-at-municipal-electricity-markups-in-south-africa).\n7. ITWeb, [Eskom's R30bn profit can't outrun R6bn electricity theft](https://www.itweb.co.za/article/eskoms-r30bn-profit-cant-outrun-r6bn-electricity-theft/nWJadMbN3agMbjO1).\n8. TimesLive, [Municipalities owe Eskom R120bn as debt threatens viability](https://www.timeslive.co.za/news/south-africa/2026-09-23-municipalities-owe-eskom-r120bn-as-debt-threatens-viability/) (23 September 2026) and [Crippled by debt and crime, City Power needs urgent reform, says report](https://www.timeslive.co.za/news/2025-12-13-crippled-by-debt-and-crime-city-power-needs-urgent-reform-says-report/) (13 December 2025).\n9. BusinessTech, [Eskom warns its R110 billion headache could reach R300 billion in 5 years](https://businesstech.co.za/news/energy/854286/eskom-warns-its-r110-billion-headache-could-reach-r300-billion-in-5-years/) (1 October 2025).\n10. Engineering News, [Municipalities owe Eskom R110.5 billion for electricity](https://www.engineeringnews.co.za/print-version/municipalities-owe-eskom-r1105-billion-for-electricity-2026-03-27) (27 March 2026).\n11. Daily Maverick, [NERSA's process for approving municipal electricity tariff hikes is unconstitutional, High Court rules](https://www.dailymaverick.co.za/article/2025-11-02-nersas-process-for-approving-municipal-electricity-tariff-hikes-is-unconstitutional-high-court-rules) (2 November 2025).",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa's electricity tariffs have risen sharply over the past decade, far outpacing inflation. The average Eskom retail tariff increased from approximately R0.25/kWh in 2010 to over R2.50/kWh by 2024 — a more than tenfold increase in nominal terms. These increases reflect Eskom's debt load, cost overruns at Medupi and Kusile, ageing infrastructure, and declining plant availability. Add current tariff levels and recent determinations.",

    "tariff-history":
        "Eskom's Multi-Year Price Determination (MYPD) process sets tariffs for rolling 3-5 year periods. MYPD3 (2013–2018) saw average increases of 8% per year. MYPD4 (2019–2022) continued above-inflation increases. MYPD5 (2022–2025) included a 18.65% increase for 2023/24 and further increases thereafter. NERSA (National Energy Regulator of SA) adjudicates Eskom's revenue applications. Add a table of year-on-year increases and key determinations.",

    "tariff-structures":
        "South Africa uses several tariff structures depending on customer category: Homepower (Residential inclining block tariff — IBT — with subsidised first 350 kWh), Businessrate (Small commercial), Nightsave (Time-of-Use for medium commercial), Megaflex (Large industrial — time-of-use with network charges), and Miniflex. The IBT was designed to cross-subsidise low-income users, but has faced criticism for benefiting high-income households with large homes. Add current tariff rates per category and structure.",

    "municipal-markups":
        "Most South African consumers buy electricity from their local municipality rather than directly from Eskom. Municipalities purchase bulk supply from Eskom and resell at a markup — typically 30–60% above the Eskom bulk tariff, though some municipalities mark up by 100% or more. Municipal electricity revenue is often used to cross-subsidise other services (roads, water), meaning electricity tariffs effectively function as a tax. Free Basic Electricity (FBE) of 50 kWh/month is provided to indigent households. Add data on mark-ups across major municipalities.",

    "regulatory-process":
        "NERSA is the independent regulator responsible for approving Eskom's tariffs and licensing electricity distributors. The MYPD process involves Eskom filing a revenue application, NERSA conducting public hearings, and issuing a determination. Municipalities submit their own tariff applications to NERSA annually. The National Electricity Regulator Act and the Electricity Regulation Act (No. 4 of 2006) govern this process. The Energy Regulator Amendment Bill (under discussion) seeks to strengthen NERSA's independence. Add recent determination outcomes and appeals.",

    "datasets":
        "Key data sources: NERSA tariff determinations (nersa.org.za), Eskom annual reports, Stats SA CPI electricity sub-index, municipal tariff schedules, and the South African Local Government Association (SALGA) electricity tariff benchmarking reports. Link to relevant datasets on this platform.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Electricity Tariffs & Pricing" },
            ]} />

            <EditablePageHeader
                pageKey="topic.electricity-tariffs-pricing"
                defaultLabel="Topic"
                defaultTitle="Electricity Tariffs & Pricing"
                defaultDesc="How South Africa prices electricity — from Eskom's bulk tariff determinations and regulatory process to municipal markups and the impact on households and businesses."
            />

            <EditableSections
                pageKey="topic.electricity-tariffs-pricing"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
