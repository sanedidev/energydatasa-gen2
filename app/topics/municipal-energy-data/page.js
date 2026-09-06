import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Municipalities with Energy Data" };

const DEFAULT_SECTIONS = [
    { id: "overview",      label: "Overview" },
    { id: "data-coverage", label: "Data Coverage" },
    { id: "use-cases",     label: "Use Cases" },
    { id: "key-metrics",   label: "Key Metrics" },
    { id: "visualisations",label: "Visualisations" },
];

const PLACEHOLDERS = {
    "overview":       "Municipal energy data captures how electricity is distributed, consumed, and managed at a local government level — sales, customers, infrastructure, and supply reliability.",
    "data-coverage":  "Add what the datasets cover: electricity sales by customer category, number of connections, municipal electricity revenue, supply areas, distribution responsibilities, and energy losses.",
    "use-cases":      "Add practical applications of this data — local energy planning, infrastructure investment, service delivery monitoring, inter-municipal benchmarking, and regulatory oversight.",
    "key-metrics":    "Add the most important indicators: total electricity sold (GWh), revenue collected (R), non-technical losses (%), number of connected households, and availability metrics.",
    "visualisations": "Add charts showing consumption by municipality, revenue and sales trends, geographic distribution of supply areas, and connection growth over time.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Municipalities with Energy Data" },
            ]} />

            <EditablePageHeader
                pageKey="topic.municipal-energy-data"
                defaultLabel="Topic"
                defaultTitle="Municipalities with Energy Data"
                defaultDesc="Energy data at municipal level — supporting local planning, service delivery analysis, and regional comparisons across South Africa."
            />

            <EditableSections
                pageKey="topic.municipal-energy-data"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
