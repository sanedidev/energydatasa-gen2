import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Peak Demand (MW)" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "annual-peaks",
        label: "Annual Peaks",
        defaultContent: JSON.stringify([
            "South Africa's all-time national peak demand was recorded in the mid-2000s, at a level the system has not approached again since — a direct reflection of the capacity shortfall that emerged from 2007 onward, after which demand growth was effectively constrained (or actively suppressed through load-shedding) rather than continuing to rise with the economy. Recorded annual peaks since then have generally trended downward or flat, a pattern more often associated with demand destruction than with genuine efficiency-driven demand management.",
        ]),
    },
    {
        id: "seasonal-patterns",
        label: "Seasonal Patterns",
        defaultContent: JSON.stringify([
            "**Winter evenings** produce the sharpest demand peaks nationally, driven by residential heating and lighting load coinciding with the return-from-work period — typically in the range of 17:00 to 20:00 — compounded by commercial and industrial load that hasn't yet wound down for the day. **Summer peaks** are generally lower and flatter, though air conditioning load has become an increasingly significant contributor to summer demand, particularly in Gauteng and inland metros, as cooling appliance ownership has grown.",
        ]),
    },
    {
        id: "system-stress",
        label: "System Stress Indicators",
        defaultContent: JSON.stringify([
            { type: "text", content: "**Reserve margin** — the buffer of available generation capacity above forecast peak demand — is the single most important indicator of system stress. When reserve margins fall too low, Eskom must rely on expensive emergency measures (OCGT diesel dispatch, demand-response curtailment) or implement load-shedding to keep supply and demand in balance.", bg: "amber" },
            "The frequency and severity of **load-shedding** has become the most visible public indicator of South African system stress, directly tracking the gap between available generation capacity (constrained by coal fleet unreliability, planned maintenance, and unplanned breakdowns) and demand. **OCGT dispatch hours** and **diesel spend** serve as a useful proxy metric — heavy reliance on diesel peaking capacity signals that the coal fleet is underperforming relative to demand, since OCGTs are economically the last resort for keeping the lights on.",
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
                { label: "Peak Demand (MW)" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Peak Demand (MW)</h1>
                <p className="mt-2 text-sm text-slate-500">Annual peaks, seasonal patterns, and system stress indicators.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.demand.peak-demand-mw"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
