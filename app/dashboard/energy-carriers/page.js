"use client";

// The original app had a separate, near-duplicate ~500-line implementation
// for this root index page instead of reusing CarrierIndexPage (which every
// child page uses). That duplication looks unintentional - functionally
// this page is just another managed card grid - so this rebuild uses
// CarrierIndexPage here too, avoiding a second copy of the same logic.
import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const PAGE_SLUG = "ec.carriers.__cards__";

// Admins can add more via "Add carrier" / "Add file" / "Add link" in edit
// mode as each one gets its own page.js files.
const DEFAULT_CARDS = [
    { id: "electricity",        href: "/dashboard/energy-carriers/electricity",        title: "Electricity",      desc: "Generation, transmission, distribution, demand & pricing.", hidden: false },
    { id: "renewable-energy",   href: "/dashboard/energy-carriers/renewable-energy",   title: "Renewable Energy", desc: "PV, wind and other renewable sources.", hidden: false },
    { id: "hydro",              href: "/dashboard/energy-carriers/hydro",              title: "Hydro",            desc: "Run-of-river, pumped storage, plants and capacities.", hidden: false },
    { id: "coal",               href: "/dashboard/energy-carriers/coal",               title: "Coal",             desc: "Production, mining, markets and power stations.", hidden: false },
    { id: "oil",                href: "/dashboard/energy-carriers/oil",                title: "Oil",              desc: "Supply, refining, imports/exports and pricing.", hidden: false },
    { id: "natural-gas",        href: "/dashboard/energy-carriers/natural-gas",        title: "Natural Gas",      desc: "Piped gas, LNG and downstream uses.", hidden: false },
    { id: "uranium",            href: "/dashboard/energy-carriers/uranium",            title: "Uranium",          desc: "Fuel cycle and nuclear context.", hidden: false },
    { id: "biofuels-and-waste", href: "/dashboard/energy-carriers/biofuels-and-waste", title: "Biofuels & Waste", desc: "Solid biomass, liquid biofuels and waste-to-energy.", hidden: false },
    { id: "peat",               href: "/dashboard/energy-carriers/peat",               title: "Peat",             desc: "Resource overview and uses.", hidden: false },
    { id: "heat",               href: "/dashboard/energy-carriers/heat",               title: "Heat",             desc: "Thermal energy for buildings and industry.", hidden: false },
    { id: "geothermal",         href: "/dashboard/energy-carriers/geothermal",         title: "Geothermal",       desc: "Low/high enthalpy resources and applications.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug={PAGE_SLUG}
            defaultCards={DEFAULT_CARDS}
            crumbs={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Carriers" },
            ]}
            title="Energy Carriers"
            description="Browse data across all energy carrier types in South Africa."
            cols={3}
        />
    );
}
