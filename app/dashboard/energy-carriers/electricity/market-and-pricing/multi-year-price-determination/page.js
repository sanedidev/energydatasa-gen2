import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Multi-Year Price Determination" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "mypd-framework",
        label: "MYPD Framework",
        defaultContent: JSON.stringify([
            "The **Multi-Year Price Determination (MYPD)** methodology is NERSA's regulatory framework for setting Eskom's allowed electricity tariffs over multi-year periods, based on a **revenue-requirement model**: Eskom submits its projected costs (primary energy, operating expenditure, capital expenditure, depreciation) and requested return on regulatory asset base, and NERSA reviews and approves (often reduces) this submission through a public consultation process before setting the approved tariff increase for each year of the determination period.",
        ]),
    },
    {
        id: "determination-history",
        label: "Determination History",
        defaultContent: JSON.stringify([
            "Successive MYPD determinations (MYPD1 through MYPD5 and beyond) have generally seen Eskom submit for tariff increases well above what NERSA ultimately approves, reflecting a persistent gap between Eskom's assessed revenue requirement and what NERSA judges to be a reasonable, affordable increase for consumers. This gap has been a recurring source of tension, with Eskom arguing that under-recovery of its allowed revenue undermines its financial sustainability, while consumer groups and industry argue that even the approved increases have far outpaced inflation and household income growth over the same period.",
        ]),
    },
    {
        id: "cost-components",
        label: "Cost Components",
        defaultContent: JSON.stringify([
            { type: "text", content: "**Primary energy costs** (coal, diesel for OCGTs, and IPP power purchases) are typically the single largest cost component in any MYPD submission, meaning tariff increases are highly sensitive to coal fleet reliability — poor availability forces more expensive diesel dispatch, which flows directly into future tariff applications.", bg: "amber" },
            "Beyond primary energy, MYPD submissions also account for **operating expenditure** (staff costs, maintenance), **capital expenditure** (new build and refurbishment programmes, including the Kusile and Medupi build programme in earlier determinations), **depreciation** on Eskom's asset base, and — increasingly significant in recent determinations — **IPP procurement costs**, as a growing share of the country's generation mix comes from independent power producers under long-term power purchase agreements rather than from Eskom's own fleet.",
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
                { label: "Multi-Year Price Determination" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Multi-Year Price Determination</h1>
                <p className="mt-2 text-sm text-slate-500">NERSA MYPD framework, determination history, and cost component breakdowns.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.market-and-pricing.multi-year-price-determination"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
