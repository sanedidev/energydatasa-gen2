import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Generation — Private" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Private Generation", subtitle: "Independent power producers and embedded generation" },
    "Private-sector electricity generation in South Africa has grown from a negligible share of the national mix a decade ago into a significant and expanding source of capacity, driven by two separate mechanisms.\n\n**The Renewable Energy Independent Power Producer Procurement Programme (REIPPPP)**, launched in 2011, has run multiple bid windows procuring solar PV and wind capacity from private developers under long-term power purchase agreements, with tariffs generally falling across successive rounds. Reported cumulative figures vary considerably depending on what is counted and when the source was published — one 2026 tracker put total *awarded* REIPPPP capacity at around 15,864 MW, with roughly 7,336 MW actually connected to the grid at that point — so treat any single REIPPPP capacity figure as a snapshot rather than a fixed number, and check the IPP Office's own published bid-window results for the current position.\n\n**The removal of licensing thresholds for embedded/private generation** is the second, more recent driver. NERSA's generation-licensing exemption threshold was raised from 1 MW to 100 MW in August 2021, then removed entirely by regulatory amendments in 2022 (some sources date the final removal to 2023) — meaning private generation projects of any size built to supply the developer's own operations, or to wheel power to other customers via the grid, no longer need a generation licence at all. This unlocked a wave of commercial and industrial self-generation: one 2026 industry report put newly-connected private generation at 279 MW in 2024, 337 MW in 2025, and 1,046 MW in the first half of 2026 alone, with government citing a pipeline of 80+ confirmed private projects totalling over 6,000 MW.",
    { type: "text", content: "Embedded generation also includes rooftop and small-scale commercial solar feeding a customer's own consumption, whose uptake accelerated sharply during the 2021-2023 load-shedding period. Figures for this category are widely cited but hard to verify precisely, since much small-scale solar is not centrally registered.", bg: "amber" },
    { type: "title", title: "Sources & References" },
    "1. Wikipedia, [Renewable Energy Independent Power Producer Procurement Programme](https://en.wikipedia.org/wiki/Renewable_Energy_Independent_Power_Producer_Procurement_Programme).\n2. GreenCape, [Large-Scale Renewable Energy Market Intelligence Report](https://greencape.co.za/wp-content/uploads/2023/04/RENEWABLE_ENERGY_MIR_2023_DIGITAL_SINGLES.pdf) (2023).\n3. State of the Nation, [Just Transition to a Low-Carbon Economy](https://stateofthenation.gov.za/priorities/growing-the-economy-and-jobs/just-transition-to-a-low-carbon-economy) - government reporting on the private generation project pipeline.\n4. Power Futures Lab, [H1 2026 Report](https://www.greenbuildingafrica.co.za/wp-content/uploads/2026/08/Power-futures-lab-report-H1-2026.pdf) - private generation connection figures by year.",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Private" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Generation</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Private Generation</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Independent power producers, embedded generation, and private sector contributions to South Africa&apos;s electricity supply.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.electricity.generation.private"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
