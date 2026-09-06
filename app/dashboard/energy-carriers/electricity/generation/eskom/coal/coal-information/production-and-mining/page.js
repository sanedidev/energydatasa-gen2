import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom/coal/coal-information/production-and-mining";
const CARDS = [
    { id: "underground", href: `${BASE}/underground`, title: "Underground", desc: "Underground mining methods, seam data, tonnes produced, energy content, and mineral composition.", hidden: false },
    { id: "overcast",    href: `${BASE}/overcast`,    title: "Overcast",    desc: "Opencast / overcast mining operations, volumes, quality characteristics, and life-of-mine projections.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.eskom.coal.coal-information.production-and-mining.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom", href: "/dashboard/energy-carriers/electricity/generation/eskom" },
                { label: "Coal", href: "/dashboard/energy-carriers/electricity/generation/eskom/coal" },
                { label: "Coal Information", href: "/dashboard/energy-carriers/electricity/generation/eskom/coal/coal-information" },
                { label: "Production & Mining" },
            ]}
            label="Coal Information"
            title="Production & Mining"
            description="Mining methods, volumes, mine ownership, supply contracts, and coal quality for Eskom's feedstock."
            cols={2}
        />
    );
}
