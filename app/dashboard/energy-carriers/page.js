"use client";

// The original app had a separate, near-duplicate ~500-line implementation
// for this root index page instead of reusing CarrierIndexPage (which every
// child page uses). That duplication looks unintentional - functionally
// this page is just another managed card grid - so this rebuild uses
// CarrierIndexPage here too, avoiding a second copy of the same logic.
import CarrierIndexPage from "@/app/components/CarrierIndexPage";

const PAGE_SLUG = "ec.carriers.__cards__";

// Trimmed to the carriers actually built so far (see _nav-data.js). Admins
// can add more via "Add carrier" / "Add file" / "Add link" in edit mode as
// each one gets its own page.js files.
const DEFAULT_CARDS = [
    { id: "coal", href: "/dashboard/energy-carriers/coal", title: "Coal", desc: "Production, mining, markets and power stations.", hidden: false },
];

export default function Page() {
    return (
        <CarrierIndexPage
            pageSlug={PAGE_SLUG}
            defaultCards={DEFAULT_CARDS}
            crumbs={[
                { label: "Datasets", href: "/dashboard" },
                { label: "Energy Carriers" },
            ]}
            title="Energy Carriers"
            description="Browse data across all energy carrier types in South Africa."
            cols={3}
        />
    );
}
