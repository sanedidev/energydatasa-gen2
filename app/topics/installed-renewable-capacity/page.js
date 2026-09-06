import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Installed Renewable Capacity" };

const DEFAULT_SECTIONS = [
    { id: "overview",          label: "Overview" },
    { id: "capacity-breakdown",label: "Capacity by Technology" },
    { id: "ipp-programmes",    label: "REIPPP Bid Windows" },
    { id: "embedded-gen",      label: "Embedded Generation" },
    { id: "irp-targets",       label: "IRP 2019 Targets" },
    { id: "visualisations",    label: "Visualisations" },
];

const PLACEHOLDERS = {
    "overview":
        "South Africa's installed utility-scale renewable capacity reached approximately 7,000–8,000 MW by end-2024, up from near-zero in 2010. Wind accounts for the largest share (~3,500 MW), followed by solar PV (~2,500 MW utility-scale), concentrated solar power (CSP, ~600 MW), and biogas/landfill gas (~150 MW). Separately, embedded (behind-the-meter) solar PV — driven by load shedding — surged past 5,000 MW by mid-2024. Renewables now meet roughly 8–10% of national electricity demand. Add current installed figures by technology.",

    "capacity-breakdown":
        "Utility-scale installed capacity by technology (approximate, 2024): Wind: ~3,500 MW across 60+ projects (Eastern Cape, Western Cape, Northern Cape); Solar PV: ~2,500 MW utility-scale; Concentrated Solar Power (CSP): ~600 MW (Northern Cape — Kathu, Bokpoort, KaXu Solar One, Redstone); Biogas and landfill gas: ~150 MW; Small hydro: ~15 MW. The Northern Cape leads in solar irradiance and has the most utility-scale solar projects. The Eastern and Western Cape host the majority of wind projects, benefiting from the coastal Berg wind and coastal low-level jet. Add MW per project and geographic distribution.",

    "ipp-programmes":
        "The Renewable Energy Independent Power Producer Procurement Programme (REIPPP) has been the main vehicle for utility-scale renewable procurement since 2011. Bid Window 1 (2011): 28 projects, 1,416 MW awarded. BW2 (2012): 19 projects, 1,044 MW. BW3 (2013): 17 projects, 1,456 MW. BW4 (2014–2015): 26 projects, 2,205 MW. BW5 (2021): 25 projects, 2,583 MW. BW6 (2023): approximately 4,200 MW awarded across wind and solar. BW7 is expected to build on this. Total REIPPP contracted capacity: ~12,000 MW across all windows to date. Add latest status of construction and grid connection per window.",

    "embedded-gen":
        "The embedded generation revolution is arguably the most significant change in South Africa's energy landscape in 2022–2024. Following the lifting of the licensing threshold to 100 MW (Schedule 2 amendment, 2021), commercial, industrial, and residential installations surged. By mid-2024, registered embedded solar PV capacity exceeded 5,000 MW — comparable to the entire REIPPP programme built over 10 years. This has materially reduced Eskom's daytime peak demand and is one of the primary reasons load shedding reduced in 2024. Add quarterly registration data, sectoral breakdown (residential vs commercial vs industrial), and impact on Eskom load curve.",

    "irp-targets":
        "The Integrated Resource Plan 2019 (IRP 2019) is the government's long-term electricity plan. It sets 2030 targets of: 14,400 MW additional wind; 6,000 MW solar PV (utility-scale); 2,500 MW CSP; 2,500 MW hydro (including imports); 1,500 MW battery storage; and 1,000 MW gas/diesel peakers. Against these targets, wind and solar PV procurement is tracking broadly on schedule via REIPPP, though grid connection timelines are constrained by Eskom's transmission infrastructure and substation capacity. The IRP is reviewed periodically — IRP 2023 revision was under consultation as of 2024. Add progress against each technology target.",

    "visualisations":
        "Add charts showing: cumulative renewable capacity installed (MW) 2011–present by technology; REIPPP bid window capacity awarded vs connected to grid; embedded generation quarterly growth (MW); share of renewables in electricity generation mix over time; geographic map of renewable projects by province. Data sources: NERSA, IPPPP Office, Eskom Grid Connection Reports, CSIR Energy Centre.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Installed Renewable Capacity" },
            ]} />

            <EditablePageHeader
                pageKey="topic.installed-renewable-capacity"
                defaultLabel="Topic"
                defaultTitle="Installed Renewable Capacity"
                defaultDesc="Total installed renewable energy capacity in South Africa, including wind, solar, hydro, and other technologies contributing to the national electricity mix."
            />

            <EditableSections
                pageKey="topic.installed-renewable-capacity"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
