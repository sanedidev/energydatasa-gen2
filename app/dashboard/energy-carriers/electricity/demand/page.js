import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/demand";
const CARDS = [
    { id: "consumption-mwh", href: `${BASE}/electricity-consumption-mwh`, title: "Electricity Consumption (MWh)", desc: "Historical and current electricity consumption by sector, region, and consumer type.", hidden: false },
    { id: "peak-demand-mw",  href: `${BASE}/peak-demand-mw`,              title: "Peak Demand (MW)",             desc: "Annual and seasonal peak demand trends, records, and system stress indicators.", hidden: false },
    { id: "hourly-profiles", href: `${BASE}/hourly-profiles`,             title: "Hourly Profiles",              desc: "Typical daily and weekly load profiles across seasons and consumer segments.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.demand.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Demand" },
            ]}
            label="Electricity"
            title="Demand"
            description="Consumption volumes, peak demand metrics, and load profiles for South Africa."
            cols={3}
        />
    );
}
