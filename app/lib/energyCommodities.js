// Shared commodity-grouping logic for the two energy-flow charts
// (EnergySankey, FinalConsumptionBars) so they can never drift apart on
// which raw commodity ids roll up into which fuel group.

export const COAL_IDS    = ["bituminous", "coking", "anthracite", "coke"];
export const OIL_GAS_IDS = ["crude", "gasoline", "diesel", "lpg", "kerosene", "aviationGas", "hfo", "naturalGas", "otherLiquid"];
export const BIOMASS_IDS = ["biomass", "wood", "charcoal"];
export const RENEW_IDS   = ["solar", "wind", "hydro", "otherRE"];
export const SKIP_IDS    = new Set(["electricity", "heat", "total"]); // not routed as a direct fuel

export function commodityGroup(id) {
    if (COAL_IDS.includes(id))    return "coal";
    if (OIL_GAS_IDS.includes(id)) return "oil_gas";
    if (BIOMASS_IDS.includes(id)) return "biomass";
    if (RENEW_IDS.includes(id))   return "renewables";
    if (id === "nuclear")         return "nuclear";
    return null;
}

export const SECTOR_IDS = ["industry", "transport", "residential", "commerce", "agriculture"];
export const SECTOR_LABEL = {
    industry:    "Industry",
    transport:   "Transport",
    residential: "Residential",
    commerce:    "Commerce",
    agriculture: "Agriculture",
};

// Splits a sector's TOTAL row into fuel-group magnitudes + electricity.
// NEB sign convention: consumption is negative, a positive value is
// embedded generation/export (e.g. rooftop solar) and is excluded here -
// it isn't consumption, so it has no home in a "what did this sector use"
// breakdown.
export function sectorGroupBreakdown(totRow) {
    const byGroup = { coal: 0, oil_gas: 0, biomass: 0, renewables: 0, nuclear: 0 };
    Object.entries(totRow?.values ?? {}).forEach(([id, val]) => {
        if (SKIP_IDS.has(id) || val === null || val === undefined) return;
        if (id === "electricity") return;
        const absVal = Math.abs(val);
        if (absVal === 0 || val > 0) return;
        const group = commodityGroup(id);
        if (group && group in byGroup) byGroup[group] += absVal;
    });
    const electricity = Math.abs(totRow?.values?.electricity ?? 0);
    return { ...byGroup, electricity };
}
