import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Natural Gas — Piped" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Piped Gas", subtitle: "Pipeline infrastructure and downstream demand for natural gas" },
    "South Africa's piped natural gas supply is dominated by a single source: the **Rompco pipeline**, an 865 km, 26-inch high-pressure line running from the Temane and Pande gas fields in Mozambique to Secunda in Mpumalanga, jointly owned by Sasol (50%), the Mozambican government via ENH (25%), and iGas — a subsidiary of the Central Energy Fund (25%). This single pipeline effectively defines South Africa's current piped gas supply capability.\n\n**Sasol** is both the dominant industrial consumer of this gas (used as feedstock and fuel at its Secunda operations) and the operator of a downstream **gas distribution network** serving industrial and residential customers, most notably a reticulated network serving roughly 100,000 residential customers in the **Western Cape** — one of the only parts of the country with meaningful residential piped gas access. Industrial demand beyond Sasol's own operations includes chemicals, ceramics and glass manufacturing (for kiln firing), and potential mining applications such as underground heating.\n\nThe regulatory framework for piped gas is set by the **Gas Act (2001)** and the **Petroleum Pipelines Act (2003)**, with **NERSA** responsible for licensing transmission, storage, and distribution activity and for regulating third-party access to pipeline capacity — the existing Rompco pipeline operates under a NERSA-regulated tariff.",
    { type: "text", content: "This supply picture is not stable: Mozambique's Pande and Temane field output is widely expected to decline sharply from around 2027-2028 as the fields deplete, and Sasol has indicated it may stop supplying industrial customers from around July 2028 without a replacement source in place. Sasol and Eskom have signed a Memorandum of Understanding to jointly explore LNG as a replacement supply (see the LNG page) - Sasol's own leadership has struck a more measured tone than some industry commentary, saying gas is not expected to run out immediately, with a bridging supply (methane-rich gas, at a higher price) being explored for the transition period.", bg: "amber" },
    { type: "title", title: "Sources & References" },
    "1. Engineering News, [More Intentional Effort and Coordination Needed to Avert Gas Crisis](https://www.engineeringnews.co.za/article/more-intentional-effort-and-coordination-needed-to-avert-gas-crisis-2026-04-10) (10 April 2026).\n2. Engineering News, [Sasol and Eskom to Explore Demand Anchors for LNG as Part of Effort to Avert 'Gas Cliff'](https://www.engineeringnews.co.za/article/sasol-and-eskom-to-explore-demand-anchors-for-lng-as-part-of-effort-to-avert-gas-cliff-2024-09-20) (20 September 2024).\n3. AllAfrica, [South Africa Will Run Out of Industrial Gas by 2028 and 70,000 Jobs Could Be Lost](https://allafrica.com/stories/202603180027.html) (18 March 2026).",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Natural Gas</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Piped Gas</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Transmission pipelines, supply sources, distribution networks, and market data for piped natural gas in South Africa.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.natural-gas.piped"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
