import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-[var(--color-hairline)] bg-[var(--color-cream)]">
            <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between text-sm text-[var(--color-ink-soft)]">
                <p>© {year} Energy Data SA</p>

                <nav className="flex items-center gap-6">
                    <Link href="/about" className="hover:text-[var(--color-ink)]">
                        About
                    </Link>
                    <Link href="/partners" className="hover:text-[var(--color-ink)]">
                        Partners
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
