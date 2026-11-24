import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Tax Incentives — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Tax Incentives", subtitle: "Section 12L of the Income Tax Act" },
            "South Africa's main energy-efficiency tax incentive is **Section 12L of the Income Tax Act 58 of 1962**, which gives a taxpayer carrying on a trade an additional tax deduction for verified, measured energy-efficiency savings. It is a performance-based incentive: the deduction is calculated directly from the energy saved (in kWh or kWh-equivalent) rather than from the cost of the equipment installed, and it can be claimed by both owners and lessees of the equipment responsible for the saving.\n\nThe incentive is jointly administered by two bodies with different roles. The **South African National Energy Development Institute (SANEDI)** is the body designated under the Act to evaluate and certify claimed savings; the **South African Revenue Service (SARS)** remains the tax authority that ultimately assesses whether a taxpayer qualifies for the deduction and processes the claim.",
            { type: "text", content: "Section 12L was originally due to expire at the end of 2025. In 2025, National Treasury extended it by a further five years, to **31 December 2030**.", bg: "blue" },
        ]),
    },
    {
        id: "schemes",
        label: "Incentive Schemes",
        defaultContent: JSON.stringify([
            { type: "title", title: "Incentive Schemes", subtitle: "How the Section 12L deduction is calculated" },
            "Section 12L allows a deduction of **95 cents per kilowatt-hour (or kWh-equivalent)** of energy-efficiency savings, verified against a measured baseline. This is the only incentive scheme currently operating under the Act — there is no separate accelerated-depreciation or grant scheme alongside it for energy efficiency specifically (capital allowances for renewable-energy generation assets are dealt with separately, under Section 12B).\n\nThe rate has changed over time: it was originally set at **45c/kWh** for savings realised between November 2013 and February 2015, and was increased to the current **95c/kWh** by the 2015 Taxation Laws Amendment Act, effective for savings from 1 March 2015 onward.",
            { type: "text", content: "Worked example: a verified saving of 1,000,000 kWh in a year of assessment would, at 95c/kWh, generate a **R950,000** additional tax deduction (not a refund — the benefit depends on the taxpayer's marginal tax rate).", bg: "gray" },
        ]),
    },
    {
        id: "eligibility",
        label: "Eligibility Criteria",
        defaultContent: JSON.stringify([
            { type: "title", title: "Eligibility Criteria" },
            "Any person carrying on a trade in South Africa may claim the Section 12L deduction, provided the energy-efficiency saving is:\n- **Measured and verified** against an agreed energy baseline for the relevant performance area, following the SANEDI/SANAS Measurement & Verification (M&V) methodology.\n- **Confirmed by a SANAS-accredited M&V professional**, who signs off the savings report submitted to SANEDI.\n- **Not already claimed** by another taxpayer for the same saving (to prevent double-counting where, for example, a lessor and lessee might otherwise both claim).\n\nOwnership of the energy-efficient equipment itself is not a requirement — a lessee who pays for and benefits from an efficiency upgrade can claim the deduction even if the underlying asset belongs to the lessor.",
        ]),
    },
    {
        id: "application",
        label: "Application Process",
        defaultContent: JSON.stringify([
            { type: "title", title: "Application Process", subtitle: "From baseline to tax return" },
            "1. **Register the project with SANEDI** before or during implementation, so a baseline can be established.\n2. **Engage a SANAS-accredited M&V body** to measure savings against that baseline once the efficiency intervention is in place.\n3. **Submit the M&V report to SANEDI** for review; if accepted, SANEDI issues an official **Section 12L tax certificate** stating the verified savings.\n4. **Submit the certificate to SARS** together with the taxpayer's annual tax return, to claim the additional deduction for that year of assessment.\n\nSARS's **Interpretation Note 95** sets out its detailed interpretation of the section, including how the deduction interacts with other allowances already claimed on the same asset (to avoid double-dipping where, for instance, a capital allowance has already been claimed on energy-efficient equipment).",
        ]),
    },
    {
        id: "case-studies",
        label: "Case Studies",
        defaultContent: JSON.stringify([
            { type: "title", title: "Case Studies" },
            "**Harmony Gold — Tshepong mine, Free State (2017).** Harmony Gold received a Section 12L tax certificate for compressed-air efficiency improvements at its Tshepong gold mine. The application — covering upgrades to compressor operation and control — was compiled on Harmony's behalf by Pretoria-based engineering firm ETA Operations and approved by SANEDI, with a certified value of **R5.7 million**. Compressed air is one of the most common targets for industrial Section 12L claims in South Africa, since compressors are typically oversized, run continuously, and are relatively easy to instrument for M&V purposes.",
            { type: "text", content: "Mining and heavy industry remain the dominant users of Section 12L in South Africa, reflecting both the scale of their energy spend and their ability to fund the upfront M&V and engineering work the claims process requires.", bg: "gray" },
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. South African Revenue Service, [Interpretation Note 95 (Issue 2): Deduction for Energy-Efficiency Savings](https://www.sars.gov.za/wp-content/uploads/Legal/Notes/LAPD-IntR-IN-2017-01-IN95-Deduction-for-energy-efficiency-savings.pdf) (11 January 2019).\n2. Government of South Africa, [Deputy Minister Samantha Graham-Maré on extension of deadline for Section 12L Tax Incentive](https://www.gov.za/news/media-statements/deputy-minister-samantha-graham-mar%C3%A9-extension-deadline-section-12l-tax) (2025).\n3. KPMG, [South Africa: Tax Incentive, Energy Efficiency, Extension](https://kpmg.com/us/en/taxnewsflash/news/2025/11/south-africa-tax-incentive-energy-efficiency-extension.html) (November 2025).\n4. Engineering News / Mining Weekly, [Energy Efficiency Tax Rebate Increased to 95c/kWh](https://www.engineeringnews.co.za/article/energy-efficiency-tax-rebate-increased-to-95ckwh-2016-01-29) (29 January 2016).\n5. Mining Weekly, [Gold Miner Receives Section 12L Tax Incentive for Energy Savings at Tshepong](https://www.miningweekly.com/article/gold-miner-receives-section-12l-tax-incentive-for-energy-savings-at-tshepong-2017-11-24) (24 November 2017).\n6. Mining Weekly, [Section 12L Tax Incentive Powers South Africa's Energy Efficiency Revolution](https://www.miningweekly.com/article/section-12l-tax-incentive-powers-south-africas-energy-efficiency-revolution-2026-02-04) (4 February 2026).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency & Planning", href: "/dashboard/energy-efficiency-planning" },
                { label: "Tax Incentives" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Efficiency &amp; Planning</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Tax Incentives</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-2xl">
                    Incentive schemes, eligibility criteria, and application guidance for energy efficiency improvements in South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ee.tax-incentives"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
