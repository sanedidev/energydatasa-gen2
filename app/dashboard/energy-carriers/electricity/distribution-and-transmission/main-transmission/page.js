import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Main Transmission" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "conductor",
        label: "Type of conductor of lines",
        defaultContent: JSON.stringify([
            "South Africa's transmission network primarily uses **ACSR (Aluminium Conductor Steel Reinforced)** conductors, chosen for their favourable strength-to-weight ratio and cost-effectiveness over the very long span lengths typical of the national grid, which connects generation in Mpumalanga and Limpopo to demand centres across the country. Higher-capacity routes and newer builds increasingly use **bundled conductor configurations** (two, three, or four sub-conductors per phase) to increase current-carrying capacity and reduce corona losses on the highest-voltage lines.",
        ]),
    },
    {
        id: "km",
        label: "KM",
        defaultContent: JSON.stringify([
            "Eskom's transmission network spans **tens of thousands of circuit-kilometres**, reflecting South Africa's geography: generation is heavily concentrated in Mpumalanga and Limpopo, while significant demand centres — Gauteng, the Western Cape, KwaZulu-Natal — lie hundreds of kilometres away, requiring long high-voltage corridors to move power efficiently across the country. Network growth in recent years has been increasingly driven by the need to connect new renewable energy capacity in resource-rich but historically under-served regions such as the Northern Cape and parts of the Eastern Cape, a key focus of Eskom's Transmission Development Plan.",
        ]),
    },
    {
        id: "voltage",
        label: "Voltage",
        defaultContent: JSON.stringify([
            "The transmission network operates across several voltage classes, from **765 kV** (South Africa's highest transmission voltage, used on key long-distance corridors) down through **400 kV** and **275 kV** (the backbone voltages linking major generation and demand centres) to **132 kV** (sub-transmission, feeding into regional distribution networks). Each voltage class serves a different role: higher voltages minimise losses over long distances, while lower voltages step power down for regional distribution to substations closer to end consumers.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Distribution & Transmission", href: `${ROOT}/electricity/distribution-and-transmission` },
                { label: "Main Transmission" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Main Transmission</h1>
                <p className="mt-2 text-sm text-slate-500">High-level information about the main transmission network.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.distribution-and-transmission.main-transmission"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
