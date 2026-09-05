import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const BASE = "/dashboard/energy-planning";
const CARDS = [
    { id: "integrated-resource-plan",  href: `${BASE}/integrated-resource-plan`,  title: "Integrated Resource Plan (IRP)", desc: "Capacity outlooks, technology splits, assumptions and scenarios.",              hidden: false },
    { id: "integrated-energy-plan",    href: `${BASE}/integrated-energy-plan`,    title: "Integrated Energy Plan (IEP)",   desc: "Energy balance, long-term demand drivers and policy pathways.",               hidden: false },
    { id: "gas-master-plan",           href: `${BASE}/gas-master-plan`,           title: "Gas Master Plan",                desc: "Infrastructure, LNG vs piped options, demand outlooks and timelines.",          hidden: false },
    { id: "liquid-fuels-master-plan",  href: `${BASE}/liquid-fuels-master-plan`,  title: "Liquid Fuels Master Plan",       desc: "Refinery/import strategy, specs, logistics and security of supply.",           hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug="energy-planning.__cards__"
            defaultCards={CARDS}
            crumbs={[
                { label: "Datasets", href: "/dashboard" },
            ]}
            label="Datasets"
            title="Energy Planning"
            description="Long-term planning frameworks and integrated resource strategies for South Africa."
            cols={2}
        />
    );
}
