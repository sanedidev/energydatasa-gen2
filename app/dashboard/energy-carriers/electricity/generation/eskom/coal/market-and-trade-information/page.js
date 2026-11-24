import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Coal — Market & Trade Information" };

const ROOT = "/dashboard/energy-carriers";
const COAL = `${ROOT}/electricity/generation/eskom/coal`;

const DEFAULT_SECTIONS = [
    {
        id: "imports-exports",
        label: "Imports & Export data",
        defaultContent: JSON.stringify([
            { type: "title", title: "Imports & Export Data", subtitle: "Coal trade context for Eskom-consumed coal" },
            "Coal committed to Eskom under dedicated long-term supply contracts is, by design, kept out of the export market — the vast majority of Eskom's fuel supply moves directly from adjacent or nearby collieries to the power station via conveyor or short-haul rail, never entering the trade flows that supply South Africa's substantial coal export industry through the **Richards Bay Coal Terminal (RBCT)**, one of the largest coal export facilities in the world.\n\nEskom has, at various points, needed to supplement contracted supply with **spot-market purchases** during periods of stockpile shortfall at specific stations — these purchases are priced very differently from cost-plus contract coal, generally tracking domestic spot prices which themselves move in relation to (though at a discount to) international export benchmarks such as the Richards Bay FOB thermal coal price. Reliance on spot-market coal has periodically drawn scrutiny given its materially higher cost relative to Eskom's contracted supply base.",
            { type: "text", content: "Imports of coal into South Africa for Eskom's own use are effectively negligible — the country is a major net coal exporter, and Eskom's fuel strategy has always been built around domestic Mpumalanga and Limpopo coalfields rather than any import dependency.", bg: "gray" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Daily Maverick, [Richards Bay Coal Terminal Exports Rise Over 10% in 2025 in Latest Sign of Transnet Reboot](https://www.dailymaverick.co.za/article/2026-01-27-richards-bay-coal-terminal-exports-rise-s-rise-over-10-in-2025-in-latest-sign-of/) (27 January 2026).\n2. Mining Indaba, [South Africa's Coal Sector Holds Firm Despite...](https://miningindaba.com/articles/south-africas-coal-sector-holds-firm-despite) — 2025 coal pricing and sales-revenue context.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Coal", href: COAL },
                { label: "Market & Trade Information" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Market &amp; Trade Information</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Coal import/export data and trade context for Eskom-consumed coal.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-coal.market-and-trade-information"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
