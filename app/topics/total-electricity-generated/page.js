import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Total Electricity Generated" };

const DEFAULT_SECTIONS = [
    { id: "overview",       label: "Overview" },
    { id: "by-source",      label: "Generation by Source" },
    { id: "trends",         label: "Historical Trends" },
    { id: "loadshedding",   label: "Load Shedding Impact" },
    { id: "visualisations", label: "Visualisations" },
    { id: "datasets",       label: "Related Datasets" },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa generated approximately 200,000–215,000 GWh of electricity per year in 2022–2024, down from a peak of around 240,000 GWh in 2007. Eskom produces roughly 90% of national output across its coal, nuclear, hydro, and gas-fired fleet, with independent power producers (IPPs) supplying the remainder. Chronic capacity constraints — driven by Eskom's ageing coal fleet and delayed Medupi and Kusile builds — have led to widespread load shedding since 2008, with 2023 recording the worst year of outages in SA history. Add current generation figures and recent trends.",

    "by-source":
        "Coal dominates South Africa's electricity mix, contributing approximately 80–85% of total generation (2023 data). Nuclear accounts for roughly 4–5% (Koeberg's 1,860 MW). Pumped-storage hydro (Drakensberg, Ingula) provides 2–3%. Imported hydro from Cahora Bassa (Mozambique) contributes approximately 5%. Wind and solar PV — driven by the REIPPP programme — now supply around 5–8% and growing rapidly. Open Cycle Gas Turbines (OCGTs) are used for peaking but at high cost. Add latest generation mix percentages by source with MW capacity.",

    "trends":
        "Generation peaked at ~240,000 GWh in 2007 before declining as Eskom's Energy Availability Factor (EAF) deteriorated. By 2022, EAF fell below 55% — meaning Eskom's fleet was producing at barely half its nominal capacity. 2023 saw record load shedding totalling over 7,000 hours of Stage 2+ outages nationwide. Since mid-2024, load shedding has reduced significantly following emergency procurement, improved plant maintenance, and the rapid growth of embedded solar PV reducing grid demand. Add year-on-year generation data and EAF trends.",

    "loadshedding":
        "Load shedding is the controlled, rotational reduction of electricity supply when demand exceeds available generation capacity. Eskom implements stages 1–8, each representing increments of approximately 1,000 MW of demand reduction. Stage 6 — the worst experienced routinely — means 6,000 MW of load is shed, cutting power to rotating blocks for up to 12 hours per day. The 2023 load shedding crisis caused an estimated R1 billion in daily economic losses. The end of rotational load shedding in late 2024 followed improved Eskom EAF (reaching ~60%), embedded solar growth surpassing 5 GW, and Kusile Unit 6 coming online. Add cumulative load shedding hours by year and economic impact estimates.",

    "visualisations":
        "Add charts showing: total annual electricity generation (GWh) 2000–present; generation mix by source (pie/stacked bar); Eskom Energy Availability Factor over time; monthly generation trends; load shedding hours per year. Data source: Eskom Integrated Reports, Stats SA energy accounts, CSIR Energy Centre load shedding tracker.",

    "datasets":
        "Key data sources: Eskom Integrated Annual Reports (eskom.co.za), Stats SA energy accounts, CSIR Energy Centre (real-time and historical load shedding data), IEA South Africa electricity statistics, NERSA generation statistics, and the SA Energy Data SA Energy Balance datasets on this platform.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Total Electricity Generated" },
            ]} />

            <EditablePageHeader
                pageKey="topic.total-electricity-generated"
                defaultLabel="Topic"
                defaultTitle="Total Electricity Generated"
                defaultDesc="Total electricity generation in South Africa — approximately 200,000–215,000 GWh per year — broken down by source, with context on Eskom's capacity constraints and the growing contribution of renewables and embedded solar."
            />

            <EditableSections
                pageKey="topic.total-electricity-generated"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
