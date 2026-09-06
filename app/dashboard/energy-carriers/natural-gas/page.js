import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/natural-gas";
const CARDS = [
    { id: "piped", href: `${BASE}/piped`, title: "Piped", desc: "Pipeline routes, supply, downstream demand and contracts.", hidden: false },
    { id: "lng",   href: `${BASE}/lng`,   title: "LNG",   desc: "Terminals, regasification, shipping and pricing references.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.natural-gas.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Natural Gas" },
            ]}
            title="Natural Gas"
            description="Piped gas and LNG options with downstream demand and pricing context."
            cols={2}
        />
    );
}
