import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Standards & Labelling — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    { id: "overview",     label: "Overview" },
    { id: "meps",         label: "Minimum Energy Performance Standards" },
    { id: "labelling",    label: "Energy Labelling" },
    { id: "enforcement",  label: "Enforcement & Compliance" },
    { id: "datasets",     label: "Relevant Datasets" },
];

const PLACEHOLDERS = {
    "overview":    "Describe the standards and labelling framework in South Africa — the role of SABS, DMRE, and NRCS in setting and enforcing minimum energy performance standards (MEPS) for appliances and equipment.",
    "meps":        "List the product categories covered by MEPS — air conditioners, refrigerators, motors, lighting, water heaters, etc. Include the relevant SANS standard number, the performance threshold, and the year of introduction or last update.",
    "labelling":   "Describe the energy label system — star ratings or efficiency bands, mandatory vs voluntary status, label format requirements, and how consumers can interpret the label for purchase decisions.",
    "enforcement": "Add how MEPS and labelling requirements are enforced — NRCS market surveillance, testing laboratories, product registration, penalties for non-compliance, and industry notification processes.",
    "datasets":    "List datasets on appliance efficiency, product registration, market surveillance results, and compliance rates — with links to SABS, NRCS, or DMRE portals.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency", href: "/dashboard/energy-efficiency" },
                { label: "Standards & Labelling" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Efficiency</p>
                <h1 className="text-2xl font-bold text-slate-900">Standards & Labelling</h1>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                    Minimum energy performance standards (MEPS) and product labelling requirements for appliances and equipment in South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ee.standards-and-labelling"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
