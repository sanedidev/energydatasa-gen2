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
            "South Africa's refining base has roughly halved since 2020, and is now down to two refineries in regular operation: **Natref** (Sasolburg, a joint venture between Sasol and TotalEnergies, processing imported crude) and **Astron Energy's Cape Town refinery** (formerly Chevron). The others have stopped conventional refining: **Sapref** (Durban, historically the country's largest refinery) has been idle since 2022 and was sold by former owners BP and Shell to the state-owned Central Energy Fund for a nominal R1 in 2024, with a refinery-revival plan (reportedly requiring US$8 billion or more to restore Sapref and upgrade Natref) under discussion but with no confirmed Treasury funding as of this writing; **Enref** (Durban, Engen-operated) was converted to an import terminal in 2021; and **PetroSA's Mossel Bay** gas-to-liquids facility has been mothballed after failing to secure a new gas feedstock source.\n\nStandard refining configurations use **crude distillation units** to separate crude oil into fractions by boiling point, followed by **cracking units** (catalytic or thermal) to convert heavier fractions into higher-value lighter products such as petrol and diesel. The resulting **product slate** is weighted toward transport fuels (petrol, diesel, jet fuel) alongside LPG, heavy fuel oil, and bitumen. With most of the country's refining capacity now gone, South Africa depends heavily on imported crude (for the refineries still operating) and imported refined product to cover the rest of demand.",
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
            "South Africa's retail fuel is **not yet** at cleaner, Euro 5/6-equivalent sulphur limits. The **Clean Fuels 2 (CF2)** regulations, which would cut sulphur content in petrol and diesel to roughly 10 ppm, were originally targeted for 2017 but have been postponed repeatedly; as of the most recent 2025-2026 reporting they are scheduled to take effect on **1 July 2027**. Current retail fuel remains at the older specification. Meeting CF2 requires significant refinery capital investment in desulphurisation units - investment that has been harder to justify given the uncertainty around Sapref's and Natref's own future (see above), and industry commentary has flagged the 2027 timeline itself as at risk without confirmed investment support.\n\nOther emissions-control priorities for the sector include **volatile organic compound (VOC)** controls at storage and loading facilities, **flaring reduction** programmes to minimise the burning off of excess process gas, and ongoing compliance with air quality regulations under South Africa's National Environmental Management: Air Quality Act, particularly for refineries situated near residential areas such as the South Durban Basin.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Discovery Alert, [South Africa's Refinery Revival: Sapref's $7bn Funding Gap](https://discoveryalert.com/analysis/south-africa-refinery-revival-sapref-september-2026/) (September 2026).\n2. Moneyweb, [Jack Up Domestic Oil Refineries, Focus on Storage, or Move to Renewables?](https://www.moneyweb.co.za/mineweb/energy/jack-up-domestic-oil-refineries-focus-on-storage-or-move-to-renewables/).\n3. Daily Investor, [Three Facilities Stopping South Africa from Falling Off a Cliff](https://dailyinvestor.com/energy/129726/three-facilities-stopping-south-africa-from-falling-off-a-cliff/).\n4. SGS Inspire, [South Africa Delays New Fuel Specifications to July 2027](https://inspire.sgs.com/content/100103337/south-africa-delays-new-fuel-specifications-to-july-2027).\n5. Engineering News, [Economic and Regulatory Constraints Are Putting South Africa's Fuel Supply at Risk](https://www.engineeringnews.co.za/article/economic-and-regulatory-constraints-are-putting-south-africas-fuel-supply-at-risk-2025-08-22-1) (22 August 2025).",
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
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Technology &amp; Innovation</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Refining technology, efficiency improvements, and emissions controls in the oil sector.</p>
            </div>

            <EditableSections
                pageKey="ec.oil.technology-and-innovation"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
