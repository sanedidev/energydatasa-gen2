import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const EE_BASE = "/dashboard/energy-efficiency";
const EP_BASE = "/dashboard/energy-planning";

// Merges the old separate Energy Efficiency and Energy Planning dashboard
// blocks into one - the two were similar enough (both small, flat sets of
// policy/programme pages) that keeping them as separate top-level blocks
// on the Datasets page was mostly just duplication. The 8 pages below still
// live at their original URLs; only the index/listing is combined.
const CARDS = [
    { id: "tax-incentives",                  href: `${EE_BASE}/tax-incentives`,                  title: "Tax Incentives",                       desc: "Incentive schemes, eligibility and application guidance.",              hidden: false },
    { id: "energy-performance-certificates", href: `${EE_BASE}/energy-performance-certificates`, title: "Energy Performance Certificates",       desc: "EPC requirements, ratings and compliance process.",                    hidden: false },
    { id: "balancing-energy-supply-demand",  href: `${EE_BASE}/balancing-energy-supply-and-demand`, title: "Balancing Energy Supply and Demand", desc: "Demand-side management, DSM programs and planning.",                   hidden: false },
    { id: "standards-and-labelling",         href: `${EE_BASE}/standards-and-labelling`,          title: "Standards & Labelling",                desc: "Minimum performance standards and product labels.",                    hidden: false },
    { id: "integrated-resource-plan",  href: `${EP_BASE}/integrated-resource-plan`,  title: "Integrated Resource Plan (IRP)", desc: "Capacity outlooks, technology splits, assumptions and scenarios.",              hidden: false },
    { id: "integrated-energy-plan",    href: `${EP_BASE}/integrated-energy-plan`,    title: "Integrated Energy Plan (IEP)",   desc: "Energy balance, long-term demand drivers and policy pathways.",               hidden: false },
    { id: "gas-master-plan",           href: `${EP_BASE}/gas-master-plan`,           title: "Gas Master Plan",                desc: "Infrastructure, LNG vs piped options, demand outlooks and timelines.",          hidden: false },
    { id: "liquid-fuels-master-plan",  href: `${EP_BASE}/liquid-fuels-master-plan`,  title: "Liquid Fuels Master Plan",       desc: "Refinery/import strategy, specs, logistics and security of supply.",           hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="energy-efficiency-planning.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Datasets", href: "/dashboard" },
            ]}
            label="Datasets"
            title="Energy Efficiency & Planning"
            description="Efficiency programmes, standards and demand management alongside South Africa's long-term planning frameworks."
            cols={3}
        />
    );
}
