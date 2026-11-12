import Link from "next/link";

export default function Breadcrumbs({ items }) {
    return (
        <nav className="mb-6 text-sm text-[var(--color-ink-soft)]">
            <ol className="flex items-center gap-2 flex-wrap">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.label} className="flex items-center gap-2">
                            {!isLast ? (
                                <Link
                                    href={item.href}
                                    className="hover:text-[var(--color-ink)] transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-[var(--color-ink)]">
                                    {item.label}
                                </span>
                            )}

                            {!isLast && <span className="text-[var(--color-ink-soft)]/70">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
