import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Coal — Market & Trade Information" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "imports-exports",
        label: "Imports & Exports data",
        defaultContent: JSON.stringify([
            { type: "title", title: "Imports & Exports", subtitle: "Richards Bay Coal Terminal and the Transnet rail recovery" },
            "South Africa is a significant net coal **exporter**, not an importer — the vast majority of coal trade flows out through the **Richards Bay Coal Terminal (RBCT)**, one of the largest dedicated coal export facilities in the world, with nameplate capacity of up to **91 Mt/year**.\n\nExport volumes through RBCT collapsed over the first half of the 2020s as Transnet's freight-rail network deteriorated, bottoming out at a record low of **47.2 Mt in 2023**. A sustained rail-performance turnaround then drove a recovery: exports rose to roughly **57–58 Mt in 2025** (a greater than 10% year-on-year increase; sources differ slightly on the exact total), with a further rise toward **60–62 Mt** forecast for 2026.",
            { type: "text", content: "Roughly a third of South Africa's total coal production (around 72 Mt on an annualised basis, against total national production of about 236 Mt in 2025) is exported; the remainder is consumed domestically, overwhelmingly by Eskom.", bg: "blue" },
        ]),
    },
    {
        id: "pricing",
        label: "Pricing",
        defaultContent: JSON.stringify([
            { type: "title", title: "Pricing" },
            "Export-grade coal is priced against international thermal coal benchmarks, principally the **Richards Bay FOB** price, which tracks broader seaborne thermal coal markets (alongside Newcastle and other global benchmarks). 2025 saw a sharp decline in prices — thermal coal prices fell by roughly **15%** over the year — which, combined with only modestly higher export volumes, left total South African coal sales revenue down an estimated 3% year-on-year despite the recovery in shipped tonnage.\n\nDomestic coal sold to Eskom under dedicated long-term supply contracts is priced very differently: predominantly on a **cost-plus** basis rather than tracking export or spot benchmarks, which insulates Eskom's fuel costs from global price swings but has drawn periodic scrutiny over whether it provides sufficient incentive for mine-level cost discipline.",
        ]),
    },
    {
        id: "trade-partners",
        label: "Trade Partners & Demand Mix",
        defaultContent: JSON.stringify([
            { type: "title", title: "Trade Partners & Demand Mix" },
            "India has in recent years been South Africa's largest single export destination for thermal coal, alongside other Asian markets; European demand for South African coal has declined structurally as the EU continues to reduce coal-fired generation. Domestically, **Eskom is by far the largest single consumer**, with Sasol's Secunda coal-to-liquids operation the other major domestic offtaker.",
            { type: "text", content: "IRP 2025's planned reduction in coal-fired generation capacity is expected to materially cut Eskom's own coal demand over time — from current consumption in the order of 100 Mt/year toward a much lower figure as older units retire — a structural shift that will increasingly shape domestic coal demand independent of export-market conditions.", bg: "amber" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Daily Maverick, [Richards Bay Coal Terminal Exports Rise Over 10% in 2025 in Latest Sign of Transnet Reboot](https://www.dailymaverick.co.za/article/2026-01-27-richards-bay-coal-terminal-exports-rise-s-rise-over-10-in-2025-in-latest-sign-of/) (27 January 2026).\n2. Miningmx, [SA Coal Exports Could Rise 10% in 2026, Says Terminal](https://www.miningmx.com/top-story/65964-sa-coal-exports-could-rise-10-in-2026-says-terminal/).\n3. Miningwrap, [Richards Bay Coal Terminal Exports Jump More Than 10% as Rail Recovery Takes Hold](https://miningwrap.co.za/articles/richards-bay-coal-terminal-exports-jump-more-than-10-as-rail-recovery-takes-hold).\n4. Mining Indaba, [South Africa's Coal Sector Holds Firm Despite...](https://miningindaba.com/articles/south-africas-coal-sector-holds-firm-despite) — 2025 production, pricing, and revenue estimates.\n5. EWN, [Coal Exports From Richards Bay Rise as Transnet Rail Turnaround Continues](https://www.ewn.co.za/coal-exports-from-richards-bay-rise-as-transnet-rail-turnaround-continues/).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Coal", href: `${ROOT}/coal` },
                { label: "Market & Trade Information" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Market &amp; Trade Information</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Coal import and export volumes, trade partners, and pricing data.</p>
            </div>

            <EditableSections
                pageKey="ec.coal.market-and-trade-information"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
