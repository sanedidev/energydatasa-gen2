import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-efficiency";
const CARDS = [
    { id: "tax-incentives",                  href: `${BASE}/tax-incentives`,                  title: "Tax Incentives",                       desc: "Incentive schemes, eligibility and application guidance.",              hidden: false },
    { id: "energy-performance-certificates", href: `${BASE}/energy-performance-certificates`, title: "Energy Performance Certificates",       desc: "EPC requirements, ratings and compliance process.",                    hidden: false },
    { id: "balancing-energy-supply-demand",  href: `${BASE}/balancing-energy-supply-and-demand`, title: "Balancing Energy Supply and Demand", desc: "Demand-side management, DSM programs and planning.",                   hidden: false },
    { id: "standards-and-labelling",         href: `${BASE}/standards-and-labelling`,          title: "Standards & Labelling",                desc: "Minimum performance standards and product labels.",                    hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="energy-efficiency.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Datasets", href: "/dashboard" },
            ]}
            label="Datasets"
            title="Energy Efficiency"
            description="Data on efficiency programmes, standards, and demand management across South Africa."
            cols={2}
        />
    );
}
