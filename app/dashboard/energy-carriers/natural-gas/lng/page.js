import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Natural Gas — LNG" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "LNG", subtitle: "Liquefied natural gas import options for South Africa" },
    "South Africa currently has no operating LNG import terminal, relying instead on pipeline gas from Mozambique for the bulk of its natural gas supply — this matters more than it once did, since that Mozambican supply (the Pande and Temane fields, ~90% of current national gas supply) is expected to decline sharply from around 2027–2028 as the fields deplete. LNG import has moved from a long-term diversification option to an urgent near-term requirement.\n\nThe leading project is the **Zululand Energy Terminal (ZET)** at Richards Bay, a joint venture between **Vopak** and **Transnet**. ZET signed a 25-year terminal operator agreement with Transnet National Ports Authority in February 2025 and a Heads of Agreement with **ExxonMobil South Africa LNG** to advance supply arrangements. A second, secondary site at **Coega/Port of Ngqura** in the Eastern Cape has also been identified in gas-sector planning.",
    { type: "text", content: "ZET's final investment decision has been **postponed**, pending clarity on Eskom's own planned 3,000 MW gas-to-power project at Richards Bay — which itself now requires a new environmental-authorisation process. Industry commentary (including the gas-users' association IGUA-SA) has warned LNG import infrastructure is unlikely to be ready before Sasol's current Mozambique-sourced gas supply to industrial customers runs down around July 2028, and has called for minimum LNG demand commitments to make the terminal bankable.", bg: "amber" },
    "An FSRU (Floating Storage and Regasification Unit) based approach — mooring a specialised vessel that stores LNG and regasifies it on demand — remains the fastest and lowest-capital path to LNG import capability compared with fixed onshore regasification infrastructure. International LNG pricing is referenced against the TTF (European) and JKM (Asian) benchmarks; the economics of any South African LNG import project are highly sensitive to where global LNG prices sit relative to the cost of alternative generation and industrial fuel sources.",
    { type: "title", title: "Sources & References" },
    "1. IOL Business Report, [South Africa Eyes Energy Security with R15bn Energy Project That Could Reshape Richards Bay](https://iol.co.za/business/2026-06-21-south-africa-eyes-energy-security-with-r15bn-energy-project-that-could-reshape-richards-bay/) (21 June 2026).\n2. IGUA-SA, [Industry's Gas Roadmap Targets Supply Crisis and Economic Growth](https://igua-sa.org/industry-gas-roadmap/).\n3. AllAfrica, [South Africa Will Run Out of Industrial Gas by 2028 and 70,000 Jobs Could Be Lost](https://allafrica.com/stories/202603180027.html) (18 March 2026).\n4. IOL Business Report, [Sasol Extends Gas Production Timeline to Support South Africa's LNG Transition](https://iol.co.za/business-report/companies/2025-08-30-sasol-extends-gas-production-timeline-to-support-south-africas-lng-transition/) (30 August 2025).\n5. Engineering News, [More Intentional Effort and Coordination Needed to Avert Gas Crisis](https://www.engineeringnews.co.za/article/more-intentional-effort-and-coordination-needed-to-avert-gas-crisis-2026-04-10) (10 April 2026).",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Natural Gas</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">LNG</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Liquefied natural gas terminals, shipping routes, regasification, contracts, and pricing for South Africa.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.natural-gas.lng"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
