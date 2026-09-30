// Shared static navigation tree for Energy Carriers.
// Imported by _section-nav.js and CarrierPicker.js.
//
// Electricity's own sub-pages (generation/eskom/coal/... down to individual
// power stations) aren't listed here beyond one level deep - they're all
// CarrierIndexPage-backed hubs, whose default card lists (below, in
// STATIC_CHILDREN) mirror each page's own hardcoded `defaultCards`, so
// _section-nav.js can render every ancestor of the active path without
// waiting on a PageContent record to exist. If an admin edits a hub's cards
// (saving a PageContent record under its `ec.<path>.__cards__` slug),
// _section-nav.js's live fetch takes priority over this static fallback,
// same as CarrierIndexPage's own `parseCards(content) ?? defaultCards`.

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

// Fallback children for hub pages below STATIC_NAV's first level, keyed by
// path relative to BASE. Generated from each hub's own hardcoded
// `defaultCards`/`CARDS` array (and, for Power Generating Stations, its
// hardcoded station list) - see the comment above.
export const STATIC_CHILDREN = {
    "/coal": [
        { label: "Coal Information", href: `${BASE}/coal/coal-information` },
        { label: "Production & Mining", href: `${BASE}/coal/production-and-mining` },
        { label: "Market & Trade Information", href: `${BASE}/coal/market-and-trade-information` },
    ],
    "/electricity": [
        { label: "Generation", href: `${BASE}/electricity/generation` },
        { label: "Distribution & Transmission", href: `${BASE}/electricity/distribution-and-transmission` },
        { label: "Demand", href: `${BASE}/electricity/demand` },
        { label: "Market & Pricing", href: `${BASE}/electricity/market-and-pricing` },
    ],
    "/electricity/demand": [
        { label: "Electricity Consumption (MWh)", href: `${BASE}/electricity/demand/electricity-consumption-mwh` },
        { label: "Peak Demand (MW)", href: `${BASE}/electricity/demand/peak-demand-mw` },
        { label: "Hourly Profiles", href: `${BASE}/electricity/demand/hourly-profiles` },
    ],
    "/electricity/distribution-and-transmission": [
        { label: "Main Transmission", href: `${BASE}/electricity/distribution-and-transmission/main-transmission` },
    ],
    "/electricity/generation": [
        { label: "Eskom", href: `${BASE}/electricity/generation/eskom` },
        { label: "Private", href: `${BASE}/electricity/generation/private` },
        { label: "Non-Eskom", href: `${BASE}/electricity/generation/non-eskom` },
    ],
    "/electricity/generation/eskom": [
        { label: "Coal", href: `${BASE}/electricity/generation/eskom/coal` },
        { label: "Nuclear", href: `${BASE}/electricity/generation/eskom/nuclear` },
        { label: "Oil", href: `${BASE}/electricity/generation/eskom/oil` },
        { label: "Hydro", href: `${BASE}/electricity/generation/eskom/hydro` },
    ],
    "/electricity/generation/eskom/coal": [
        { label: "Power Generating Stations", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations` },
        { label: "Coal Information", href: `${BASE}/electricity/generation/eskom/coal/coal-information` },
        { label: "Market & Trade Information", href: `${BASE}/electricity/generation/eskom/coal/market-and-trade-information` },
        { label: "Technology & Innovation", href: `${BASE}/electricity/generation/eskom/coal/technology-and-innovation` },
    ],
    "/electricity/generation/eskom/coal/coal-information": [
        { label: "Production & Mining", href: `${BASE}/electricity/generation/eskom/coal/coal-information/production-and-mining` },
    ],
    "/electricity/generation/eskom/coal/coal-information/production-and-mining": [
        { label: "Underground", href: `${BASE}/electricity/generation/eskom/coal/coal-information/production-and-mining/underground` },
        { label: "Overcast", href: `${BASE}/electricity/generation/eskom/coal/coal-information/production-and-mining/overcast` },
    ],
    "/electricity/generation/eskom/coal/power-generating-stations": [
        { label: "Arnot", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/arnot` },
        { label: "Camden", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/camden` },
        { label: "Duvha", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/duvha` },
        { label: "Grootvlei", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/grootvlei` },
        { label: "Hendrina", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/hendrina` },
        { label: "Kendal", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/kendal` },
        { label: "Komati", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/komati` },
        { label: "Kriel", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/kriel` },
        { label: "Kusile", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/kusile` },
        { label: "Lethabo", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/lethabo` },
        { label: "Majuba", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/majuba` },
        { label: "Matimba", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/matimba` },
        { label: "Matla", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/matla` },
        { label: "Medupi", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/medupi` },
        { label: "Tutuka", href: `${BASE}/electricity/generation/eskom/coal/power-generating-stations/tutuka` },
    ],
    "/electricity/generation/eskom/hydro": [
        { label: "Run-off River", href: `${BASE}/electricity/generation/eskom/hydro/run-off-river` },
        { label: "Water-Pump Storage", href: `${BASE}/electricity/generation/eskom/hydro/water-pump-storage` },
    ],
    "/electricity/generation/eskom/nuclear": [
        { label: "Koeberg", href: `${BASE}/electricity/generation/eskom/nuclear/koeberg` },
    ],
    "/electricity/market-and-pricing": [
        { label: "Tariffs Per Sector Over Time", href: `${BASE}/electricity/market-and-pricing/tariffs-per-sector-over-time` },
        { label: "Multi-Year Price Determination", href: `${BASE}/electricity/market-and-pricing/multi-year-price-determination` },
    ],
    "/natural-gas": [
        { label: "Piped", href: `${BASE}/natural-gas/piped` },
        { label: "LNG", href: `${BASE}/natural-gas/lng` },
    ],
    "/oil": [
        { label: "Technology & Innovation", href: `${BASE}/oil/technology-and-innovation` },
        { label: "CCS & Clean Coal Tech", href: `${BASE}/oil/ccs-and-clean-coal-tech` },
    ],
    "/renewable-energy": [
        { label: "PV", href: `${BASE}/renewable-energy/pv` },
        { label: "Wind", href: `${BASE}/renewable-energy/wind` },
    ],
};
