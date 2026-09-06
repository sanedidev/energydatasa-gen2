import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Hydro — Water Pump Storage" };

const ROOT = "/dashboard/energy-carriers";
const HYDRO = `${ROOT}/electricity/generation/eskom/hydro`;

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Water Pump Storage", subtitle: "Eskom's pumped-storage schemes" },
    "Eskom operates three pumped-storage schemes: **Ingula** (1,332 MW), commissioned 2016-2017 between KwaZulu-Natal and the Free State; **Drakensberg** (1,000 MW) near Bergville, commissioned in the 1980s; and **Palmiet** (400 MW) near Grabouw in the Western Cape, commissioned in 1988. Each scheme uses an upper and lower reservoir pair, pumping water uphill during periods of low demand or surplus generation and releasing it through turbines to generate power rapidly during peak demand or emergency conditions.\n\nPumped storage is a **net consumer of electricity** overall — more energy is used pumping water up than is recovered generating it back down — but its value lies in fast-response flexibility rather than net energy output: these plants can move from standstill to full output within minutes, making them one of Eskom's most important tools for managing the evening demand peak and responding to sudden generation losses elsewhere in the fleet. Combined installed pumped-storage capacity across the three schemes is approximately 2,732 MW.",
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
                { label: "Water Pump Storage" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Eskom Hydro</p>
                <h1 className="text-2xl font-bold text-slate-900">Water Pump Storage</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Pumped-storage schemes, upper and lower reservoirs, net head, installed capacity, and grid balancing role.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.electricity.generation.eskom.hydro.water-pump-storage"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
