import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Renewable Energy — Solar PV" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Solar PV", subtitle: "Utility-scale and embedded solar photovoltaic generation in South Africa" },
    "Solar PV has grown from a negligible share of South Africa's generation mix a decade ago into one of the fastest-expanding electricity sources in the country, driven by two distinct growth channels: **utility-scale plants** procured through the Renewable Energy Independent Power Producer Procurement Programme (REIPPPP), and **embedded generation** — rooftop and small-scale commercial/industrial solar installed behind the meter, whose growth accelerated sharply during periods of extended load-shedding.\n\nUtility-scale solar PV projects have been procured across multiple **REIPPPP bid windows** since the programme's launch in 2011, concentrated in high-irradiance regions such as the Northern Cape, with successive bid windows generally achieving lower tariffs as technology costs fell and the market matured. South Africa's solar resource is exceptionally strong by global standards — the Northern Cape in particular ranks among the best solar resource regions in the world, with high **Global Horizontal Irradiance (GHI)** supporting strong capacity factors for both fixed-tilt and tracking PV systems.\n\nEmbedded generation growth has been harder to track precisely than utility-scale capacity, since much of it has historically gone unregistered with municipalities and distributors, though registration and net-metering/feed-in frameworks have gradually improved as municipalities adapt their tariff structures and connection processes to the reality of far more distributed generation on their networks.",
    { type: "text", content: "By mid-2026, this shift had become structural: Eskom's National Transmission Company reported rooftop and embedded PV capacity above 8.3 GW, exceeding the combined operational capacity of all utility-scale solar contracted under REIPPPP and the smaller RMIPPPP programme (roughly 2.8 GW) - rooftop solar is no longer the smaller half of South Africa's solar story. Total installed solar PV capacity (utility-scale plus embedded) passed 10 GW during 2026, with NERSA recording 139 new solar PV facilities and 2,045 MW of newly registered capacity in Q3 2026 alone. IRP 2025 (see the National Energy Planning section of this site) targets utility-scale solar reaching 25 GW by 2039.", bg: "blue" },
    { type: "title", title: "Sources & References" },
    "1. Engineering News, [Capacity of Rooftop Solar Installed in South Africa Has Passed 8GW Mark](https://www.engineeringnews.co.za/article/capacity-of-rooftop-solar-installed-in-south-africa-has-passed-8gw-mark-2026-06-19) (19 June 2026).\n2. IOL, [How SA's Rooftop Solar Capacity Surpassed 8.3 GW Amid Changing Energy Dynamics](https://iol.co.za/news/south-africa/2026-07-06-how-sas-rooftop-solar-capacity-surpassed-83-gw-amid-changing-energy-dynamics/) (6 July 2026).\n3. PV Tech, [South Africa Registers 2GW of New Solar PV Capacity in Q3 2026](https://www.pv-tech.org/south-africa-registers-2gw-new-solar-pv-capacity-q3-2026/).\n4. TaiyangNews, [South Africa Targets 25 GW Solar PV by 2039 Under IRP 2025](https://taiyangnews.info/markets/south-africa-targets-25-gw-solar-pv-by-2039-under-irp-2025).",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Renewable Energy", href: `${ROOT}/renewable-energy` },
                { label: "Solar PV" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Renewable Energy</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Solar PV</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Installed capacity, generation output, REIPPP projects, rooftop installations, and solar resource data for South Africa.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.renewable-energy.pv"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
