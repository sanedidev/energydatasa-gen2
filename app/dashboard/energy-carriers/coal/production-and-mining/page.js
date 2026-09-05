import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Coal — Production & Mining" };

const ROOT = "/dashboard/energy-carriers";

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Coal", href: `${ROOT}/coal` },
                { label: "Production & Mining" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Coal</p>
                <h1 className="text-2xl font-bold text-slate-900">Production &amp; Mining</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Mining methods, producing regions, annual volumes, major companies, and supply-chain notes for South African coal.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.coal.production-and-mining"
                    placeholder="Add content about provincial production breakdowns, mine types (underground vs opencast), major producers, annual tonnage trends, and rail/port logistics."
                />
            </div>
        </div>
    );
}
