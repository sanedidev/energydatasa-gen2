import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom/hydro";
const CARDS = [
    { id: "run-off-river",      href: `${BASE}/run-off-river`,      title: "Run-off River",       desc: "Run-of-river schemes, plants, capacities and maps.", hidden: false },
    { id: "water-pump-storage", href: `${BASE}/water-pump-storage`, title: "Water-Pump Storage",  desc: "Pumped-storage schemes, reservoirs and dashboards.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.electricity.generation.eskom.hydro.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom", href: "/dashboard/energy-carriers/electricity/generation/eskom" },
                { label: "Hydro" },
            ]}
            label="Eskom Generation"
            title="Eskom — Hydro"
            description="Hydro generation assets — plants, capacities, maps and dashboards."
            cols={2}
        />
    );
}
