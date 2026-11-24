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
    {
        id: "unit-1",
        label: "Unit 1",
        defaultContent: JSON.stringify([
            { type: "title", title: "Unit 1", subtitle: "Commercial operation since 4 April 1984" },
            "Koeberg Unit 1 is rated at approximately **970 MW gross / 930 MW net** sent-out capacity. As part of Eskom's Long-Term Operation (LTO) programme, Unit 1 underwent a major steam-generator replacement and refurbishment outage; following an extended, delayed return to service, it was reconnected to the national grid in **late October 2025**. In **July 2024**, South Africa's **National Nuclear Regulator (NNR)** granted Unit 1's licence extension, permitting operation to **21 July 2044** — a 20-year extension beyond its original design life.",
        ]),
    },
    {
        id: "unit-2",
        label: "Unit 2",
        defaultContent: JSON.stringify([
            { type: "title", title: "Unit 2", subtitle: "Commercial operation since 25 July 1985" },
            "Koeberg Unit 2 is also rated at approximately **970 MW gross / 930 MW net** sent-out capacity. Unit 2 completed its own LTO steam-generator replacement and refuelling programme, returning to service in **December 2024**. The NNR granted Unit 2's 20-year licence extension in **November 2025** — approved just days before its previous operating licence was due to expire — permitting operation to **9 November 2044/2045** (sources differ by a year on the exact date; check the NNR's own determination for the authoritative figure).",
            { type: "text", content: "With both units now life-extended, Koeberg's combined ~1,860 MW is secured as part of South Africa's baseload mix for roughly the next two decades — separate from, and in addition to, the new nuclear capacity (5.2 GW by 2039) targeted under IRP 2025.", bg: "blue" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Engineering News, [Koeberg Unit 1 Reconnected to the National Grid Following Major Maintenance](https://www.engineeringnews.co.za/article/koeberg-unit-1-reconnected-to-the-national-grid-following-major-maintenance-2025-10-30) (30 October 2025).\n2. Engineering News, [Necsa Welcomes Regulatory Approval for Extending the Life of Koeberg's First Nuclear Reactor](https://www.engineeringnews.co.za/article/necsa-welcomes-regulatory-approval-for-extending-the-life-of-koebergs-first-nuclear-reactor-2024-07-17) (17 July 2024).\n3. News24, [Koeberg Unit 2 Powers Up Again After Delays](https://www.news24.com/business/economy/koeberg-unit-2-powers-up-again-after-delays-20241231) (31 December 2024).\n4. News24, [Koeberg Unit 2 Has Its Life Extended by 20 Years Just Days Before Expiry of Licence](https://www.news24.com/business/climate-future/energy/koeberg-unit-2-has-its-life-extended-by-20-years-just-days-before-expiry-of-licence-20251106-0729) (6 November 2025).\n5. Eskom, [Koeberg Unit 2 Successfully Restored to Service Following Unplanned Outage, Delivering 930MW of Reliable Baseload Power](https://www.eskom.co.za/koeberg-unit-2-successfully-restored-to-service-following-unplanned-outage-delivering-930mw-of-reliable-baseload-power-to-south-africa/).",
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
                { label: "Nuclear", href: `${ROOT}/electricity/generation/eskom/nuclear` },
                { label: "Koeberg" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Koeberg</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">High-level information about Koeberg nuclear power station.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-nuclear.koeberg"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
