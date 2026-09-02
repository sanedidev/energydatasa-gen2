import EditablePageHeader from "@/app/components/EditablePageHeader";
import PageBody from "@/app/components/PageBody";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "CO₂ Emissions (Energy Sector)" };

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "CO₂ Emissions (Energy Sector)" },
            ]} />

            <EditablePageHeader
                pageKey="topic.co2-emissions-energy-sector"
                defaultLabel="Topic"
                defaultTitle="CO₂ Emissions (Energy Sector)"
                defaultDesc="Carbon dioxide emissions from electricity generation, fuel combustion, and other energy-related activities in South Africa."
            />

            <PageBody
                pageKey="topic.co2-emissions-energy-sector.__body__"
                placeholder="Add content about CO₂ emissions from South Africa's energy sector: key sources, the carbon tax, NDC targets, and related datasets."
            />
        </div>
    );
}
