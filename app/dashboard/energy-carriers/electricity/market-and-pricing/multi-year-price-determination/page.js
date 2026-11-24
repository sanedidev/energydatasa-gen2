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
            "Successive MYPD determinations (MYPD1 through the current **MYPD6**) have generally seen Eskom submit for tariff increases well above what NERSA ultimately approves, reflecting a persistent gap between Eskom's assessed revenue requirement and what NERSA judges to be a reasonable, affordable increase for consumers.",
            "**Approved average direct-customer tariff increases by year:**\n- 2021/22: 15.63%\n- 2022/23: 9.61%\n- 2023/24: 18.7%\n- 2024/25: 12.7%\n- 2025/26: 12.74%\n- 2026/27: 8.76%\n- 2027/28: 8.83%\n\nMunicipal bulk-purchase tariffs typically increase by a similar but not identical percentage, implemented on a different date (1 July rather than 1 April) to account for the municipal distribution margin.",
            { type: "text", content: "**MYPD6 was revised upward mid-determination.** NERSA originally approved 5.36% (2026/27) and 6.19% (2027/28) in January 2025, but a court-ordered correction to Eskom's Generation Regulatory Asset Base added R54.7 billion in allowable revenue, recovered in phases — pushing the approved increases up to 8.76% and 8.83% respectively. NERSA confirmed this on 5 March 2026.", bg: "amber" },
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
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Engineering News, [Nersa Approves Higher Electricity Hikes for 2026/27 After R54.7bn Error](https://www.engineeringnews.co.za/article/nersa-approves-higher-electricity-hikes-for-202627-after-r547bn-error-2026-03-10) (10 March 2026).\n2. Eskom, [Eskom Implements NERSA Decision for Financial Year 2027](https://www.eskom.co.za/eskom-implements-nersa-decision-for-financial-year-2027/).\n3. The Citizen, [Power Price Increase Confirmed as NERSA Grants 8.76% Eskom Hike](https://www.citizen.co.za/kempton-express/news-headlines/local-news/2026/02/14/power-price-increase-confirmed-as-nersa-grants-8-76-eskom-hike/) (14 February 2026).\n4. SAnews, [NERSA Announces Electricity Price Hike](https://www.sanews.gov.za/node/79497).",
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
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Multi-Year Price Determination</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">NERSA MYPD framework, determination history, and cost component breakdowns.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.market-and-pricing.multi-year-price-determination"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
