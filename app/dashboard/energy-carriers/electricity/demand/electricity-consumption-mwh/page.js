import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Consumption (MWh)" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "annual-consumption",
        label: "Annual Consumption",
        defaultContent: JSON.stringify([
            "South Africa's total annual electricity consumption has trended broadly flat-to-declining over the past decade — a marked contrast to the steady growth seen in the 1990s and 2000s — reflecting a combination of subdued economic growth, energy efficiency gains, load-shedding-driven demand suppression, and growing behind-the-meter generation (rooftop solar) that reduces grid-measured consumption without necessarily reducing underlying energy use. This makes South Africa somewhat unusual among developing economies, where electricity consumption typically grows in step with GDP.",
        ]),
    },
    {
        id: "sector-breakdown",
        label: "Sector Breakdown",
        defaultContent: JSON.stringify([
            "**Industry and mining** together account for the largest share of national electricity consumption, reflecting South Africa's energy-intensive economic structure — particularly mining, metals smelting, and chemicals processing. **Residential** consumption is the second-largest category, shaped strongly by household income (electrified low-income households consume far less per capita than middle- and high-income households) and by the prevalence of electric water heating. **Commercial** consumption spans offices, retail, and institutional buildings, while **agricultural** consumption is smaller in aggregate but locally significant, particularly for irrigation-dependent farming regions.",
        ]),
    },
    {
        id: "regional-distribution",
        label: "Regional Distribution",
        defaultContent: JSON.stringify([
            "Electricity consumption is heavily concentrated in **Gauteng** (South Africa's economic and industrial core), followed by other major metros — Cape Town, eThekwini (Durban), and the industrial corridors of Mpumalanga tied directly to nearby power generation and heavy industry. Rural and lower-income areas generally show markedly lower per-capita consumption, reflecting both lower appliance ownership and, in some communities, incomplete or unreliable electrification.",
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
                { label: "Electricity Consumption (MWh)" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Electricity Consumption (MWh)</h1>
                <p className="mt-2 text-sm text-slate-500">Annual totals, sector breakdown, and regional distribution of electricity consumption.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.demand.electricity-consumption-mwh"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
