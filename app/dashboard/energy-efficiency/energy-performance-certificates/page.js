import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Energy Performance Certificates — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Performance Certificates", subtitle: "Mandatory for large non-residential buildings" },
            "An **Energy Performance Certificate (EPC)** states how much energy a building actually uses, measured against a national benchmark for buildings of its type. South Africa's EPC regime was introduced by the **Regulations for the Mandatory Display and Submission of Energy Performance Certificates for Buildings**, made under the **National Energy Act 34 of 2008** and first gazetted in December 2020 (amended in November 2022 and August 2023).\n\nThe regulations apply to non-residential buildings above a floor-area threshold:\n- **Public buildings** — owned, operated or occupied by an organ of state, with a net floor area over **1,000 m²**.\n- **Private buildings** — not owned/operated/occupied by an organ of state, with a net floor area over **2,000 m²**.",
            { type: "text", content: "Non-compliance is a criminal offence under the National Energy Act: Section 20(1) makes it an offence to contravene any provision of the Act, including the duty to publicly display a valid EPC.", bg: "amber" },
        ]),
    },
    {
        id: "ratings",
        label: "Rating System",
        defaultContent: JSON.stringify([
            { type: "title", title: "Rating System", subtitle: "Measured consumption benchmarked against SANS 10400-XA" },
            "An EPC rates a building on an **A–G performance scale**, broadly similar in spirit to appliance energy labels. The rating compares a building's actual, measured annual energy consumption to the maximum energy consumption benchmark set out in **SANS 10400-XA:2021** (the national building regulation covering energy usage in buildings) for that building's category and climate zone — it is a measured, not a modelled or theoretical, rating.\n\nBecause the rating depends on real metered consumption over a full year rather than design intent, two architecturally identical buildings can receive different EPC ratings depending on how they are actually operated and occupied.",
        ]),
    },
    {
        id: "compliance",
        label: "Compliance & Obligations",
        defaultContent: JSON.stringify([
            { type: "title", title: "Compliance & Obligations" },
            "- **Who is responsible:** the building owner carries ultimate responsibility for obtaining and displaying a valid EPC, regardless of who occupies the building.\n- **Where it must be displayed:** a valid EPC must be publicly displayed at the building's entrance.\n- **Validity period:** an EPC is valid for **up to five years** from its date of issue, after which it must be renewed.\n- **Who issues it:** certificates must be issued by an **accredited body** against **SANS 1544:2014**, the national standard for energy performance certification of buildings.\n- **Compliance deadline:** the original registration deadline of 7 December 2022 was extended to **7 December 2025** by the then Department of Mineral Resources and Energy.",
            { type: "text", content: "Enforcement sits across two bodies: compliance monitoring was assigned to the then **Department of Mineral Resources and Energy (DMRE)**, whose electricity-related functions (including the National Energy Act) transferred to the newly-created **Department of Electricity and Energy (DOEE)** from 2024, while **SANEDI** maintains the national register that every issued certificate must be recorded on.", bg: "blue" },
        ]),
    },
    {
        id: "process",
        label: "Assessment Process",
        defaultContent: JSON.stringify([
            { type: "title", title: "Assessment Process" },
            "1. **Metering and data collection** — at least 12 months of actual metered energy consumption data for the building is required before an assessment can be made.\n2. **Assessment against SANS 10400-XA** — an accredited assessor compares that consumption to the relevant benchmark for the building's category and climate zone.\n3. **Certificate issued under SANS 1544** — the accredited body issues the EPC, recording the building's rating.\n4. **Submission to the national register** — a certified copy of the EPC must be submitted to **SANEDI's National Building Energy Performance Register within three months of issue**.\n5. **Public display** — the building owner displays the certificate at the building entrance for its five-year validity period.",
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **SANEDI National Building Energy Performance Register** — the official record of all valid, issued EPCs; the primary dataset for tracking certified-building stock over time.\n- **SANEDI EPC Guideline** — SANEDI's own published guideline document detailing the certification methodology, assessor accreditation requirements, and worked examples.\n- **SANS 10400-XA:2021** — the underlying national building-energy-usage standard against which every EPC rating is benchmarked.\n- **DMRE Energy Performance Certificate guidelines** — the Department's own published guidance for building owners and assessors.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. South African National Energy Development Institute, [Energy Performance Certificates](https://sanedi.org.za/projects/energy-performance-certificates/).\n2. South African National Energy Development Institute, [Energy Performance Certificate Guideline, V3](https://epc.sanedi.org.za/EPC%20Guideline%20_%20V3_September%202024.pdf) (September 2024).\n3. Department of Mineral Resources and Energy, [Energy Performance Certificate Guidelines](https://www.dmre.gov.za/Portals/0/Energy_Website/EEE/Energy-Performance-Certificate-Guidelines.pdf).\n4. BusinessTech, [Building Owners in South Africa Have Five Months to Get a New Certificate — or Face Jail Time and Millions in Fines](https://businesstech.co.za/news/business/832860/building-owners-in-south-africa-have-five-months-to-get-a-new-certificate-or-face-jail-time-and-millions-in-fines/) (2025).\n5. Werksmans Attorneys, [Energy Performance Certificate for Commercial Buildings](https://werksmans.com/energy-performance-certificate-for-commercial-buildings/) — legal updates and opinions.",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency & Planning", href: "/dashboard/energy-efficiency-planning" },
                { label: "Energy Performance Certificates" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Efficiency &amp; Planning</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Energy Performance Certificates (EPC)</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-2xl">
                    EPC requirements, rating methodology, compliance obligations, and the assessment process for buildings in South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ee.energy-performance-certificates"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
