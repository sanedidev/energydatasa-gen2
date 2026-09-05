"use client";

import { use as usePromise, useEffect, useState } from "react";
import Link from "next/link";
import { apiClient as client } from "@/app/lib/apiClient";
import CarrierIndexPage from "@/app/components/CarrierIndexPage";
import EditableSections from "@/app/components/EditableSections";


export default function DynamicEnergyEfficiencyPage({ params }) {
    const { slug } = usePromise(params);
    const slugPath = slug.join(".");
    const nodeConfigSlug = `dyn.node.dashboard.energy-efficiency.${slugPath}`;

    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: nodeConfigSlug }, { authMode: "apiKey" });
                const item = res?.data?.[0] ?? null;
                if (!cancelled && item?.content) {
                    setConfig(JSON.parse(item.content));
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [nodeConfigSlug]);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-4 w-1/3 rounded-full bg-slate-100" />
                <div className="h-8 w-1/2 rounded-full bg-slate-100" />
                <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-slate-100" />)}
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="py-16 text-center">
                <p className="text-slate-500 text-sm">Page not found.</p>
                <Link href="/dashboard/energy-efficiency" className="mt-4 inline-block text-sm text-green-700 hover:underline">
                    ← Back to Energy Efficiency
                </Link>
            </div>
        );
    }

    const crumbs = config.crumbs ?? [
        { label: "Datasets", href: "/dashboard" },
        { label: "Energy Efficiency", href: "/dashboard/energy-efficiency" },
        { label: config.title },
    ];

    if (config.type === "carrier") {
        return (
            <CarrierIndexPage
                pageSlug={`dyn.cards.dashboard.energy-efficiency.${slugPath}`}
                defaultCards={[]}
                crumbs={crumbs}
                label="Datasets"
                title={config.title}
                description={config.desc}
                cols={2}
            />
        );
    }

    if (config.type === "file") {
        return (
            <div className="space-y-8">
                <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-sm">
                    {crumbs.map((c, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            {i > 0 && <span className="text-slate-300">/</span>}
                            {c.href
                                ? <Link href={c.href} className="text-slate-500 hover:text-slate-900 transition-colors">{c.label}</Link>
                                : <span className="font-medium text-slate-900">{c.label}</span>}
                        </span>
                    ))}
                </nav>
                <EditableSections
                    pageKey={`dyn.file.dashboard.energy-efficiency.${slugPath}`}
                    defaultSections={[{ id: "overview", label: "Overview" }]}
                    placeholders={{ overview: "Add content for this section." }}
                />
            </div>
        );
    }

    return <div className="py-8 text-slate-500 text-sm text-center">Unknown page type.</div>;
}
