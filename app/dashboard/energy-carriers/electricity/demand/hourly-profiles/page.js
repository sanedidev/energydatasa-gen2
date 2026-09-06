import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Hourly Profiles" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "daily-profiles",
        label: "Daily Profiles",
        defaultContent: JSON.stringify([
            "A typical South African daily load curve shows two distinct peaks — a **morning ramp** as businesses open and households prepare for the day (roughly 06:00-09:00), and a sharper **evening peak** (roughly 17:00-20:00) driven by the combination of returning commuters, evening cooking and heating, and lighting load, compounded in winter by the earlier onset of darkness. Between these peaks, demand typically settles into a **midday plateau** sustained by commercial and industrial activity, before dropping to an **overnight base load** dominated by continuous industrial processes and mining operations that run around the clock.",
        ]),
    },
    {
        id: "weekday-weekend",
        label: "Weekday vs Weekend",
        defaultContent: JSON.stringify([
            "Weekday load shapes are more pronounced than weekends, since commercial and industrial activity — which runs on a Monday-to-Friday rhythm for most sectors — adds substantially to the midday plateau. Weekends and public holidays show a **flatter, lower overall profile**, with the evening residential peak still present but the midday commercial/industrial contribution largely absent, since most offices, retail back-of-house operations, and non-continuous industrial processes are not operating.",
        ]),
    },
    {
        id: "seasonal-variation",
        label: "Seasonal Variation",
        defaultContent: JSON.stringify([
            "**Winter** load profiles show the most extreme peak-to-trough variation, driven by heating demand and shorter daylight hours pulling the evening peak higher and earlier. **Summer** profiles are generally flatter, though growing air-conditioning penetration has begun to introduce a secondary early-afternoon demand bump in warmer inland regions during heatwave periods — a pattern that is expected to become more pronounced as cooling appliance ownership continues to grow nationally.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Demand", href: `${ROOT}/electricity/demand` },
                { label: "Hourly Profiles" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Hourly Profiles</h1>
                <p className="mt-2 text-sm text-slate-500">Daily, weekday/weekend, and seasonal electricity demand load shapes.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.demand.hourly-profiles"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
