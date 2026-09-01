import Link from "next/link";

export default function Breadcrumbs({ items }) {
    return (
        <nav className="mb-6 text-sm text-slate-600">
            <ol className="flex items-center gap-2 flex-wrap">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.label} className="flex items-center gap-2">
                            {!isLast ? (
                                <Link
                                    href={item.href}
                                    className="hover:text-slate-900 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-slate-900">
                                    {item.label}
                                </span>
                            )}

                            {!isLast && <span className="text-slate-400">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
