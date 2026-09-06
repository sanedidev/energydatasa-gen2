import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Hydro" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Hydro", subtitle: "Run-of-river and pumped-storage hydropower in South Africa" },
            "South Africa is not a hydro-rich country by regional standards — its rainfall is low and highly variable, and most of its major rivers are shared with neighbouring states — but hydropower still plays a disproportionately important role in the electricity system. Rather than being used for bulk baseload energy, South African hydro is concentrated in **pumped-storage schemes**, which act as large-scale batteries: pumping water uphill using cheap or surplus electricity (historically overnight coal power, increasingly midday solar), then releasing it through turbines to generate power rapidly during peak demand or when other generation trips.\n\nThis makes hydro one of the grid's most valuable assets for stability rather than volume — pumped storage can go from standstill to full output in minutes, making it a key tool for managing the evening demand peak and for providing an immediate response when a large generating unit fails unexpectedly.",
        ]),
    },
    {
        id: "capacity-and-plants",
        label: "Installed Capacity & Plants",
        defaultContent: JSON.stringify([
            { type: "title", title: "Installed Capacity & Plants" },
            "Eskom operates three major pumped-storage schemes: **Ingula** (1,332 MW), commissioned in 2016-2017 in the Drakensberg foothills between KwaZulu-Natal and the Free State; **Drakensberg Pumped Storage** (1,000 MW) near Bergville, commissioned in the 1980s; and **Palmiet** (400 MW) near Grabouw in the Western Cape, commissioned in 1988. Together these three schemes account for the vast majority of South Africa's hydro capacity.\n\nRun-of-river generation is smaller in scale and concentrated on a handful of sites, including the **Gariep** and **Vanderkloof** dams on the Orange River, which combine hydropower generation with irrigation and municipal water supply functions, and several smaller municipal-owned schemes.",
            { type: "text", content: "Combined installed pumped-storage capacity (Ingula + Drakensberg + Palmiet) is approximately 2,732 MW — roughly 5-6% of Eskom's total nameplate capacity, though its actual annual energy contribution is far smaller since pumped storage is a net energy consumer overall (it uses more electricity to pump than it recovers generating).", bg: "blue" },
        ]),
    },
    {
        id: "generation-output",
        label: "Generation Output",
        defaultContent: JSON.stringify([
            { type: "title", title: "Generation Output" },
            "Because pumped storage is used for peaking and grid support rather than continuous supply, its annual generation output (GWh) is modest relative to its installed capacity — plants typically run for only a few hours per day during periods of high demand or system stress. Output has grown as load-shedding has made fast-response capacity more valuable, with Eskom prioritising pumped-storage dispatch during evening peaks and emergency conditions.\n\nRun-of-river output is more consistent but highly weather-dependent, rising and falling with rainfall and reservoir levels on the Orange River system and other catchments — a dry year can reduce run-of-river generation noticeably compared to a wet one.",
        ]),
    },
    {
        id: "resource-context",
        label: "Resource Context",
        defaultContent: JSON.stringify([
            { type: "title", title: "Resource Context" },
            "South Africa's semi-arid climate and highly variable rainfall place a natural ceiling on how much hydropower the country can develop domestically — most of the technically feasible large-scale hydro sites within South Africa's borders have already been developed. This is why the country's biggest hydro growth opportunities lie outside its own borders: the **Southern African Power Pool (SAPP)** already imports a portion of the region's hydro generation, most notably from the **Cahora Bassa** scheme in Mozambique via the Zimbabwe-South Africa transmission interconnectors, and proposed projects such as the **Grand Inga** scheme in the Democratic Republic of Congo have long been discussed as a long-term regional hydro resource.\n\nClimate change projections for southern Africa generally point toward greater rainfall variability and more frequent drought conditions, which is a key planning risk for any strategy that leans further on hydro (domestic or imported) for future capacity.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **Eskom generation reports** — pumped-storage and run-of-river output by station, published in Eskom's annual and integrated reports\n- **Department of Water and Sanitation (DWS)** — hydrological and dam-level data for major river systems\n- **NERSA** — generation licence registrations for hydro facilities, including municipal and private schemes\n- **Southern African Power Pool (SAPP)** — regional hydro trade and import/export statistics",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Hydro" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Carriers</p>
                <h1 className="text-2xl font-bold text-slate-900">Hydro</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Run-of-river and pumped-storage hydropower — plants, installed capacity, generation, and resource context for South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ec.hydro"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
