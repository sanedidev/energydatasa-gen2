import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Tariffs Per Sector Over Time" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "residential",
        label: "Residential",
        defaultContent: JSON.stringify([
            "Residential customers are billed under several tariff categories depending on their municipality and connection type — **prepaid** tariffs (common in lower-income and township areas), **conventional post-paid** tariffs (typical in wealthier suburbs), and subsidised **lifeline/inclining-block tariffs** that provide a low-cost basic electricity allocation before higher-consumption blocks kick in at steeper rates. Residential tariffs have risen substantially in real terms over the past 15 years, well ahead of inflation, driven by successive NERSA-approved increases intended to move Eskom's pricing closer to the actual cost of supply — a trend that has raised significant affordability concerns, particularly for lower-income households.",
        ]),
    },
    {
        id: "commercial",
        label: "Commercial",
        defaultContent: JSON.stringify([
            "Commercial and small business customers are typically billed under **demand-based tariffs** that include both an energy charge (c/kWh) and a separate demand charge based on the customer's peak load contribution, incentivising businesses to manage their peak demand rather than just total consumption. Like residential tariffs, commercial rates have risen substantially over the past decade and a half, and the demand-charge structure means businesses with poor load management (spiky rather than flat demand profiles) pay disproportionately more relative to their total energy use.",
        ]),
    },
    {
        id: "industrial",
        label: "Industrial",
        defaultContent: JSON.stringify([
            "Large industrial and mining customers are typically billed under **Megaflex** or similar time-of-use tariffs, which vary the energy price by time of day and season — charging a premium during winter weekday peak periods and offering discounted rates during off-peak and summer periods, to incentivise large users to shift discretionary load away from system-stress periods. **Notified Maximum Demand (NMD)** charges penalise customers who exceed their contracted demand level, reflecting the network capacity they require to be reserved for them regardless of actual usage.",
        ]),
    },
    {
        id: "agricultural",
        label: "Agricultural",
        defaultContent: JSON.stringify([
            "Agricultural customers are typically billed under **Ruraflex** or similar rural tariff structures, which include seasonal and time-of-use elements similar to industrial tariffs but calibrated to farming load patterns — notably irrigation pumping, which is highly seasonal and often runs during off-peak hours specifically to take advantage of lower rates. Rural electrification pricing more broadly has had to balance cost-reflective pricing principles against the historically weaker grid infrastructure and lower load density typical of agricultural areas.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Market & Pricing", href: `${ROOT}/electricity/market-and-pricing` },
                { label: "Tariffs Per Sector Over Time" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tariffs Per Sector Over Time</h1>
                <p className="mt-2 text-sm text-slate-500">Historical electricity tariff data across residential, commercial, industrial, and agricultural sectors.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.market-and-pricing.tariffs-per-sector-over-time"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
