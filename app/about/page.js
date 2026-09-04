import { PageEditModeProvider } from "@/app/context/pageEditMode";
import Breadcrumbs from "@/app/components/breadcrumbs";
import EditableSections from "@/app/components/EditableSections";

const DEFAULT_SECTIONS = [
    {
        id: "hero",
        label: "Hero",
        defaultContent: "# About Energy Data SA\n\nA South African open-data initiative for energy evidence, transparency, and innovation — advancing access to affordable, reliable, and sustainable energy for all.",
    },
    {
        id: "mission",
        label: "Our Mission",
        defaultContent: "## What is Energy Data SA?\n\n**Energy Data SA** is an open-data platform focused on the South African energy ecosystem. We curate and publish datasets and simple analytics that support planning, operations, and research across the electricity, clean cooking, and broader energy sectors. Our goal is to help the country advance towards Sustainable Development Goal 7: access to affordable, reliable, sustainable, and modern energy for all.\n\nThe platform is a public good for South African institutions — national and provincial departments, municipalities, regulators, SOEs and utilities, private companies, academic groups, non-profits, and citizens. Where possible, datasets are sourced from public releases or shared directly by data owners and research teams.",
    },
    {
        id: "getting-started",
        label: "Getting Started",
        defaultContent: "## Getting Started\n\nThe **Get Started** guide gives a quick tour of Energy Data SA — how to search, filter, and download datasets; how to preview files and APIs; and how to embed simple charts on your own pages. Whether you are a municipal analyst, an NGO, a student, or a founder, you can use the platform to discover and reuse South African energy data in minutes.",
    },
    {
        id: "open-data",
        label: "Open Data & Open Source",
        defaultContent: "## Open Data & Open Source\n\nMost content is published under CC BY 4.0 — free to reuse, including commercially, with attribution. We publish open file formats, documented APIs, and reproducible workflows so data can be checked, cited, and improved.",
    },
    {
        id: "collaboration",
        label: "Collaboration",
        defaultContent: "## Collaboration\n\nWe collaborate with data providers and users to publish more datasets, dashboards, and tools that serve South African priorities — grid reliability, clean energy transitions, universal access, and climate resilience.",
    },
    {
        id: "technology",
        label: "Technology",
        defaultContent: "## Technology\n\nEnergy Data SA runs on open-source tooling. Our catalog and APIs are compatible with CKAN, and our front-end is built with modern open-source frameworks. We publish code, notebooks, and ETL pipelines on GitHub to make validation and reuse easy.",
    },
    {
        id: "free-access",
        label: "Free Access",
        defaultContent: "## Free Access\n\nAccess to data on this site is free of charge, subject to the Terms of Use and the original licenses provided by data owners. Where a dataset carries a more restrictive license, those terms supersede the default.",
    },
    {
        id: "contact",
        label: "Get in Touch",
        defaultContent: "## Want to contribute or collaborate?\n\nIf you would like to contribute data, co-develop a visualization, or request a dataset, we'd love to hear from you. Contact us at hello@energydatasa.org",
    },
    {
        id: "map-disclaimer",
        label: "Map Disclaimer",
        defaultContent: "## Map Disclaimer\n\nAdministrative boundaries, names, and any other geographic information shown on this site (e.g., national, provincial, district, or municipal layers) are for informational purposes only. They do not imply any judgment on legal status or boundary delimitation.",
    },
    {
        id: "terms-of-use",
        label: "Terms of Use",
        defaultContent: "## Terms of Use\n\nYou are encouraged to use and share content on Energy Data SA to benefit South Africa and beyond. Unless otherwise noted, content is licensed under Creative Commons Attribution 4.0 (CC BY 4.0). Some datasets may carry different licenses or additional terms set by original data owners. By using this site you agree to respect those licenses and our Terms of Use. Please read the relevant license and terms before using any dataset or resource.",
    },
];

export const metadata = { title: "About" };

export default function About() {
    return (
        <PageEditModeProvider>
            <main>
                <div className="mx-auto max-w-4xl px-4 md:px-6 pt-5">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "About" },
                        ]}
                    />
                </div>

                <div className="mx-auto max-w-4xl px-4 md:px-6 py-10">
                    <div className="mb-8">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-600">About</p>
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Energy Data SA</h1>
                    </div>

                    <EditableSections
                        pageKey="about"
                        defaultSections={DEFAULT_SECTIONS}
                    />
                </div>
            </main>
        </PageEditModeProvider>
    );
}
