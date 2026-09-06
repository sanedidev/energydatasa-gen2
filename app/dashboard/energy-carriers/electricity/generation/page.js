import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation";
const CARDS = [
    { id: "eskom",   href: `${BASE}/eskom`,   title: "Eskom",   desc: "Coal, nuclear, oil and hydro generation assets.", hidden: false },
    { id: "private", href: `${BASE}/private`, title: "Private", desc: "Independent power producers and private generation.", hidden: false },
    { id: "non-eskom", href: `${BASE}/non-eskom`, title: "Non-Eskom", desc: "Municipal and other non-Eskom generation.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation" },
            ]}
            label="Electricity"
            title="Generation"
            description="Utility and IPP generation — fuel mix, installed capacity and plant data."
            cols={3}
        />
    );
}
