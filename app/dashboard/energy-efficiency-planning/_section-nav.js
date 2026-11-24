"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import { STATIC_NAV } from "./_nav-data";

const DEFAULT_ITEMS = STATIC_NAV.map((n) => ({ id: n.href, label: n.label, href: n.href }));

// Shared sidebar for the merged Energy Efficiency & Planning section -
// rendered by both the old /energy-efficiency and /energy-planning layouts
// (whose own pages still live at their original URLs) and the new merged
// /energy-efficiency-planning layout, so the same 8-item nav shows up
// wherever you are in either family.
export default function SectionNav() {
    const pathname = usePathname();
    const [items, setItems] = useState(DEFAULT_ITEMS);

    useEffect(() => {
        async function load() {
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: "energy-efficiency-planning.__cards__" }, { authMode: "apiKey" });
                const content = res?.data?.[0]?.content;
                if (content) {
                    const cards = JSON.parse(content);
                    if (Array.isArray(cards) && cards.length > 0) {
                        setItems(
                            cards
                                .filter((c) => !c.hidden)
                                .map((c) => ({ id: c.id, label: c.title, href: c.href }))
                        );
                    }
                }
            } catch {}
        }
        load();
    }, []);

    return (
        <nav aria-label="Energy Efficiency & Planning" className="select-none">
            <div className="mb-3 flex items-center gap-2 px-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]/70" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]/70">
                    Energy Efficiency &amp; Planning
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
                                    "flex items-center rounded-none px-3 py-1.5 text-sm transition-colors",
                                    active
                                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-medium"
                                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)]",
                                ].join(" ")}
                            >
                                {active && (
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
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
