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
            "Eskom's transmission network totalled **374 transmission lines spanning approximately 33,199 km**, connecting **169 transmission substations**, according to Eskom's own National Transmission Company South Africa (NTC) transmission licence application (reporting 2021 figures — the most recent detailed public breakdown found for this page). This reflects South Africa's geography: generation is heavily concentrated in Mpumalanga and Limpopo, while major demand centres — Gauteng, the Western Cape, KwaZulu-Natal — lie hundreds of kilometres away, requiring long high-voltage corridors to move power efficiently across the country.\n\nNetwork expansion is increasingly driven by the need to connect new renewable energy capacity in resource-rich but historically under-served regions such as the Northern Cape and parts of the Eastern Cape — a central focus of Eskom's Transmission Development Plan, and a frequently-cited bottleneck for new wind and solar projects awaiting grid connection.",
        ]),
    },
    {
        id: "voltage",
        label: "Voltage",
        defaultContent: JSON.stringify([
            "The transmission network operates across several voltage classes. Per Eskom's 2021 transmission licence figures:\n- **765 kV:** 10 lines, ~2,784 km — South Africa's highest transmission voltage, used on key long-distance corridors.\n- **400 kV:** 167 lines, ~19,760 km — the dominant backbone voltage linking major generation and demand centres.\n- **275 kV:** ~7,342 km.\n- **220 kV:** ~1,352 km.\n\nBelow these, **132 kV** sub-transmission lines feed into regional distribution networks. Higher voltages minimise losses over long distances, while lower voltages step power down for regional distribution to substations closer to end consumers.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Eskom, [NTC Transmission Licence Application](https://www.eskom.co.za/wp-content/uploads/2023/02/NTC_Transmission_licence_application.pdf) — line counts and lengths by voltage class (2021 data).\n2. Eskom, [Transmission Development Plan](https://www.eskom.co.za/?p=8892) — planned network expansion to connect new generation capacity.",
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
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Main Transmission</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">High-level information about the main transmission network.</p>
            </div>

            <EditableSections
                pageKey="ec.electricity.distribution-and-transmission.main-transmission"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
