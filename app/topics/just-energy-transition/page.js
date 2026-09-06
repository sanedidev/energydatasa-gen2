import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Just Energy Transition" };

const DEFAULT_SECTIONS = [
    { id: "overview",       label: "Overview" },
    { id: "jet-ip",         label: "JET Investment Plan" },
    { id: "coal-transition",label: "Coal Phase-Down & Worker Transition" },
    { id: "renewables-push",label: "Renewable Energy Scale-Up" },
    { id: "green-hydrogen",  label: "Green Hydrogen" },
    { id: "datasets",       label: "Related Datasets" },
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
                defaultDesc="South Africa's nationally led programme to decarbonise the electricity sector, phase down coal, scale up renewables, and protect affected workers and communities — backed by $8.5 billion in international partner financing."
            />

            <EditableSections
                pageKey="topic.just-energy-transition"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
