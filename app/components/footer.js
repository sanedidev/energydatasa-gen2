"use client";

import Link from "next/link";
import { useAuth } from "../context/auth";
import { NAV_LINKS } from "./navbar";

// Mirrors navbar.js's own logged-in/logged-out visibility: every tab when
// signed in, only the public ones otherwise - NAV_LINKS is the one shared
// source of truth for which pages exist, so this list can't drift from it.
export default function Footer() {
    const { user } = useAuth();
    const year = new Date().getFullYear();
    const links = user ? NAV_LINKS : NAV_LINKS.filter((l) => l.public);

    return (
        <footer className="mt-auto border-t border-[var(--color-hairline)] bg-[var(--color-cream)]">
            <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between text-sm text-[var(--color-ink-soft)]">
                <p>© {year} Energy Data SA</p>

                <nav className="flex items-center gap-6">
                    {links.map((l) => (
                        <Link key={l.href} href={l.href} className="hover:text-[var(--color-ink)]">
                            {l.label}
                        </Link>
                    ))}
                    {user && (
                        <Link href="/profile" className="hover:text-[var(--color-ink)]">
                            Profile
                        </Link>
                    )}
                </nav>
            </div>
        </footer>
    );
}
