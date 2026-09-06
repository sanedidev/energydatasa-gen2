import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Koeberg Nuclear Power Station" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "about",
        label: "About",
        defaultContent: JSON.stringify([
            { type: "title", title: "Koeberg", subtitle: "South Africa's only commercial nuclear power station" },
            "Koeberg Nuclear Power Station is situated at Duynefontein, approximately 27 km north of Cape Town, and is the only commercial nuclear power plant on the African continent. Construction began in 1976, and the plant uses **pressurised water reactor (PWR)** technology of French design, reflecting the era's close nuclear cooperation between South Africa and France.\n\nUnit 1 was synchronised to the grid on **4 April 1984**, with Unit 2 following on **25 July 1985**. Together, the two units have supplied a significant share of the Western Cape's baseload electricity for four decades, playing a distinctive role in the national grid as the only major generation source located far from the coal-dominated Mpumalanga/Limpopo generation heartland — an important consideration for regional grid stability and transmission planning.\n\nBoth units have undergone **long-term operation (LTO) programmes**, including major steam generator replacements, to extend their operating licences beyond their original design life, reflecting Koeberg's importance to both national capacity and the Western Cape's supply security specifically.",
        ]),
    },
    { id: "unit-1", label: "Unit 1" },
    { id: "unit-2", label: "Unit 2" },
];

const PLACEHOLDERS = {
    "unit-1": "Add Unit 1 details: installed capacity (MW), COD (4 April 1984), sent-out capacity, reactor type, recent refuelling/maintenance schedule, and any life-extension work.",
    "unit-2": "Add Unit 2 details: installed capacity (MW), COD (25 July 1985), sent-out capacity, reactor type, recent refuelling/maintenance schedule, and any life-extension work.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Nuclear", href: `${ROOT}/electricity/generation/eskom/nuclear` },
                { label: "Koeberg" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Koeberg</h1>
                <p className="mt-2 text-sm text-slate-500">High-level information about Koeberg nuclear power station.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-nuclear.koeberg"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
