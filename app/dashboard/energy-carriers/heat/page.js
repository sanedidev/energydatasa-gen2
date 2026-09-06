import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Heat" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Heat", subtitle: "Thermal energy for buildings and industry" },
            "Heat is one of the largest but least visible components of South Africa's final energy demand — while electricity generation dominates public attention, a substantial share of the coal, gas, and electricity consumed nationally is ultimately converted into process heat, space heating, and water heating rather than mechanical power or lighting. The primary fuel sources used to meet this heat demand are **coal** (dominant in heavy industry), **natural gas and LPG** (industrial and some commercial use), **electricity** (resistive heating and heat pumps), and **solar thermal** (mainly water heating).\n\nThe key consuming sectors are **industry** (by far the largest, spanning mining, chemicals, food processing, and manufacturing), **residential** (water heating, space heating, and cooking), and **commercial** (water heating and space conditioning in offices, retail, and institutional buildings).",
        ]),
    },
    {
        id: "industrial-heat",
        label: "Industrial Heat",
        defaultContent: JSON.stringify([
            { type: "title", title: "Industrial Heat" },
            "Industrial heat demand spans a wide temperature range, generally categorised as low-enthalpy (below roughly 150°C, typical of food processing, drying, and some chemical processes), medium-enthalpy (150-400°C, common in many chemical and manufacturing processes), and high-enthalpy (above 400°C, required for processes like cement kilns, steel and ferro-alloy smelting, and glass manufacturing).\n\nThe major heat-consuming industries include **mining** (ore processing and beneficiation), **chemicals and petrochemicals** (led by Sasol's Secunda and Sasolburg complexes), **food processing** (sugar milling, dairy, brewing), and **pulp and paper**. Coal remains the dominant fuel for high-temperature industrial heat given its cost and availability, though energy efficiency programmes — including waste heat recovery, combustion optimisation, and insulation upgrades — represent a significant and often underexploited opportunity across these sectors, typically offering shorter payback periods than equivalent investments in new generation capacity.",
        ]),
    },
    {
        id: "solar-water-heating",
        label: "Solar Water Heating",
        defaultContent: JSON.stringify([
            { type: "title", title: "Solar Water Heating" },
            "Solar water heating (SWH) has been one of South Africa's longest-running demand-side energy efficiency interventions, promoted through Eskom's and various municipalities' rebate programmes over the past two decades as a way to shift water-heating load off the electricity grid, particularly during the morning and evening demand peaks. Installed SWH units span both low-pressure thermosiphon systems common in lower-income housing programmes and higher-pressure systems more typical of middle- and upper-income residential and commercial installations.\n\nTypical household electricity savings from converting an electric geyser to solar water heating are substantial, since water heating is one of the largest single electricity end-uses in a typical South African home. Installations are governed by **SABS** product and installation standards, and market growth has been shaped over time by the availability (and periodic withdrawal) of utility and government rebate schemes.",
        ]),
    },
    {
        id: "heat-pumps-district",
        label: "Heat Pumps & District Heating",
        defaultContent: JSON.stringify([
            { type: "title", title: "Heat Pumps & District Heating" },
            "**Heat pumps** — which move heat rather than generating it directly, typically achieving a coefficient of performance (COP) of 3-4x that of resistive electric heating — have seen growing uptake in both residential and commercial water-heating and space-conditioning applications, often as a more efficient alternative to conventional electric geysers, particularly in commercial and hospitality settings where hot water demand is high and consistent.\n\n**District heating**, where a central plant supplies heat to multiple buildings via a shared network, remains largely undeveloped in South Africa. Unlike in colder climates where district heating is common infrastructure, South Africa's milder climate and dispersed urban form have historically limited the economic case for such systems, and any pilot or feasibility studies to date have remained small in scale relative to the broader heat-supply landscape.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **SANEDI industrial energy audit data** — process heat efficiency assessments across industrial sectors\n- **Solar water heating programme statistics** — historical rebate programme installation data (DoE/Eskom)\n- **National Energy Balance heat data** — final consumption of heat-related fuels by sector (see National Energy Planning)\n- **Stats SA energy use surveys** — household and commercial energy use patterns, including water and space heating",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Heat" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-green-700">Energy Carriers</p>
                <h1 className="text-2xl font-bold text-slate-900">Heat</h1>
                <p className="mt-2 text-sm text-slate-500">
                    Thermal energy for buildings and industry — boilers, heat pumps, district heating, and efficiency standards.
                </p>
            </div>

            <EditableSections
                pageKey="ec.heat"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
