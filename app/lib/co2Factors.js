// IPCC 2006 Guidelines emission factors (kg CO₂/GJ) — used for sector overlay estimates
// Electricity uses SA grid average (NEB 2024: ~81% coal → ~0.9 kg CO₂/kWh = 250 kg CO₂/GJ)
// Biomass, solar, wind, hydro are considered carbon-neutral under IPCC accounting

export const CO2_FACTORS = {
    bituminous:  94.6,
    coking:      94.6,
    anthracite:  98.3,
    coke:       107.0,
    charcoal:     0,    // biomass-derived, carbon neutral
    crude:       73.3,
    gasoline:    69.3,
    diesel:      74.1,
    lpg:         63.1,
    kerosene:    71.9,
    aviationGas: 70.0,
    hfo:         77.4,
    naturalGas:  56.1,
    nuclear:      0,
    electricity: 250,   // SA grid average (0.9 kg CO₂/kWh)
    biomass:      0,
    wood:         0,
    solar:        0,
    wind:         0,
    hydro:        0,
};

/**
 * Estimate sector CO₂ from NEB section data.
 * Returns { totalMtCO2, byGroup: { coal, liquid, biomass, other } }
 * Values in Mt CO₂ (megatonnes).
 * PJ × factor(kg CO₂/GJ) / 1000 = Mt CO₂
 */
export function computeSectorCO2(section, commodities) {
    if (!section) return { totalMtCO2: 0, byGroup: { coal: 0, liquid: 0, biomass: 0, other: 0 } };

    const byGroup = { coal: 0, liquid: 0, biomass: 0, other: 0 };

    section.rows
        .filter((r) => !r.isTotal)
        .forEach((row) => {
            commodities.forEach((c) => {
                const pj     = Math.abs(row.values?.[c.id] ?? 0);
                const factor = CO2_FACTORS[c.id] ?? 0;
                const mt     = (pj * factor) / 1000;
                if (mt > 0) byGroup[c.group ?? "other"] = (byGroup[c.group ?? "other"] ?? 0) + mt;
            });
        });

    const totalMtCO2 = Object.values(byGroup).reduce((a, b) => a + b, 0);
    return { totalMtCO2, byGroup };
}
