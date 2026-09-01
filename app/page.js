"use client";

import "./ConfigureAmplify";
import { useEffect, useState } from "react";
import {
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    getCurrentUser,
    fetchAuthSession,
} from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";

const client = generateClient();
const HOME_SLUG = "home";

async function checkIsAdmin() {
    const session = await fetchAuthSession();
    const groups = session.tokens?.accessToken?.payload["cognito:groups"] ?? [];
    return groups.includes("Admins");
}

export default function Home() {
    const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
    const [isAdmin, setIsAdmin] = useState(false);
    const [mode, setMode] = useState("signIn"); // signIn | signUp | confirm
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const [pageContent, setPageContent] = useState(null);
    const [draft, setDraft] = useState("");

    const [permissions, setPermissions] = useState([]);
    const [newPermEmail, setNewPermEmail] = useState("");
    const [permError, setPermError] = useState("");

    useEffect(() => {
        getCurrentUser()
            .then(async (u) => {
                setUser(u);
                setIsAdmin(await checkIsAdmin());
            })
            .catch(() => setUser(null));
    }, []);

    // Any signed-in user can read/write this - proves ordinary CMS content works.
    useEffect(() => {
        if (!user) return;
        const sub = client.models.PageContent.observeQuery({
            filter: { slug: { eq: HOME_SLUG } },
        }).subscribe({
            next: ({ items }) => {
                const record = items[0] ?? null;
                setPageContent(record);
                setDraft(record?.content ?? "");
            },
        });
        return () => sub.unsubscribe();
    }, [user]);

    // Only the Admins group can write AdminPermission - proves the group-gated model.
    useEffect(() => {
        if (!user || !isAdmin) return;
        const sub = client.models.AdminPermission.observeQuery().subscribe({
            next: ({ items }) => setPermissions(items),
        });
        return () => sub.unsubscribe();
    }, [user, isAdmin]);

    async function handleSignUp(e) {
        e.preventDefault();
        setError("");
        try {
            await signUp({ username: email, password, options: { userAttributes: { email } } });
            setMode("confirm");
        } catch (err) {
            setError(err.message ?? "Sign up failed");
        }
    }

    async function handleConfirm(e) {
        e.preventDefault();
        setError("");
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
            setMode("signIn");
        } catch (err) {
            setError(err.message ?? "Confirmation failed");
        }
    }

    async function handleSignIn(e) {
        e.preventDefault();
        setError("");
        try {
            await signIn({ username: email, password });
            setUser(await getCurrentUser());
            setIsAdmin(await checkIsAdmin());
        } catch (err) {
            setError(err.message ?? "Sign in failed");
        }
    }

    async function handleSignOut() {
        await signOut();
        setUser(null);
        setIsAdmin(false);
        setPageContent(null);
        setPermissions([]);
    }

    async function handleSavePageContent(e) {
        e.preventDefault();
        if (pageContent?.id) {
            await client.models.PageContent.update({ id: pageContent.id, content: draft });
        } else {
            const { data } = await client.models.PageContent.create({ slug: HOME_SLUG, content: draft });
            setPageContent(data);
        }
    }

    async function handleCreatePermission(e) {
        e.preventDefault();
        setPermError("");
        if (!newPermEmail.trim()) return;
        try {
            await client.models.AdminPermission.create({ email: newPermEmail.trim(), editablePages: [] });
            setNewPermEmail("");
        } catch (err) {
            setPermError(err.message ?? "Could not create permission");
        }
    }

    if (user === undefined) {
        return <main className="p-8">Loading...</main>;
    }

    if (!user) {
        return (
            <main className="max-w-sm mx-auto p-8">
                <h1 className="text-xl font-semibold mb-4">energydatasa-gen2 — connectivity test</h1>

                {error && (
                    <div className="mb-3 rounded bg-red-50 border border-red-200 p-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {mode === "signUp" && (
                    <form onSubmit={handleSignUp} className="space-y-3">
                        <input type="email" required placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <input type="password" required placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <button className="w-full bg-slate-900 text-white rounded px-4 py-2">Sign up</button>
                        <button type="button" onClick={() => setMode("signIn")} className="text-sm text-slate-500">
                            Already have an account? Sign in
                        </button>
                    </form>
                )}

                {mode === "confirm" && (
                    <form onSubmit={handleConfirm} className="space-y-3">
                        <p className="text-sm text-slate-600">Enter the code emailed to {email}</p>
                        <input required placeholder="Confirmation code" value={code}
                            onChange={(e) => setCode(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <button className="w-full bg-slate-900 text-white rounded px-4 py-2">Confirm</button>
                    </form>
                )}

                {mode === "signIn" && (
                    <form onSubmit={handleSignIn} className="space-y-3">
                        <input type="email" required placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <input type="password" required placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" />
                        <button className="w-full bg-slate-900 text-white rounded px-4 py-2">Sign in</button>
                        <button type="button" onClick={() => setMode("signUp")} className="text-sm text-slate-500">
                            No account? Sign up
                        </button>
                    </form>
                )}
            </main>
        );
    }

    return (
        <main className="max-w-lg mx-auto p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">energydatasa-gen2</h1>
                    <p className="text-sm text-slate-500">
                        {user.signInDetails?.loginId ?? user.username} — {isAdmin ? "Admin" : "Signed in"}
                    </p>
                </div>
                <button onClick={handleSignOut} className="text-sm border rounded px-3 py-1.5">Sign out</button>
            </div>

            <section>
                <h2 className="font-medium mb-2">PageContent: &quot;{HOME_SLUG}&quot;</h2>
                <p className="text-xs text-slate-500 mb-2">
                    Any signed-in user can edit this — proves ordinary CMS content works.
                </p>
                <form onSubmit={handleSavePageContent} className="space-y-2">
                    <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
                        className="w-full border rounded px-3 py-2 h-24" placeholder="Page content..." />
                    <button className="bg-slate-900 text-white rounded px-4 py-2 text-sm">Save</button>
                </form>
            </section>

            {isAdmin ? (
                <section>
                    <h2 className="font-medium mb-2">Admin permissions</h2>
                    <p className="text-xs text-slate-500 mb-2">
                        Only the Admins group can write these — proves the group-gated model works.
                    </p>
                    {permError && <p className="text-sm text-red-600 mb-2">{permError}</p>}
                    <form onSubmit={handleCreatePermission} className="flex gap-2 mb-3">
                        <input value={newPermEmail} onChange={(e) => setNewPermEmail(e.target.value)}
                            placeholder="user@example.com" className="flex-1 border rounded px-3 py-2 text-sm" />
                        <button className="bg-slate-900 text-white rounded px-4 py-2 text-sm">Grant</button>
                    </form>
                    <ul className="space-y-1 text-sm">
                        {permissions.map((p) => (
                            <li key={p.id} className="border rounded px-3 py-2">{p.email}</li>
                        ))}
                        {permissions.length === 0 && <li className="text-slate-500">No permission records yet.</li>}
                    </ul>
                </section>
            ) : (
                <p className="text-xs text-slate-500">
                    Not an admin — the &quot;Admin permissions&quot; panel is hidden, and directly calling
                    AdminPermission.create from the browser console would be rejected server-side too,
                    not just hidden client-side.
                </p>
            )}
        </main>
    );
}
