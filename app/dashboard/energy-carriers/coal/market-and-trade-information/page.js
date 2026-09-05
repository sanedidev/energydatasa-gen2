import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Coal — Market & Trade Information" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    { id: "imports-exports", label: "Imports & Exports data" },
];

const PLACEHOLDERS = {
    "imports-exports": "Add coal import/export volumes, primary trade partners, values, monthly/annual series, and links to dashboards when available.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Coal", href: `${ROOT}/coal` },
                { label: "Market & Trade Information" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Market &amp; Trade Information</h1>
                <p className="mt-2 text-sm text-slate-500">Coal import and export volumes, trade partners, and pricing data.</p>
            </div>

            <EditableSections
                pageKey="ec.coal.market-and-trade-information"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
