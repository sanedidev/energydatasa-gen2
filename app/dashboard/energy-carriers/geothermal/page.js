import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Geothermal" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Geothermal", subtitle: "Low- and high-enthalpy geothermal potential in South Africa" },
            "South Africa sits on the stable **Kaapvaal Craton**, one of the oldest and most tectonically quiet pieces of continental crust on Earth — geologically excellent for mining and construction, but a poor setting for the high-temperature geothermal resources that power geothermal electricity generation elsewhere in the world, such as along East Africa's volcanically active Rift Valley. As a result, South Africa's geothermal potential is generally classified as **low-enthalpy** (moderate temperature, suited to direct-use applications) rather than **high-enthalpy** (suited to power generation), and the sector remains at an early exploration stage rather than commercial development.",
        ]),
    },
    {
        id: "resource-mapping",
        label: "Resource Mapping",
        defaultContent: JSON.stringify([
            { type: "title", title: "Resource Mapping" },
            "Evidence of South Africa's geothermal resource comes primarily from **hot springs** — naturally occurring warm-water surface expressions found across several provinces, including well-known sites in Limpopo, Mpumalanga, and the Western Cape — combined with **heat flow measurements** and borehole temperature-gradient data collected mainly as a by-product of mineral and groundwater exploration rather than dedicated geothermal surveys.\n\nRegional heat flow in most of South Africa is unremarkable by global geothermal standards, though localised anomalies associated with specific geological structures (fault zones and certain groundwater aquifer systems) can produce warmer-than-average conditions, which is where most identified hot springs occur.",
        ]),
    },
    {
        id: "exploration",
        label: "Exploration & Development",
        defaultContent: JSON.stringify([
            { type: "title", title: "Exploration & Development" },
            "Geothermal exploration in South Africa has historically been limited and largely academic or exploratory in nature, rather than backed by sustained commercial investment. Dedicated funding for geothermal resource assessment has been modest compared to funding directed at solar, wind, and other renewable technologies, reflecting both the resource's uncertain commercial potential and the relatively low priority it has been given in national energy planning to date.\n\nAny path toward commercial development would likely require a combination of further resource characterisation (additional borehole and heat-flow data), feasibility studies for specific direct-use applications, and dedicated funding — potentially through vehicles such as the Central Energy Fund (CEF) or DMRE-linked exploration support — given the high upfront cost and uncertainty associated with geothermal resource confirmation.",
        ]),
    },
    {
        id: "applications",
        label: "Applications",
        defaultContent: JSON.stringify([
            { type: "title", title: "Applications" },
            "Given the low-enthalpy character of most identified South African resources, the more realistic near-term applications are **direct-use** rather than power generation: greenhouse and agricultural heating, aquaculture (warm-water fish farming), spa and wellness tourism (building on existing hot-spring resorts), and localised space heating.\n\nPower generation from South African geothermal resources, if pursued at all, would likely rely on **binary cycle** plant technology suited to lower-temperature resources, similar to smaller-scale geothermal developments seen internationally at the lower end of the enthalpy spectrum. For comparison, the **East African Rift** region — spanning Kenya, Ethiopia, and neighbouring states — hosts genuinely high-enthalpy geothermal resources and established utility-scale geothermal power generation, illustrating the difference in resource quality between an active rift setting and South Africa's stable craton.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **Council for Geoscience heat flow maps** — regional geothermal gradient and heat flow data\n- **Borehole temperature databases** — collected alongside groundwater and mineral exploration\n- **DMRE exploration licences** — records of any geothermal-related exploration activity\n- **Hot spring inventories** — documented natural hot spring locations and measured temperatures",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Geothermal" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Carriers</p>
                <h1 className="text-2xl font-bold text-slate-900">Geothermal</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Low- and high-enthalpy geothermal resources, exploration status, and technology potential for South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ec.geothermal"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
