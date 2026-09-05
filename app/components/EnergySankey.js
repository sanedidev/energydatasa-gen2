"use client";

import { useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";

const NODE_COLOR = {
    coal:        "#64748b",
    nuclear:     "#8b5cf6",
    renewables:  "#22c55e",
    oil_gas:     "#f59e0b",
    biomass:     "#84cc16",
    power_gen:   "#3b82f6",
    electricity: "#60a5fa",
    conv_losses: "#94a3b8",
    td_losses:   "#cbd5e1",
    industry:    "#06b6d4",
    transport:   "#a78bfa",
    residential: "#f472b6",
    commerce:    "#2dd4bf",
    agriculture: "#a3e635",
};

const NODE_LABEL = {
    coal:        "Coal",
    nuclear:     "Nuclear",
    renewables:  "Solar, Wind & Hydro",
    oil_gas:     "Oil & Gas",
    biomass:     "Biomass & Wood",
    power_gen:   "Power Generation",
    electricity: "Electricity",
    conv_losses: "Conversion Losses",
    td_losses:   "T&D Losses",
    industry:    "Industry",
    transport:   "Transport",
    residential: "Residential",
    commerce:    "Commerce",
    agriculture: "Agriculture",
};

const SUPPRESS_LABEL = new Set(["electricity"]);

// Commodity → Sankey source group
const COAL_IDS    = ["bituminous", "coking", "anthracite", "coke"];
const OIL_GAS_IDS = ["crude", "gasoline", "diesel", "lpg", "kerosene", "aviationGas", "hfo", "naturalGas", "otherLiquid"];
const BIOMASS_IDS = ["biomass", "wood", "charcoal"];
const RENEW_IDS   = ["solar", "wind", "hydro", "otherRE"];
const SKIP_IDS    = new Set(["electricity", "heat", "total"]); // don't route these as direct fuel

function commodityGroup(id) {
    if (COAL_IDS.includes(id))    return "coal";
    if (OIL_GAS_IDS.includes(id)) return "oil_gas";
    if (BIOMASS_IDS.includes(id)) return "biomass";
    if (RENEW_IDS.includes(id))   return "renewables";
    if (id === "nuclear")         return "nuclear";
    return null;
}

// Build Sankey nodes/links from live NEB sections data
function buildSankeyData(sections) {
    if (!sections?.length) return null;

    const byId  = Object.fromEntries(sections.map((s) => [s.id, s]));
    const conv  = byId["conversion"];
    if (!conv) return null;

    const rowById = Object.fromEntries(conv.rows.map((r) => [r.id, r]));

    // Accumulate fuel inputs into power generation, grouped by Sankey source
    const powerInputs = { coal: 0, nuclear: 0, renewables: 0, oil_gas: 0, biomass: 0 };

    conv.rows.forEach((row) => {
        // Only process individual generation rows (power-* and chp-*)
        if (!row.id.startsWith("power-") && !row.id.startsWith("chp-")) return;
        Object.entries(row.values ?? {}).forEach(([id, val]) => {
            if (SKIP_IDS.has(id) || val === null || val === undefined) return;
            const absVal = Math.abs(val);
            if (absVal === 0) return;
            // Fuel inputs are negative in NEB (consumption); electricity output is positive — skip
            if (val > 0) return;
            const group = commodityGroup(id);
            if (group && group in powerInputs) powerInputs[group] += absVal;
        });
    });

    const totalPowerInput = Object.values(powerInputs).reduce((a, b) => a + b, 0);

    // Electricity generated = total-electricity row
    const totalElecRow = rowById["total-electricity"];
    const elecGenerated = totalElecRow ? Math.abs(totalElecRow.values?.electricity ?? 0) : 0;

    const convLosses = Math.max(0, totalPowerInput - elecGenerated);

    // T&D losses
    const tdRow = rowById["electricity-losses"];
    const tdLoss = tdRow ? Math.abs(tdRow.values?.electricity ?? 0) : 0;

    // Build links
    const links = [];

    // Primary sources → Power Generation
    Object.entries(powerInputs).forEach(([group, val]) => {
        if (val > 0.5) links.push({ source: group, target: "power_gen", value: Math.round(val) });
    });

    // Power Generation → Electricity + Conversion Losses
    if (elecGenerated > 0.5) links.push({ source: "power_gen", target: "electricity", value: Math.round(elecGenerated) });
    if (convLosses > 0.5)    links.push({ source: "power_gen", target: "conv_losses", value: Math.round(convLosses) });

    // T&D losses
    if (tdLoss > 0.5) links.push({ source: "electricity", target: "td_losses", value: Math.round(tdLoss) });

    // Final sector consumption
    const SECTOR_IDS = ["industry", "transport", "residential", "commerce", "agriculture"];
    SECTOR_IDS.forEach((sectorId) => {
        const sec = byId[sectorId];
        if (!sec) return;
        const tot = sec.rows.find((r) => r.isTotal);
        if (!tot) return;

        const directByGroup = { coal: 0, oil_gas: 0, biomass: 0, renewables: 0, nuclear: 0 };

        Object.entries(tot.values ?? {}).forEach(([id, val]) => {
            if (SKIP_IDS.has(id) || val === null || val === undefined) return;
            if (id === "electricity") return; // handled separately
            const absVal = Math.abs(val);
            if (absVal === 0) return;
            // In sector rows, consumption is negative; skip any positive values (e.g. rooftop solar production)
            if (val > 0) return;
            const group = commodityGroup(id);
            if (group && group in directByGroup) directByGroup[group] += absVal;
        });

        // Electricity → sector
        const elecUse = Math.abs(tot.values?.electricity ?? 0);
        if (elecUse > 0.5) links.push({ source: "electricity", target: sectorId, value: Math.round(elecUse) });

        // Direct fuel → sector
        Object.entries(directByGroup).forEach(([group, val]) => {
            if (val > 0.5) links.push({ source: group, target: sectorId, value: Math.round(val) });
        });
    });

    // Only include nodes that actually appear in links
    const activeIds = new Set(links.flatMap((l) => [l.source, l.target]));
    const nodes = Object.keys(NODE_LABEL).filter((id) => activeIds.has(id)).map((id) => ({ id }));

    return nodes.length && links.length ? { nodes, links } : null;
}

// Hardcoded 2024 fallback (used when no sections prop supplied)
const FALLBACK_DATA = {
    nodes: Object.keys(NODE_LABEL).map((id) => ({ id })),
    links: [
        { source: "coal",        target: "power_gen",   value: 1970 },
        { source: "nuclear",     target: "power_gen",   value: 28   },
        { source: "renewables",  target: "power_gen",   value: 105  },
        { source: "oil_gas",     target: "power_gen",   value: 39   },
        { source: "biomass",     target: "power_gen",   value: 3    },
        { source: "power_gen",   target: "electricity", value: 671  },
        { source: "power_gen",   target: "conv_losses", value: 1474 },
        { source: "electricity", target: "industry",    value: 322  },
        { source: "electricity", target: "residential", value: 163  },
        { source: "electricity", target: "commerce",    value: 137  },
        { source: "electricity", target: "transport",   value: 19   },
        { source: "electricity", target: "agriculture", value: 22   },
        { source: "electricity", target: "td_losses",   value: 137  },
        { source: "coal",        target: "industry",    value: 250  },
        { source: "coal",        target: "residential", value: 5    },
        { source: "biomass",     target: "residential", value: 92   },
        { source: "biomass",     target: "industry",    value: 91   },
        { source: "biomass",     target: "commerce",    value: 27   },
        { source: "oil_gas",     target: "transport",   value: 781  },
        { source: "oil_gas",     target: "industry",    value: 157  },
        { source: "oil_gas",     target: "agriculture", value: 43   },
        { source: "oil_gas",     target: "commerce",    value: 37   },
        { source: "oil_gas",     target: "residential", value: 12   },
    ],
};

const LEGEND = [
    { id: "coal",        label: "Coal" },
    { id: "nuclear",     label: "Nuclear" },
    { id: "renewables",  label: "Solar, Wind & Hydro" },
    { id: "oil_gas",     label: "Oil & Gas" },
    { id: "biomass",     label: "Biomass & Wood" },
    { id: "electricity", label: "Electricity (grid)" },
    { id: "conv_losses", label: "Conversion Losses" },
];

const TOOLTIP_STYLE = {
    background: "#0f172a",
    color: "#f1f5f9",
    fontSize: 12,
    borderRadius: 8,
    padding: "8px 12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
};

function NodeTooltip({ node }) {
    return (
        <div style={TOOLTIP_STYLE}>
            <span style={{ fontWeight: 600 }}>{NODE_LABEL[node.id] ?? node.id}</span>
            <span style={{ color: "#94a3b8" }}>{Math.round(node.value).toLocaleString("en-ZA")} PJ</span>
        </div>
    );
}

function LinkTooltip({ link }) {
    return (
        <div style={TOOLTIP_STYLE}>
            <span style={{ fontWeight: 600 }}>
                {NODE_LABEL[link.source.id] ?? link.source.id}
                {" → "}
                {NODE_LABEL[link.target.id] ?? link.target.id}
            </span>
            <span style={{ color: "#94a3b8" }}>{Math.round(link.value).toLocaleString("en-ZA")} PJ</span>
        </div>
    );
}

export default function EnergySankey({ sections, height = 580 }) {
    const data = useMemo(() => {
        const computed = buildSankeyData(sections);
        return computed ?? FALLBACK_DATA;
    }, [sections]);

    return (
        <div>
            <div style={{ height }}>
                <ResponsiveSankey
                    data={data}
                    margin={{ top: 8, right: 210, bottom: 8, left: 155 }}
                    align="justify"
                    colors={(node) => NODE_COLOR[node.id] ?? "#94a3b8"}
                    nodeOpacity={1}
                    nodeHoverOpacity={1}
                    nodeThickness={20}
                    nodeInnerPadding={4}
                    nodeSpacing={24}
                    nodeBorderWidth={0}
                    nodeBorderRadius={2}
                    linkOpacity={0.42}
                    linkHoverOpacity={0.7}
                    linkHoverOthersOpacity={0.08}
                    enableLinkGradient
                    label={(node) => {
                        if (SUPPRESS_LABEL.has(node.id)) return "";
                        const lbl = NODE_LABEL[node.id] ?? node.id;
                        const val = Math.round(node.value).toLocaleString("en-ZA");
                        if (node.id === "power_gen") return lbl;
                        return `${lbl}  ${val} PJ`;
                    }}
                    labelPosition="outside"
                    labelOrientation="horizontal"
                    labelPadding={14}
                    labelTextColor="#475569"
                    nodeTooltip={NodeTooltip}
                    linkTooltip={LinkTooltip}
                    theme={{
                        fontSize: 11,
                        fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                />
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 px-6 pb-5 pt-1">
                {LEGEND.map((item) => (
                    <div key={item.id} className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
                            style={{ background: NODE_COLOR[item.id] }}
                        />
                        <span className="text-xs text-slate-500">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
