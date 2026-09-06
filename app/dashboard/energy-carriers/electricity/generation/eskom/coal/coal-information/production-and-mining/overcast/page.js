import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Production & Mining — Overcast" };

const ROOT  = "/dashboard/energy-carriers";
const COAL  = `${ROOT}/electricity/generation/eskom/coal`;
const CI    = `${COAL}/coal-information`;
const PM    = `${CI}/production-and-mining`;

const DEFAULT_SECTIONS = [
    {
        id: "type-of-coal",
        label: "Type of coal",
        defaultContent: JSON.stringify([
            "Opencast (surface) mining is used where coal seams lie close enough to the surface that overburden can be economically stripped away — a method well suited to the relatively shallow, flat-lying seams found across much of the **Mpumalanga Highveld coalfield**, which supplies the majority of Eskom's coal-fired fleet. Opencast coal from this region is typically **bituminous, medium-to-high-ash coal** — lower calorific value than premium export-grade coal, but well matched to power station boilers designed specifically to burn it.",
        ]),
    },
    {
        id: "when-established",
        label: "When established",
        defaultContent: JSON.stringify([
            "Most of the opencast collieries supplying Eskom's Highveld stations were established alongside — or shortly before — the power stations they feed, from the 1970s through the 1990s, under long-term **cost-plus or dedicated-supply contracts** designed to guarantee decades of secure fuel supply. Several of these mines are directly adjacent to their power station, connected by conveyor rather than road or rail, minimising transport cost and supply risk.",
        ]),
    },
    {
        id: "tonnes-produced",
        label: "Tonnes produced",
        defaultContent: JSON.stringify([
            "Eskom is by far the largest single consumer of South African coal, burning on the order of **100+ million tonnes per year** across its coal fleet at recent fleet-wide utilisation levels, the majority of which is sourced from opencast operations given their lower extraction cost relative to underground mining. Annual volumes fluctuate with power station availability, planned maintenance, and load-shedding-driven dispatch changes.",
        ]),
    },
    {
        id: "where-coal-is-used",
        label: "Where coal is used",
        defaultContent: JSON.stringify([
            "Opencast-sourced coal supplies the majority of Eskom's Mpumalanga coal fleet — including Kendal, Duvha, Matla, Kriel, Tutuka, and Majuba — almost all of which are supplied via dedicated conveyor systems from adjacent or nearby collieries rather than by road or rail, a logistics model that minimises transport cost but also means any disruption at the mine directly threatens the connected station's fuel stockpile.",
        ]),
    },
    {
        id: "remaining-life-of-mine",
        label: "Remaining life of mine",
        defaultContent: JSON.stringify([
            "Remaining life-of-mine varies considerably across Eskom's dedicated opencast suppliers, with several of the older Highveld collieries approaching or past the midpoint of their reserve base after decades of continuous extraction — a factor increasingly relevant to Eskom's own generation planning, since a colliery reaching end-of-life can force early retirement or costly resourcing of the power station it feeds.",
        ]),
    },
    {
        id: "exports",
        label: "Exports",
        defaultContent: JSON.stringify([
            "Coal destined for Eskom's power stations is, almost by definition, **not exported** — dedicated-supply opencast mines are contractually committed to their power station customer. South Africa's substantial coal export industry (through Richards Bay Coal Terminal) instead draws on separate, generally higher-quality opencast and underground operations not tied to Eskom supply contracts.",
        ]),
    },
    {
        id: "coal-prices",
        label: "Coal prices",
        defaultContent: JSON.stringify([
            "Eskom's coal is priced overwhelmingly through **long-term, cost-plus supply agreements** rather than spot or export-linked pricing, meaning the price Eskom pays is largely disconnected from international thermal coal benchmarks (such as the Richards Bay FOB price) that apply to export-grade coal. This insulates Eskom's fuel cost from global price volatility but has also drawn scrutiny over whether cost-plus contracts create sufficient incentive for mine-side cost discipline.",
        ]),
    },
    {
        id: "energy-content",
        label: "Energy content",
        defaultContent: JSON.stringify([
            "Coal supplied to Eskom's power stations typically has a calorific value in the range of roughly **19-23 MJ/kg** — notably lower than premium export-grade coal (often above 27 MJ/kg) — since Eskom's boilers were purpose-designed to burn lower-grade, higher-ash Highveld coal that would otherwise have limited commercial value.",
        ]),
    },
    {
        id: "calorific-value",
        label: "Calorific value of content",
        defaultContent: JSON.stringify([
            "Calorific value testing for Eskom-bound coal follows **SABS/ISO standard methods**, distinguishing between gross calorific value (as-received, including moisture) and net calorific value (adjusted for the energy consumed evaporating moisture during combustion) — the latter being the more relevant figure for actual boiler performance and heat-rate calculations.",
        ]),
    },
    {
        id: "mineral-composition",
        label: "Mineral composition",
        defaultContent: JSON.stringify([
            "Highveld opencast coal is characterised by comparatively **high ash content** (commonly 25-35%) relative to international thermal coal, along with moderate sulphur levels — factors that directly shape boiler design (larger ash-handling and precipitator/FGD systems) and are central to the emissions-control and ash-disposal challenges facing Eskom's coal fleet.",
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
                { label: "Overcast" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Production &amp; Mining — Overcast</h1>
                <p className="mt-2 text-sm text-slate-500">Opencast mining data, coal quality, and production statistics.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-coal.overcast"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
