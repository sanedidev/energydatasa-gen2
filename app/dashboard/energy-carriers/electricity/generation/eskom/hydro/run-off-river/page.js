import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Hydro — Run-off River" };

const ROOT = "/dashboard/energy-carriers";
const HYDRO = `${ROOT}/electricity/generation/eskom/hydro`;

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Run-off River", subtitle: "Eskom's run-of-river hydro generation" },
    "Eskom's run-of-river hydro generation is concentrated on the **Orange River system**, at two conventional hydro stations: **Gariep** (360 MW, four 90 MW units, commissioned 1971) and **Vanderkloof** (240 MW, two 120 MW units), about 130 km further downstream. Both stations sit on dams owned and operated by the **Department of Water and Sanitation** — the Gariep and Vanderkloof dams are respectively the largest and second-largest reservoirs in South Africa — whose primary purposes are irrigation water supply and flood control for the Orange-Fish river system, with electricity generation as a secondary function layered on top of water-release schedules.\n\nBecause of this, both stations are operated mainly as **peaking stations**: generation depends on water being released for downstream water-supply needs, so output is influenced by rainfall, irrigation demand and water-sharing agreements as much as by electricity demand, rather than being freely dispatchable like Eskom's pumped-storage fleet.\n\nCombined, the two stations provide 600 MW of installed capacity — a modest share of Eskom's overall fleet, but low-cost, low-emissions generation whenever water releases coincide with system demand needs.",
    { type: "title", title: "Sources & References" },
    "1. Eskom, [Orange River Hydros Technical Brochure](https://www.eskom.co.za/wp-content/uploads/2021/08/HY-0005-Orange-River-Hydros-Rev-11.pdf).\n2. Eskom Heritage, [Vanderkloof Power Station](https://www.eskom.co.za/heritage/vanderkloof-power-station/).\n3. Eskom, [Peaking Power Stations](https://www.eskom.co.za/gx/peaking-power-stations/).",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Hydro", href: HYDRO },
                { label: "Run-off River" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Eskom Hydro</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Run-off River</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Run-of-river hydro plants, installed capacity, generation output, and hydrological context.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.electricity.generation.eskom.hydro.run-off-river"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
