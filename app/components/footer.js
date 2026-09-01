import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8 flex items-center justify-between text-sm text-slate-600">
                <p>© {year} Energy Data SA</p>

                <nav className="flex items-center gap-6">
                    <Link href="/about" className="hover:text-slate-900">
                        About
                    </Link>
                    <Link href="/partners" className="hover:text-slate-900">
                        Partners
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
