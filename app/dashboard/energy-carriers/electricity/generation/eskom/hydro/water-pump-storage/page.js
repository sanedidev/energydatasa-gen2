import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Hydro — Water Pump Storage" };

const ROOT = "/dashboard/energy-carriers";
const HYDRO = `${ROOT}/electricity/generation/eskom/hydro`;

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Water Pump Storage", subtitle: "Eskom's pumped-storage schemes" },
    "Eskom operates three pumped-storage schemes: **Ingula** (1,332 MW across four 333 MW units), commissioned 2016–2017 between KwaZulu-Natal and the Free State — Eskom's largest and newest scheme; **Drakensberg** (1,000 MW) near Bergville, commissioned in the 1980s; and **Palmiet** (400 MW) near Grabouw in the Western Cape, commissioned in 1988. Each scheme uses an upper and lower reservoir pair, pumping water uphill during periods of low demand or surplus generation and releasing it through turbines to generate power rapidly during peak demand or emergency conditions.\n\nPumped storage is a **net consumer of electricity** overall — more energy is used pumping water up than is recovered generating it back down — but its value lies in fast-response flexibility rather than net energy output: these plants can move from standstill to full output within minutes, making them one of Eskom's most important tools for managing the evening demand peak and responding to sudden generation losses elsewhere in the fleet. Combined installed pumped-storage capacity across the three schemes is approximately 2,732 MW.",
    { type: "title", title: "Sources & References" },
    "1. Eskom, [Ingula Technical Brochure](https://www.eskom.co.za/wp-content/uploads/2025/07/HY-0009-Ingula-Technical-Brochure.pdf).\n2. Eskom, [Drakensberg Technical Brochure](https://www.eskom.co.za/wp-content/uploads/2022/08/HY-0008-Drakensberg-Technical-Brochure-Rev-0.pdf).\n3. Eskom, [Pumped Storage Scheme and Water Transfer](https://www.eskom.co.za/wp-content/uploads/2021/08/HY-0001-Pumped-Storage-Scheme-and-Water-Transfer-Rev-11.pdf).",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Eskom Hydro</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Water Pump Storage</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Pumped-storage schemes, upper and lower reservoirs, net head, installed capacity, and grid balancing role.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.electricity.generation.eskom.hydro.water-pump-storage"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
