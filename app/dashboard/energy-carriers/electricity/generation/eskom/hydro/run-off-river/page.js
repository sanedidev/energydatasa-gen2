import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Hydro — Run-off River" };

const ROOT = "/dashboard/energy-carriers";
const HYDRO = `${ROOT}/electricity/generation/eskom/hydro`;

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Run-off River", subtitle: "Eskom's run-of-river hydro generation" },
    "Eskom's run-of-river hydro generation is concentrated on the **Orange River system**, principally at the **Gariep** and **Vanderkloof** dams, which combine hydropower generation with their primary functions of irrigation water supply and flood control for the Orange-Fish river system. Unlike pumped storage, run-of-river generation depends directly on river flow and reservoir release schedules rather than being dispatchable purely on demand, meaning its output is influenced by rainfall patterns, upstream water requirements, and inter-provincial water-sharing agreements as much as by electricity demand.\n\nRun-of-river output makes only a modest contribution to Eskom's overall generation mix by volume, but it provides low-cost, low-emissions generation whenever water releases coincide with demand needs, and its operation is tightly coordinated with the **Department of Water and Sanitation** given the dams' dual role in water supply and power generation.",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Hydro", href: HYDRO },
                { label: "Run-off River" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Eskom Hydro</p>
                <h1 className="text-2xl font-bold text-slate-900">Run-off River</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Run-of-river hydro plants, installed capacity, generation output, and hydrological context.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.electricity.generation.eskom.hydro.run-off-river"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
