import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Natural Gas — Piped" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Piped Gas", subtitle: "Pipeline infrastructure and downstream demand for natural gas" },
    "South Africa's piped natural gas supply is dominated by a single source: the **Rompco pipeline**, an 865 km, 26-inch high-pressure line running from the Temane and Pande gas fields in Mozambique to Secunda in Mpumalanga, jointly owned by Sasol (50%), the Mozambican government via ENH (25%), and iGas — a subsidiary of the Central Energy Fund (25%). This single pipeline effectively defines South Africa's current piped gas supply capability.\n\n**Sasol** is both the dominant industrial consumer of this gas (used as feedstock and fuel at its Secunda operations) and the operator of a downstream **gas distribution network** serving industrial and residential customers, most notably a reticulated network serving roughly 100,000 residential customers in the **Western Cape** — one of the only parts of the country with meaningful residential piped gas access. Industrial demand beyond Sasol's own operations includes chemicals, ceramics and glass manufacturing (for kiln firing), and potential mining applications such as underground heating.\n\nThe regulatory framework for piped gas is set by the **Gas Act (2001)** and the **Petroleum Pipelines Act (2003)**, with **NERSA** responsible for licensing transmission, storage, and distribution activity and for regulating third-party access to pipeline capacity — the existing Rompco pipeline operates under a NERSA-regulated tariff.",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Natural Gas", href: `${ROOT}/natural-gas` },
                { label: "Piped" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Natural Gas</p>
                <h1 className="text-2xl font-bold text-slate-900">Piped Gas</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Transmission pipelines, supply sources, distribution networks, and market data for piped natural gas in South Africa.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.natural-gas.piped"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
