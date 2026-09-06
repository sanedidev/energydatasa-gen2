import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Coal — Technology & Innovation" };

const ROOT = "/dashboard/energy-carriers";
const COAL = `${ROOT}/electricity/generation/eskom/coal`;

const DEFAULT_SECTIONS = [
    {
        id: "ccs-clean-coal",
        label: "CCS & Clean Coal Tech",
        defaultContent: JSON.stringify([
            { type: "title", title: "CCS & Clean Coal Technology", subtitle: "Emissions control, efficiency retrofits, and carbon capture in Eskom's coal fleet" },
            "Emissions control has become one of the most consequential technology priorities across Eskom's coal fleet, driven by tightening **Minimum Emission Standards (MES)** under the National Environmental Management: Air Quality Act. Compliance pathways include retrofitting **flue-gas desulphurisation (FGD)** to reduce SO₂ emissions — implemented at Kusile from the outset and progressively rolled out or assessed elsewhere in the fleet — alongside **electrostatic precipitators (ESPs)** and, in newer or upgraded units, **selective catalytic reduction (SCR)** or low-NOx burner technology to control particulate and nitrogen oxide emissions.\n\n**Efficiency retrofits** — boiler and turbine upgrades, improved combustion control, and heat-rate optimisation — offer a lower-cost emissions and cost improvement than new-build capacity, since even modest efficiency gains across a fleet burning over 100 million tonnes of coal annually translate into meaningful reductions in both fuel cost and emissions intensity.\n\n**Carbon capture and storage (CCS)** remains at an early, largely research and feasibility stage for Eskom's coal fleet, coordinated in part through the **South African Centre for Carbon Capture and Storage (SACCCS)**. No commercial-scale capture facility has been built at any Eskom coal station, reflecting both the high capital cost of retrofitting capture technology to an ageing fleet and the broader strategic direction — set out in Eskom's Just Energy Transition plans — toward managed decommissioning of older coal units rather than long-life extension via CCS retrofit.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Coal", href: COAL },
                { label: "Technology & Innovation" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Technology &amp; Innovation</h1>
                <p className="mt-2 text-sm text-slate-500">CCS, clean-coal technologies, efficiency improvements and R&amp;D.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-coal.technology-and-innovation"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
