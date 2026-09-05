"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiClient as client } from "@/app/lib/apiClient";
import { BASE, STATIC_NAV } from "./_nav-data";


const STATIC_HREFS = new Set(STATIC_NAV.map((n) => n.href));

async function fetchDynCards(slug) {
    try {
        const res = await client.models.PageContent.pageContentBySlug({ slug }, { authMode: "apiKey" });
        const content = res?.data?.[0]?.content;
        if (content) {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) return parsed.filter((c) => !c.hidden);
        }
    } catch {}
    return [];
}

function Item({ node, depth = 0, dynChildMap }) {
    const pathname = usePathname();
    const active = pathname === node.href || pathname.startsWith(node.href + "/");
    const expanded = active;

    const staticChildren = node.children ?? [];
    const dynChildren = (dynChildMap[node.href] ?? []).map((c) => ({ label: c.label, href: c.href }));
    const staticHrefSet = new Set(staticChildren.map((c) => c.href));
    const allChildren = [...staticChildren, ...dynChildren.filter((c) => !staticHrefSet.has(c.href))];

    return (
        <li>
            <Link
                href={node.href}
                className={[
                    "flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                    depth > 0 ? "ml-2" : "",
                    active
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                ].join(" ")}
            >
                {active && depth === 0 && (
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                )}
                {node.label}
            </Link>

            {expanded && allChildren.length > 0 ? (
                <div className={[
                    "mt-0.5 ml-2 pl-3 border-l",
                    active ? "border-green-200" : "border-slate-100",
                ].join(" ")}>
                    <ul className="space-y-0.5 py-1">
                        {allChildren.map((child) => (
                            <Item key={child.href} node={child} depth={depth + 1} dynChildMap={dynChildMap} />
                        ))}
                    </ul>
                </div>
            ) : null}
        </li>
    );
}

export default function SectionNav() {
    const pathname = usePathname();
    const [dynExtras, setDynExtras] = useState([]);
    const [dynChildMap, setDynChildMap] = useState({});

    // Fetch root dynamic items (cards not already in the static NAV)
    useEffect(() => {
        fetchDynCards("ec.carriers.__cards__").then((cards) => {
            const extras = cards
                .filter((c) => {
                    const href = c.href ?? `${BASE}/${c.id}`;
                    return !STATIC_HREFS.has(href);
                })
                .map((c) => ({ label: c.title, href: c.href ?? `${BASE}/${c.id}` }));
            setDynExtras(extras);
        });
    }, []);

    // When the active path changes, fetch children for each dynamic segment along the path
    useEffect(() => {
        let cancelled = false;
        async function loadPath() {
            if (!pathname.startsWith(BASE + "/")) {
                if (!cancelled) setDynChildMap({});
                return;
            }
            const rel = pathname.slice(BASE.length + 1);
            const segs = rel.split("/").filter(Boolean);
            const map = {};
            for (let i = 0; i < segs.length; i++) {
                const pathKey = segs.slice(0, i + 1).join(".");
                const cardsSlug = `dyn.cards.dashboard.energy-carriers.${pathKey}`;
                const cards = await fetchDynCards(cardsSlug);
                if (cancelled) return;
                if (cards.length > 0) {
                    const parentHref = `${BASE}/${segs.slice(0, i + 1).join("/")}`;
                    map[parentHref] = cards.map((c) => ({
                        label: c.title,
                        href: c.href ?? `${parentHref}/${c.id}`,
                    }));
                }
            }
            if (!cancelled) setDynChildMap(map);
        }
        loadPath();
        return () => { cancelled = true; };
    }, [pathname]);

    const allNodes = [...STATIC_NAV, ...dynExtras];

    return (
        <nav aria-label="Energy Carriers" className="select-none">
            <div className="mb-3 flex items-center gap-2 px-3">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Energy Carriers
                </p>
            </div>

            <ul className="space-y-0.5">
                {allNodes.map((node) => (
                    <Item key={node.href} node={node} dynChildMap={dynChildMap} />
                ))}
            </ul>
        </nav>
    );
}
