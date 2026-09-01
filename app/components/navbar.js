"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/auth";

// Single source of truth. Add new pages here only.
// group: "primary"   → tool links, logged-in only
// group: "secondary" → editorial/info links, shown in both states
// public: true       → visible to logged-out users
const NAV_LINKS = [
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

    const doSignOut = () => {
        signOut();
        setOpen(false);
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-7xl items-center px-4 md:px-6">

                {/* Brand */}
                <Link
                    href="/"
                    className="shrink-0 text-sm font-bold tracking-widest text-slate-900 uppercase hover:text-green-700 transition-colors"
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
                                            ? "text-green-700 bg-green-50"
                                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="mx-3 h-4 w-px bg-slate-200" />

                        {/* Secondary links */}
                        <div className="flex items-center gap-0.5">
                            {SECONDARY_LINKS.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={[
                                        "px-3 py-1.5 text-sm rounded-lg transition-colors",
                                        isActive(l.href)
                                            ? "text-slate-700 bg-slate-50 font-medium"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="mx-3 h-4 w-px bg-slate-200" />

                        {/* Profile + Sign out */}
                        <div className="flex items-center gap-1">
                            <Link
                                href="/profile"
                                className={[
                                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                                    isActive("/profile")
                                        ? "text-slate-700 bg-slate-50 font-medium"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={doSignOut}
                                className="ml-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
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
                                        ? "text-green-700 bg-green-50"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                {l.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="ml-2 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {/* Mobile menu button */}
                <button
                    className="md:hidden ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3">
                    <ul className="space-y-0.5">
                        {(user ? [...PRIMARY_LINKS, ...SECONDARY_LINKS, { href: "/profile", label: "Profile" }] : [...PUBLIC_LINKS, { href: "/login", label: "Login" }]).map((l) => (
                            <li key={l.href}>
                                <Link
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className={[
                                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive(l.href)
                                            ? "text-green-700 bg-green-50"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
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
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm text-slate-500 hover:bg-slate-50 transition-colors"
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
