import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-carriers/oil";
const CARDS = [
    { id: "technology-and-innovation", href: `${BASE}/technology-and-innovation`, title: "Technology & Innovation", desc: "Refining tech, fuel specs, efficiency, R&D and policy updates.", hidden: false },
    { id: "ccs-and-clean-coal-tech",   href: `${BASE}/ccs-and-clean-coal-tech`,   title: "CCS & Clean Coal Tech",   desc: "Carbon capture, utilization & storage and related standards.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="ec.oil.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Oil" },
            ]}
            title="Oil"
            description="Supply chain, refining, imports/exports and pricing frameworks."
            cols={2}
        />
    );
}
