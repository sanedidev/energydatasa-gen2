import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Balancing Supply & Demand — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    { id: "overview",        label: "Overview" },
    { id: "dsm-measures",    label: "DSM Measures" },
    { id: "peak-shaving",    label: "Peak Shaving & Load Shifting" },
    { id: "programmes",      label: "National Programmes" },
    { id: "visualisations",  label: "Visualisations" },
];

const PLACEHOLDERS = {
    "overview":       "Describe the demand-side management (DSM) landscape in South Africa — the role of NERSA, Eskom, and municipalities in balancing supply and demand, particularly during constrained grid conditions.",
    "dsm-measures":   "Add types of DSM measures by sector — industrial (load curtailment, process optimisation), commercial (smart building controls, lighting retrofits), and residential (solar water heaters, LED programmes). Include typical savings and verification methods.",
    "peak-shaving":   "Describe peak-shaving and load-shifting strategies — time-of-use tariffs, demand response programmes, battery storage, and industrial curtailment agreements with Eskom.",
    "programmes":     "Add national and utility-funded DSM programmes — EEDSM, IDM (Integrated Demand Management), municipal energy efficiency grants, and SANEDI-led initiatives. Include funding, targets, and outcomes.",
    "visualisations": "Add charts showing peak demand trends, DSM savings achieved by programme, load profile comparisons before/after interventions, and Eskom demand response data.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency", href: "/dashboard/energy-efficiency" },
                { label: "Balancing Energy Supply and Demand" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Efficiency</p>
                <h1 className="text-2xl font-bold text-slate-900">Balancing Energy Supply and Demand</h1>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                    Demand-side management, energy efficiency programmes, and peak-shaving strategies across South Africa&apos;s grid.
                </p>
            </div>

            <EditableSections
                pageKey="ee.balancing-energy-supply-and-demand"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
