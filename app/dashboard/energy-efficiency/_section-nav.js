"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";

const BASE = "/dashboard/energy-efficiency";

const DEFAULT_ITEMS = [
    { id: "tax-incentives",                      label: "Tax Incentives",                   href: `${BASE}/tax-incentives` },
    { id: "energy-performance-certificates",     label: "Energy Performance Certificates",  href: `${BASE}/energy-performance-certificates` },
    { id: "balancing-energy-supply-and-demand",  label: "Balancing Supply & Demand",        href: `${BASE}/balancing-energy-supply-and-demand` },
    { id: "standards-and-labelling",             label: "Standards & Labelling",            href: `${BASE}/standards-and-labelling` },
];

export default function SectionNav() {
    const pathname = usePathname();
    const [items, setItems] = useState(DEFAULT_ITEMS);

    useEffect(() => {
        async function load() {
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: "energy-efficiency.__cards__" }, { authMode: "apiKey" });
                const content = res?.data?.[0]?.content;
                if (content) {
                    const cards = JSON.parse(content);
                    if (Array.isArray(cards) && cards.length > 0) {
                        setItems(
                            cards
                                .filter((c) => !c.hidden)
                                .map((c) => ({ id: c.id, label: c.title, href: c.href ?? `${BASE}/${c.id}` }))
                        );
                    }
                }
            } catch {}
        }
        load();
    }, []);

    return (
        <nav aria-label="Energy Efficiency" className="select-none">
            <div className="mb-3 flex items-center gap-2 px-3">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Energy Efficiency
                </p>
            </div>
            <ul className="space-y-0.5">
                {items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={[
                                    "flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                                    active
                                        ? "bg-green-50 text-green-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                                ].join(" ")}
                            >
                                {active && (
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                )}
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
