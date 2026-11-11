"use client";

import { useMemo } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { FUEL_COLOR, FUEL_LABEL, ELECTRICITY_COLOR } from "@/app/lib/energyColors";
import { SKIP_IDS, commodityGroup, SECTOR_IDS, sectorGroupBreakdown } from "@/app/lib/energyCommodities";

// This diagram now covers transformation only (primary sources → power
// generation → electricity/losses) - it deliberately stops at a single
// "Delivered to Sectors" node rather than fanning out into all 5 end-use
// sectors. Fanning out there was the main source of the long, crossing
// diagonal ribbons that made the old all-in-one diagram unreadable: sectors
// don't feed each other, so that part of the data isn't actually a flow, and
// is shown instead as a proper per-sector fuel-mix breakdown in
// FinalConsumptionBars. power_gen/conv_losses/td_losses/final_demand are
// deliberately neutral "process" nodes, not identity colors, same treatment
// the dataviz skill gives reserved status colors and recessive grid ink.
const NODE_COLOR = {
    ...FUEL_COLOR,
    power_gen:    "#334155",
    electricity:  ELECTRICITY_COLOR,
    conv_losses:  "#94a3b8",
    td_losses:    "#cbd5e1",
    final_demand: "#475569",
};

const NODE_LABEL = {
    ...FUEL_LABEL,
    power_gen:    "Power Generation",
    electricity:  "Electricity",
    conv_losses:  "Conversion Losses",
    td_losses:    "T&D Losses",
    final_demand: "Delivered to Sectors",
};

const SUPPRESS_LABEL = new Set();

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

    // Electricity actually delivered to end-use sectors (detail-by-sector
    // lives in FinalConsumptionBars, not here - this is just the aggregate).
    const deliveredElec = SECTOR_IDS.reduce((sum, sectorId) => {
        const tot = byId[sectorId]?.rows.find((r) => r.isTotal);
        return sum + (tot ? sectorGroupBreakdown(tot).electricity : 0);
    }, 0);

    // Build links
    const links = [];

    // Primary sources → Power Generation
    Object.entries(powerInputs).forEach(([group, val]) => {
        if (val > 0.5) links.push({ source: group, target: "power_gen", value: Math.round(val) });
    });

    // Power Generation → Electricity + Conversion Losses
    if (elecGenerated > 0.5) links.push({ source: "power_gen", target: "electricity", value: Math.round(elecGenerated) });
    if (convLosses > 0.5)    links.push({ source: "power_gen", target: "conv_losses", value: Math.round(convLosses) });

    // Electricity → T&D Losses + Delivered to Sectors
    if (tdLoss > 0.5)       links.push({ source: "electricity", target: "td_losses",    value: Math.round(tdLoss) });
    if (deliveredElec > 0.5) links.push({ source: "electricity", target: "final_demand", value: Math.round(deliveredElec) });

    // Only include nodes that actually appear in links
    const activeIds = new Set(links.flatMap((l) => [l.source, l.target]));
    const nodes = Object.keys(NODE_LABEL).filter((id) => activeIds.has(id)).map((id) => ({ id }));

    return nodes.length && links.length ? { nodes, links } : null;
}

// Hardcoded 2024 fallback (used when no sections prop supplied)
const FALLBACK_DATA = {
    nodes: Object.keys(NODE_LABEL).map((id) => ({ id })),
    links: [
        { source: "coal",        target: "power_gen",    value: 1970 },
        { source: "nuclear",     target: "power_gen",    value: 28   },
        { source: "renewables",  target: "power_gen",    value: 105  },
        { source: "oil_gas",     target: "power_gen",    value: 39   },
        { source: "biomass",     target: "power_gen",    value: 3    },
        { source: "power_gen",   target: "electricity",  value: 671  },
        { source: "power_gen",   target: "conv_losses",  value: 1474 },
        { source: "electricity", target: "td_losses",    value: 137  },
        { source: "electricity", target: "final_demand", value: 534  },
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

// Custom layer drawn on top of nivo's own 'links' layer: a thin, animated
// dashed stroke along each link's path, suggesting flow direction. Nivo has
// no built-in prop for this, so it's a real custom layer rather than a
// config option. pos0/pos1 are already absolute y-centers at the source/
// target ends (nivo's internal data transform sets link.pos0 = the raw
// d3-sankey y0, link.pos1 = the raw y1, before deleting those keys) - NOT
// offsets from the node's own y0, confirmed by reading nivo's own link-path
// builder in its built source.
function AnimatedFlowLayer({ links, currentLink, isCurrentLink, isInteractive }) {
    // Heavier flows read as "heavier": their dash animates slower. Lighter
    // flows feel quicker/thinner. Duration is scaled off this layer's own
    // value range rather than a fixed PJ scale, so it stays meaningful
    // whether the diagram is showing one year or a very different one.
    const maxValue = Math.max(1, ...links.map((l) => l.value ?? 0));
    return (
        <g>
            {links.map((link) => {
                const dimmed = isInteractive && currentLink && !isCurrentLink(link);
                const x0 = link.source.x1;
                const x1 = link.target.x0;
                const y0 = link.pos0;
                const y1 = link.pos1;
                const xMid = (x0 + x1) / 2;
                const d = `M${x0},${y0} C${xMid},${y0} ${xMid},${y1} ${x1},${y1}`;
                const ratio = Math.min(1, Math.max(0, (link.value ?? 0) / maxValue));
                const duration = 1.6 + ratio * 2.4; // 1.6s (smallest flows) .. 4.0s (largest)
                return (
                    <path
                        key={`flow-${link.index}`}
                        d={d}
                        fill="none"
                        stroke={NODE_COLOR[link.source.id] ?? "#94a3b8"}
                        strokeWidth={1.5}
                        strokeOpacity={dimmed ? 0 : 0.55}
                        strokeDasharray="1,9"
                        strokeLinecap="round"
                        className="sankeyFlowDash"
                        style={{ transition: "stroke-opacity 150ms ease", animationDuration: `${duration}s` }}
                    />
                );
            })}
        </g>
    );
}

export default function EnergySankey({ sections, height = 440 }) {
    const computed = useMemo(() => buildSankeyData(sections), [sections]);

    // Distinguish "no sections prop at all" (a legacy call site - the
    // illustrative fallback is appropriate) from "sections supplied but
    // produced zero links" (a genuinely blank year - e.g. one just created
    // via createYear). Without this split, a brand-new blank year would
    // silently render 2024's real numbers under its own label, since
    // buildSankeyData returns null in both cases.
    if (!sections) {
        return <SankeyBody data={FALLBACK_DATA} height={height} />;
    }
    if (!computed) {
        return (
            <div className="flex items-center justify-center text-sm text-slate-400" style={{ height }}>
                No energy-flow data yet for this year.
            </div>
        );
    }
    return <SankeyBody data={computed} height={height} />;
}

function SankeyBody({ data, height }) {
    return (
        <div>
            {/* Slow, subtle dash-offset animation for the directional-flow
                layer - kept outside Tailwind since it's a one-off keyframe
                tied to a class only this component renders. */}
            <style>{`
                @keyframes sankeyFlowMove {
                    from { stroke-dashoffset: 40; }
                    to   { stroke-dashoffset: 0; }
                }
                .sankeyFlowDash {
                    animation: sankeyFlowMove 2.4s linear infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .sankeyFlowDash { animation: none; }
                }
            `}</style>
            <div
                style={{
                    height,
                    background: "radial-gradient(120% 140% at 0% 0%, rgba(37,99,235,0.035), transparent 55%)",
                }}
            >
                <ResponsiveSankey
                    data={data}
                    margin={{ top: 8, right: 140, bottom: 8, left: 140 }}
                    align="justify"
                    sort="input"
                    layers={["links", AnimatedFlowLayer, "nodes", "labels", "legends"]}
                    colors={(node) => NODE_COLOR[node.id] ?? "#94a3b8"}
                    nodeOpacity={1}
                    nodeHoverOpacity={1}
                    nodeHoverOthersOpacity={0.15}
                    nodeThickness={18}
                    nodeInnerPadding={4}
                    nodeSpacing={28}
                    nodeBorderWidth={0}
                    nodeBorderRadius={6}
                    linkOpacity={0.35}
                    linkHoverOpacity={0.78}
                    linkHoverOthersOpacity={0.06}
                    enableLinkGradient
                    label={(node) => (SUPPRESS_LABEL.has(node.id) ? "" : NODE_LABEL[node.id] ?? node.id)}
                    labelPosition="outside"
                    labelOrientation="horizontal"
                    labelPadding={12}
                    labelTextColor="#475569"
                    nodeTooltip={NodeTooltip}
                    linkTooltip={LinkTooltip}
                    theme={{
                        fontSize: 11,
                        fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    }}
                />
            </div>

            <div className="flex flex-wrap gap-2 px-6 pb-5 pt-1">
                {LEGEND.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ background: `${NODE_COLOR[item.id]}14` }}
                    >
                        <span
                            className="inline-block h-2 w-2 shrink-0 rounded-full"
                            style={{ background: NODE_COLOR[item.id] }}
                        />
                        <span className="text-xs font-medium text-slate-600">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
