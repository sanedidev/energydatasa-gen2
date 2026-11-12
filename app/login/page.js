"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";

export default function Login() {
    const router = useRouter();
    const { signIn, completeNewPassword, resetPassword, confirmResetPassword, user } = useAuth();

    const [email, setEmail]         = useState("");
    const [pw, setPw]               = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState("");

    // New-password challenge state (forced, right after AdminCreateUser)
    const [needsNewPassword, setNeedsNewPassword] = useState(false);
    const [newPw, setNewPw]         = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    // Self-service "forgot password" state
    const [forgotStep, setForgotStep]     = useState(null); // null | "request" | "confirm"
    const [forgotEmail, setForgotEmail]   = useState("");
    const [forgotCode, setForgotCode]     = useState("");
    const [forgotNewPw, setForgotNewPw]   = useState("");
    const [forgotConfirmPw, setForgotConfirmPw] = useState("");
    const [forgotNotice, setForgotNotice] = useState("");

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

    function openForgotPassword() {
        setError("");
        setForgotNotice("");
        setForgotEmail(email);
        setForgotCode("");
        setForgotNewPw("");
        setForgotConfirmPw("");
        setForgotStep("request");
    }

    function backToSignIn() {
        setError("");
        setForgotNotice("");
        setForgotStep(null);
    }

    async function onForgotRequest(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await resetPassword({ email: forgotEmail });
            setForgotStep("confirm");
        } catch (err) {
            console.error(err);
            if (err?.name === "UserNotFoundException") {
                // Don't reveal whether an account exists - move on as if it worked.
                setForgotStep("confirm");
            } else {
                setError(err?.message ?? "Could not send a reset code. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function onForgotConfirm(e) {
        e.preventDefault();
        setError("");
        if (forgotNewPw.length < 8) { setError("Password must be at least 8 characters."); return; }
        if (forgotNewPw !== forgotConfirmPw) { setError("Passwords do not match."); return; }
        setSubmitting(true);
        try {
            await confirmResetPassword({ email: forgotEmail, code: forgotCode, newPassword: forgotNewPw });
            setForgotStep(null);
            setEmail(forgotEmail);
            setPw("");
            setForgotNotice("Password reset. Sign in with your new password.");
        } catch (err) {
            console.error(err);
            setError(err?.message ?? "Could not reset password. Please try again.");
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
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-cream-2)] px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-ink)]">
                        {needsNewPassword
                            ? "Set your password"
                            : forgotStep === "request"
                            ? "Reset your password"
                            : forgotStep === "confirm"
                            ? "Check your email"
                            : "Sign in"}
                    </h1>
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                        {needsNewPassword
                            ? "Your account requires a new password before you can continue."
                            : forgotStep === "request"
                            ? "Enter your email and we'll send you a code to reset it."
                            : forgotStep === "confirm"
                            ? "Enter the code we emailed you along with your new password."
                            : "Welcome back to Energy Data SA"}
                    </p>
                </div>

                {needsNewPassword ? (
                    <form onSubmit={onSetNewPassword} className="rounded-none bg-white p-8 border border-[var(--color-hairline)]">
                        <div className="space-y-5">
                            {error && (
                                <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
                            )}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">New password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPw}
                                    onChange={(e) => setNewPw(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Confirm new password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPw}
                                    onChange={(e) => setConfirmPw(e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full rounded-none px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-[var(--color-ink-soft)]/40 cursor-not-allowed" : "bg-[var(--color-ink)] hover:bg-[var(--color-ink-soft)]"}`}
                            >
                                {submitting ? "Setting password…" : "Set password & sign in"}
                            </button>
                        </div>
                    </form>
                ) : forgotStep === "request" ? (
                    <form onSubmit={onForgotRequest} className="rounded-none bg-white p-8 border border-[var(--color-hairline)]">
                        <div className="space-y-5">
                            {error && (
                                <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
                            )}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)]/50 focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full rounded-none px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-[var(--color-ink-soft)]/40 cursor-not-allowed" : "bg-[var(--color-ink)] hover:bg-[var(--color-ink-soft)]"}`}
                            >
                                {submitting ? "Sending…" : "Send reset code"}
                            </button>
                            <p className="text-center text-sm text-[var(--color-ink-soft)]">
                                <button type="button" onClick={backToSignIn} className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">Back to sign in</button>
                            </p>
                        </div>
                    </form>
                ) : forgotStep === "confirm" ? (
                    <form onSubmit={onForgotConfirm} className="rounded-none bg-white p-8 border border-[var(--color-hairline)]">
                        <div className="space-y-5">
                            {error && (
                                <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
                            )}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Verification code</label>
                                <input
                                    type="text"
                                    required
                                    value={forgotCode}
                                    onChange={(e) => setForgotCode(e.target.value)}
                                    placeholder="6-digit code"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)]/50 focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                                <p className="mt-1.5 text-xs text-[var(--color-ink-soft)]/70">
                                    Don&apos;t see it? Check your spam or junk folder — the code can sometimes land there.
                                </p>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">New password</label>
                                <input
                                    type="password"
                                    required
                                    value={forgotNewPw}
                                    onChange={(e) => setForgotNewPw(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Confirm new password</label>
                                <input
                                    type="password"
                                    required
                                    value={forgotConfirmPw}
                                    onChange={(e) => setForgotConfirmPw(e.target.value)}
                                    placeholder="Repeat password"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full rounded-none px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-[var(--color-ink-soft)]/40 cursor-not-allowed" : "bg-[var(--color-ink)] hover:bg-[var(--color-ink-soft)]"}`}
                            >
                                {submitting ? "Resetting…" : "Reset password"}
                            </button>
                            <p className="text-center text-sm text-[var(--color-ink-soft)]">
                                <button type="button" onClick={backToSignIn} className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">Back to sign in</button>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onSubmit} className="rounded-none bg-white p-8 border border-[var(--color-hairline)]">
                        <div className="space-y-5">
                            {error && (
                                <div className="rounded-none bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
                            )}
                            {forgotNotice && (
                                <div className="rounded-none bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">{forgotNotice}</div>
                            )}
                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-soft)]/50 focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-[var(--color-ink)]">Password</label>
                                    <button type="button" onClick={openForgotPassword} className="text-xs font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
                                        Forgot password?
                                    </button>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    className="w-full rounded-none border border-[var(--color-hairline)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full rounded-none px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? "bg-[var(--color-ink-soft)]/40 cursor-not-allowed" : "bg-[var(--color-ink)] hover:bg-[var(--color-ink-soft)]"}`}
                            >
                                {submitting ? "Signing in…" : "Sign in"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}
