import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom";
const CARDS = [
    { id: "coal",    href: `${BASE}/coal`,    title: "Coal",    desc: "Power stations, coal information, market and technology.", hidden: false },
    { id: "nuclear", href: `${BASE}/nuclear`, title: "Nuclear", desc: "Koeberg nuclear power station units and capacity.", hidden: false },
    { id: "oil",     href: `${BASE}/oil`,     title: "Oil",     desc: "Open-cycle gas turbines and oil-fired generation.", hidden: false },
    { id: "hydro",   href: `${BASE}/hydro`,   title: "Hydro",   desc: "Run-of-river and pumped-storage schemes.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.eskom.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom" },
            ]}
            label="Generation"
            title="Eskom Generation"
            description="Browse Eskom generation assets by fuel type."
            cols={4}
        />
    );
}
