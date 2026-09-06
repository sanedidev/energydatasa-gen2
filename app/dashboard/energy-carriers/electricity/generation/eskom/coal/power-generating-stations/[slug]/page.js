import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

const ROOT = "/dashboard/energy-carriers";
const COAL = `${ROOT}/electricity/generation/eskom/coal`;
const STATIONS = `${COAL}/power-generating-stations`;

// Well-established, publicly documented basics (location, approximate
// installed capacity, commissioning era) for each station — used to seed
// the General Identification section with real facts. The more granular
// sections (fuel supply specifics, OEM equipment details, financials,
// regulatory filings) are left as placeholder guidance rather than
// fabricated numbers, since that data isn't publicly verifiable at this
// level of detail and belongs to Eskom's own operational records.
const STATION_FACTS = {
    arnot:      "Arnot Power Station is located near Middelburg, Mpumalanga. It has an installed capacity of approximately 2,352 MW across six units and was commissioned in the early-to-mid 1970s, making it one of Eskom's older coal-fired stations.",
    camden:     "Camden Power Station is located near Ermelo, Mpumalanga. Originally commissioned in 1967 with an installed capacity of approximately 1,561 MW, it was mothballed in the late 1980s and returned to service in the mid-2000s as part of Eskom's return-to-service programme to address the capacity shortfall of that period.",
    duvha:      "Duvha Power Station is located near eMalahleni (Witbank), Mpumalanga. It has an installed capacity of approximately 3,600 MW across six units of 600 MW each, commissioned in the late 1980s.",
    grootvlei:  "Grootvlei Power Station is located near Balfour, Mpumalanga. Originally built in 1969 with a capacity of approximately 1,200 MW, it was mothballed and later returned to service between 2008 and 2011 as part of Eskom's return-to-service programme.",
    hendrina:   "Hendrina Power Station is located near Hendrina, Mpumalanga. It was commissioned in the early 1970s with an original installed capacity of approximately 2,000 MW across ten units, some of which have since been decommissioned as part of the ageing fleet's retirement schedule.",
    kendal:     "Kendal Power Station is located near Ogies, Mpumalanga. It has an installed capacity of approximately 4,116 MW across six units of 686 MW each, commissioned in the late 1980s to early 1990s, and is one of the largest direct dry-cooled power stations in the world.",
    komati:     "Komati Power Station is located near Middelburg, Mpumalanga. Originally commissioned with a capacity of approximately 1,000 MW, it was fully decommissioned in October 2022 — the first Eskom coal station retired under South Africa's Just Energy Transition — and is being repurposed as a pilot site for solar, wind, and battery storage.",
    kriel:      "Kriel Power Station is located near Kriel, Mpumalanga. It has an installed capacity of approximately 3,000 MW across six units of 500 MW each, commissioned between the mid-1970s and early 1980s.",
    kusile:     "Kusile Power Station is located near eMalahleni, Mpumalanga. It has a design capacity of approximately 4,800 MW across six units of 800 MW each, and is one of Eskom's newest stations — the first in the fleet built with flue-gas desulphurisation (FGD) from the outset. Its construction faced significant delays and cost overruns, with units brought online progressively through the 2020s.",
    lethabo:    "Lethabo Power Station is located near Vereeniging, Free State. It has an installed capacity of approximately 3,708 MW across six units of 618 MW each, commissioned in the 1980s, and is supplied largely by discard coal from nearby collieries.",
    majuba:     "Majuba Power Station is located near Volksrust, Mpumalanga. It has an installed capacity of approximately 4,110 MW, commissioned between 1996 and 2001, making it one of the newer stations in the coal fleet prior to Medupi and Kusile. A 2014 coal storage silo collapse affected supply to some units for an extended period.",
    matimba:    "Matimba Power Station is located near Lephalale, Limpopo, in the Waterberg coalfield. It has an installed capacity of approximately 3,990 MW across six units of 665 MW each, commissioned between 1987 and 1991, and is one of the largest direct dry-cooled coal power stations in the world.",
    matla:      "Matla Power Station is located near Kriel, Mpumalanga. It has an installed capacity of approximately 3,600 MW across six units of 600 MW each, commissioned in the late 1970s to early 1980s.",
    medupi:     "Medupi Power Station is located near Lephalale, Limpopo, adjacent to Matimba. It has a design capacity of approximately 4,764 MW across six units of 794 MW each, making it the newest and largest station in the coal fleet. Its construction was affected by significant delays, cost overruns, and a 2021 boiler explosion at Unit 4, with units completed progressively through the 2020s.",
    tutuka:     "Tutuka Power Station is located near Standerton, Mpumalanga. It has an installed capacity of approximately 3,654 MW across six units of 609 MW each, commissioned in the early-to-mid 1980s, and has experienced notable reliability and availability challenges in recent years.",
};

const DEFAULT_SECTIONS = [
    { id: "general-identification",   label: "General Identification" },
    { id: "plant-configuration",      label: "Plant Configuration & Capacity" },
    { id: "fuel-and-coal-supply",     label: "Fuel & Coal Supply" },
    { id: "boiler-turbine-generator", label: "Boiler, Turbine & Generator Details" },
    { id: "performance-efficiency",   label: "Performance & Efficiency" },
    { id: "environmental-emissions",  label: "Environmental & Emissions Data" },
    { id: "reliability-availability", label: "Reliability & Availability" },
    { id: "operations-maintenance",   label: "Operations & Maintenance" },
    { id: "grid-integration",         label: "Grid & System Integration" },
    { id: "financial-economic",       label: "Financial & Economic Data" },
    { id: "regulatory-policy",        label: "Regulatory & Policy Information" },
    { id: "future-outlook",           label: "Future Outlook & Transition" },
];

const PLACEHOLDERS = {
    "plant-configuration":      "Add installed capacity (MW), number of units, unit sizes, sent-out capacity, auxiliary consumption, and any decommissioned units.",
    "fuel-and-coal-supply":     "Add coal mine sources, dedicated mine vs. spot market split, conveyor/rail logistics, stockpile capacity, and coal quality specifications accepted.",
    "boiler-turbine-generator": "Add boiler types and ratings, turbine manufacturer and specifications, generator voltage and MVA rating, and any major equipment upgrades.",
    "performance-efficiency":   "Add design heat rate, actual heat rate trends, net station efficiency (%), equivalent availability factor, and load factors over time.",
    "environmental-emissions":  "Add SO₂, NOₓ, and particulate emission levels, compliance status against atmospheric emission licence limits, FGD/ESP/SCR installations, and ash disposal.",
    "reliability-availability": "Add equivalent availability factor (EAF), unplanned capability loss factor (UCLF), planned capability loss factor (PCLF), and major outage history.",
    "operations-maintenance":   "Add major maintenance schedules, planned outage windows, condition-monitoring programmes, and key O&M cost drivers.",
    "grid-integration":         "Add grid connection voltage, substation name, transmission constraints, synchronisation details, and role in system dispatch.",
    "financial-economic":       "Add capital cost (historical and refurbishment), levelised cost of energy estimates, operating cost per MWh, and Eskom cost-allocation context.",
    "regulatory-policy":        "Add atmospheric emission licence details, water use licence, NERSA generation licence number, and any compliance notices or legal proceedings.",
    "future-outlook":           "Add decommissioning date or life-extension plans, just-transition considerations, repurposing options, and alignment with Eskom's transmission development plan.",
};

function formatName(slug) {
    return slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    return { title: `${formatName(slug)} — Eskom Coal Station` };
}

export default async function Page({ params }) {
    const { slug } = await params;
    const name = formatName(slug);

    const sections = DEFAULT_SECTIONS.map((s) =>
        s.id === "general-identification" && STATION_FACTS[slug]
            ? { ...s, defaultContent: JSON.stringify([STATION_FACTS[slug]]) }
            : s
    );

    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Coal", href: COAL },
                { label: "Stations", href: STATIONS },
                { label: name },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Eskom Coal Station</p>
                <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                <p className="mt-1 text-sm text-slate-500">Coal-fired power station data and specifications.</p>
            </div>

            <EditableSections
                pageKey={`ec.station.${slug}`}
                defaultSections={sections}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
