import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom/coal/coal-information";
const CARDS = [
    { id: "production-and-mining", href: `${BASE}/production-and-mining`, title: "Production & Mining", desc: "Mining methods, volumes, mine ownership, coal quality specs, calorific values, and supply logistics.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.eskom.coal.coal-information.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom", href: "/dashboard/energy-carriers/electricity/generation/eskom" },
                { label: "Coal", href: "/dashboard/energy-carriers/electricity/generation/eskom/coal" },
                { label: "Coal Information" },
            ]}
            label="Eskom Coal"
            title="Coal Information"
            description="Quality specifications, composition, logistics, and supply-chain details for Eskom's coal feedstock."
            cols={2}
        />
    );
}
