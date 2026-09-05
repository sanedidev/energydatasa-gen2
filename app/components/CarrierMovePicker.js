"use client";

/**
 * CarrierMovePicker — pick a destination folder (carrier) to move a card
 * into, directly from the card being moved (rather than having to go to
 * the destination and search for the source item via CarrierPicker).
 *
 * Props:
 *   card          – the card being moved: { id, title, desc, href }
 *   sectionConfig – which subsystem's tree to search (Energy Carriers,
 *                   Energy Efficiency, Energy Planning). Defaults to
 *                   Energy Carriers if omitted. See CarrierPicker.js for
 *                   the shape (base, rootCardsSlug, sectionPathKey,
 *                   staticItems, staticCarriers).
 *   onCancel      – called to close without moving
 *   onMoved()     – called after the card has been added to the
 *                   destination's cards record; the caller is responsible
 *                   for removing it from the current location (it already
 *                   has `cards`/`persist` in scope, this component only
 *                   touches the destination).
 */

import { useState, useEffect, useRef } from "react";
import { apiClient as client } from "@/app/lib/apiClient";
import { buildDynamicItems, DEFAULT_SECTION_CONFIG } from "./CarrierPicker";
import ConfirmDialog from "./ui/ConfirmDialog";

function FolderIcon() {
    return (
        <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    );
}

export default function CarrierMovePicker({ card, sectionConfig = DEFAULT_SECTION_CONFIG, onCancel, onMoved }) {
    const [query, setQuery] = useState("");
    const [dynTargets, setDynTargets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [target, setTarget] = useState(null); // selected destination, pending confirm
    const [moving, setMoving] = useState(false);
    const [error, setError] = useState("");
    const searchRef = useRef(null);

    useEffect(() => { searchRef.current?.focus(); }, []);

    useEffect(() => {
        function load() {
            buildDynamicItems(sectionConfig).then((items) => {
                const carriers = items
                    .filter((i) => i.type === "carrier")
                    .map((i) => {
                        const rel = i.href.replace(`${sectionConfig.base}/`, "");
                        return {
                            href: i.href,
                            label: i.label,
                            path: i.path,
                            cardsSlug: `dyn.cards.${sectionConfig.sectionPathKey}.${rel.replace(/\//g, ".")}`,
                            defaultCards: [],
                        };
                    });
                setDynTargets(carriers);
                setLoading(false);
            });
        }
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sectionConfig.rootCardsSlug]);

    const staticCarriers = sectionConfig.staticCarriers ?? [];
    const allTargets = [...staticCarriers, ...dynTargets].filter((t) => t.href !== card.href);
    const q = query.trim().toLowerCase();
    const filtered = allTargets.filter((t) => !q || t.label.toLowerCase().includes(q));

    async function handleConfirmMove() {
        setMoving(true);
        setError("");
        try {
            const res = await client.models.PageContent.pageContentBySlug({ slug: target.cardsSlug }, { authMode: "apiKey" });
            const record = res?.data?.[0] ?? null;
            let destCards = target.defaultCards;
            if (record?.content) {
                try {
                    const parsed = JSON.parse(record.content);
                    if (Array.isArray(parsed)) destCards = parsed;
                } catch {}
            }
            if (destCards.some((c) => c.href === card.href)) {
                setError(`"${card.title}" is already in "${target.label}".`);
                setMoving(false);
                return;
            }
            const updated = [...destCards, { id: card.id, title: card.title, desc: card.desc, href: card.href, hidden: false }];
            const content = JSON.stringify(updated);
            if (record) {
                await client.models.PageContent.update({ id: record.id, content });
            } else {
                await client.models.PageContent.create({ slug: target.cardsSlug, content });
            }
            onMoved();
        } catch (e) {
            console.error(e);
            setError("Failed to move. Please try again.");
            setMoving(false);
        }
    }

    if (target) {
        return (
            <ConfirmDialog
                title={`Move "${card.title}" here?`}
                message={`This moves "${card.title}" into "${target.label}". It will no longer appear in its current location.${error ? ` ${error}` : ""}`}
                confirmLabel={moving ? "Moving…" : "Yes, move"}
                onConfirm={handleConfirmMove}
                onCancel={() => { setTarget(null); setError(""); }}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-20">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 flex flex-col max-h-[70vh]">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        ref={searchRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Move "${card.title}" to…`}
                        className="flex-1 text-sm text-slate-900 placeholder-slate-400 outline-none bg-transparent"
                    />
                    {loading && <span className="text-[10px] text-slate-400 animate-pulse shrink-0">Loading…</span>}
                    <button onClick={onCancel} className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Close">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <ul className="flex-1 overflow-y-auto divide-y divide-slate-50 py-1">
                    {filtered.length === 0 && (
                        <li className="px-4 py-8 text-center text-sm text-slate-400">{q ? "No matches found." : "No folders available."}</li>
                    )}
                    {filtered.map((t) => (
                        <li key={t.href}>
                            <button type="button" onClick={() => setTarget(t)}
                                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors group">
                                <span className="mt-0.5"><FolderIcon /></span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 group-hover:text-green-700 transition-colors truncate">{t.label}</p>
                                    {t.path && <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.path.slice(0, -1).join(" / ")}</p>}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>

                <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">{filtered.length} folder{filtered.length !== 1 ? "s" : ""}{q ? " found" : ""}</p>
                    <button onClick={onCancel} className="text-xs text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
}
