import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Coal — Coal Information" };

const ROOT = "/dashboard/energy-carriers";

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Coal", href: `${ROOT}/coal` },
                { label: "Coal Information" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Coal</p>
                <h1 className="text-2xl font-bold text-slate-900">Coal Information</h1>
                <p className="mt-2 text-sm text-slate-500">
                    South African coal quality specifications, composition, logistics, and resource context.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.coal.coal-information"
                    placeholder="Add content about coal grades, calorific values, proximate/ultimate analysis results, reserve classifications, and logistics/rail maps."
                />
            </div>
        </div>
    );
}
