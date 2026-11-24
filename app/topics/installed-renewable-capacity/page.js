import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Installed Renewable Capacity" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Installed Renewable Capacity", subtitle: "Utility-scale REIPPPP projects, embedded generation, and the current build-out" },
            "South Africa now has **close to 16 GW of installed renewable energy capacity**, with a further **32 GW of projects in the grid-connection queue**, according to the Presidency (2026). This spans utility-scale wind, solar PV, and concentrated solar power procured mainly through the Renewable Energy Independent Power Producer Procurement Programme (REIPPPP), plus a fast-growing pool of smaller \"embedded\" generation — commercial, industrial, and residential solar PV connected behind the meter or directly to municipal/Eskom distribution networks.\n\nGrid capacity, not procurement, is now the binding constraint: multiple 2026 reports (Engineering News, Reuters-sourced coverage) describe South Africa's transmission grid as not yet ready to absorb the pace of renewables coming forward, even as capital keeps flowing — BloombergNEF projected 2.3 GW of new solar and wind capacity for 2026 alone, 73% of it backed by corporate buyers rather than the state programme.",
        ]),
    },
    {
        id: "capacity-breakdown", label: "Capacity by Technology",
        defaultContent: JSON.stringify([
            { type: "title", title: "Capacity by Technology" },
            "A precise, current, independently-confirmed MW breakdown by individual technology (wind vs utility-scale solar PV vs CSP vs biogas/small hydro) was not available from an official source at time of writing — NERSA's own registration data (below) tracks facility counts and total MW, not always split by technology, and the Presidency's ~16 GW headline figure is also an aggregate. Known concrete recent additions include:\n\n- **Ummbila Emoyeni Wind Farm** (Mpumalanga, developed by Seriti Green) — first 155 MW phase reached commercial operation, reported 8 November 2026.\n- **Solar PV registrations, Q2 FY2026/27 (Jul–Sep 2026)**: 139 solar facilities registered nationally, totalling 2,045 MW, per NERSA data reported by trade press in November 2026.\n\nFor exact installed MW by technology, check the IPP Office's project database or NERSA's generation licence register directly; this page will be updated as a reliable current breakdown is confirmed.",
        ]),
    },
    {
        id: "ipp-programmes", label: "REIPPPP Bid Windows",
        defaultContent: JSON.stringify([
            { type: "title", title: "REIPPPP Bid Windows", subtitle: "Bid Window 7 — the current round, solar-only" },
            "**Bid Window 7 (BW7)** was originally designed for up to 5,000 MW split between solar PV and onshore wind, with 48 bidders offering a combined 10.2 GW. It did not attract sufficient wind bids, so the Department of Electricity and Energy reallocated the shortfall to solar PV. Awards came in three rounds:\n\n- **December 2024** — 8 solar PV projects named preferred bidders, totalling **1,760 MW**, representing R31.4 billion in investment.\n- **July 2025** — a further 6 solar projects added, totalling 1,290 MW (reallocated from the wind technology stream).\n- **December 2025** — a further 890 MW of solar PV capacity added.\n\n**As of December 2025, total capacity procured under BW7 stood at 3,940 MW across 18 solar PV projects.** A May 2026 update lists developers including Infinity Power Holding (six projects), Mulilo Renewable Project Developments, Scatec Solar Africa, Red Rocket South Africa, and ENGIE, across Limpopo, the Free State, North West, and Mpumalanga. No confirmation of financial close or grid-connection timing for these BW7 projects was found during this research pass.\n\nEarlier bid windows (BW1–BW6, 2011–2023) built out the bulk of South Africa's existing utility-scale wind and solar fleet; BW7 is the first window procured entirely from solar PV.",
        ]),
    },
    {
        id: "embedded-gen", label: "Embedded & Registered Generation",
        defaultContent: JSON.stringify([
            { type: "title", title: "Embedded & Registered Generation", subtitle: "Important: NERSA's registration totals cover ALL generation facilities, not only rooftop/embedded solar" },
            { type: "text", content: "A genuinely important caveat, stated by NERSA itself: the regulator has said it does not have the capacity or systems in place to track which registered projects have actually been built and connected. **Registered capacity is not the same as built, operating capacity.**", bg: "amber" },
            "NERSA registration totals, all generation facilities (embedded and larger grid-tied projects combined):\n\n- **Calendar 2025 (full year):** 597 facilities registered, totalling 7.46 GW, representing approximately R158 billion in investment.\n- **Calendar 2024:** 476 facilities, 4.16 GW.\n- **H1 2026:** 236 facilities, 2.13 GW.\n\nMore recent quarterly detail:\n- **Q4 FY2025/26 (Jan–Mar 2026):** 112 facilities, 1,327 MW.\n- **Q1 FY2026/27 (Apr–Jun 2026):** 124 facilities, 804 MW — 63 connecting to municipal distribution networks (47 MW combined) and 61 to Eskom's network (757 MW).\n- **Q2 FY2026/27 (Jul–Sep 2026):** 144 facilities, 3,129 MW — 68 connecting to municipal networks (50 MW combined).\n\nCumulative-since-2018 totals are **inconsistent between NERSA's own releases** — one report gives 2,763 facilities and 23,260 MW, another gives approximately 21.9 GW — and this discrepancy is not resolved here; check NERSA's own register for the authoritative current total.\n\n**Registration rules (clarified by NERSA, February 2026):** systems of 100 kW or less with a grid connection register with the relevant distributor (Eskom or the licensed municipality); larger grid-connected systems register directly with NERSA; systems with no grid connection at all are exempt from registration entirely — meaning a further, genuinely unknown amount of off-grid capacity exists outside any of these figures.",
        ]),
    },
    {
        id: "irp-targets", label: "IRP 2025 Targets",
        defaultContent: JSON.stringify([
            { type: "title", title: "IRP 2025 Targets", subtitle: "The current official plan — IRP 2019 has been superseded" },
            "The Integrated Resource Plan 2019 (IRP 2019) has been replaced: **IRP 2025 was approved by Cabinet on 15 October 2025 and gazetted on 28 October 2025** (Government Gazette No. 53596). Any reference elsewhere to IRP 2019 renewable-energy targets as the current plan is now out of date.\n\nIRP 2025 sets out roughly **105 GW of build-out to 2039**, requiring an estimated R2.23 trillion in investment. Headline renewable-relevant targets:\n\n- **By 2030:** 11,270 MW solar PV, 7,340 MW wind, 6,000 MW gas-to-power — and explicitly **no new coal or nuclear capacity** in this window.\n- **By 2039:** 34 GW wind, 25 GW solar, 16,000 MW gas, 5.2 GW of new nuclear capacity, and 8,500 MW of battery storage.\n- **2039 generation share:** coal approximately 27%, wind approximately 24%, solar approximately 18% — a structurally different mix from today's coal-dominated ~81% (see [Total Electricity Generated](/topics/total-electricity-generated)).\n\nTracking actual procurement (REIPPPP Bid Window 7, described above) against these 2030/2039 targets requires comparing contracted and connected MW year by year — this platform will add that comparison once BW7's construction and grid-connection status is confirmed.",
        ]),
    },
    {
        id: "visualisations", label: "Visualisations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Visualisations" },
            "Charts planned for this section: cumulative installed renewable capacity by technology and year; REIPPPP bid-window capacity awarded vs. grid-connected; NERSA quarterly registered-generation totals; renewable share of national generation mix over time; IRP 2025 target trajectory to 2030 and 2039.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Government of South Africa, [Integrated Resource Plan 2025](https://www.gov.za/) — Cabinet-approved 15 October 2025, gazetted 28 October 2025, Government Gazette No. 53596; 2030/2039 capacity targets.\n2. Engineering News, [Renewable Energy Independent Power Producer Procurement Programme – Bid Window 7, South Africa – update](https://www.engineeringnews.co.za/article/renewable-energy-independent-power-producer-procurement-programme-bid-window-7-south-africa-update-2026-05-22) (10 Jan 2025, 25 Jul 2025, 22 May 2026 update series) — BW7 award rounds and developer list.\n3. PV Magazine, [South Africa adds 890 MW of solar to seventh renewables bid window](https://www.pv-magazine.com/2025/12/17/south-africa-adds-890-mw-of-solar-to-seventh-renewables-bid-window/) (17 December 2025) — BW7 cumulative total of 3,940 MW across 18 projects.\n4. DBSA, [REIPPPP Bid Window 7 — Successful Bidders](https://dbsa.org/sites/default/files/media/documents/2025-01/REIPPPP%20BW%207%20Successful%20Bidders.pdf) and [Additional Bidders](https://www.dbsa.org/sites/default/files/media/documents/2025-07/REIPPPP%20BW%207%20Additional%20Bidders%20Final.pdf) (2025) — official BW7 preferred-bidder lists.\n5. Engineering News, [NERSA registered 144 generation facilities in the September quarter](https://engineeringnews.co.za/article/nersa-registered-144-generation-facilities-in-the-september-quarter-2026-11-06) and related quarterly NERSA registration articles (2026) — registered-generation totals and the registered-vs-built caveat.\n6. New Energy World, [Seriti Green's Ummbila Emoyeni wind farm reaches commercial operation](https://knowledge.energyinst.org/new-energy-world/article?id=160428) (8 November 2026).\n7. NERSA, [NERSA clarifies regulatory requirements for Small-Scale Embedded Generation registrations](https://www.engineeringnews.co.za/article/nersa-clarifies-regulatory-requirements-for-small-scale-embedded-generation-registrations-2026-02-02) (February 2026) — current registration thresholds and rules.",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa's installed utility-scale renewable capacity reached approximately 7,000–8,000 MW by end-2024, up from near-zero in 2010. Wind accounts for the largest share (~3,500 MW), followed by solar PV (~2,500 MW utility-scale), concentrated solar power (CSP, ~600 MW), and biogas/landfill gas (~150 MW). Separately, embedded (behind-the-meter) solar PV — driven by load shedding — surged past 5,000 MW by mid-2024. Renewables now meet roughly 8–10% of national electricity demand. Add current installed figures by technology.",

    "capacity-breakdown":
        "Utility-scale installed capacity by technology (approximate, 2024): Wind: ~3,500 MW across 60+ projects (Eastern Cape, Western Cape, Northern Cape); Solar PV: ~2,500 MW utility-scale; Concentrated Solar Power (CSP): ~600 MW (Northern Cape — Kathu, Bokpoort, KaXu Solar One, Redstone); Biogas and landfill gas: ~150 MW; Small hydro: ~15 MW. The Northern Cape leads in solar irradiance and has the most utility-scale solar projects. The Eastern and Western Cape host the majority of wind projects, benefiting from the coastal Berg wind and coastal low-level jet. Add MW per project and geographic distribution.",

    "ipp-programmes":
        "The Renewable Energy Independent Power Producer Procurement Programme (REIPPP) has been the main vehicle for utility-scale renewable procurement since 2011. Bid Window 1 (2011): 28 projects, 1,416 MW awarded. BW2 (2012): 19 projects, 1,044 MW. BW3 (2013): 17 projects, 1,456 MW. BW4 (2014–2015): 26 projects, 2,205 MW. BW5 (2021): 25 projects, 2,583 MW. BW6 (2023): approximately 4,200 MW awarded across wind and solar. BW7 is expected to build on this. Total REIPPP contracted capacity: ~12,000 MW across all windows to date. Add latest status of construction and grid connection per window.",

    "embedded-gen":
        "The embedded generation revolution is arguably the most significant change in South Africa's energy landscape in 2022–2024. Following the lifting of the licensing threshold to 100 MW (Schedule 2 amendment, 2021), commercial, industrial, and residential installations surged. By mid-2024, registered embedded solar PV capacity exceeded 5,000 MW — comparable to the entire REIPPP programme built over 10 years. This has materially reduced Eskom's daytime peak demand and is one of the primary reasons load shedding reduced in 2024. Add quarterly registration data, sectoral breakdown (residential vs commercial vs industrial), and impact on Eskom load curve.",

    "irp-targets":
        "The Integrated Resource Plan 2019 (IRP 2019) is the government's long-term electricity plan. It sets 2030 targets of: 14,400 MW additional wind; 6,000 MW solar PV (utility-scale); 2,500 MW CSP; 2,500 MW hydro (including imports); 1,500 MW battery storage; and 1,000 MW gas/diesel peakers. Against these targets, wind and solar PV procurement is tracking broadly on schedule via REIPPP, though grid connection timelines are constrained by Eskom's transmission infrastructure and substation capacity. The IRP is reviewed periodically — IRP 2023 revision was under consultation as of 2024. Add progress against each technology target.",

    "visualisations":
        "Add charts showing: cumulative renewable capacity installed (MW) 2011–present by technology; REIPPP bid window capacity awarded vs connected to grid; embedded generation quarterly growth (MW); share of renewables in electricity generation mix over time; geographic map of renewable projects by province. Data sources: NERSA, IPPPP Office, Eskom Grid Connection Reports, CSIR Energy Centre.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Installed Renewable Capacity" },
            ]} />

            <EditablePageHeader
                pageKey="topic.installed-renewable-capacity"
                defaultLabel="Topic"
                defaultTitle="Installed Renewable Capacity"
                defaultDesc="South Africa has close to 16 GW of installed renewable capacity with a further 32 GW in the grid-connection queue — spanning REIPPPP wind, solar, and CSP projects plus a fast-growing pool of embedded generation."
            />

            <EditableSections
                pageKey="topic.installed-renewable-capacity"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
