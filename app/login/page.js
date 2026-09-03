"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";

export default function Login() {
    const router = useRouter();
    const { signIn, completeNewPassword, user } = useAuth();

    const [email, setEmail]         = useState("");
    const [pw, setPw]               = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState("");

    // New-password challenge state
    const [needsNewPassword, setNeedsNewPassword] = useState(false);
    const [newPw, setNewPw]         = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    useEffect(() => {
        // /dashboard doesn't exist in this rebuild yet - send signed-in
        // visitors home instead of into a dead route.
        if (user) router.replace("/");
    }, [user, router]);

    if (user) return null;

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const result = await signIn({ email, password: pw });
            if (result?.requiresNewPassword) {
                setNeedsNewPassword(true);
                setPw("");
            } else {
                router.replace("/");
            }
        } catch (err) {
            console.error(err);
            if (err?.name === "NotAuthorizedException") {
                setError("Incorrect email or password.");
            } else if (err?.name === "UserNotFoundException") {
                setError("No account found with this email.");
            } else if (err?.name === "UserNotConfirmedException") {
                setError("Please verify your email before signing in.");
            } else {
                setError("Could not sign in. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function onSetNewPassword(e) {
        e.preventDefault();
        setError("");
        if (newPw.length < 8) { setError("Password must be at least 8 characters."); return; }
        if (newPw !== confirmPw) { setError("Passwords do not match."); return; }
        setSubmitting(true);
        try {
            await completeNewPassword({ newPassword: newPw });
            router.replace("/");
        } catch (err) {
            console.error(err);
            setError(err?.message ?? "Could not set password. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {needsNewPassword ? "Set your password" : "Sign in"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {needsNewPassword
                            ? "Your account requires a new password before you can continue."
                            : "Welcome back to Energy Data SA"}
                    </p>
                </div>

                {needsNewPassword ? (
                    <form onSubmit={onSetNewPassword} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                        <div className="space-y-5">
                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
                            )}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPw}
                                    onChange={(e) => setNewPw(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm new password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#19223a] hover:bg-[#0d1526]"}`}
                            >
                                {submitting ? "Setting password…" : "Set password & sign in"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
                        <div className="space-y-5">
                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
                            )}
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#19223a] hover:bg-[#0d1526]"}`}
                            >
                                {submitting ? "Signing in…" : "Sign in"}
                            </button>
                            <p className="text-center text-sm text-slate-500">
                                No account?{" "}
                                <Link href="/signup" className="font-medium text-green-700 hover:text-green-800">Sign up</Link>
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
