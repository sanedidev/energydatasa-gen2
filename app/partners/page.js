"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiClient as client } from "@/app/lib/apiClient";
import DragHandleIcon from "@/app/components/ui/DragHandle";
import { usePermissions } from "@/app/context/permissions";
import Breadcrumbs from "@/app/components/breadcrumbs";
import MediaLibrary from "@/app/components/MediaLibrary";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import HeroSection from "@/app/components/ui/HeroSection";
import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";

const SLUG = "partners.__cards__";

export const DEFAULT_PARTNERS = [
    {
        id: "sanedi",
        name: "Sanedi",
        type: "Clean Energy",
        site: "https://sanedi.org.za/",
        blurb: "SANEDi's focus is mainly developing innovative, integrated clean energy and resource efficient solutions that aim to catalyse growth and prosperity.",
        logo: "/icons/Sanedi-logo.png",
        hidden: false,
    },
    {
        id: "dee",
        name: "Department of Electricity and Energy (DEE)",
        type: "Energy & Electricity",
        site: "https://nationalgovernment.co.za/units/view/456/department-of-electricity-and-energy-dee",
        blurb: "The Department of Electricity and Energy (DEE) is to be a leader in the transformation of South Africa through economic growth and sustainable development in the energy sector.",
        logo: "/icons/DEE-logo.png",
        hidden: false,
    },
    {
        id: "eskom",
        name: "Eskom Holdings SOC Ltd",
        type: "Utility",
        site: "https://www.eskom.co.za/",
        blurb: "South Africa's national electricity utility and grid operator.",
        logo: "/icons/eskom-icon.png",
        hidden: false,
    },
    {
        id: "up",
        name: "The University of Pretoria",
        type: "Institution",
        site: "https://www.up.ac.za/",
        blurb: "The University of Pretoria (UP) is one of Africa's top universities and the largest contact university in South Africa.",
        logo: "/icons/up-logo.png",
        hidden: false,
    },
];

const AVATAR_COLOR = "from-slate-600 to-slate-800";

function initials(name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last  = parts[parts.length - 1]?.[0] ?? "";
    return (first + last).toUpperCase().slice(0, 2);
}

function slugify(str) {
    return str.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function parsePartners(raw) {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
    return null;
}

// Static /icons/* logos (the seeded defaults) resolve synchronously; any
// logo picked via the media library is a Storage key needing a signed URL.
function useLogoUrl(logo) {
    const isStatic = !!logo && logo.startsWith("/");
    const resolved = useResolvedImageUrl(isStatic ? null : logo);
    return isStatic ? logo : resolved;
}

// ── Drag handle ───────────────────────────────────────────────────────────────
function DragHandle({ onMouseDown, onMouseUp }) {
    return (
        <div
            title="Drag to reorder"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors p-1"
        >
            <DragHandleIcon />
        </div>
    );
}

// ── Edit / Add form modal ─────────────────────────────────────────────────────
function PartnerFormModal({ form, onChange, onSave, onCancel, onPickLogo, isNew, saving }) {
    const logoUrl = useLogoUrl(form.logo);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 my-8">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{isNew ? "Add partner" : "Edit partner"}</p>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {/* Logo */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Logo</label>
                        <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-50 ring-1 ring-slate-100 flex items-center justify-center overflow-hidden">
                                {logoUrl ? (
                                    <Image src={logoUrl} alt="logo" width={40} height={40} className="object-contain" unoptimized={!logoUrl.startsWith("/")} />
                                ) : (
                                    <svg className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                                    </svg>
                                )}
                            </div>
                            <button type="button" onClick={onPickLogo}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                {form.logo ? "Change logo" : "Choose from media library"}
                            </button>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Name <span className="text-red-400">*</span></label>
                        <input type="text" value={form.name} onChange={(e) => onChange("name", e.target.value)}
                            placeholder="e.g. Eskom Holdings SOC Ltd"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400" />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Type / Category</label>
                        <input type="text" value={form.type} onChange={(e) => onChange("type", e.target.value)}
                            placeholder="e.g. Clean Energy, Utility, Institution…"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400" />
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Website URL</label>
                        <input type="url" value={form.site} onChange={(e) => onChange("site", e.target.value)}
                            placeholder="https://example.org"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400" />
                    </div>

                    {/* Blurb */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                        <textarea value={form.blurb} onChange={(e) => onChange("blurb", e.target.value)}
                            rows={3}
                            placeholder="Short description of the partner…"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-y" />
                    </div>
                </div>
                <div className="flex gap-2 px-6 py-4 border-t border-slate-100">
                    <button type="button" onClick={onSave} disabled={!form.name.trim() || saving}
                        className="rounded-xl bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50 transition-all">
                        {saving ? "Saving…" : isNew ? "Add partner" : "Save changes"}
                    </button>
                    <button type="button" onClick={onCancel} disabled={saving}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Partner card ───────────────────────────────────────────────────────────────
function PartnerCard({ p, i, managing, isDragging, isDragOver, draggable, onDragStart, onDragOver, onDrop, onDragEnd, onDragHandleDown, onDragHandleUp, onChangeLogo, onEdit, onToggleHide, onDelete }) {
    const logoUrl = useLogoUrl(p.logo);
    const isHidden = !!p.hidden;

    return (
        <div
            draggable={managing && draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`group relative flex flex-col rounded-2xl bg-white ring-1 shadow-sm transition-all
                ${isHidden ? "opacity-40" : ""}
                ${isDragging  ? "opacity-50 scale-[0.98]" : ""}
                ${isDragOver  ? "ring-2 ring-green-400 shadow-md" : "ring-slate-100"}
                ${managing    ? "ring-2 ring-dashed ring-slate-200" : "hover:-translate-y-0.5 hover:shadow-md"}
            `}
        >
            {managing && (
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                    <DragHandle onMouseDown={onDragHandleDown} onMouseUp={onDragHandleUp} />
                    <div className="flex items-center gap-1">
                        <button type="button" onClick={onChangeLogo} title="Change logo"
                            className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                            </svg>
                            Logo
                        </button>

                        <button type="button" onClick={onEdit} title="Edit partner"
                            className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                        </button>

                        <button type="button" onClick={onToggleHide} title={isHidden ? "Show partner" : "Hide partner"}
                            className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-all">
                            {isHidden ? (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            )}
                            {isHidden ? "Show" : "Hide"}
                        </button>

                        <button type="button" onClick={onDelete} title="Delete partner"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <a
                href={p.site || undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => managing && e.preventDefault()}
                className={`flex flex-col flex-1 ${managing ? "pointer-events-none" : ""}`}
            >
                <div className="flex items-start gap-4 p-6">
                    <div className="shrink-0 h-14 w-14 rounded-xl bg-slate-50 ring-1 ring-slate-100 flex items-center justify-center overflow-hidden">
                        {logoUrl ? (
                            <Image src={logoUrl} alt={`${p.name} logo`} width={40} height={40} className="object-contain" unoptimized={!logoUrl.startsWith("/")} />
                        ) : (
                            <div className={`h-full w-full bg-linear-to-br ${AVATAR_COLOR} text-white grid place-content-center text-sm font-bold`}>
                                {initials(p.name)}
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        {p.type && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset bg-slate-50 text-slate-600 ring-slate-100">
                                {p.type}
                            </span>
                        )}
                        <h3 className={`mt-1.5 text-sm font-semibold text-slate-900 leading-snug ${!managing ? "group-hover:text-green-700 transition-colors" : ""}`}>
                            {p.name}
                        </h3>
                    </div>

                    {!managing && p.site && (
                        <svg className="shrink-0 h-4 w-4 text-slate-300 group-hover:text-green-500 transition-colors mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                    )}
                </div>

                {p.blurb && (
                    <p className="px-6 pb-6 text-sm leading-relaxed text-slate-500">{p.blurb}</p>
                )}
            </a>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Partners() {
    const { isAdmin, canEdit } = usePermissions();
    const canManage = isAdmin || canEdit("partners.__index__");

    const [record,   setRecord]   = useState(null);
    const [partners, setPartners] = useState(DEFAULT_PARTNERS);
    const [loading,  setLoading]  = useState(true);
    const [managing, setManaging] = useState(false);
    const [saving,   setSaving]   = useState(false);

    const [editIdx,   setEditIdx]   = useState(null); // number | "new" | null
    const [editForm,  setEditForm]  = useState({ name: "", type: "", site: "", blurb: "", logo: "" });

    const [confirmIdx, setConfirmIdx] = useState(null);

    const [mediaOpen,     setMediaOpen]     = useState(false);
    const [logoTargetIdx, setLogoTargetIdx] = useState(null); // "form" | number

    const [dragIdx,     setDragIdx]     = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);
    const [draggable,   setDraggable]   = useState({});

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res  = await client.models.PageContent.pageContentBySlug({ slug: SLUG }, { authMode: "apiKey" });
                const item = res?.data?.[0] ?? null;
                if (!cancelled) {
                    setRecord(item);
                    const parsed = parsePartners(item?.content);
                    if (parsed) setPartners(parsed);
                }
            } catch (e) { console.error(e); }
            finally { if (!cancelled) setLoading(false); }
        }
        load();
        return () => { cancelled = true; };
    }, []);

    async function persist(updated) {
        setSaving(true);
        const content = JSON.stringify(updated);
        try {
            if (record?.id) {
                const { data } = await client.models.PageContent.update({ id: record.id, content });
                setRecord(data ?? record);
            } else {
                const { data } = await client.models.PageContent.create({ slug: SLUG, content });
                setRecord(data ?? null);
            }
            setPartners(updated);
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    }

    function toggleHide(idx) {
        persist(partners.map((p, i) => i === idx ? { ...p, hidden: !p.hidden } : p));
    }

    function doDelete(idx) {
        persist(partners.filter((_, i) => i !== idx));
        setConfirmIdx(null);
    }

    function handleDrop(targetIdx) {
        if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDragOverIdx(null); return; }
        const next = [...partners];
        const [moved] = next.splice(dragIdx, 1);
        next.splice(targetIdx, 0, moved);
        setDragIdx(null);
        setDragOverIdx(null);
        persist(next);
    }

    function openEdit(idx) {
        const p = partners[idx];
        setEditForm({ name: p.name, type: p.type ?? "", site: p.site ?? "", blurb: p.blurb ?? "", logo: p.logo ?? "" });
        setEditIdx(idx);
    }

    function openAdd() {
        setEditForm({ name: "", type: "", site: "", blurb: "", logo: "" });
        setEditIdx("new");
    }

    function saveEdit() {
        if (!editForm.name.trim()) return;
        let updated;
        if (editIdx === "new") {
            const id = slugify(editForm.name) || `partner-${Date.now()}`;
            updated = [...partners, { id, ...editForm, hidden: false }];
        } else {
            updated = partners.map((p, i) => i === editIdx ? { ...p, ...editForm } : p);
        }
        persist(updated);
        setEditIdx(null);
    }

    function handleLogoSelect(key) {
        setMediaOpen(false);
        if (logoTargetIdx === "form") {
            setEditForm((f) => ({ ...f, logo: key }));
        } else if (typeof logoTargetIdx === "number") {
            persist(partners.map((p, i) => i === logoTargetIdx ? { ...p, logo: key } : p));
        }
        setLogoTargetIdx(null);
    }

    const visible = canManage ? partners : partners.filter((p) => !p.hidden);

    return (
        <main>
            {mediaOpen && (
                <MediaLibrary
                    onSelect={handleLogoSelect}
                    onClose={() => { setMediaOpen(false); setLogoTargetIdx(null); }}
                />
            )}

            {confirmIdx !== null && (
                <ConfirmDialog
                    title="Delete partner?"
                    message={`Are you sure you want to delete "${partners[confirmIdx]?.name}"? This cannot be undone.`}
                    confirmLabel="Yes, delete"
                    onConfirm={() => doDelete(confirmIdx)}
                    onCancel={() => setConfirmIdx(null)}
                />
            )}

            {editIdx !== null && (
                <PartnerFormModal
                    form={editForm}
                    onChange={(key, val) => setEditForm((f) => ({ ...f, [key]: val }))}
                    onSave={saveEdit}
                    onCancel={() => setEditIdx(null)}
                    onPickLogo={() => { setLogoTargetIdx("form"); setMediaOpen(true); }}
                    isNew={editIdx === "new"}
                    saving={saving}
                />
            )}

            <div className="mx-auto max-w-7xl px-4 md:px-6 pt-5">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Partners" }]} />
            </div>

            <HeroSection eyebrow="Ecosystem">
                <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    Our <span className="text-green-400">Partners</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base md:text-lg text-white/60 leading-relaxed">
                    Energy Data SA is built in collaboration with government departments, utilities,
                    academic institutions, and organisations committed to open energy data in South Africa.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur-sm">
                    <span className="text-2xl font-bold text-white">{visible.filter((p) => !p.hidden).length}</span>
                    <span className="text-sm text-white/50 uppercase tracking-wider">Partners</span>
                </div>
            </HeroSection>

            <div className="mx-auto max-w-7xl px-4 md:px-6 py-14">
                {canManage && (
                    <div className="mb-8 flex items-center gap-3 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setManaging((v) => !v)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                                managing
                                    ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                            {managing ? (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Done
                                </>
                            ) : (
                                <>
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Manage Partners
                                </>
                            )}
                        </button>

                        {managing && (
                            <button
                                type="button"
                                onClick={openAdd}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 transition-all"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add partner
                            </button>
                        )}

                        {saving && <span className="text-xs text-slate-400">Saving…</span>}
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl bg-slate-50 animate-pulse h-40" />
                        ))}
                    </div>
                ) : visible.length === 0 ? (
                    <p className="text-sm text-slate-400">No partners yet.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {visible.map((p, i) => (
                            <PartnerCard
                                key={p.id ?? i}
                                p={p}
                                i={i}
                                managing={managing}
                                isDragging={dragIdx === i}
                                isDragOver={dragOverIdx === i && dragIdx !== i}
                                draggable={!!draggable[i]}
                                onDragStart={() => setDragIdx(i)}
                                onDragOver={(e) => { if (managing) { e.preventDefault(); setDragOverIdx(i); } }}
                                onDrop={() => managing && handleDrop(i)}
                                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); setDraggable({}); }}
                                onDragHandleDown={() => setDraggable((d) => ({ ...d, [i]: true }))}
                                onDragHandleUp={() => setDraggable((d) => ({ ...d, [i]: false }))}
                                onChangeLogo={() => { setLogoTargetIdx(i); setMediaOpen(true); }}
                                onEdit={() => openEdit(i)}
                                onToggleHide={() => toggleHide(i)}
                                onDelete={() => setConfirmIdx(i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
