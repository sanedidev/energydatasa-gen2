import EditableSections from "@/app/components/EditableSections";
import EditablePageHeader from "@/app/components/EditablePageHeader";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Current Load Shedding Stage" };

const DEFAULT_SECTIONS = [
    { id: "overview",        label: "Overview" },
    { id: "current-status",  label: "Current Status" },
    { id: "stage-breakdown", label: "Stage Definitions" },
    { id: "trends",          label: "Historical Trends" },
    { id: "visualisations",  label: "Visualisations" },
];

const PLACEHOLDERS = {
    "overview":        "Load shedding is a controlled process used to reduce demand on the national electricity grid when supply is constrained. Stages range from Stage 1 (lowest impact) to Stage 8 (severe impact).",
    "current-status":  "Add the latest officially reported load shedding stage, updated frequency, and source. Describe the current system adequacy context.",
    "stage-breakdown": "Add definitions for each load shedding stage — how many MW of load reduction each represents, typical duration patterns, and which areas are affected.",
    "trends":          "Add historical load shedding data — total hours per year, frequency by stage, and comparison across years since 2008.",
    "visualisations":  "Add charts showing historical load shedding stages over time, frequency heatmaps, and duration summaries.",
};

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Home", href: "/" },
                { label: "Current Load Shedding Stage" },
            ]} />

            <EditablePageHeader
                pageKey="topic.current-load-shedding-stage"
                defaultLabel="Topic"
                defaultTitle="Current Load Shedding Stage"
                defaultDesc="An overview of South Africa's load shedding stages — how they are defined, when implemented, and their impact on electricity supply."
            />

            <EditableSections
                pageKey="topic.current-load-shedding-stage"
                defaultSections={DEFAULT_SECTIONS}
                placeholders={PLACEHOLDERS}
            />
        </div>
    );
}
