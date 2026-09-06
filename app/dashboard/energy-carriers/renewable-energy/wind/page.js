import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Renewable Energy — Wind" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Wind", subtitle: "Onshore wind capacity and generation in South Africa" },
    "Onshore wind has been one of the two pillars of South Africa's renewable energy build programme alongside solar PV, procured through successive **REIPPPP bid windows** since 2011. Wind capacity is concentrated in provinces with strong, consistent wind resource — principally the **Eastern Cape** and **Western Cape**, particularly along the coastal corridor, where wind farms benefit from strong onshore wind regimes driven by the region's coastal and topographic conditions.\n\nAs with solar, successive REIPPPP bid windows for wind have generally seen falling tariffs as turbine technology improved (larger rotors and hub heights capturing more energy at a given site) and the local developer and supply-chain market matured. Wind's generation profile is complementary to solar PV in some respects — wind resource in parts of South Africa tends to be stronger in the evening and overnight, which can help offset solar PV's natural drop-off after sunset, an important consideration for system planners balancing the two technologies within the broader generation mix.\n\n**Grid integration** has been an ongoing challenge for wind (and renewables generally), since the strongest wind resource areas are not always well served by existing transmission infrastructure, requiring dedicated grid strengthening and new transmission corridors — a recurring theme in South Africa's Transmission Development Plan and a frequently cited bottleneck constraining how quickly new wind capacity can be connected and dispatched.",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Renewable Energy", href: `${ROOT}/renewable-energy` },
                { label: "Wind" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Renewable Energy</p>
                <h1 className="text-2xl font-bold text-slate-900">Wind</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Installed wind capacity, generation volumes, plant locations, wind resource data, and REIPPP project details for South Africa.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.renewable-energy.wind"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
