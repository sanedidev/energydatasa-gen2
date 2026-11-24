import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Coal — Technology & Innovation" };

const ROOT = "/dashboard/energy-carriers";
const COAL = `${ROOT}/electricity/generation/eskom/coal`;

const DEFAULT_SECTIONS = [
    {
        id: "ccs-clean-coal",
        label: "CCS & Clean Coal Tech",
        defaultContent: JSON.stringify([
            { type: "title", title: "CCS & Clean Coal Technology", subtitle: "Emissions control, efficiency retrofits, and carbon capture in Eskom's coal fleet" },
            "Emissions control has become one of the most consequential technology priorities across Eskom's coal fleet, driven by tightening **Minimum Emission Standards (MES)** under the National Environmental Management: Air Quality Act. Compliance pathways include retrofitting **flue-gas desulphurisation (FGD)** to reduce SO₂ emissions — implemented at Kusile from the outset, the only station in the fleet built with FGD from day one — alongside **electrostatic precipitators (ESPs)** and, in newer or upgraded units, **selective catalytic reduction (SCR)** or low-NOx burner technology to control particulate and nitrogen oxide emissions. **Medupi does not yet have FGD**: Eskom published a draft cost-benefit analysis on retrofitting Medupi with FGD in February 2026, meaning the business case for that retrofit is still under review rather than committed.\n\n**Efficiency retrofits** — boiler and turbine upgrades, improved combustion control, and heat-rate optimisation — offer a lower-cost emissions and cost improvement than new-build capacity, since even modest efficiency gains across a fleet burning over 100 million tonnes of coal annually translate into meaningful reductions in both fuel cost and emissions intensity.\n\n**Carbon capture and storage (CCS)** remains at an early, largely research and feasibility stage for Eskom's coal fleet, coordinated in part through the **South African Centre for Carbon Capture and Storage (SACCCS)**. No commercial-scale capture facility has been built at any Eskom coal station, reflecting both the high capital cost of retrofitting capture technology to an ageing fleet and the broader strategic direction — set out in Eskom's Just Energy Transition plans — toward managed decommissioning of older coal units rather than long-life extension via CCS retrofit.",
            { type: "text", content: "Both Kusile and Medupi are now fully built: Kusile's sixth and final unit entered commercial operation in September 2025 (having been delayed for years by a 2022 flue-duct failure that took earlier units offline), and Medupi's Unit 4 returned to service in mid-2025 following its 2021 boiler explosion. Eskom now manages both stations as operating assets rather than construction projects, though Kusile remains in formal project close-out.", bg: "gray" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. Eskom, [Latest Kusile and Medupi Approved Construction Budgets](https://www.eskom.co.za/latest-kusile-and-medupi-approved-construction-budgets-remain-r160-5-billion-and-r145-billion-with-recorded-expenditure-of-r155-5-billion-and-r131-1-billion-respectively-and-not-r233-4-billion-for-k/).\n2. Ecofin Agency, [Eskom Completes Kusile, Medupi Plants, Adds 9,600 MW to Grid](https://www.ecofinagency.com/news-industry/3009-49148-eskom-completes-kusile-medupi-plants-adds-9-600-mw-to-grid).\n3. Global Energy Monitor, [Medupi Power Station](https://www.gem.wiki/Medupi_power_station) — Unit 4 repair timeline and FGD retrofit cost-benefit analysis.\n4. Daily Investor, [Eskom Spent R432 Billion on Two Power Stations That Are Still Not Finished 18 Years Later](https://dailyinvestor.com/energy/157457/eskom-spent-r432-billion-on-two-power-stations-that-are-still-not-finished-18-years-later/) (29 September 2026) — Kusile project close-out status.",
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
                { label: "Technology & Innovation" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Technology &amp; Innovation</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">CCS, clean-coal technologies, efficiency improvements and R&amp;D.</p>
            </div>

            <EditableSections
                pageKey="ec.eskom-coal.technology-and-innovation"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
