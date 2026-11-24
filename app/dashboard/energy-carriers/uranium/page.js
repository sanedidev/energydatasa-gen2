import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Uranium" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Uranium", subtitle: "Uranium's role in South Africa's nuclear power programme" },
            "Uranium's relevance to South Africa's energy mix is almost entirely tied to a single facility: **Koeberg Nuclear Power Station**, the only commercial nuclear plant on the African continent, located near Cape Town. South Africa also has a long and distinctive history as a uranium producer and, in the apartheid era, as an enrichment technology developer — a legacy that still shapes policy discussions around nuclear expansion today.\n\nWhile uranium itself contributes a relatively small share of the primary energy supply by mass, nuclear-generated electricity from Koeberg has historically supplied a meaningful share of low-carbon baseload power to the Western Cape and the broader grid, and nuclear expansion remains a live (if contested) option in long-term energy planning.",
        ]),
    },
    {
        id: "resources-reserves",
        label: "Resources & Reserves",
        defaultContent: JSON.stringify([
            { type: "title", title: "Resources & Reserves" },
            "South Africa holds meaningful uranium resources, historically produced largely as a **by-product of gold mining** on the Witwatersrand, where uraniferous ore bodies are found alongside gold-bearing reefs. Additional resource potential exists in the **Karoo Basin**, associated with sedimentary uranium deposits, though these have seen limited commercial development.\n\nSouth Africa was a significant uranium producer through the mid-to-late 20th century, supplying both domestic nuclear fuel needs and export markets, but production has declined substantially since the 1990s as gold mining (its main co-production driver) contracted. Current domestic uranium mining is limited, and Koeberg's fuel is sourced primarily through international supply arrangements rather than domestic production.",
        ]),
    },
    {
        id: "nuclear-fuel-cycle",
        label: "Nuclear Fuel Cycle",
        defaultContent: JSON.stringify([
            { type: "title", title: "Nuclear Fuel Cycle" },
            "The nuclear fuel cycle relevant to Koeberg runs from uranium mining and milling, through **conversion** (to uranium hexafluoride), **enrichment** (increasing the concentration of fissile U-235), **fuel fabrication** into fuel assemblies, use in the reactor, and finally spent fuel storage and management.\n\nSouth Africa has a unique historical footnote in this chain: the apartheid-era **UCOR** programme developed an indigenous uranium enrichment capability (using a jet-nozzle process distinct from the centrifuge or diffusion methods used elsewhere), originally developed in part for weapons purposes before South Africa voluntarily dismantled its nuclear weapons programme in the early 1990s and became a signatory to the Nuclear Non-Proliferation Treaty. Commercial enrichment services for Koeberg's fuel are sourced internationally today.",
            { type: "text", content: "Koeberg's spent fuel is stored on-site in spent fuel pools and dry storage casks, pending a long-term national policy decision on permanent disposal — a common challenge shared by nuclear operators worldwide.", bg: "gray" },
        ]),
    },
    {
        id: "koeberg-context",
        label: "Koeberg Context",
        defaultContent: JSON.stringify([
            { type: "title", title: "Koeberg Context" },
            "Koeberg's two pressurised water reactor units have a combined capacity of approximately 1,860 MW (about 5% of South Africa's total electricity supply) and have operated since the mid-1980s. Both units' **long-term operation (LTO) life extension programmes** are now complete, following steam generator replacement and refuelling work: Unit 1 was granted its 20-year extension in July 2024 (operating to 2044), and Unit 2 followed in November 2025 (operating to 2044/2045) — these are secured, not pending.\n\nFuel procurement for Koeberg is managed through Eskom's nuclear fuel supply arrangements, sourcing enriched uranium fuel assemblies internationally under multi-year contracts. Fuel costs represent a comparatively small share of Koeberg's generating cost relative to capital and operating costs — one of nuclear power's structural characteristics, where the fuel itself is cheap but the plant is capital-intensive.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **DMPR mineral resources reports** — historical and current uranium production and reserve estimates (the minerals-side successor to the former DMRE)\n- **IAEA Uranium Resources, Production and Demand ('Red Book')** — internationally comparable uranium resource data, including South Africa\n- **Eskom Koeberg operational data** — published in Eskom's annual and integrated reports\n- **National Nuclear Regulator (NNR)** — licensing and safety oversight information for Koeberg",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. News24, [Koeberg Unit 2 Has Its Life Extended by 20 Years Just Days Before Expiry of Licence](https://www.news24.com/business/climate-future/energy/koeberg-unit-2-has-its-life-extended-by-20-years-just-days-before-expiry-of-licence-20251106-0729) (6 November 2025).\n2. Engineering News, [National Nuclear Regulator Grants 20-Year Life Extension to Koeberg Unit 2](https://www.engineeringnews.co.za/article/national-nuclear-regulator-grants-20-year-life-extension-to-koeberg-unit-2-2025-11-06).\n3. Engineering News, [Necsa Welcomes Regulatory Approval for Extending the Life of Koeberg's First Nuclear Reactor](https://www.engineeringnews.co.za/article/necsa-welcomes-regulatory-approval-for-extending-the-life-of-koebergs-first-nuclear-reactor-2024-07-17) (17 July 2024).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Uranium" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Carriers</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Uranium</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Uranium resources, nuclear fuel cycle, mining context, and linkages to South Africa&apos;s nuclear power programme.
                </p>
            </div>

            <EditableSections
                pageKey="ec.uranium"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
