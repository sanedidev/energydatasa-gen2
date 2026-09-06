import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/distribution-and-transmission";
const CARDS = [
    { id: "main-transmission", href: `${BASE}/main-transmission`, title: "Main Transmission", desc: "Conductor types, circuit-kilometres by voltage class, and key interconnections across the national grid.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.distribution-and-transmission.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Distribution & Transmission" },
            ]}
            label="Electricity"
            title="Distribution & Transmission"
            description="Grid infrastructure, substations, transmission lines, and distribution networks across South Africa."
            cols={2}
        />
    );
}
