"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import { usePermissions } from "@/app/context/permissions";
import { apiClient as client } from "@/app/lib/apiClient";
import { fetchHistory, revertEntry, labelFromSlug } from "@/app/lib/editHistory";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

// ── Static page groups (single fixed key per page, not card-driven) ─────────
// Extend this list as more non-carrier pages get built.
const STATIC_GROUPS = [
    {
        group: "Topics",
        pages: [
            { key: "topic.co2-emissions-energy-sector", label: "CO₂ Emissions (Energy Sector)" },
        ],
    },
    {
        group: "Energy Insights",
        pages: [
            { key: "energyinsights.__index__", label: "Manage index (add / hide / delete articles)", isIndex: true },
            { key: "insight.*",                label: "All Energy Insights content (wildcard)" },
        ],
    },
    {
        group: "Audiences",
        pages: [
            { key: "whoisitfor.__index__", label: "Manage index (add / hide / delete audiences)", isIndex: true },
            { key: "audience.*",           label: "All Audience content (wildcard)" },
        ],
    },
    {
        group: "About Page",
        pages: [
            { key: "about", label: "About page (all sections)" },
        ],
    },
    {
        group: "Maps",
        pages: [
            { key: "maps.power-stations", label: "Power Station Map (edit stations)" },
        ],
    },
    {
        group: "Partners",
        pages: [
            { key: "partners.__index__", label: "Manage partners (add / edit / hide / delete)", isIndex: true },
        ],
    },
    {
        group: "Energy Carriers",
        pages: [
            { key: "ec.carriers.__cards__", label: "Manage index (add / edit / hide / delete carriers)", isIndex: true },
        ],
    },
    {
        group: "National Energy Planning",
        pages: [
            { key: "neb.methodology", label: "Methodology & Data Sources page" },
            { key: "neb.balance",     label: "Energy flow diagram title (overview page)" },
        ],
    },
];

// ── Dynamic (card-driven) section registry ───────────────────────────────────
// Unlike STATIC_GROUPS, these groups load their actual card list live from
// PageContent, so a renamed/added/removed card here is instantly reflected
// on this page without a code change. `knownKeys` maps a card's `id` to its
// real, verified PageContent slug — the two don't always match (e.g. the
// Coal card id "market-and-trade" vs its real slug
// "ec.coal.market-and-trade-information"), so we look it up explicitly
// rather than assume `${prefix}.${id}`. Any card NOT in `knownKeys` (i.e. an
// admin-created dynamic page beyond the built-in defaults) falls back to the
// `dyn.file.<section>.<path>` convention used by each subsystem's catch-all
// route — correct for simple content pages, and harmless even when it isn't
// (an inert extra checkbox, not a security issue).
const SECTION_REGISTRY = [
    {
        group: "Energy Carriers › Coal",
        pageSlug: "ec.coal.__cards__",
        base: "/dashboard/energy-carriers/coal",
        sectionPathKey: "dashboard.energy-carriers.coal",
        wildcardKey: "ec.coal.*",
        wildcardLabel: "All Coal content (wildcard)",
        defaultCards: [
            { id: "coal-information",      href: "/dashboard/energy-carriers/coal/coal-information",             title: "Coal Information" },
            { id: "production-and-mining", href: "/dashboard/energy-carriers/coal/production-and-mining",        title: "Production & Mining" },
            { id: "market-and-trade",      href: "/dashboard/energy-carriers/coal/market-and-trade-information", title: "Market & Trade Information" },
        ],
        knownKeys: {
            "coal-information":      "ec.coal.coal-information",
            "production-and-mining": "ec.coal.production-and-mining",
            "market-and-trade":      "ec.coal.market-and-trade-information",
        },
    },
    {
        group: "Energy Efficiency",
        pageSlug: "energy-efficiency.__cards__",
        base: "/dashboard/energy-efficiency",
        sectionPathKey: "dashboard.energy-efficiency",
        wildcardKey: "ee.*",
        wildcardLabel: "All Energy Efficiency content (wildcard)",
        defaultCards: [
            { id: "tax-incentives",                  href: "/dashboard/energy-efficiency/tax-incentives",                  title: "Tax Incentives" },
            { id: "energy-performance-certificates", href: "/dashboard/energy-efficiency/energy-performance-certificates", title: "Energy Performance Certificates" },
            { id: "balancing-energy-supply-demand",  href: "/dashboard/energy-efficiency/balancing-energy-supply-and-demand", title: "Balancing Energy Supply and Demand" },
            { id: "standards-and-labelling",         href: "/dashboard/energy-efficiency/standards-and-labelling",         title: "Standards & Labelling" },
        ],
        knownKeys: {
            "tax-incentives":                  "ee.tax-incentives",
            "energy-performance-certificates": "ee.energy-performance-certificates",
            "balancing-energy-supply-demand":  "ee.balancing-energy-supply-and-demand",
            "standards-and-labelling":         "ee.standards-and-labelling",
        },
    },
    {
        group: "Energy Planning",
        pageSlug: "energy-planning.__cards__",
        base: "/dashboard/energy-planning",
        sectionPathKey: "dashboard.energy-planning",
        wildcardKey: "ep.*",
        wildcardLabel: "All Energy Planning content (wildcard)",
        defaultCards: [
            { id: "integrated-resource-plan", href: "/dashboard/energy-planning/integrated-resource-plan", title: "Integrated Resource Plan (IRP)" },
            { id: "integrated-energy-plan",   href: "/dashboard/energy-planning/integrated-energy-plan",   title: "Integrated Energy Plan (IEP)" },
            { id: "gas-master-plan",          href: "/dashboard/energy-planning/gas-master-plan",          title: "Gas Master Plan" },
            { id: "liquid-fuels-master-plan", href: "/dashboard/energy-planning/liquid-fuels-master-plan", title: "Liquid Fuels Master Plan" },
        ],
        knownKeys: {
            "integrated-resource-plan": "ep.integrated-resource-plan",
            "integrated-energy-plan":   "ep.integrated-energy-plan",
            "gas-master-plan":          "ep.gas-master-plan",
            "liquid-fuels-master-plan": "ep.liquid-fuels-master-plan",
        },
    },
];

function fallbackDynKey(section, card) {
    const rel = (card.href ?? "").replace(`${section.base}/`, "").replace(/\//g, ".");
    return `dyn.file.${section.sectionPathKey}.${rel}`;
}

function buildDynamicGroup(section, cards) {
    const pages = [
        { key: section.pageSlug, label: "Manage index (add / edit / hide / delete)", isIndex: true },
    ];
    if (section.wildcardKey) pages.push({ key: section.wildcardKey, label: section.wildcardLabel });
    pages.push(...cards.map((c) => ({
        key:   section.knownKeys?.[c.id] ?? fallbackDynKey(section, c),
        label: c.title,
    })));
    return { group: section.group, pages };
}

async function loadDynamicGroups() {
    return Promise.all(
        SECTION_REGISTRY.map(async (section) => {
            let cards = section.defaultCards;
            try {
                const res = await client.models.PageContent.pageContentBySlug({ slug: section.pageSlug }, { authMode: "apiKey" });
                const content = res?.data?.[0]?.content;
                if (content) {
                    const parsed = JSON.parse(content);
                    if (Array.isArray(parsed) && parsed.length > 0) cards = parsed;
                }
            } catch {}
            return buildDynamicGroup(section, cards);
        })
    );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ className = "h-5 w-5" }) {
    return (
        <svg className={`animate-spin text-slate-400 ${className}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

// ── Permission checkbox group ─────────────────────────────────────────────────
function PermissionGroup({ group, pages, editablePages, onChange, defaultCollapsed = false }) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const checkedCount = pages.filter((p) => editablePages.includes(p.key)).length;
    const allChecked   = checkedCount === pages.length;

    function toggleAll() {
        if (allChecked) {
            onChange(editablePages.filter((k) => !pages.some((p) => p.key === k)));
        } else {
            const toAdd = pages.map((p) => p.key).filter((k) => !editablePages.includes(k));
            onChange([...editablePages, ...toAdd]);
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => setCollapsed((v) => !v)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0"
                >
                    <svg
                        className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${collapsed ? "-rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    <p className="text-xs font-semibold text-slate-700 truncate">{group}</p>
                    {checkedCount > 0 && (
                        <span className="shrink-0 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            {checkedCount}/{pages.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={toggleAll}
                    className="shrink-0 ml-3 text-[11px] text-slate-500 hover:text-slate-900 underline underline-offset-2"
                >
                    {allChecked ? "Deselect all" : "Select all"}
                </button>
            </div>
            {!collapsed && (
                <div className="px-4 py-3 space-y-2">
                    {pages.map((p) => (
                        <label key={p.key} className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={editablePages.includes(p.key)}
                                onChange={(e) => {
                                    if (e.target.checked) onChange([...editablePages, p.key]);
                                    else onChange(editablePages.filter((k) => k !== p.key));
                                }}
                                className="h-4 w-4 rounded accent-green-600"
                            />
                            <span className="text-sm text-slate-700 flex-1">{p.label}</span>
                            {p.isIndex && (
                                <span className="text-[10px] font-mono bg-blue-100 text-blue-600 px-1.5 rounded">index</span>
                            )}
                            {p.key.endsWith(".*") && (
                                <span className="text-[10px] font-mono bg-purple-100 text-purple-600 px-1.5 rounded">wildcard</span>
                            )}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Per-user permission editor modal ──────────────────────────────────────────
function UserEditor({ record, onClose, onDeleted, onSaved }) {
    const [editablePages, setEditablePages] = useState(record.editablePages ?? []);
    const [dirty,         setDirty]         = useState(false);
    const [saving,        setSaving]        = useState(false);
    const [saved,         setSaved]         = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [dynamicGroups, setDynamicGroups] = useState([]);
    const [dynLoading,    setDynLoading]    = useState(true);

    useEffect(() => {
        let cancelled = false;
        loadDynamicGroups().then((groups) => {
            if (!cancelled) { setDynamicGroups(groups); setDynLoading(false); }
        });
        return () => { cancelled = true; };
    }, []);

    function update(pages) {
        setEditablePages(pages);
        setDirty(true);
    }

    async function handleSave() {
        setSaving(true);
        try {
            const { data } = await client.models.AdminPermission.update({ id: record.id, editablePages });
            onSaved(data);
            setDirty(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setConfirmRemove(false);
        setSaving(true);
        try {
            await client.models.AdminPermission.delete({ id: record.id });
            onDeleted(record.id);
        } finally {
            setSaving(false);
        }
    }

    const allGroups = [...STATIC_GROUPS, ...dynamicGroups];
    const allKeys   = allGroups.flatMap((g) => g.pages.map((p) => p.key));

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-10 px-4 pb-10 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{record.email}</p>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>

                {dynLoading ? (
                    <div className="p-8 flex justify-center"><Spinner className="h-6 w-6" /></div>
                ) : (
                    <div className="p-6 space-y-5">
                        <p className="text-xs text-slate-500 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                            Admin access (the <span className="font-mono">Admins</span> Cognito group) can&apos;t be
                            granted here — that&apos;s deliberate. It has to be set directly in AWS Cognito, so it
                            can never be self-granted through a data write. This only controls which specific pages
                            this user can edit as a non-admin editor.
                        </p>

                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-700">Page-level permissions</p>
                            <div className="flex gap-2">
                                <button onClick={() => update(allKeys)}
                                    className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2">
                                    Grant all
                                </button>
                                <span className="text-slate-300">·</span>
                                <button onClick={() => update([])}
                                    className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2">
                                    Revoke all
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {allGroups.map((g, i) => (
                                <PermissionGroup
                                    key={g.group}
                                    group={g.group}
                                    pages={g.pages}
                                    editablePages={editablePages}
                                    onChange={update}
                                    defaultCollapsed={i >= STATIC_GROUPS.length}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {saved && (
                    <div className="mx-6 mt-0 mb-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 flex items-center gap-2">
                        <svg className="h-4 w-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-sm text-green-700 font-medium">Permissions saved successfully</p>
                    </div>
                )}

                {confirmRemove && (
                    <div className="mx-6 mb-2 rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                        <p className="text-sm font-semibold text-red-700">Remove {record.email} from the permissions list?</p>
                        <p className="text-xs text-red-500">Their Cognito account will not be deleted — only their page-editing permissions record will be removed.</p>
                        <div className="flex gap-2">
                            <button onClick={handleDelete} disabled={saving}
                                className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                Yes, remove
                            </button>
                            <button onClick={() => setConfirmRemove(false)}
                                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                    <button onClick={() => setConfirmRemove(true)} disabled={saving || confirmRemove}
                        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50">
                        Remove user
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={!dirty || saving}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40">
                            {saving ? "Saving…" : "Save permissions"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Reset password modal ──────────────────────────────────────────────────────
function ResetPasswordModal({ email, onClose, onSubmit }) {
    const [newPassword, setNewPassword] = useState("");
    const [busy,        setBusy]        = useState(false);
    const [error,       setError]       = useState("");
    const [success,     setSuccess]     = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
        setBusy(true);
        setError("");
        try {
            await onSubmit(newPassword);
            setSuccess(true);
        } catch (err) {
            setError(err?.message ?? "Failed to set password.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">Set password for {email}</p>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>
                {success ? (
                    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                        Password updated. Share it with {email} through a secure channel.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && <p className="text-xs text-red-500">{error}</p>}
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password (min. 8 characters)"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
                        />
                        <div className="flex gap-2">
                            <button type="submit" disabled={busy}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">
                                {busy ? "Saving…" : "Set password"}
                            </button>
                            <button type="button" onClick={onClose}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Profile() {
    const { user, booted, signOut } = useAuth();
    const { isAdmin, loading: permsLoading, permissions } = usePermissions();
    const router = useRouter();

    const [grants,        setGrants]        = useState([]);
    const [grantsLoading, setGrantsLoading]  = useState(true);
    const [editingId,     setEditingId]      = useState(null);

    // Static + dynamic groups, loaded once, used to resolve page keys to
    // human-readable labels in "My Edit Permissions" and the quick-view.
    const [labelGroups, setLabelGroups] = useState(STATIC_GROUPS);
    const labelMap = useMemo(
        () => Object.fromEntries(labelGroups.flatMap((g) => g.pages.map((p) => [p.key, p.label]))),
        [labelGroups]
    );

    const [historyEntries,  setHistoryEntries]  = useState([]);
    const [historyLoading,  setHistoryLoading]  = useState(false);
    const [historyOpen,     setHistoryOpen]     = useState(false);
    const [historyExpanded, setHistoryExpanded] = useState(null);
    const [revertingId,     setRevertingId]     = useState(null);
    const [revertDone,      setRevertDone]      = useState(null);
    const [historyFilter,   setHistoryFilter]   = useState("");

    // Cognito account management (list / invite / delete / reset-password)
    const [cognitoUsers,   setCognitoUsers]   = useState([]);
    const [cognitoLoading, setCognitoLoading] = useState(false);
    const [cognitoError,   setCognitoError]   = useState("");
    const [inviteEmail,    setInviteEmail]    = useState("");
    const [inviteBusy,     setInviteBusy]     = useState(false);
    const [inviteError,    setInviteError]    = useState("");
    const [inviteSuccess,  setInviteSuccess]  = useState(false);
    const [confirmDeleteEmail, setConfirmDeleteEmail] = useState(null);
    const [deletingEmail,      setDeletingEmail]      = useState(null);
    const [resetPasswordFor,   setResetPasswordFor]   = useState(null);

    // Unified table interactions
    const [quickViewEmail, setQuickViewEmail] = useState(null);
    const [addingPermsFor, setAddingPermsFor] = useState(null);
    const [justAddedEmail, setJustAddedEmail] = useState(null);

    useEffect(() => {
        if (booted && !user) router.replace("/login");
    }, [booted, user, router]);

    useEffect(() => {
        let cancelled = false;
        loadDynamicGroups().then((dyn) => {
            if (!cancelled) setLabelGroups([...STATIC_GROUPS, ...dyn]);
        });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!isAdmin) {
                if (!cancelled) setGrantsLoading(false);
                return;
            }
            setGrantsLoading(true);
            try {
                const { data } = await client.models.AdminPermission.list();
                if (!cancelled) setGrants(data ?? []);
            } finally {
                if (!cancelled) setGrantsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [isAdmin]);

    // ── Cognito account management ───────────────────────────────────────────
    async function callManageUsers(args) {
        const { data, errors } = await client.mutations.manageUsers(args);
        if (errors?.length) throw new Error(errors[0].message ?? "Request failed");
        return typeof data === "string" ? JSON.parse(data) : data;
    }

    async function loadCognitoUsers() {
        setCognitoLoading(true);
        setCognitoError("");
        try {
            const result = await callManageUsers({ action: "list" });
            setCognitoUsers(result?.users ?? []);
        } catch (err) {
            setCognitoError(err?.message ?? "Failed to load users.");
        } finally {
            setCognitoLoading(false);
        }
    }

    useEffect(() => {
        if (!isAdmin) return;
        (async () => { await loadCognitoUsers(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    async function handleInvite(e) {
        e.preventDefault();
        const email = inviteEmail.trim().toLowerCase();
        if (!email || !email.includes("@")) { setInviteError("Enter a valid email address."); return; }
        setInviteBusy(true);
        setInviteError("");
        setInviteSuccess(false);
        try {
            await callManageUsers({ action: "create", email });
            setInviteEmail("");
            setInviteSuccess(true);
            setTimeout(() => setInviteSuccess(false), 5000);
            await loadCognitoUsers();
        } catch (err) {
            setInviteError(err?.message ?? "Failed to invite user.");
        } finally {
            setInviteBusy(false);
        }
    }

    async function handleDeleteUser() {
        if (!confirmDeleteEmail) return;
        setDeletingEmail(confirmDeleteEmail);
        setCognitoError("");
        try {
            await callManageUsers({ action: "delete", email: confirmDeleteEmail });
            setCognitoUsers((prev) => prev.filter((u) => u.email !== confirmDeleteEmail));
            setGrants((prev) => prev.filter((g) => g.email !== confirmDeleteEmail));
        } catch (err) {
            setCognitoError(err?.message ?? "Failed to delete user.");
        } finally {
            setDeletingEmail(null);
            setConfirmDeleteEmail(null);
        }
    }

    async function handleSetPassword(newPassword) {
        await callManageUsers({ action: "setPassword", email: resetPasswordFor, newPassword });
    }

    async function handleAddPermissions(email) {
        if (grants.some((g) => g.email === email) || addingPermsFor === email) return;
        setAddingPermsFor(email);
        try {
            const { data, errors } = await client.models.AdminPermission.create({ email, editablePages: [] });
            if (errors?.length) throw errors[0];
            setGrants((prev) => [...prev, data]);
            setJustAddedEmail(email);
            setTimeout(() => setJustAddedEmail(null), 2000);
        } catch (err) {
            console.error("Failed to add permissions record", err);
        } finally {
            setAddingPermsFor(null);
        }
    }

    function openQuickView(email) {
        setQuickViewEmail((prev) => (prev === email ? null : email));
    }

    async function loadHistoryEntries() {
        setHistoryLoading(true);
        try {
            const entries = await fetchHistory();
            setHistoryEntries(entries);
        } finally {
            setHistoryLoading(false);
        }
    }

    async function handleRevert(entry) {
        setRevertingId(entry.id);
        try {
            const ok = await revertEntry(client, entry);
            if (ok) {
                setRevertDone(entry.id);
                setTimeout(() => setRevertDone(null), 3000);
            }
        } finally {
            setRevertingId(null);
        }
    }

    if (!booted || !user) return null;

    const editingRecord = grants.find((g) => g.id === editingId) ?? null;

    // Merge Cognito accounts with permission grants into one row list, keyed
    // by email — a grant record with no matching Cognito account (e.g. the
    // account was deleted outside this page) still shows up so it stays
    // manageable rather than silently orphaned.
    const cognitoByEmail = Object.fromEntries(cognitoUsers.map((u) => [u.email, u]));
    const grantByEmail   = Object.fromEntries(grants.map((g) => [g.email, g]));
    const rowEmails = [...new Set([...cognitoUsers.map((u) => u.email), ...grants.map((g) => g.email)])].sort();
    const rows = rowEmails.map((email) => ({
        email,
        cognito: cognitoByEmail[email] ?? null,
        grant:   grantByEmail[email] ?? null,
    }));

    return (
        <main className="min-h-screen bg-white">
            {editingRecord && (
                <UserEditor
                    record={editingRecord}
                    onClose={() => setEditingId(null)}
                    onDeleted={(id) => { setGrants((prev) => prev.filter((g) => g.id !== id)); setEditingId(null); }}
                    onSaved={(updated) => setGrants((prev) => prev.map((g) => g.id === updated.id ? updated : g))}
                />
            )}

            <div className="mx-auto max-w-3xl px-4 md:px-6 py-10 space-y-8">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-600">Profile</p>
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{user.email}</h1>
                        <p className="mt-1 text-sm text-slate-500">{isAdmin ? "Admin" : "Signed in"}</p>
                    </div>
                    <button onClick={signOut} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                        Sign out
                    </button>
                </div>

                {permsLoading ? (
                    <div className="flex justify-center py-12"><Spinner className="h-6 w-6" /></div>
                ) : !isAdmin ? (
                    <section className="rounded-xl border border-slate-200 bg-white p-6">
                        <h2 className="font-semibold text-slate-900 mb-4">My Edit Permissions</h2>
                        {!permissions?.editablePages?.length ? (
                            <p className="text-sm text-slate-500">You have not been granted edit access to any pages yet. Contact your administrator.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {permissions.editablePages.map((k) => (
                                    <span key={k} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-700" title={k}>
                                        {labelMap[k] ?? k}
                                    </span>
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* Unified user management */}
                        <section className="space-y-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">User Management</h2>
                                <p className="text-sm text-slate-500 mt-0.5">Manage who can access and edit your site. Click a user to view their permissions.</p>
                            </div>

                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Cognito connected
                                        </span>
                                    </div>
                                    <button onClick={loadCognitoUsers} disabled={cognitoLoading}
                                        title="Refresh user list"
                                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors">
                                        <svg className={`h-3.5 w-3.5 ${cognitoLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>

                                {cognitoError && <p className="px-5 py-2 text-xs text-red-500 bg-red-50 border-b border-red-100">{cognitoError}</p>}

                                {(cognitoLoading || grantsLoading) && rows.length === 0 ? (
                                    <div className="p-8 flex justify-center"><Spinner /></div>
                                ) : rows.length === 0 ? (
                                    <div className="p-6 text-sm text-slate-400">No users found.</div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {rows.map((row) => {
                                            const { email, cognito: u, grant } = row;
                                            const isSelf = email === user.email;
                                            const hasGrant = !!grant;
                                            const pageCount = grant?.editablePages?.length ?? 0;
                                            return (
                                                <div key={email} className="px-5 py-3.5">
                                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                                        <button onClick={() => openQuickView(email)}
                                                            className="flex items-center gap-3 min-w-0 text-left hover:opacity-80 transition-opacity">
                                                            <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${quickViewEmail === email ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600"}`}>
                                                                {email[0]?.toUpperCase() ?? "?"}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <p className="text-sm font-medium text-slate-900 truncate underline underline-offset-2 decoration-slate-300">{email}</p>
                                                                    {u?.isAdmin && (
                                                                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 shrink-0">Admin</span>
                                                                    )}
                                                                    {isSelf && (
                                                                        <span className="text-[10px] font-medium bg-slate-100 text-slate-500 rounded-full px-1.5 py-0.5 shrink-0">You</span>
                                                                    )}
                                                                    {!u && (
                                                                        <span className="text-[10px] font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 shrink-0">No account found</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-slate-400 mt-0.5">
                                                                    {u ? (
                                                                        <>
                                                                            {u.status}{u.enabled === false ? " · Disabled" : ""}
                                                                            {u.created && ` · Joined ${new Date(u.created).toLocaleDateString()}`}
                                                                        </>
                                                                    ) : "Permissions record only"}
                                                                    {u?.isAdmin ? (
                                                                        <span className="ml-2 text-blue-500">· Full edit access</span>
                                                                    ) : hasGrant ? (
                                                                        <span className="ml-2 text-slate-500">
                                                                            · {pageCount === 0 ? "No page access" : `${pageCount} page${pageCount !== 1 ? "s" : ""}`}
                                                                        </span>
                                                                    ) : null}
                                                                </p>
                                                            </div>
                                                        </button>

                                                        <div className="flex items-center gap-2 shrink-0 ml-4">
                                                            {!hasGrant && !u?.isAdmin && (
                                                                <button onClick={() => handleAddPermissions(email)}
                                                                    disabled={addingPermsFor === email}
                                                                    className={`text-xs font-medium border rounded-lg px-3 py-1.5 transition-colors ${justAddedEmail === email ? "text-green-700 border-green-300 bg-green-50" : "text-green-700 border-green-200 hover:bg-green-50"} disabled:opacity-60`}>
                                                                    {addingPermsFor === email ? "Adding…" : justAddedEmail === email ? "Added ✓" : "+ Permissions"}
                                                                </button>
                                                            )}
                                                            {hasGrant && !u?.isAdmin && (
                                                                <button onClick={() => setEditingId(grant.id)}
                                                                    className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors">
                                                                    Manage
                                                                </button>
                                                            )}
                                                            {u && (
                                                                <button
                                                                    onClick={() => setResetPasswordFor(email)}
                                                                    disabled={isSelf}
                                                                    title={isSelf ? "Reset your own password via sign-in instead" : "Set a new password"}
                                                                    className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                                                                    Reset password
                                                                </button>
                                                            )}
                                                            {u && (
                                                                <button
                                                                    onClick={() => setConfirmDeleteEmail(email)}
                                                                    disabled={isSelf || deletingEmail === email}
                                                                    title={isSelf ? "You can't delete your own account here" : "Delete account"}
                                                                    className="text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 disabled:opacity-30 transition-colors">
                                                                    {deletingEmail === email ? "Deleting…" : "Delete"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {quickViewEmail === email && (
                                                        <div className="mt-2.5 ml-11 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                                                            {u?.isAdmin ? (
                                                                <p className="text-xs text-blue-600 font-medium">Full access to all pages — Admins group</p>
                                                            ) : !hasGrant ? (
                                                                <p className="text-xs text-slate-400">No permissions record — click &quot;+ Permissions&quot; to grant page access.</p>
                                                            ) : pageCount === 0 ? (
                                                                <p className="text-xs text-slate-400">No page access granted</p>
                                                            ) : (
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {grant.editablePages.map((k) => (
                                                                        <span key={k} className="text-[11px] bg-white border border-slate-200 text-slate-600 rounded px-2 py-0.5 font-mono" title={k}>
                                                                            {labelMap[k] ?? k}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Invite form */}
                                <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 mb-2">Invite new user</p>
                                    <form onSubmit={handleInvite} className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                        <button type="submit" disabled={inviteBusy}
                                            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-40">
                                            {inviteBusy ? "Inviting…" : "Invite"}
                                        </button>
                                    </form>
                                    {inviteSuccess && (
                                        <p className="mt-2 text-xs font-medium text-green-700 flex items-center gap-1.5">
                                            <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            Invitation sent — user will receive a temporary password by email.
                                        </p>
                                    )}
                                    {inviteError && <p className="mt-2 text-xs font-medium text-red-600">{inviteError}</p>}
                                    {!inviteSuccess && !inviteError && (
                                        <p className="mt-1.5 text-[11px] text-slate-400">User will receive a temporary password via email from Cognito.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {confirmDeleteEmail && (
                            <ConfirmDialog
                                title="Delete this account?"
                                message={`This permanently deletes the Cognito account for ${confirmDeleteEmail}. This cannot be undone.`}
                                confirmLabel={deletingEmail ? "Deleting…" : "Yes, delete"}
                                onConfirm={handleDeleteUser}
                                onCancel={() => setConfirmDeleteEmail(null)}
                            />
                        )}

                        {resetPasswordFor && (
                            <ResetPasswordModal
                                email={resetPasswordFor}
                                onClose={() => setResetPasswordFor(null)}
                                onSubmit={handleSetPassword}
                            />
                        )}

                        {/* Edit history */}
                        <section className="rounded-xl border border-slate-200 overflow-hidden">
                            <div
                                onClick={() => {
                                    setHistoryOpen((v) => !v);
                                    if (!historyOpen && historyEntries.length === 0) loadHistoryEntries();
                                }}
                                className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-2">
                                    <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-semibold text-slate-700">Edit History</span>
                                    {historyEntries.length > 0 && (
                                        <span className="text-[11px] bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 font-medium">{historyEntries.length}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {historyOpen && (
                                        <button onClick={(e) => { e.stopPropagation(); loadHistoryEntries(); }}
                                            className="text-[11px] text-slate-500 hover:text-slate-800 border border-slate-200 rounded px-2 py-0.5 bg-white">
                                            Refresh
                                        </button>
                                    )}
                                    <svg className={`h-4 w-4 text-slate-400 transition-transform ${historyOpen ? "" : "-rotate-90"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {historyOpen && (
                                <div>
                                    <div className="px-5 py-2.5 border-b border-slate-100 bg-white">
                                        <input
                                            type="text"
                                            placeholder="Filter by email or page…"
                                            value={historyFilter}
                                            onChange={(e) => setHistoryFilter(e.target.value)}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-400"
                                        />
                                    </div>

                                    {historyLoading ? (
                                        <div className="p-8 flex justify-center"><Spinner /></div>
                                    ) : historyEntries.length === 0 ? (
                                        <p className="p-6 text-sm text-slate-400">No edit history yet. Changes you make will appear here.</p>
                                    ) : (() => {
                                        const filtered = historyFilter.trim()
                                            ? historyEntries.filter((e) =>
                                                e.email?.toLowerCase().includes(historyFilter.toLowerCase()) ||
                                                e.label?.toLowerCase().includes(historyFilter.toLowerCase()) ||
                                                e.slug?.toLowerCase().includes(historyFilter.toLowerCase())
                                            )
                                            : historyEntries;

                                        if (filtered.length === 0) return <p className="p-6 text-sm text-slate-400">No results match your filter.</p>;

                                        return (
                                            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                                                {filtered.map((entry) => (
                                                    <div key={entry.id} className="px-5 py-3.5">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-start gap-3 min-w-0">
                                                                <div className="h-7 w-7 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600 mt-0.5">
                                                                    {(entry.email?.[0] ?? "?").toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="text-xs font-semibold text-slate-800">{entry.email ?? "Unknown"}</span>
                                                                        <span className={`text-[10px] font-medium rounded px-1.5 py-0.5 ${entry.action === "create" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                                                            {entry.action}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-600 mt-0.5 truncate font-medium">{entry.label || labelFromSlug(entry.slug)}</p>
                                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                                        {new Date(entry.timestamp).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                <button
                                                                    onClick={() => setHistoryExpanded(historyExpanded === entry.id ? null : entry.id)}
                                                                    className="text-[11px] border border-slate-200 rounded px-2 py-1 text-slate-500 hover:bg-slate-50 transition-colors"
                                                                >
                                                                    {historyExpanded === entry.id ? "Hide" : "View"}
                                                                </button>
                                                                {entry.before !== null && (
                                                                    revertDone === entry.id ? (
                                                                        <span className="text-[11px] text-green-700 font-medium flex items-center gap-1">
                                                                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                            Reverted
                                                                        </span>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => handleRevert(entry)}
                                                                            disabled={revertingId === entry.id}
                                                                            className="text-[11px] border border-amber-200 rounded px-2 py-1 text-amber-600 hover:bg-amber-50 disabled:opacity-40 transition-colors"
                                                                        >
                                                                            {revertingId === entry.id ? "Reverting…" : "Revert"}
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        {historyExpanded === entry.id && (
                                                            <div className="mt-3 ml-10 space-y-2">
                                                                {entry.before !== null && entry.before !== undefined && (
                                                                    <div>
                                                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Before</p>
                                                                        <pre className="text-[11px] bg-red-50 border border-red-100 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap text-red-700 max-h-40 overflow-y-auto leading-relaxed">
                                                                            {entry.before}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">After</p>
                                                                    <pre className="text-[11px] bg-green-50 border border-green-100 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap text-green-700 max-h-40 overflow-y-auto leading-relaxed">
                                                                        {entry.after ?? "(deleted)"}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
