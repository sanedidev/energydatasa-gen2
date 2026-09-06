import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Peat" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Peat", subtitle: "Peat as a minor, tightly constrained energy resource in South Africa" },
            "Peat plays a negligible role in South Africa's current energy balance and is included here primarily for completeness rather than as an active development priority. Unlike coal, oil, or gas, peat has no significant commercial extraction industry in the country today, and the resource itself is concentrated in ecologically sensitive wetland systems that are subject to strong conservation protections — a combination that has kept peat as a largely dormant energy carrier rather than an actively exploited one.",
        ]),
    },
    {
        id: "resource-occurrence",
        label: "Resource Occurrence",
        defaultContent: JSON.stringify([
            { type: "title", title: "Resource Occurrence" },
            "South Africa's known peat deposits occur mainly in high-altitude and coastal wetland systems, with the most notable concentrations found in **KwaZulu-Natal** (including parts of the Maputaland wetland systems) and smaller occurrences in the **Western Cape**. These deposits formed over thousands of years under waterlogged, low-oxygen conditions that slow the decomposition of organic material, the same process that (over much longer geological timescales) ultimately produces coal.\n\nResource surveys of South African peat deposits are limited compared to the country's extensively mapped coal reserves, reflecting the resource's marginal economic significance — there has been little commercial incentive to invest in detailed volumetric or calorific-value surveys.",
        ]),
    },
    {
        id: "energy-applications",
        label: "Energy Applications",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Applications" },
            "Where peat has historically been used as a fuel internationally, it is typically burned directly for heat (as in parts of Northern Europe) or, less commonly, gasified. In South Africa, peat has no meaningful role in the current energy system — there is no commercial peat-fired generation or significant direct-combustion industry — and its calorific value is generally lower than coal, making it a less attractive fuel where coal is abundant and cheap, as it is domestically.\n\nGiven South Africa's coal abundance and the environmental sensitivity of peat wetland ecosystems, peat is unlikely to become an actively developed energy resource under current market and policy conditions.",
        ]),
    },
    {
        id: "environmental-constraints",
        label: "Environmental Constraints",
        defaultContent: JSON.stringify([
            { type: "title", title: "Environmental Constraints" },
            "The great majority of South Africa's peat-bearing wetlands fall under statutory protection, whether directly or through the broader regulatory framework governing wetlands under the **National Water Act** and the **National Environmental Management Act (NEMA)**. Wetlands are recognised as critical for water regulation, biodiversity, and — significantly for climate policy — as long-term carbon sinks: peat itself is a dense store of sequestered carbon, and disturbing or draining peatlands releases that carbon, running directly counter to climate mitigation objectives.\n\nThis conservation and carbon-stock rationale represents the primary practical barrier to any commercial peat extraction in South Africa, independent of the resource's modest economic attractiveness relative to coal.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **DMRE mineral resources surveys** — where peat occurrences have been documented alongside other mineral resource assessments\n- **SANBI wetland inventory data** — the South African National Biodiversity Institute's National Wetland Map, covering peat-bearing wetland systems\n- **National Energy Balance tables** — for peat's (minimal) place within the broader national energy accounting framework",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Peat" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Carriers</p>
                <h1 className="text-2xl font-bold text-slate-900">Peat</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Peat resource occurrence, energy use cases, and constraints within South Africa&apos;s energy mix.
                </p>
            </div>

            <EditableSections
                pageKey="ec.peat"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
