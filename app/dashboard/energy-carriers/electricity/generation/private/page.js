import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Generation — Private" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Private Generation", subtitle: "Independent power producers and embedded generation" },
    "Private-sector electricity generation in South Africa has grown from a negligible share of the national mix a decade ago into a significant and rapidly expanding source of capacity, driven primarily by the **Renewable Energy Independent Power Producer Procurement Programme (REIPPPP)**. Since its launch in 2011, successive REIPPPP bid windows have procured thousands of megawatts of solar PV and wind capacity from private developers, under long-term power purchase agreements with Eskom, with tariffs generally falling across successive rounds as the market matured.\n\nA second, more recent wave of private generation growth has come from the **removal of licensing thresholds for embedded generation** — regulatory reforms that progressively raised, then removed, the capacity threshold below which private generation projects could be built without a NERSA generation licence. This has unlocked a wave of private investment in commercial and industrial-scale solar, wind, and battery storage projects built specifically to supply the developer's own operations or to wheel power to other customers via the grid.\n\n**Embedded generation** more broadly also includes rooftop and small-scale commercial solar that feeds directly into a customer's own consumption, whose growth accelerated sharply during extended periods of load-shedding as businesses and households sought greater energy independence from the national grid.",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Generation</p>
                <h1 className="text-2xl font-bold text-slate-900">Private Generation</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Independent power producers, embedded generation, and private sector contributions to South Africa&apos;s electricity supply.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.electricity.generation.private"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
