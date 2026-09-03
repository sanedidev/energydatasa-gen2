"use client";

import "@/app/ConfigureAmplify";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "aws-amplify/auth";

export default function Signup() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await signUp({
                username: email,
                password,
                options: { userAttributes: { email } },
            });
            router.push(`/confirm?email=${encodeURIComponent(email)}`);
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not create account.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
                    <p className="mt-1 text-sm text-slate-500">Join Energy Data SA</p>
                </div>

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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#19223a] hover:bg-[#0d1526]"}`}
                        >
                            {submitting ? "Creating…" : "Sign up"}
                        </button>
                        <p className="text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-green-700 hover:text-green-800">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}
