import EditableContent from "@/app/components/EditableContent";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom — Oil Generation" };

const ROOT = "/dashboard/energy-carriers";

const DEFAULT_CONTENT = JSON.stringify([
    { type: "title", title: "Oil", subtitle: "Eskom's diesel-fired open-cycle gas turbines" },
    "Eskom's oil-fired generation consists of **open-cycle gas turbines (OCGTs)** — most notably at **Ankerlig** (near Atlantis, Western Cape), **Gourikwa** (near Mossel Bay), and the smaller **Acacia** and **Port Rex** stations — designed to run on diesel and used specifically as **peaking and emergency capacity** rather than for regular baseload supply. OCGTs can start up and reach full output within minutes, making them one of the fastest-responding assets in the fleet, but diesel is by far Eskom's most expensive fuel per unit of electricity generated.\n\nAs a result, OCGT dispatch is generally reserved for periods of severe supply constraint — precisely the conditions associated with load-shedding — meaning their utilisation and associated diesel spend have varied enormously from year to year depending on the reliability of the coal fleet and overall system margin.",
    { type: "text", content: "**OCGT usage has collapsed as the coal fleet has recovered.** Eskom's own reporting puts the OCGT fleet load factor at 17.2% in FY2024, 10.3% in FY2025, and just 3.9% in FY2026 — alongside a reported 62% year-on-year reduction in diesel expenditure for FY2026 (to roughly R6.4 billion), and some mid-2026 reporting periods showing diesel spend down over 80% year-on-year. Load shedding was last implemented in April/May 2025. Treat any specific rand or litre figure as a snapshot rather than a fixed number — Eskom's own disclosures and press coverage of them have disagreed on exact totals, and the utility has publicly corrected at least one media report's figure.", bg: "blue" },
    { type: "title", title: "Sources & References" },
    "1. TimesLIVE, [Eskom Slashes Its Diesel Bill 81% While Fuel Price Spikes](https://www.timeslive.co.za/news/south-africa/2026-09-29-eskom-slashes-its-diesel-bill-81-while-fuel-price-spikes/) (29 September 2026).\n2. Government of South Africa, [Eskom Corrects Materially Inaccurate Reporting on FY2026 Diesel Expenditure by Daily Investor](https://www.gov.za/news/media-statements/eskom-corrects-materially-inaccurate-reporting-fy2026-diesel-expenditure).\n3. Parliamentary Monitoring Group, [Question NW3120 to the Minister of Electricity and Energy](https://pmg.org.za/committee-question/40305/) — Eskom OCGT fleet load factor by financial year.\n4. Eskom, [Stronger Generation Performance Underpins Winter Resilience as Diesel Expenditure Falls 85% and EAF Improves 5.4% Year-on-Year](https://www.eskom.co.za/stronger-generation-performance-underpins-winter-resilience-as-diesel-expenditure-falls-85-and-eaf-improves-5-4-year-on-year/).\n5. IOL, [Eskom Slashes Diesel Costs by R4.88 Billion as South Africa's Grid Stabilises](https://iol.co.za/business/2026-02-17-eskom-slashes-diesel-costs-by-r488-billion-as-south-africas-grid-stabilises/) (17 February 2026).",
]);

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: ROOT },
                { label: "Electricity", href: `${ROOT}/electricity` },
                { label: "Generation", href: `${ROOT}/electricity/generation` },
                { label: "Eskom", href: `${ROOT}/electricity/generation/eskom` },
                { label: "Oil" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Eskom Generation</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Oil</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
                    Eskom&apos;s oil-fired generation units — capacity, fuel usage, operational role, and technology context.
                </p>
            </div>

            <div className="rounded-none bg-white border border-[var(--color-hairline)] p-6">
                <EditableContent
                    slug="ec.electricity.generation.eskom.oil"
                    defaultContent={DEFAULT_CONTENT}
                />
            </div>
        </div>
    );
}
