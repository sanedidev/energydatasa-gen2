import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Oil — CCS & Clean Technology" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "ccs-overview",
        label: "CCS Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "CCS Overview", subtitle: "Carbon capture concepts applicable to South African refining and synfuels" },
            "Carbon capture and storage (CCS) is particularly relevant to South Africa's liquid fuels sector because of **Sasol's coal-to-liquids (CTL) operations** at Secunda, one of the most carbon-intensive synthetic fuel processes in the world — converting coal to liquid fuels via gasification and Fischer-Tropsch synthesis produces a highly concentrated CO2 stream that is, in principle, well suited to capture compared with the more diffuse emissions from combustion sources.\n\n**Post-combustion capture** (scrubbing CO2 from flue gas after combustion) and **oxyfuel combustion** (burning fuel in pure oxygen to produce a more easily captured CO2 stream) are the two capture approaches most commonly discussed for South African industrial and power applications. Whichever capture method is used, a viable CCS pathway also depends on suitable **geological storage sites** — South Africa's storage potential has been the subject of preliminary atlas-mapping work, though no storage site has been developed or permitted at commercial scale.",
        ]),
    },
    {
        id: "pilot-projects",
        label: "Pilot Projects",
        defaultContent: JSON.stringify([
            { type: "title", title: "Pilot Projects" },
            "South Africa's CCS activity to date has been concentrated in research and pre-feasibility work rather than operating demonstration plants. The **South African Centre for Carbon Capture and Storage (SACCCS)**, established under the Council for Geoscience, has led national efforts to characterise storage potential and coordinate research, including geological storage atlas studies and technical capacity-building, but no capture facility has moved to construction or operation.\n\nGiven Sasol's CTL process is the single largest concentrated point-source CO2 emitter in the liquid fuels value chain, it has featured prominently in scenario studies of what a South African CCS pathway could look like, though Sasol's own decarbonisation strategy to date has emphasised green hydrogen and renewable energy procurement more heavily than CCS.",
        ]),
    },
    {
        id: "economics",
        label: "Economics & Feasibility",
        defaultContent: JSON.stringify([
            { type: "title", title: "Economics & Feasibility" },
            "The economics of CCS in a South African context are shaped by several structural factors: the relatively **low domestic carbon price** under South Africa's carbon tax (compared with international carbon markets) reduces the financial incentive to invest in capture infrastructure, while the **capital intensity** of capture, compression, transport, and storage infrastructure represents a significant upfront cost with no direct revenue stream unless paired with enhanced oil recovery or a carbon credit mechanism.\n\nRelative to alternative decarbonisation pathways — renewable energy procurement, green hydrogen, and energy efficiency — CCS has generally been assessed as a higher-cost, higher-complexity option for South Africa's specific industrial mix, which is part of why it has remained at the study and pilot stage rather than progressing to commercial deployment.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Oil", href: `${ROOT}/oil` },
                { label: "CCS & Clean Technology" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">CCS &amp; Clean Technology</h1>
                <p className="mt-2 text-sm text-slate-500">Carbon capture, clean fuel technologies, and feasibility in the oil sector.</p>
            </div>

            <EditableSections
                pageKey="ec.oil.ccs-and-clean-coal-tech"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
