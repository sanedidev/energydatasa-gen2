import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/coal";
const CARDS = [
    { id: "coal-information",      href: `${BASE}/coal-information`,        title: "Coal Information",        desc: "Quality, calorific values, composition and logistics.", hidden: false },
    { id: "production-and-mining", href: `${BASE}/production-and-mining`,   title: "Production & Mining",     desc: "Mines, methods, output and remaining life of mines.", hidden: false },
    { id: "market-and-trade",      href: `${BASE}/market-and-trade-information`, title: "Market & Trade Information", desc: "Imports/exports, prices, contracts and indices.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.coal.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Coal" },
            ]}
            title="Coal"
            description="Mining, markets, quality, power stations and emissions context."
            cols={3}
        />
    );
}
