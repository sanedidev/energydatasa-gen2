import EditableSections from "@/app/components/EditableSections";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Standards & Labelling — Energy Efficiency" };

const DEFAULT_SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        defaultContent: JSON.stringify([
            { type: "title", title: "Standards & Labelling", subtitle: "Minimum Energy Performance Standards for appliances" },
            "South Africa regulates appliance efficiency through **compulsory specifications** administered by the **National Regulator for Compulsory Specifications (NRCS)**, under the **National Regulator for Compulsory Specifications Act 5 of 2008**. Three bodies share the framework: the **dtic (Department of Trade, Industry and Competition)** is the policy lead, the **South African Bureau of Standards (SABS)** develops the underlying technical standards, and the **NRCS** enforces them in the market.\n\nThe core instrument for appliances is **VC 9008**, a compulsory specification that sets **Minimum Energy Performance Standards (MEPS)** and mandates energy-efficiency labelling for covered product categories.",
        ]),
    },
    {
        id: "meps",
        label: "Minimum Energy Performance Standards",
        defaultContent: JSON.stringify([
            { type: "title", title: "Minimum Energy Performance Standards", subtitle: "VC 9008" },
            "VC 9008 currently covers, among other categories:\n- **Room air conditioners** (split, portable and window types) up to **7.1 kW (24,000 BTU/h)** cooling capacity — minimum energy performance rating of **Class B**.\n- **Refrigerators and freezers** — mandatory minimum of **Class B**.\n\nThe specification was gazetted with an effective date around **28 November 2014** (the underlying text is dated 7 February 2014 — sources differ slightly on the precise promulgation date, so check the current Government Gazette for the authoritative date). The dtic has signalled an intention to extend compulsory MEPS and labelling to a wider range of household appliances over time, so the covered-category list should be checked against the latest gazette rather than assumed static.",
        ]),
    },
    {
        id: "labelling",
        label: "Energy Labelling",
        defaultContent: JSON.stringify([
            { type: "title", title: "Energy Labelling" },
            "Products covered by VC 9008 must carry a **South African Energy Efficiency Label** at the point of sale, in-store or online, showing the product's energy class on the same **A-to-G-style band** structure used internationally for appliance labelling. The label is mandatory, not voluntary, for every covered category.\n\nSome products additionally require **prior NRCS approval** before they may be sold — formal confirmation by the NRCS that a specific electrical/electronic apparatus type meets the compulsory specification's requirements.",
        ]),
    },
    {
        id: "enforcement",
        label: "Enforcement & Compliance",
        defaultContent: JSON.stringify([
            { type: "title", title: "Enforcement & Compliance" },
            "- **It is illegal to sell non-compliant appliances.** Retailers may not offer for sale any product in a covered category that does not meet the applicable MEPS threshold.\n- **Retailers must display the label.** Every unit sold in-store or online in a covered category must carry the South African Energy Efficiency Label.\n- **NRCS market surveillance** is the primary enforcement mechanism — checking products already on sale against the compulsory specification, backed by the product-approval process for categories that require it.",
            { type: "text", content: "The NRCS Act's compulsory-specification regime means non-compliance is a regulatory and potentially criminal matter, not merely a voluntary-standard shortfall — it sits alongside other compulsory specifications the NRCS enforces across electrical, automotive and other product categories.", bg: "amber" },
        ]),
    },
    {
        id: "datasets",
        label: "Relevant Datasets",
        defaultContent: JSON.stringify([
            { type: "title", title: "Relevant Datasets" },
            "- **NRCS compulsory specification register** — the authoritative list of currently gazetted compulsory specifications, including VC 9008 and its amendments.\n- **CLASP appliance standards database** — an international tracker of appliance MEPS and labelling programmes that includes South Africa's VC 9008 status and history.\n- **SANEDI / Saving Energy project reports** — independent reviews of South Africa's appliance energy classes and MEPS status, useful for tracking how the covered-category list has changed over time.",
        ]),
    },
    {
        id: "sources",
        label: "Sources & References",
        defaultContent: JSON.stringify([
            { type: "title", title: "Sources & References" },
            "1. National Regulator for Compulsory Specifications Act 5 of 2008, [Government Gazette](https://www.gov.za/sites/default/files/gcis_document/201409/37288rg10106gon75.pdf).\n2. SANS Standards, [Compulsory Specifications (VCs)](https://sansstandards.co.za/compulsory-specifications/).\n3. Engineering News, [Labels Help Consumers Reduce Domestic Energy Use](https://www.engineeringnews.co.za/article/labels-help-consumers-reduce-domestic-energy-use-2017-09-15) (15 September 2017).\n4. ESI Africa, [New Regulations on the Cards for Household Electrical Appliances in SA](https://www.esi-africa.com/energy-efficiency/new-regulations-on-the-cards-for-household-electrical-appliances-in-sa/).\n5. Saving Energy (SANEDI-affiliated project), [Review of South Africa's Appliance Energy Classes — Existing MEPS Status Quo Integrated Report](https://www.savingenergy.org.za/wp-content/uploads/2019/07/Existing-MEPS-Status-Quo-Integrated-Report.pdf) (2019).\n6. CLASP, [South Africa Appliance Standards Dataset](https://www.clasp.ngo/wp-content/uploads/2021/01/South-Africa.csv).",
        ]),
    },
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Efficiency & Planning", href: "/dashboard/energy-efficiency-planning" },
                { label: "Standards & Labelling" },
            ]} />

            <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Energy Efficiency &amp; Planning</p>
                <h1 className="text-2xl font-bold text-[var(--color-ink)]">Standards & Labelling</h1>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)] max-w-2xl">
                    Minimum energy performance standards (MEPS) and product labelling requirements for appliances and equipment in South Africa.
                </p>
            </div>

            <EditableSections
                pageKey="ee.standards-and-labelling"
                defaultSections={DEFAULT_SECTIONS}
            />
        </div>
    );
}
