"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";

const BASE = "/dashboard/energy-planning";

const DEFAULT_ITEMS = [
    { id: "integrated-resource-plan",  label: "Integrated Resource Plan",  href: `${BASE}/integrated-resource-plan` },
    { id: "integrated-energy-plan",    label: "Integrated Energy Plan",    href: `${BASE}/integrated-energy-plan` },
    { id: "gas-master-plan",           label: "Gas Master Plan",           href: `${BASE}/gas-master-plan` },
    { id: "liquid-fuels-master-plan",  label: "Liquid Fuels Master Plan",  href: `${BASE}/liquid-fuels-master-plan` },
];

export default function SectionNav() {
    const pathname = usePathname();
    const [items, setItems] = useState(DEFAULT_ITEMS);

    useEffect(() => {
        async function load() {
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: "energy-planning.__cards__" }, { authMode: "apiKey" });
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
        <nav aria-label="Energy Planning" className="select-none">
            <div className="mb-3 flex items-center gap-2 px-3">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Energy Planning
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
