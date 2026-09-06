import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity";
const CARDS = [
    { id: "generation",                href: `${BASE}/generation`,                  title: "Generation",                desc: "Utility & IPP generation, fuel mix, capacity and plants.", hidden: false },
    { id: "distribution-transmission", href: `${BASE}/distribution-and-transmission`, title: "Distribution & Transmission", desc: "Grids, substations, line km by voltage and transmission maps.", hidden: false },
    { id: "demand",                    href: `${BASE}/demand`,                      title: "Demand",                    desc: "Consumption (MWh), peak demand (MW), hourly profiles and sector breakdowns.", hidden: false },
    { id: "market-and-pricing",        href: `${BASE}/market-and-pricing`,          title: "Market & Pricing",          desc: "Tariffs per sector, MYPD history and pricing dashboards.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity" },
            ]}
            title="Electricity"
            description="Generation, transmission, distribution, demand, pricing and market structures."
            cols={2}
        />
    );
}
