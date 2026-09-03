"use client";

import "@/app/ConfigureAmplify";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmSignUp } from "aws-amplify/auth";

function ConfirmForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState(searchParams.get("email") ?? "");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
            router.push("/login");
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not confirm.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Confirm your email</h1>
                <p className="mt-1 text-sm text-slate-500">Enter the verification code we emailed you</p>
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
                        <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-slate-700">Verification code</label>
                        <input
                            id="code"
                            type="text"
                            required
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="6-digit code"
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#19223a] hover:bg-[#0d1526]"}`}
                    >
                        {submitting ? "Confirming…" : "Confirm"}
                    </button>
                    <p className="text-center text-sm text-slate-500">
                        <Link href="/login" className="font-medium text-green-700 hover:text-green-800">Back to sign in</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default function Confirm() {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4">
            <Suspense fallback={null}>
                <ConfirmForm />
            </Suspense>
        </main>
    );
}
