import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom/coal";
const CARDS = [
    { id: "power-generating-stations",   href: `${BASE}/power-generating-stations`,   title: "Power Generating Stations",   desc: "Stations, capacities, COD, maps and dashboards.", hidden: false },
    { id: "coal-information",            href: `${BASE}/coal-information`,            title: "Coal Information",            desc: "Quality, calorific values, composition and logistics.", hidden: false },
    { id: "market-and-trade-information", href: `${BASE}/market-and-trade-information`, title: "Market & Trade Information",  desc: "Imports/exports, prices, contracts and indices.", hidden: false },
    { id: "technology-and-innovation",   href: `${BASE}/technology-and-innovation`,   title: "Technology & Innovation",     desc: "CCS, clean-coal tech, efficiency and R&D.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.eskom.coal.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom", href: "/dashboard/energy-carriers/electricity/generation/eskom" },
                { label: "Coal" },
            ]}
            label="Eskom Generation"
            title="Eskom — Coal"
            description="Coal-fired generation assets, coal supply, market data and technology."
            cols={2}
        />
    );
}
