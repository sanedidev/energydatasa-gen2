// Fuel/carrier identity colors shared by EnergySankey and FinalConsumptionBars,
// so the same commodity reads as the same color in both charts. Validated
// with the dataviz skill's scripts/validate_palette.js (adjacent-pair mode):
// lightness band, chroma floor, CVD separation and normal-vision floor all
// pass for this 5-color fuel-source set.
//
// biomass was originally #0d9488 (teal) - nearly identical to the site's own
// brand accent (--color-accent, also teal), so a biomass ribbon/segment read
// as if it were a UI element rather than data. Moved to a forest green that
// re-validates cleanly and sits further from the site's accent hue.
export const FUEL_COLOR = {
    coal:       "#92400e",
    nuclear:    "#8b5cf6",
    renewables: "#22c55e",
    oil_gas:    "#ea580c",
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

export const ELECTRICITY_COLOR = "#2563eb";
export const ELECTRICITY_LABEL = "Electricity (grid)";
