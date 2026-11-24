import Link from "next/link";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import EditableSections from "@/app/components/EditableSections";

const PAGE_KEY = "ep.integrated-resource-plan";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Integrated Resource Plan (IRP)", subtitle: "South Africa's electricity generation capacity plan" },
            "The **Integrated Resource Plan (IRP)** is South Africa's statutory electricity generation capacity plan — it sets out how much new generation capacity is needed, of which technology types, and over what time horizon. Unlike the Integrated Energy Plan (IEP), which covers all energy carriers, the IRP deals exclusively with electricity.\n\nThe current plan is **IRP 2025**, which replaces the previous **IRP 2019** (an IRP 2023 draft had been under public consultation but was superseded rather than finalised). Cabinet approved IRP 2025 on **15 October 2025**, and it was gazetted on **28 October 2025**, setting out an electricity build-out through to **2050**, with detailed targets to 2039.\n\nThe plan is now administered by the **Department of Electricity and Energy (DOEE)**, created when the former Department of Mineral Resources and Energy (DMRE) was split into two departments — the DOEE (electricity, taking on the Electricity Regulation Act and National Energy Act) and the Department of Mineral and Petroleum Resources (DMPR) — following legislation transferred in August 2024. Older documents and some ongoing procurement processes still refer to the DMRE; treat DOEE as its electricity-side successor.",
            { type: "text", content: "IRP 2025 represents a projected investment requirement of approximately **R2.23 trillion**.", bg: "blue" },
        ]),
    },
    {
        id: "capacity-outlook",
        label: "Capacity Outlook",
        defaultContent: JSON.stringify([
            { type: "title", title: "Capacity Outlook", subtitle: "IRP 2025's build-out to 2039" },
            "IRP 2025 is reported as a roughly **105 GW build-out to 2039**, phased around two milestone years:",
            "**By 2030:**\n- Solar PV: **11,270 MW**\n- Wind: **7,340 MW**\n- Gas-to-power: **6,000 MW**\n- No new coal; no new nuclear within this timeline (a clean-coal-technology demonstration plant is still envisaged by 2030)",
            "**By 2039:**\n- Onshore wind: **34 GW**\n- Utility-scale solar: **25 GW**\n- Gas-to-power: rising to **16,000 MW**\n- New nuclear: **5.2 GW**, with some reporting of a possible expansion to 10 GW\n- Battery energy storage: an additional **8,500 MW**\n- Generation share by 2039: coal falling to **~27%** (from ~58% historically), wind **~24%**, solar PV **~18%**",
            { type: "text", content: "Existing nuclear capacity at Koeberg (1,860 MW, both units) is separate from IRP 2025's new-nuclear target — both Koeberg units have now been granted full 20-year operating-licence extensions (Unit 1 to 2044, Unit 2 to 2044/2045), following steam-generator replacement and refuelling work.", bg: "amber" },
        ]),
    },
    {
        id: "technology-mix",
        label: "Technology Mix",
        defaultContent: JSON.stringify([
            { type: "title", title: "Technology Mix", subtitle: "Why the plan leans on solar, wind and gas" },
            "**Solar PV** remains the lowest-cost new-build technology in South Africa's resource environment, reflected in IRP 2025's large utility-scale solar target. The Northern Cape, North West, and Free State have the country's best irradiation profiles.\n\n**Wind** is the second most cost-competitive technology, concentrated mainly in the Western Cape and Eastern Cape coastal belts; offshore wind potential has been identified but has not reached formal procurement.\n\n**Gas-to-power** grows substantially under IRP 2025 (6,000 MW by 2030, rising to 16,000 MW by 2039) as flexible, dispatchable capacity to firm up the growing share of variable solar and wind — this depends on securing reliable gas supply, whether via LNG import terminals or piped gas.\n\n**Nuclear** gets a new-build target for the first time in over a decade under IRP 2025 (5.2 GW by 2039), alongside the now-secured life extension of the existing Koeberg units. No vendor or site has been confirmed for new nuclear capacity in the sources reviewed here.\n\n**Battery storage** (8,500 MW by 2039) is used mainly for shorter-duration shifting and frequency regulation, complementing — not replacing — the dispatchable gas fleet.",
        ]),
    },
    {
        id: "assumptions",
        label: "Key Assumptions",
        defaultContent: JSON.stringify([
            { type: "title", title: "Key Assumptions", subtitle: "How an IRP is put together" },
            "An IRP is produced through **least-cost capacity-expansion modelling**, choosing the generation mix that meets demand at lowest system cost subject to constraints such as:\n- Reliability criteria (reserve margin and energy adequacy)\n- Carbon emissions limits linked to South Africa's climate commitments\n- Technology build-rate limits (how much capacity of a given type can realistically be built per year)\n- Just-transition considerations around the pace of coal-plant retirement\n- Water availability, which constrains wet-cooled thermal plant siting\n- Grid stability (inertia, frequency response, ramping capability) as variable renewables take a larger share\n\nTechnology cost assumptions are typically calibrated against independent benchmarks such as CSIR capacity-expansion research, IPP Office procurement results, and IRENA's global renewable cost data — all of which have shown steep, sustained declines in solar PV and battery costs over the past decade, a major driver of successive IRPs shifting away from gas and coal toward renewables and storage.",
            { type: "text", content: "The grid context behind IRP 2025 differs sharply from that behind IRP 2019: Eskom reported over 540 consecutive days without load shedding and an Energy Availability Factor (EAF) of roughly 68% as of November 2026, a substantial recovery from the depths of the 2021–2023 load-shedding crisis. A related but distinct measure, municipal \"load reduction\" (localised power limiting, not nationwide load shedding), is targeted for full elimination by March 2027.", bg: "blue" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets", subtitle: "Primary sources for IRP analysis and capacity planning" },
            "## Generation & Infrastructure\n- **Eskom Integrated Report & generation performance updates** — installed capacity, Energy Availability Factor (EAF), unplanned outage rates, and peak demand.\n- **IPP Office — REIPPP Bid Window Results** — contracted capacity, tariffs, and commercial operation dates by bid window.\n- **NERSA Generation Licence Register** — all licensed generation projects, operational and approved, by technology and licensee.\n\n## Capacity Planning & Modelling\n- **CSIR Energy Centre research** — independent least-cost capacity-expansion modelling, often used to cross-check official IRP assumptions.\n- **IRENA Renewable Power Generation Costs** — global LCOE benchmarks used to calibrate South African cost assumptions.\n\n## Policy & Regulatory\n- **IRP 2025 (gazetted 28 October 2025)** — the current official plan.\n- **IRP 2019** — the previous official plan, now superseded.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Department of Electricity and Energy (via X/Twitter), [*IRP 2025 gazetted 28 October 2025*](https://x.com/DOEE_ZA/status/2093624982844699024).\n2. ESI-Africa, [*Cabinet Approves IRP 2025, SA's R2.23 Trillion Energy Map*](https://www.esi-africa.com/news/cabinet-approves-irp-2025-sas-r2-23-trillion-energy-map/).\n3. Energize, [*Cabinet Gives Nod to New Integrated Resource Plan*](https://www.energize.co.za/article/cabinet-gives-nod-to-new-integrated-resource-plan).\n4. Energy Capital & Power, [*South Africa Launches IRP 2025, Targeting 5.2 GW of Nuclear*](https://energycapitalpower.com/south-africa-launches-irp-2025-targeting-5-2-gw-of-nuclear/).\n5. TaiyangNews, [*South Africa Targets 25 GW Solar PV by 2039 Under IRP 2025*](https://taiyangnews.info/markets/south-africa-targets-25-gw-solar-pv-by-2039-under-irp-2025).\n6. Pinsent Masons, [*South Africa's IRP 2025 Presents Transformative Renewables Roadmap*](https://www.pinsentmasons.com/out-law/analysis/south-africa-irp-2025-renewables-roadmap).\n7. Engineering News, [*Presidency Transfers Legislation as Part of Steps to Split Mineral Resources, Energy Portfolios*](https://www.engineeringnews.co.za/article/presidency-transfers-legislation-as-part-of-steps-to-split-mineral-resources-energy-portfolios-2024-08-28) (28 August 2024).\n8. News24, [*Koeberg Unit 2 Has Its Life Extended by 20 Years Just Days Before Expiry of Licence*](https://www.news24.com/business/climate-future/energy/koeberg-unit-2-has-its-life-extended-by-20-years-just-days-before-expiry-of-licence-20251106-0729) (6 November 2025).\n9. Engineering News, [*National Nuclear Regulator Grants 20-Year Life Extension to Koeberg Unit 2*](https://www.engineeringnews.co.za/article/national-nuclear-regulator-grants-20-year-life-extension-to-koeberg-unit-2-2025-11-06).\n10. Eskom / SAnews, [*Eskom Marks 300 Days Without Loadshedding*](https://www.gov.za/news/media-statements/eskom-marks-300-days-without-loadshedding-13-mar-2026) and subsequent Eskom generation-performance updates (2026).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8">

            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 text-sm">
                <Link href="/dashboard" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">Datasets</Link>
                <span className="text-slate-300">/</span>
                <Link href="/dashboard/energy-efficiency-planning" className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">Energy Efficiency &amp; Planning</Link>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-[var(--color-ink)]">Integrated Resource Plan</span>
            </nav>

            <EditablePageHeader
                pageKey={PAGE_KEY}
                defaultLabel="Energy Efficiency & Planning"
                defaultTitle="Integrated Resource Plan (IRP)"
                defaultDesc="South Africa's electricity generation capacity plan — outlining technology mix, build timelines, and the transition pathway away from coal."
            />

            <EditableSections
                pageKey={PAGE_KEY}
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
