"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/auth";

// Single source of truth. Add new pages here only.
// group: "primary"   → tool links, logged-in only
// group: "secondary" → editorial/info links, shown in both states
// public: true       → visible to logged-out users
export const NAV_LINKS = [
    { href: "/dashboard",      label: "Datasets",  group: "primary",   public: false },
    { href: "/maps",           label: "Maps",      group: "primary",   public: false },
    { href: "/energyInsights", label: "Insights",  group: "secondary", public: true  },
    { href: "/whoisitfor",     label: "Audiences", group: "secondary", public: true  },
    { href: "/partners",       label: "Partners",  group: "secondary", public: true  },
    { href: "/about",          label: "About",     group: "secondary", public: true  },
];

const PRIMARY_LINKS   = NAV_LINKS.filter((l) => l.group === "primary");
const SECONDARY_LINKS = NAV_LINKS.filter((l) => l.group === "secondary");
const PUBLIC_LINKS    = NAV_LINKS.filter((l) => l.public);

export default function Navbar() {
    const pathname = usePathname();
    const router   = useRouter();
    const { user, signOut } = useAuth();
    const [open, setOpen] = useState(false);

    const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

    const doSignOut = async () => {
        setOpen(false);
        await signOut();
        router.push("/");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-hairline)] bg-[var(--color-cream)]/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6">

                {/* Brand */}
                <Link
                    href="/"
                    className="shrink-0 text-sm font-bold tracking-widest text-[var(--color-ink)] uppercase transition-colors hover:text-[var(--color-accent)]"
                >
                    Energy Data SA
                </Link>

                {/* Desktop — logged in */}
                {user && (
                    <div className="ml-auto hidden md:flex items-center">
                        {/* Primary tools */}
                        <div className="flex items-center gap-0.5">
                            {PRIMARY_LINKS.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={[
                                        "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                        isActive(l.href)
                                            ? "text-[var(--color-accent)]"
                                            : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream-2)]",
                                    ].join(" ")}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="mx-3 h-4 w-px bg-[var(--color-hairline)]" />

                        {/* Secondary links */}
                        <div className="flex items-center gap-0.5">
                            {SECONDARY_LINKS.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={[
                                        "px-3 py-1.5 text-sm rounded-lg transition-colors",
                                        isActive(l.href)
                                            ? "text-[var(--color-ink)] font-medium bg-[var(--color-cream-2)]"
                                            : "text-[var(--color-ink-soft)]/70 hover:text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]",
                                    ].join(" ")}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="mx-3 h-4 w-px bg-[var(--color-hairline)]" />

                        {/* Profile + Sign out */}
                        <div className="flex items-center gap-1">
                            <Link
                                href="/profile"
                                className={[
                                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                                    isActive("/profile")
                                        ? "text-[var(--color-ink)] font-medium bg-[var(--color-cream-2)]"
                                        : "text-[var(--color-ink-soft)]/70 hover:text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-2)]",
                                ].join(" ")}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={doSignOut}
                                className="ml-1 rounded-lg border border-[var(--color-hairline)] px-3 py-1.5 text-sm text-[var(--color-ink-soft)] transition-all hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}

                {/* Desktop — logged out */}
                {!user && (
                    <div className="ml-auto hidden md:flex items-center gap-0.5">
                        {PUBLIC_LINKS.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                className={[
                                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                    isActive(l.href)
                                        ? "text-[var(--color-accent)]"
                                        : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream-2)]",
                                ].join(" ")}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="ml-2 rounded-lg bg-[var(--color-ink)] px-4 py-1.5 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-ink-soft)]"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {/* Mobile menu button */}
                <button
                    className="md:hidden ml-auto rounded-lg p-2 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-cream-2)] hover:text-[var(--color-ink)]"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    {open ? (
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile panel */}
            {open && (
                <div className="md:hidden border-t border-[var(--color-hairline)] bg-[var(--color-cream)] px-4 py-3">
                    <ul className="space-y-0.5">
                        {(user ? [...PRIMARY_LINKS, ...SECONDARY_LINKS, { href: "/profile", label: "Profile" }] : [...PUBLIC_LINKS, { href: "/login", label: "Login" }]).map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className={[
                                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive(l.href)
                                            ? "text-[var(--color-accent)] bg-[var(--color-cream-2)]"
                                            : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-cream-2)]",
                                    ].join(" ")}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                        {user && (
                            <li className="pt-1">
                                <button
                                    onClick={doSignOut}
                                    className="w-full rounded-lg border border-[var(--color-hairline)] px-3 py-2.5 text-left text-sm text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-cream-2)]"
                                >
                                    Sign out
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
}
