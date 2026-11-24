import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Coal — Coal Information" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Coal Information", subtitle: "South Africa's dominant primary energy source" },
            "Coal remains the backbone of South Africa's energy system — the primary fuel for Eskom's power stations and a major export commodity. South Africa's coal is concentrated in a handful of coalfields, overwhelmingly in **Mpumalanga**, with the **Waterberg** coalfield in Limpopo increasingly positioned as the country's next major production area as Mpumalanga's established reserves mature.\n\nTotal national coal production was estimated at around **236 million tonnes (Mt) in 2025**, essentially flat on 2024 and still roughly 9% below pre-COVID-19 levels, according to the Minerals Council South Africa's Facts & Figures reporting.",
        ]),
    },
    {
        id: "quality-grades",
        label: "Coal Quality & Grades",
        defaultContent: JSON.stringify([
            { type: "title", title: "Coal Quality & Grades" },
            "South African coal spans a range of qualities. Export-grade coal shipped through Richards Bay is generally **higher calorific value, lower-ash** material, calibrated to international thermal coal benchmarks. Coal supplied to Eskom's power stations, by contrast, is typically **lower-grade, higher-ash bituminous coal** (commonly in the region of 19–23 MJ/kg calorific value, with ash content often 25–35%) — stations were purpose-built to burn exactly this grade, which would otherwise have limited export value.",
            { type: "text", content: "This quality split is structural, not incidental: Eskom's dedicated-supply contracts exist precisely because its boilers are designed around domestic, lower-grade coal that the export market does not want at scale.", bg: "gray" },
        ]),
    },
    {
        id: "reserves-resources",
        label: "Reserves & Resources",
        defaultContent: JSON.stringify([
            { type: "title", title: "Reserves & Resources" },
            "**Mpumalanga** has historically hosted the large majority of South Africa's coal production and is now a maturing basin, with several long-established collieries well advanced through their planned reserve life. The **Waterberg** coalfield (Limpopo) — currently mined at scale mainly via Exxaro's Grootegeluk mine — is widely described in industry reporting as South Africa's next strategic coal basin as Mpumalanga reserves deplete, though it lacks Mpumalanga's existing rail and power-station infrastructure.\n\nGiven coal's continued domestic importance for electricity security, South Africa's government re-classified thermal coal as a **\"critical mineral\"** in recent policy discussions — a notable shift for a commodity more usually associated with calls for phase-down than strategic protection.",
        ]),
    },
    {
        id: "logistics-export",
        label: "Logistics & Export",
        defaultContent: JSON.stringify([
            { type: "title", title: "Logistics & Export", subtitle: "Richards Bay Coal Terminal and the Transnet rail recovery" },
            "The **Richards Bay Coal Terminal (RBCT)** is one of the world's largest coal export facilities, with nameplate capacity of up to **91 Mt/year**, though actual throughput has run well below that for most of the 2020s due to a sustained collapse in Transnet's rail performance. Exports fell to a low of **47.2 Mt in 2023**, before recovering to roughly **57–58 Mt in 2025** (sources vary slightly) as Transnet's rail turnaround took hold — a double-digit percentage increase year-on-year. A further rise toward roughly **60–62 Mt** was being forecast for 2026.",
            { type: "text", content: "Around a third of South Africa's total coal production is exported (roughly 72 Mt on an annualised basis against ~236 Mt total production in 2025), with the remainder consumed domestically — overwhelmingly by Eskom for electricity generation, alongside Sasol's Secunda coal-to-liquids operation.", bg: "blue" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Department of Mineral and Petroleum Resources (formerly DMRE), [South African Coal Sector Report](https://www.dmre.gov.za/Portals/0/Energy_Website/files/media/explained/South-African-Coal-Sector-Report.pdf).\n2. Daily Maverick, [Richards Bay Coal Terminal Exports Rise Over 10% in 2025 in Latest Sign of Transnet Reboot](https://www.dailymaverick.co.za/article/2026-01-27-richards-bay-coal-terminal-exports-rise-s-rise-over-10-in-2025-in-latest-sign-of/) (27 January 2026).\n3. Miningmx, [SA Coal Exports Could Rise 10% in 2026, Says Terminal](https://www.miningmx.com/top-story/65964-sa-coal-exports-could-rise-10-in-2026-says-terminal/).\n4. Miningmx, [Why SA Rebranded Thermal Coal a Critical Mineral](https://www.miningmx.com/news/energy/64083-why-sa-rebranded-thermal-coal-a-critical-mineral/) (11 February 2026).\n5. Mining Indaba, [South Africa's Coal Sector Holds Firm Despite...](https://miningindaba.com/articles/south-africas-coal-sector-holds-firm-despite) — citing Minerals Council South Africa 2025 Facts & Figures production estimates.\n6. Exxaro Resources, [Capital Markets Day Presentation](https://exxaro-site.azurewebsites.net/media/0xvgdwx1/exxaro-2026-cmd-presentation_22-june.pdf) (22 June 2026) — on coal resource base and Waterberg positioning.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Coal", href: `${ROOT}/coal` },
                { label: "Coal Information" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Coal</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Coal Information</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    South African coal quality specifications, composition, logistics, and resource context.
                </p>
            </div>

            <EditableSections
                pageKey="ec.coal.coal-information"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
