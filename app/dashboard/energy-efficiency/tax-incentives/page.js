import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Tax Incentives — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    { id: "overview",     label: "Overview" },
    { id: "schemes",      label: "Incentive Schemes" },
    { id: "eligibility",  label: "Eligibility Criteria" },
    { id: "application",  label: "Application Process" },
    { id: "case-studies", label: "Case Studies" },
];

const PLACEHOLDERS = {
    "overview":     "Describe the landscape of energy efficiency tax incentives available in South Africa — the purpose, scope, and governing legislation (e.g., Section 12L of the Income Tax Act).",
    "schemes":      "Add specific incentive schemes — accelerated depreciation, rebates, grants, or tax credits — with the value, qualifying activities, and links to official sources.",
    "eligibility":  "Add eligibility criteria — business size, sector, minimum efficiency improvement thresholds, and whether independent verification is required.",
    "application":  "Describe the application or claiming process — forms, submission deadlines, accreditation body (SANEDI), and expected turnaround times.",
    "case-studies": "Add examples of businesses that have claimed incentives — the technology deployed, energy saved, and rand value of the benefit received.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency", href: "/dashboard/energy-efficiency" },
                { label: "Tax Incentives" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Efficiency</p>
                <h1 className="text-2xl font-bold text-slate-900">Tax Incentives</h1>
                <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                    Incentive schemes, eligibility criteria, and application guidance for energy efficiency improvements in South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ee.tax-incentives"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
