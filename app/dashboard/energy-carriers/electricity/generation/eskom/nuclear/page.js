import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom/nuclear";
const CARDS = [
    { id: "koeberg", href: `${BASE}/koeberg`, title: "Koeberg", desc: "Overview, Unit 1 & Unit 2, COD, installed & sent-out capacity and more.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.eskom.nuclear.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom", href: "/dashboard/energy-carriers/electricity/generation/eskom" },
                { label: "Nuclear" },
            ]}
            label="Eskom Generation"
            title="Eskom — Nuclear"
            description="Nuclear generation units, capacity, stations and dashboards."
            cols={2}
        />
    );
}
