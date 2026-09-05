// Shared static navigation tree for Energy Carriers.
// Imported by _section-nav.js and CarrierPicker.js.
//
// Trimmed to the branches actually built in this rebuild so far (Coal).
// The original app's tree has ~10 more top-level carriers (Electricity,
// Renewable Energy, Oil, Natural Gas, Hydro, Uranium, Biofuels & Waste,
// Peat, Heat, Geothermal) - extend this list as each gets its own
// page.js files (same ~15-line CarrierIndexPage/EditableContent pattern
// as the Coal branch), rather than seeding a sidebar full of dead links.

export const BASE = "/dashboard/energy-carriers";

export const STATIC_NAV = [
    {
        label: "Coal",
        href: `${BASE}/coal`,
        children: [
            { label: "Coal Information", href: `${BASE}/coal/coal-information` },
            { label: "Production & Mining", href: `${BASE}/coal/production-and-mining` },
            { label: "Market & Trade Information", href: `${BASE}/coal/market-and-trade-information` },
        ],
    },
];
