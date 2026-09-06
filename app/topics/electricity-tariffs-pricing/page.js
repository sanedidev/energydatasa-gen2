import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Electricity Tariffs & Pricing" };

const DEFAULT_SECTIONS = [
    { id: "overview",          label: "Overview" },
    { id: "tariff-history",    label: "Tariff History" },
    { id: "tariff-structures", label: "Tariff Structures" },
    { id: "municipal-markups", label: "Municipal Markups" },
    { id: "regulatory-process",label: "Regulatory Process" },
    { id: "datasets",          label: "Related Datasets" },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa's electricity tariffs have risen sharply over the past decade, far outpacing inflation. The average Eskom retail tariff increased from approximately R0.25/kWh in 2010 to over R2.50/kWh by 2024 — a more than tenfold increase in nominal terms. These increases reflect Eskom's debt load, cost overruns at Medupi and Kusile, ageing infrastructure, and declining plant availability. Add current tariff levels and recent determinations.",

    "tariff-history":
        "Eskom's Multi-Year Price Determination (MYPD) process sets tariffs for rolling 3-5 year periods. MYPD3 (2013–2018) saw average increases of 8% per year. MYPD4 (2019–2022) continued above-inflation increases. MYPD5 (2022–2025) included a 18.65% increase for 2023/24 and further increases thereafter. NERSA (National Energy Regulator of SA) adjudicates Eskom's revenue applications. Add a table of year-on-year increases and key determinations.",

    "tariff-structures":
        "South Africa uses several tariff structures depending on customer category: Homepower (Residential inclining block tariff — IBT — with subsidised first 350 kWh), Businessrate (Small commercial), Nightsave (Time-of-Use for medium commercial), Megaflex (Large industrial — time-of-use with network charges), and Miniflex. The IBT was designed to cross-subsidise low-income users, but has faced criticism for benefiting high-income households with large homes. Add current tariff rates per category and structure.",

    "municipal-markups":
        "Most South African consumers buy electricity from their local municipality rather than directly from Eskom. Municipalities purchase bulk supply from Eskom and resell at a markup — typically 30–60% above the Eskom bulk tariff, though some municipalities mark up by 100% or more. Municipal electricity revenue is often used to cross-subsidise other services (roads, water), meaning electricity tariffs effectively function as a tax. Free Basic Electricity (FBE) of 50 kWh/month is provided to indigent households. Add data on mark-ups across major municipalities.",

    "regulatory-process":
        "NERSA is the independent regulator responsible for approving Eskom's tariffs and licensing electricity distributors. The MYPD process involves Eskom filing a revenue application, NERSA conducting public hearings, and issuing a determination. Municipalities submit their own tariff applications to NERSA annually. The National Electricity Regulator Act and the Electricity Regulation Act (No. 4 of 2006) govern this process. The Energy Regulator Amendment Bill (under discussion) seeks to strengthen NERSA's independence. Add recent determination outcomes and appeals.",

    "datasets":
        "Key data sources: NERSA tariff determinations (nersa.org.za), Eskom annual reports, Stats SA CPI electricity sub-index, municipal tariff schedules, and the South African Local Government Association (SALGA) electricity tariff benchmarking reports. Link to relevant datasets on this platform.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Electricity Tariffs & Pricing" },
            ]} />

            <EditablePageHeader
                pageKey="topic.electricity-tariffs-pricing"
                defaultLabel="Topic"
                defaultTitle="Electricity Tariffs & Pricing"
                defaultDesc="How South Africa prices electricity — from Eskom's bulk tariff determinations and regulatory process to municipal markups and the impact on households and businesses."
            />

            <EditableSections
                pageKey="topic.electricity-tariffs-pricing"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
