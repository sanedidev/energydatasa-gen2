import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Renewable Energy — Solar PV" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Solar PV", subtitle: "Utility-scale and embedded solar photovoltaic generation in South Africa" },
    "Solar PV has grown from a negligible share of South Africa's generation mix a decade ago into one of the fastest-expanding electricity sources in the country, driven by two distinct growth channels: **utility-scale plants** procured through the Renewable Energy Independent Power Producer Procurement Programme (REIPPPP), and **embedded generation** — rooftop and small-scale commercial/industrial solar installed behind the meter, whose growth accelerated sharply during periods of extended load-shedding.\n\nUtility-scale solar PV projects have been procured across multiple **REIPPPP bid windows** since the programme's launch in 2011, concentrated in high-irradiance regions such as the Northern Cape, with successive bid windows generally achieving lower tariffs as technology costs fell and the market matured. South Africa's solar resource is exceptionally strong by global standards — the Northern Cape in particular ranks among the best solar resource regions in the world, with high **Global Horizontal Irradiance (GHI)** supporting strong capacity factors for both fixed-tilt and tracking PV systems.\n\nEmbedded generation growth has been harder to track precisely than utility-scale capacity, since much of it has historically gone unregistered with municipalities and distributors, though registration and net-metering/feed-in frameworks have gradually improved as municipalities adapt their tariff structures and connection processes to the reality of far more distributed generation on their networks.",
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
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Renewable Energy</p>
                <h1 className="text-2xl font-bold text-slate-900">Solar PV</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Installed capacity, generation output, REIPPP projects, rooftop installations, and solar resource data for South Africa.
                </p>
            </div>

            <div className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm p-6">
                <EditableContent
                    slug="ec.renewable-energy.pv"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
