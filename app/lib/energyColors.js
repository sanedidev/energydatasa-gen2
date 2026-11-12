// Fuel/carrier identity colors shared by EnergySankey and FinalConsumptionBars,
// so the same commodity reads as the same color in both charts. Validated
// with the dataviz skill's scripts/validate_palette.js (adjacent-pair mode):
// lightness band, chroma floor, CVD separation and normal-vision floor all
// pass for this 6-color set (5 fuels + electricity).
//
// Re-toned for the Japanese redesign: the original set (Tailwind-stock amber/
// violet/green/orange/blue) read as a generic dashboard palette against the
// warm paper/muted-ink language used everywhere else on the site. These are
// closer to traditional Japanese pigment tones - chestnut, dusty plum, moss,
// vermillion, pine, indigo - while keeping each commodity's color distinct
// and re-validating cleanly. renewables was kept away from a teal/cyan hue
// specifically so it doesn't read as the site's own --color-accent; biomass
// (originally literal #0d9488, the accent color itself) was already moved to
// pine green for the same reason, before this pass, and is unchanged here.
export const FUEL_COLOR = {
    coal:       "#9c5a2e",
    nuclear:    "#9c5a99",
    renewables: "#7a9c3a",
    oil_gas:    "#b23a1f",
    biomass:    "#15754f",
};

export const FUEL_LABEL = {
    coal:       "Coal",
    nuclear:    "Nuclear",
    renewables: "Solar, Wind & Hydro",
    oil_gas:    "Oil & Gas",
    biomass:    "Biomass & Wood",
};

export const FUEL_ORDER = ["coal", "nuclear", "renewables", "oil_gas", "biomass"];

export const ELECTRICITY_COLOR = "#3a6bb0";
export const ELECTRICITY_LABEL = "Electricity (grid)";
