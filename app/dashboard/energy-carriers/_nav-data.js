// Shared static navigation tree for Energy Carriers.
// Imported by _section-nav.js and CarrierPicker.js.
//
// Electricity's own sub-pages (generation/eskom/coal/... down to individual
// power stations) aren't listed here beyond one level deep - they're all
// CarrierIndexPage-backed hubs, so _section-nav.js's dynamic child-fetching
// picks them up automatically once you navigate into them.

export const BASE = "/dashboard/energy-carriers";

export const STATIC_NAV = [
    {
        label: "Electricity",
        href: `${BASE}/electricity`,
        children: [
            { label: "Generation", href: `${BASE}/electricity/generation` },
            { label: "Distribution & Transmission", href: `${BASE}/electricity/distribution-and-transmission` },
            { label: "Demand", href: `${BASE}/electricity/demand` },
            { label: "Market & Pricing", href: `${BASE}/electricity/market-and-pricing` },
        ],
    },
    {
        label: "Renewable Energy",
        href: `${BASE}/renewable-energy`,
        children: [
            { label: "PV", href: `${BASE}/renewable-energy/pv` },
            { label: "Wind", href: `${BASE}/renewable-energy/wind` },
        ],
    },
    { label: "Hydro", href: `${BASE}/hydro` },
    {
        label: "Coal",
        href: `${BASE}/coal`,
        children: [
            { label: "Coal Information", href: `${BASE}/coal/coal-information` },
            { label: "Production & Mining", href: `${BASE}/coal/production-and-mining` },
            { label: "Market & Trade Information", href: `${BASE}/coal/market-and-trade-information` },
        ],
    },
    {
        label: "Oil",
        href: `${BASE}/oil`,
        children: [
            { label: "Technology & Innovation", href: `${BASE}/oil/technology-and-innovation` },
            { label: "CCS & Clean Coal Tech", href: `${BASE}/oil/ccs-and-clean-coal-tech` },
        ],
    },
    {
        label: "Natural Gas",
        href: `${BASE}/natural-gas`,
        children: [
            { label: "Piped", href: `${BASE}/natural-gas/piped` },
            { label: "LNG", href: `${BASE}/natural-gas/lng` },
        ],
    },
    { label: "Uranium", href: `${BASE}/uranium` },
    { label: "Biofuels & Waste", href: `${BASE}/biofuels-and-waste` },
    { label: "Peat", href: `${BASE}/peat` },
    { label: "Heat", href: `${BASE}/heat` },
    { label: "Geothermal", href: `${BASE}/geothermal` },
];
