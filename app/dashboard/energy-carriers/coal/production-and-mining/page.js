import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Coal — Production & Mining" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Production & Mining", subtitle: "Who mines South Africa's coal, and how" },
            "South African coal production was estimated at around **236 million tonnes (Mt) in 2025**, essentially unchanged from 2024 and still roughly 9% below pre-COVID-19 output levels, per the Minerals Council South Africa's Facts & Figures reporting. Total coal *sales* revenue fell further than volumes in 2025 — down an estimated 3% year-on-year — driven mainly by a roughly 15% drop in coal prices over the year.",
            { type: "text", content: "Domestic demand, overwhelmingly from Eskom's power stations, dominates South African coal consumption; roughly a third of national production is exported.", bg: "blue" },
        ]),
    },
    {
        id: "mining-methods",
        label: "Mining Methods",
        defaultContent: JSON.stringify([
            { type: "title", title: "Mining Methods", subtitle: "Opencast vs underground" },
            "South African coal is extracted by both **opencast (surface)** and **underground** mining, with the method determined largely by seam depth. Opencast mining dominates the shallower, flat-lying seams of the Mpumalanga Highveld — it is generally lower-cost per tonne than underground extraction and supplies the majority of Eskom's dedicated power-station contracts, often via direct conveyor links between mine and station. Underground mining (bord-and-pillar or longwall methods) is used where seams lie too deep for economic stripping, and generally carries a higher cost per tonne than opencast operations.",
        ]),
    },
    {
        id: "major-producers",
        label: "Major Producers",
        defaultContent: JSON.stringify([
            { type: "title", title: "Major Producers", subtitle: "A reshaped ownership landscape" },
            "South Africa's coal-mining ownership has shifted substantially over the past several years, as international majors have progressively exited domestic thermal coal:\n- **Seriti Resources** has become one of the two dominant players, after acquiring South32's South African energy coal operations (Khutala, Klipspruit, New Largo and Middelburg Mine Services) in 2021, alongside earlier Anglo American asset acquisitions.\n- **Exxaro Resources** is commonly described as South Africa's largest coal producer, with its Waterberg-based Grootegeluk mine increasingly central to its strategy as its Mpumalanga assets mature; Exxaro has also been divesting some mines to newer entrants as it diversifies away from coal.\n- **Thungela Resources** (spun off from Anglo American in 2021) is a major pure-play thermal coal producer and exporter, with operations in both South Africa and Australia.\n- **Glencore** has scaled back its South African thermal coal exposure — its local output fell to around 16.6 Mt in 2024 — and has previously signalled an intention to let its SA coal reserves deplete rather than reinvest, though it has since indicated openness to new projects as rail export capacity has recovered.\n\nTogether, Seriti and Exxaro now supply the large majority of Eskom's contracted coal, reflecting the exit of several former majors from the domestic-supply segment of the market specifically.",
        ]),
    },
    {
        id: "employment",
        label: "Employment",
        defaultContent: JSON.stringify([
            { type: "title", title: "Employment" },
            "Coal is the **third-largest employer within South African mining**, after platinum and gold. The Minerals Council South Africa's most recent coal-specific figure (2022) put direct coal-sector employment at approximately **92,670 people** — a number that has likely shifted somewhat given subsequent ownership changes and price movements, but which is the most recent verifiable coal-specific figure available.",
            { type: "text", content: "A broader, more recent Minerals Council figure (Mining Matters, reporting on 2024 performance) put *total* mining-sector direct employment at 874,000 across all commodities — not coal-specific, but useful context for coal's share of a much larger industry.", bg: "gray" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Mining Indaba, [South Africa's Coal Sector Holds Firm Despite...](https://miningindaba.com/articles/south-africas-coal-sector-holds-firm-despite) — citing Minerals Council South Africa 2025 Facts & Figures.\n2. Argus Media, [Economic Difficulties May Hamper S African Coal Strikes](https://www.argusmedia.com/en/news-and-insights/latest-market-news/2154794-economic-difficulties-may-hamper-s-african-coal-strikes) — on producer concentration.\n3. S&P Global, [As Global Coal Majors Get Ready to Exit S Africa, Lack of Funding Leaves Junior Minors Stuck](https://www.spglobal.com/energy/en/news-research/latest-news/coal/022820-as-global-coal-majors-get-ready-to-exit-s-africa-lack-of-funding-leaves-junior-minors-stuck) — on the Seriti/South32/Anglo American ownership transition.\n4. Mining-technology.com, [Coal in South Africa](https://www.mining-technology.com/data-insights/coal-in-south-africa/).\n5. Mining Weekly, [Minerals Council Details Contribution to the Economy, Livelihoods](https://www.miningweekly.com/article/minerals-council-details-contribution-to-the-economy-livelihoods-2025-11-03) (3 November 2025) — coal and total mining employment figures.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Coal", href: `${ROOT}/coal` },
                { label: "Production & Mining" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Coal</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Production &amp; Mining</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Mining methods, producing regions, annual volumes, major companies, and supply-chain notes for South African coal.
                </p>
            </div>

            <EditableSections
                pageKey="ec.coal.production-and-mining"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
