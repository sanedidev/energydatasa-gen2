import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Oil — Technology & Innovation" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "refining-technology",
        label: "Refining Technology",
        defaultContent: JSON.stringify([
            { type: "title", title: "Refining Technology", subtitle: "Current refining configurations at South African refineries" },
            "South Africa's crude oil refining capacity has historically been concentrated across a small number of refineries: **Natref** (Sasolburg, a joint venture between Sasol and TotalEnergies, processing imported crude), **Sapref** (Durban, historically the country's largest refinery), **Enref** (Durban, Engen-operated), and **PetroSA's Mossel Bay** gas-to-liquids facility, which converts natural gas condensate rather than crude oil.\n\nStandard refining configurations use **crude distillation units** to separate crude oil into fractions by boiling point, followed by **cracking units** (catalytic or thermal) to convert heavier fractions into higher-value lighter products such as petrol and diesel. The resulting **product slate** is weighted toward transport fuels (petrol, diesel, jet fuel) alongside LPG, heavy fuel oil, and bitumen. Several of the country's refineries have faced ageing-infrastructure challenges and periods of reduced or suspended operation in recent years, increasing South Africa's reliance on imported refined products.",
        ]),
    },
    {
        id: "efficiency-improvements",
        label: "Efficiency Improvements",
        defaultContent: JSON.stringify([
            { type: "title", title: "Efficiency Improvements" },
            "Refinery energy efficiency initiatives typically focus on **process heat integration** (recovering and reusing waste heat between process units), **combustion optimisation** in furnaces and boilers, and **energy management systems** that track and target energy intensity per barrel processed. These improvements matter both for operating cost and for emissions performance, since refining is itself an energy- and emissions-intensive process.\n\nGiven the age of much of South Africa's refining infrastructure, efficiency investment has often competed with more urgent maintenance and reliability spending, and heat-rate gains have generally come incrementally through targeted process upgrades rather than wholesale refinery modernisation.",
        ]),
    },
    {
        id: "emissions-controls",
        label: "Emissions Controls",
        defaultContent: JSON.stringify([
            { type: "title", title: "Emissions Controls" },
            "South Africa has progressively tightened fuel specifications, moving toward cleaner-burning fuel standards broadly aligned with international **Euro-equivalent** specifications, requiring refineries to reduce sulphur content and other pollutants in petrol and diesel — a process that has required significant capital investment in refinery upgrading units.\n\nOther emissions-control priorities for the sector include **volatile organic compound (VOC)** controls at storage and loading facilities, **flaring reduction** programmes to minimise the burning off of excess process gas, and ongoing compliance with air quality regulations under South Africa's National Environmental Management: Air Quality Act, particularly for refineries situated near residential areas such as the South Durban Basin.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Oil", href: `${ROOT}/oil` },
                { label: "Technology & Innovation" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Technology &amp; Innovation</h1>
                <p className="mt-2 text-sm text-slate-500">Refining technology, efficiency improvements, and emissions controls in the oil sector.</p>
            </div>

            <EditableSections
                pageKey="ec.oil.technology-and-innovation"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
