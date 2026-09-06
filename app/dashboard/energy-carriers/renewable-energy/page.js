import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/renewable-energy";
const CARDS = [
    { id: "pv",   href: `${BASE}/pv`,   title: "PV",   desc: "Installed capacity, resource, plants, REIPPPP rounds and more.", hidden: false },
    { id: "wind", href: `${BASE}/wind`, title: "Wind", desc: "Capacity, resource maps, projects and operations.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.renewable-energy.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Renewable Energy" },
            ]}
            title="Renewable Energy"
            description="PV, wind and other renewables in South Africa."
            cols={2}
        />
    );
}
