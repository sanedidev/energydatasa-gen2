import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Just Energy Transition" };

const DEFAULT_SECTIONS = [
    {
        id: "overview", label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Just Energy Transition", subtitle: "South Africa's nationally led shift away from coal, and the international financing behind it" },
            "South Africa's Just Energy Transition (JET) is a nationally led programme to shift away from coal-dominated electricity generation toward a lower-carbon economy while protecting workers and communities dependent on fossil fuels. At COP26 (November 2021), South Africa partnered with the US, UK, France, Germany, and the EU in the International Partners Group (IPG), with an initial $8.5 billion financing commitment. The JET Investment Plan (JET-IP) was formally adopted in November 2022, covering 2023–2027 and identifying roughly R1.5 trillion (~$84 billion) in total investment needs across five pillars: electricity generation, electric vehicles, green hydrogen, energy efficiency, and new energy vehicles.",
            { type: "text", content: "By 2026, the IPG's pledged financing had grown to **$11.6 billion**, per a UK government 12-month Leaders Update — though grants remain a small share of that total, with increasing emphasis on mobilising private capital. The same 2026 update characterises South Africa as having moved \"from crisis management and policy reform to implementation and delivery,\" while independent reporting has repeatedly flagged the pace of actual disbursement as slow relative to the scale of the pledges.", bg: "blue" },
        ]),
    },
    {
        id: "jet-ip", label: "JET Investment Plan",
        defaultContent: JSON.stringify([
            { type: "title", title: "JET Investment Plan" },
            "The Presidential Climate Commission (PCC) and the Presidential Climate Finance Task Team coordinate JET-IP implementation, drawing on grants, concessional loans, risk-sharing instruments, and private-investment mobilisation from Development Finance Institutions including the AfDB, DBSA, and IDC alongside the international partners. Disbursement has been criticised as slow: a 2024 initiative aimed to channel at least R600 million in grants through a dedicated \"matchmaking platform\" by 2025, though confirmation that this target was met was not found in this research pass.\n\nA newer, parallel instrument — the **Accelerating Coal Transition Investment Plan (ACT IP)** — had its first round of detailed project proposals approved by the Climate Investment Fund Trust Fund Committee on 30 October 2026, signalling continued momentum on the financing side even as overall disbursement remains gradual. Separately, NERSA issued revised draft electricity trading rules in May 2026, relevant to the third-party wheeling arrangements the JET-IP's renewables pillar depends on.",
        ]),
    },
    {
        id: "coal-transition", label: "Coal Phase-Down & Worker Transition",
        defaultContent: JSON.stringify([
            { type: "title", title: "Coal Phase-Down & Worker Transition" },
            "South Africa's coal-fired fleet is still substantial — Eskom's own 2026 figures put its coal capacity at roughly 47–48 GW out of a national generation capacity of about 63 GW (coal ≈ 69% of the national total) — and retirements have in practice been pushed back rather than accelerated: Eskom's current plan provides for around 7.4 GW of coal retirements by 2030, with Hendrina, Grootvlei, and Camden's closures specifically delayed because the gas-fired capacity meant to replace them is running behind schedule.",
            { type: "text", content: "**Komati Power Station** (decommissioned October 2022, 1,000 MW) remains the JET's flagship repurposing pilot: the World Bank approved roughly $497 million in financing in November 2022 (a $439.5m World Bank loan plus a $47.5m Canada Clean Energy and Forest Climate Facility loan) to convert the site to solar, wind, and battery storage — reported plans have ranged between 50–150 MW solar, 70 MW wind, and 150 MW battery storage across different project updates. As of this research pass, no confirmed 2025–2026 construction-progress update was found; Eskom's own project pages or the World Bank's Komati Just Energy Transition Project page are the sources to check for current status.", bg: "amber" },
        ]),
    },
    {
        id: "renewables-push", label: "Renewable Energy Scale-Up",
        defaultContent: JSON.stringify([
            { type: "title", title: "Renewable Energy Scale-Up" },
            "**IRP 2025** — cabinet-approved 15 October 2025 and gazetted 28 October 2025 — replaced IRP 2019 as South Africa's official electricity capacity plan, and sets materially different targets from the superseded 2019 version: by 2030, 11,270 MW of solar PV, 7,340 MW of wind, and 6,000 MW of gas-to-power, with no new coal or nuclear; by 2039, 34 GW of wind, 25 GW of solar, 16,000 MW of gas, 5.2 GW of new nuclear, and 8,500 MW of battery storage. IRP 2025 also underpins South Africa's new NDC 3.0, which itself projects roughly 44 GW of new renewable capacity by 2035.\n\nThe REIPPPP's **Bid Window 7** — redesigned as solar-only after onshore wind bids were reallocated — had grown to **3,940 MW across 18 solar PV projects** as of December 2025. Separately, NERSA's generation-facility registrations (covering both grid-scale and embedded/rooftop generation) totalled 597 facilities and 7.46 GW across all of 2025, with momentum continuing into 2026 — 144 facilities and 3,129 MW registered in the July–September 2026 quarter alone. NERSA itself cautions that registered capacity is not the same as built, operating capacity. A concrete recent example: Seriti Green's Ummbila Emoyeni wind farm in Mpumalanga reached commercial operation on its first 155 MW phase, reported 8 November 2026.",
        ]),
    },
    {
        id: "green-hydrogen", label: "Green Hydrogen",
        defaultContent: JSON.stringify([
            { type: "title", title: "Green Hydrogen" },
            "South Africa's Hydrogen Society Roadmap (February 2022) sets out the country's green hydrogen ambitions, built on its strong solar and wind resources and existing hydrogen-handling expertise from the petrochemicals sector. Its real targets are **10 GW of electrolysis capacity concentrated in the Northern Cape by 2030**, scaling to **15 GW nationally by 2040**, and around **500,000 tonnes/year of green hydrogen production by 2030** — these are national roadmap targets, not a single company's commitment (the figures are sometimes miscited elsewhere as \"Sasol's 10 GW target by 2050,\" which conflates both the scale and the timeframe). The Northern Cape and Western Cape remain the priority production zones, and the HySA (Hydrogen South Africa) programme continues to coordinate R&D. A current, dated project pipeline or electrolyser procurement update was not confirmed in this research pass — treat specific project-level hydrogen claims with caution until checked against a current source.",
        ]),
    },
    {
        id: "datasets", label: "Related Datasets",
        defaultContent: JSON.stringify([
            "Key sources for this topic: the Presidential Climate Commission's JET-IP reporting; the UK government's annual Just Energy Transition Partnership Leaders Updates; NERSA's quarterly generation-registration releases; and IRP 2025 itself (Department of Electricity and Energy). See also this platform's **National Energy Planning** section for the underlying generation-mix data.",
        ]),
    },
    {
        id: "sources", label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. UK Government, [12-month Just Energy Transition Partnership Leaders Update 2026](https://www.gov.uk/government/news/12-month-just-energy-transition-partnership-leaders-update-2026) and its [Annex](https://assets.publishing.service.gov.uk/media/6afd6c82c8c31a0a6a745c3d/Leaders_Update_2026_Annex.pdf).\n2. International Climate Initiative, [Accelerating implementation of South Africa's Just Energy Transition Investment Plan (JET-IP)](https://www.international-climate-initiative.com/PROJECT2427-1).\n3. Engineering News / Mining Weekly, [New Just Energy Transition matchmaking platform aiming for R600m in grant disbursements in 2025](https://www.engineeringnews.co.za/article/new-just-energy-transition-matchmaking-platform-aiming-for-r600m-in-grant-disbursements-in-2025-2024-10-25) (25 October 2024).\n4. Daily Maverick, [Slow start to funding for SA's Just Energy Transition but acceleration expected](https://www.dailymaverick.co.za/article/2024-07-17-slow-start-to-funding-for-sas-just-energy-transition-but-acceleration-expected) (17 July 2024).\n5. World Bank, [Factsheet: Eskom Just Energy Transition Project](https://www.worldbank.org/en/news/factsheet/2023/06/05/factsheet-eskom-just-energy-transition-project-in-afe-south-africa) (5 June 2023).\n6. Engineering News, [South Africa set to run coal stations longer as gas projects lag](https://www.engineeringnews.co.za/article/south-africa-set-to-run-coal-stations-longer-as-gas-projects-lag-2026-06-12) (June 2026).\n7. PV-Tech, [South Africa adds 890 MW of solar to seventh renewables bid window](https://www.pv-magazine.com/2025/12/17/south-africa-adds-890-mw-of-solar-to-seventh-renewables-bid-window/) (17 December 2025).\n8. Mining Weekly, [NERSA confirms 2,692 generator registrations](https://www.miningweekly.com/article/nersa-confirms-2-692-generator-registrations-2026-09-11) (11 September 2026); Engineering News, [NERSA registered 144 generation facilities in the September quarter](https://engineeringnews.co.za/article/nersa-registered-144-generation-facilities-in-the-september-quarter-2026-11-06) (6 November 2026).\n9. New Energy World, Seriti Green Ummbila Emoyeni wind farm commercial operation report (8 November 2026) — [knowledge.energyinst.org](https://knowledge.energyinst.org/new-energy-world/article?id=160428).\n10. Department of Electricity and Energy, Integrated Resource Plan 2025 (cabinet-approved 15 October 2025, Government Gazette No. 53596, 28 October 2025).\n11. Enerdata, [South Africa aims to reduce GHG emissions to 320–380 MtCO2eq by 2035](https://www.enerdata.net/publications/daily-energy-news/south-africa-aims-reduce-ghg-emissions-320-380-mtco2eq-2035.html) (NDC 3.0 context).",
        ]),
    },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa's Just Energy Transition (JET) is a nationally led programme to shift away from coal-dominated electricity generation toward a lower-carbon economy, while protecting workers and communities dependent on fossil fuels. At COP26 (November 2021), South Africa partnered with the United States, United Kingdom, France, Germany, and the European Union in the International Partners Group (IPG), committing $8.5 billion in initial financing. The JET Investment Plan (JET-IP) was formally adopted in November 2022. Add current status, governance structure, and key milestones.",

    "jet-ip":
        "The JET Investment Plan (JET-IP) covers 2023–2027 and identifies R1.5 trillion (~$84 billion) in investment needs across five pillars: electricity generation, electric vehicles (EVs), green hydrogen, energy efficiency, and new energy vehicles (NEVs). The initial $8.5bn IPG commitment comprises grants, concessional loans, risk-sharing instruments, and private investment mobilisation. The Presidential Climate Finance Task Team (PCFTT) coordinates implementation. The Development Finance Institutions (DFIs) involved include the AfDB, DBSA, IDC, and international partners. Add funding disbursement status and updated commitments.",

    "coal-transition":
        "South Africa has approximately 40 GW of coal-fired capacity (2024), employing an estimated 80,000–90,000 people directly in coal mining and power generation, with several hundred thousand in indirect employment. The JET-IP identifies a phased retirement schedule: Komati Power Station was decommissioned in October 2022 (1,000 MW); Grootvlei, Camden, and Hendrina are scheduled for retirement. The Komati Repowering Project — a pilot for repurposing retired plants using renewables and storage — is funded by the World Bank. The JET Social Equity Fund supports affected workers and communities. Add updated plant retirement schedules and social support programmes.",

    "renewables-push":
        "South Africa's IRP 2019 (Integrated Resource Plan) targets 41 GW of new renewable capacity by 2030, comprising 14.4 GW wind, 6 GW solar PV, 2.5 GW CSP, and 2.1 GW hydro. REIPPP Bid Window 6 (BW6) was awarded in 2023, adding approximately 4.2 GW of contracted capacity. BW7 is expected to follow. The Embedded Generation programme allows municipalities and private consumers to self-generate up to 100 MW without a licence (amended Schedule 2, Electricity Regulation Act, 2021). Wheeling regulations enabling third-party energy trading are still being finalised. Add latest bid window results and grid connection status.",

    "green-hydrogen":
        "South Africa has significant potential for green hydrogen production given its solar and wind resources, as well as existing hydrogen expertise from the petrochemicals sector (Sasol). The Hydrogen Society Roadmap (2021) sets out a vision for SA to be a major global green hydrogen exporter by 2030. The Northern Cape and Western Cape are identified as priority production zones. Key projects include the HySA (Hydrogen South Africa) programme, Sasol's 10 GW green hydrogen target, and several REIPPP-linked hydrogen export proposals. Add current project pipeline, electrolyser procurement, and export agreements.",

    "datasets":
        "Key data sources: DFFE JET-IP document (November 2022), Presidential Climate Commission (PCC) reports, NERSA, IEA South Africa country page, IRENA South Africa profile, World Bank Komati project data, Council for Scientific and Industrial Research (CSIR) renewable energy statistics. Link to relevant datasets on this platform.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Just Energy Transition" },
            ]} />

            <EditablePageHeader
                pageKey="topic.just-energy-transition"
                defaultLabel="Topic"
                defaultTitle="Just Energy Transition"
                defaultDesc="South Africa's nationally led programme to decarbonise the electricity sector, phase down coal, scale up renewables, and protect affected workers and communities — backed by $11.6 billion in pledged international partner financing, up from an initial $8.5 billion committed at COP26 in 2021."
            />

            <EditableSections
                pageKey="topic.just-energy-transition"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
