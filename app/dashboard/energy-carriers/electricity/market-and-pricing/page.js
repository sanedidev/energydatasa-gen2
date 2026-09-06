import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/market-and-pricing";
const CARDS = [
    { id: "tariffs-per-sector",    href: `${BASE}/tariffs-per-sector-over-time`,    title: "Tariffs Per Sector Over Time",   desc: "Historical electricity tariff trends broken down by consumer sector and tariff category.", hidden: false },
    { id: "multi-year-price-determination", href: `${BASE}/multi-year-price-determination`, title: "Multi-Year Price Determination", desc: "NERSA MYPD cycles, approved tariff increases, and regulatory process outcomes.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.market-and-pricing.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Market & Pricing" },
            ]}
            label="Electricity"
            title="Market & Pricing"
            description="Tariff structures, price determinations, and electricity market context for South Africa."
            cols={2}
        />
    );
}
