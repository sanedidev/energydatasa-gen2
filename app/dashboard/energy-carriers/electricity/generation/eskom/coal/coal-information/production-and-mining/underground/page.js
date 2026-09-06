import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Production & Mining — Underground" };

const ROOT  = "/dashboard/energy-carriers";
const COAL  = `${ROOT}/electricity/generation/eskom/coal`;
const CI    = `${COAL}/coal-information`;
const PM    = `${CI}/production-and-mining`;

const DEFAULT_SECTIONS = [
    {
        id: "type-of-coal",
        label: "Type of coal",
        defaultContent: JSON.stringify([
            "Underground mining is used where economically viable seams lie too deep for opencast extraction to be cost-effective, or where surface land use, rehabilitation obligations, or seam geometry favour bord-and-pillar or longwall methods over stripping the overburden. Underground-sourced coal for Eskom is generally similar in rank to opencast Highveld coal — **bituminous, medium-to-high-ash** — though seam-specific quality can vary more with depth and geological conditions than in shallower opencast pits.",
        ]),
    },
    {
        id: "when-established",
        label: "When established",
        defaultContent: JSON.stringify([
            "A number of Eskom's dedicated underground suppliers have been in continuous operation since the 1970s and 1980s, developed specifically to secure decades-long fuel supply for individual power stations under the same long-term contracting model used for opencast supply. Underground operations generally require significantly higher capital investment to establish than opencast pits, given the cost of shaft development, ventilation, and underground infrastructure.",
        ]),
    },
    {
        id: "tonnes-produced",
        label: "Tonnes produced",
        defaultContent: JSON.stringify([
            "Underground mining contributes a smaller share of Eskom's total coal supply than opencast operations, reflecting the generally higher extraction cost per tonne of underground methods — though it remains an important supplementary and, in some cases, primary source where opencast reserves at a given station's dedicated supplier have been depleted or are geologically unavailable.",
        ]),
    },
    {
        id: "where-coal-is-used",
        label: "Where coal is used",
        defaultContent: JSON.stringify([
            "Underground-sourced coal supplies specific stations within the Eskom fleet depending on which collieries were developed to serve them, generally delivered by a combination of conveyor, rail, and — for smaller or more distant suppliers — road transport, in contrast to the largely conveyor-fed opencast supply model.",
        ]),
    },
    {
        id: "remaining-life-of-mine",
        label: "Remaining life of mine",
        defaultContent: JSON.stringify([
            "Remaining life-of-mine for Eskom's underground suppliers depends heavily on seam depth, extraction method efficiency (bord-and-pillar recovery rates are typically lower than longwall), and the pace of reserve depletion relative to contracted offtake — with some of the longest-operating underground collieries now well advanced through their originally planned reserve base.",
        ]),
    },
    {
        id: "exports",
        label: "Exports",
        defaultContent: JSON.stringify([
            "As with opencast supply, coal produced under dedicated underground contracts for Eskom is generally **not available for export**, being committed to the power station customer under long-term supply agreements. Separate underground operations not tied to Eskom contracts do contribute to South Africa's broader coal export industry.",
        ]),
    },
    {
        id: "coal-prices",
        label: "Coal prices",
        defaultContent: JSON.stringify([
            "Underground coal supplied to Eskom is priced predominantly under the same **cost-plus, long-term contract** structure used for opencast supply, though underground mining's higher capital and operating cost base generally translates into a higher delivered cost per tonne than comparable opencast supply.",
        ]),
    },
    {
        id: "energy-content",
        label: "Energy content",
        defaultContent: JSON.stringify([
            "Underground-sourced coal for Eskom's fleet generally falls in a similar calorific range to opencast Highveld coal — roughly **19-23 MJ/kg** — though individual seams can vary depending on depth, ash content, and local geology.",
        ]),
    },
    {
        id: "calorific-value",
        label: "Calorific value of content",
        defaultContent: JSON.stringify([
            "As with opencast supply, calorific value testing follows **SABS/ISO standard methods**, distinguishing gross calorific value (as-received) from net calorific value (adjusted for moisture evaporation), with net calorific value being the more relevant figure for boiler heat-rate performance.",
        ]),
    },
    {
        id: "mineral-composition",
        label: "Mineral composition",
        defaultContent: JSON.stringify([
            "Mineral composition of underground-sourced coal is broadly comparable to opencast Highveld coal — moderate-to-high ash content and moderate sulphur levels — though underground seams can show greater variability in mineral matter distribution than the more uniform, shallower opencast pits, requiring closer blending management to maintain consistent boiler feed quality.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Coal", href: COAL },
                { label: "Coal Information", href: CI },
                { label: "Production & Mining", href: PM },
                { label: "Underground" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Production &amp; Mining — Underground</h1>
                <p className="mt-2 text-sm text-slate-500">Underground mining data, coal quality, and production statistics.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-coal.underground"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
