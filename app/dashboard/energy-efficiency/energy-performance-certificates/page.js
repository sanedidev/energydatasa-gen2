import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Energy Performance Certificates — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    { id: "overview",    label: "Overview" },
    { id: "ratings",     label: "Rating System" },
    { id: "compliance",  label: "Compliance & Obligations" },
    { id: "process",     label: "Assessment Process" },
    { id: "datasets",    label: "Relevant Datasets" },
];

const PLACEHOLDERS = {
    "overview":   "Describe what an Energy Performance Certificate (EPC) is — its purpose under SANS 1544, the buildings it applies to, and the regulatory framework (DoE / DMRE mandate).",
    "ratings":    "Add how the EPC rating bands work — the scale (A–G or equivalent), what each band means in terms of energy use intensity (kWh/m²/year), and how buildings are benchmarked.",
    "compliance": "Describe obligations for building owners and tenants — when an EPC is required (sale, lease, occupation), validity period, and enforcement mechanisms.",
    "process":    "Add the assessment process — qualified assessor requirements, audit methodology, submission to the national register, and typical timeframes and costs.",
    "datasets":   "List datasets related to building energy performance — DMRE registers, GBCSA benchmarks, municipal building audit data, and links to access them.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency", href: "/dashboard/energy-efficiency" },
                { label: "Energy Performance Certificates" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Efficiency</p>
                <h1 className="text-2xl font-bold text-slate-900">Energy Performance Certificates (EPC)</h1>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                    EPC requirements, rating methodology, compliance obligations, and the assessment process for buildings in South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ee.energy-performance-certificates"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
