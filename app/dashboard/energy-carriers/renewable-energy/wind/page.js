import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Renewable Energy — Wind" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Wind", subtitle: "Onshore wind capacity and generation in South Africa" },
    "Onshore wind has been one of the two pillars of South Africa's renewable energy build programme alongside solar PV, procured through successive **REIPPPP bid windows** since 2011. Wind capacity is concentrated in provinces with strong, consistent wind resource — principally the **Eastern Cape** and **Western Cape**, particularly along the coastal corridor, where wind farms benefit from strong onshore wind regimes driven by the region's coastal and topographic conditions.\n\nAs with solar, successive REIPPPP bid windows for wind have generally seen falling tariffs as turbine technology improved (larger rotors and hub heights capturing more energy at a given site) and the local developer and supply-chain market matured. Wind's generation profile is complementary to solar PV in some respects — wind resource in parts of South Africa tends to be stronger in the evening and overnight, which can help offset solar PV's natural drop-off after sunset, an important consideration for system planners balancing the two technologies within the broader generation mix.\n\n**Grid integration** has been an ongoing challenge for wind (and renewables generally), since the strongest wind resource areas are not always well served by existing transmission infrastructure, requiring dedicated grid strengthening and new transmission corridors — a recurring theme in South Africa's Transmission Development Plan and a frequently cited bottleneck constraining how quickly new wind capacity can be connected and dispatched.",
    { type: "text", content: "Wind has grown far more slowly than solar PV: one independent benchmark put South African wind capacity at roughly 3.5 GW in 2022, with projections (not confirmed current figures) of around 6.5 GW by 2028. A precise up-to-date installed-capacity figure was not confirmed as part of this research pass - check the latest IRP or NERSA generation-licence data for the current number. By contrast, IRP 2025 sets a substantially larger ambition for the sector: 7,340 MW of wind by 2030, rising to 34 GW of onshore wind by 2039 (see the National Energy Planning section of this site).", bg: "amber" },
    { type: "title", title: "Sources & References" },
    "1. NewClimate Institute, [Wind and Solar Benchmarks for a 1.5°C World - South Africa](https://newclimate.org/sites/default/files/2024-09/windsolarbenchmarks_southafrica_0.pdf) (2024).\n2. TaiyangNews, [South Africa Targets 25 GW Solar PV by 2039 Under IRP 2025](https://taiyangnews.info/markets/south-africa-targets-25-gw-solar-pv-by-2039-under-irp-2025) - also reports IRP 2025's wind targets.\n3. Energy Capital & Power, [South Africa Launches IRP 2025, Targeting 5.2 GW of Nuclear](https://energycapitalpower.com/south-africa-launches-irp-2025-targeting-5-2-gw-of-nuclear/).",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Renewable Energy</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Wind</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Installed wind capacity, generation volumes, plant locations, wind resource data, and REIPPP project details for South Africa.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.renewable-energy.wind"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
