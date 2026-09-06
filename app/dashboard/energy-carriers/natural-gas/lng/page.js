import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Natural Gas — LNG" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "LNG", subtitle: "Liquefied natural gas import options for South Africa" },
    "South Africa currently has no operating LNG import terminal, relying instead on pipeline gas from Mozambique for the bulk of its natural gas supply. LNG import is the centrepiece of most future gas-supply diversification plans, since it would allow South Africa to access global gas markets rather than depending on a single pipeline source. The **Gas Master Plan** identifies two priority sites for a Floating Storage and Regasification Unit (FSRU): **Richards Bay**, favoured for its status as South Africa's largest bulk port and existing infrastructure, and **Coega/Port of Ngqura** in the Eastern Cape, a secondary site better positioned to serve regional power and industrial demand.\n\nAn FSRU-based approach — mooring a specialised vessel that stores LNG and regasifies it on demand — is generally seen as the fastest and lowest-capital path to LNG import capability, compared with building fixed onshore regasification infrastructure. As of the most recent planning cycles, no LNG import terminal had reached financial close or construction, with progress constrained by the need for long-term offtake agreements, environmental authorisation, and supporting pipeline connectivity to move regasified gas from the coast to inland demand centres.",
    { type: "text", content: "International LNG pricing is referenced against the TTF (European) and JKM (Asian) benchmarks. Prices spiked sharply during the 2021-2023 global energy crisis before normalising, and the economics of any South African LNG import project are highly sensitive to where global LNG prices sit relative to the cost of alternative generation and industrial fuel sources.", bg: "blue" },
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Natural Gas", href: `${ROOT}/natural-gas` },
                { label: "LNG" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Natural Gas</p>
                <h1 className="text-2xl font-bold text-slate-900">LNG</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Liquefied natural gas terminals, shipping routes, regasification, contracts, and pricing for South Africa.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.natural-gas.lng"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
