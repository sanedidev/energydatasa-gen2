"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import { usePermissions } from "@/app/context/permissions";
import { apiClient as client } from "@/app/lib/apiClient";
import { fetchHistory, revertEntry, labelFromSlug } from "@/app/lib/editHistory";

// ── Page groups (non-dynamic pages) ──────────────────────────────────────────
// Trimmed to this rebuild's actual pages. Extend this list as more pages
// get built (e.g. as more Energy Carriers branches beyond Coal are added).
const PAGE_GROUPS = [
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
            { key: "ec.coal.*",             label: "Coal (index + all content, wildcard)" },
        ],
    },
];

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
function PermissionGroup({ group, pages, editablePages, onChange }) {
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
                <div className="flex items-center gap-2 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{group}</p>
                    {checkedCount > 0 && (
                        <span className="shrink-0 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            {checkedCount}/{pages.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={toggleAll}
                    className="shrink-0 ml-3 text-[11px] text-slate-500 hover:text-slate-900 underline underline-offset-2"
                >
                    {allChecked ? "Deselect all" : "Select all"}
                </button>
            </div>
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

    const allKeys = PAGE_GROUPS.flatMap((g) => g.pages.map((p) => p.key));

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-10 px-4 pb-10 overflow-y-auto">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{record.email}</p>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>

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
                        {PAGE_GROUPS.map((g) => (
                            <PermissionGroup
                                key={g.group}
                                group={g.group}
                                pages={g.pages}
                                editablePages={editablePages}
                                onChange={update}
                            />
                        ))}
                    </div>
                </div>

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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Profile() {
    const { user, booted, signOut } = useAuth();
    const { isAdmin, loading: permsLoading } = usePermissions();
    const router = useRouter();

    const [grants,      setGrants]      = useState([]);
    const [grantsLoading, setGrantsLoading] = useState(true);
    const [editingId,   setEditingId]   = useState(null);

    const [addEmail, setAddEmail] = useState("");
    const [addError, setAddError] = useState("");
    const [addBusy,  setAddBusy]  = useState(false);

    const [historyEntries,  setHistoryEntries]  = useState([]);
    const [historyLoading,  setHistoryLoading]  = useState(false);
    const [historyOpen,     setHistoryOpen]     = useState(false);
    const [historyExpanded, setHistoryExpanded] = useState(null);
    const [revertingId,     setRevertingId]     = useState(null);
    const [revertDone,      setRevertDone]      = useState(null);
    const [historyFilter,   setHistoryFilter]   = useState("");

    useEffect(() => {
        if (booted && !user) router.replace("/login");
    }, [booted, user, router]);

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

    async function handleAddUser(e) {
        e.preventDefault();
        const email = addEmail.trim().toLowerCase();
        if (!email || !email.includes("@")) { setAddError("Enter a valid email address."); return; }
        if (grants.some((g) => g.email === email)) { setAddError("This user already has a permissions record."); return; }
        setAddBusy(true);
        setAddError("");
        try {
            const { data, errors } = await client.models.AdminPermission.create({ email, editablePages: [] });
            if (errors?.length) throw errors[0];
            setGrants((prev) => [...prev, data]);
            setAddEmail("");
            setEditingId(data.id);
        } catch (err) {
            setAddError(err?.message ?? "Failed to add user. Please try again.");
        } finally {
            setAddBusy(false);
        }
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
                    <p className="text-sm text-slate-500">
                        You&apos;re signed in. Page-editing permissions and account management are only
                        visible to admins.
                    </p>
                ) : (
                    <>
                        {/* Grant a new user */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold text-slate-700">Grant a user permissions</h2>
                            <form onSubmit={handleAddUser} className="flex gap-2">
                                <input
                                    type="email"
                                    value={addEmail}
                                    onChange={(e) => setAddEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
                                />
                                <button type="submit" disabled={addBusy}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50">
                                    {addBusy ? "Adding…" : "Add"}
                                </button>
                            </form>
                            {addError && <p className="text-xs text-red-500">{addError}</p>}
                        </section>

                        {/* Existing grants */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold text-slate-700">Users with page permissions</h2>
                            {grantsLoading ? (
                                <div className="flex justify-center py-8"><Spinner className="h-5 w-5" /></div>
                            ) : grants.length === 0 ? (
                                <p className="text-sm text-slate-400">No non-admin editors yet. Add one above to grant page-level editing access.</p>
                            ) : (
                                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                                    {grants.map((g) => (
                                        <button
                                            key={g.id}
                                            onClick={() => setEditingId(g.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="text-sm text-slate-800">{g.email}</span>
                                            <span className="text-xs text-slate-400">
                                                {(g.editablePages ?? []).length} page{(g.editablePages ?? []).length !== 1 ? "s" : ""}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

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
