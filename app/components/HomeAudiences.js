"use client";

import Link from "next/link";
import MediaFill from "@/app/components/ui/MediaFill";
import FlowLine from "@/app/components/ui/FlowLine";

function AudienceLogo({ logo, title }) {
    if (!logo) return null;
    return (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-none bg-[var(--color-cream-2)]">
            <MediaFill value={logo} alt={title} fallback={null} />
        </div>
    );
}

export default function HomeAudiences({ audiences = [] }) {
    if (!audiences.length) return null;

    return (
        <section className="bg-[var(--color-cream-2)] pb-16">
            <FlowLine from="var(--color-link)" to="var(--color-accent)" />
            <div className="mx-auto max-w-7xl px-4 md:px-6 pt-12">
                <div className="mb-10">
                    <Link href="/whoisitfor" className="hover:text-[var(--color-accent)] transition-colors">
                        <h2 className="text-2xl font-bold text-[var(--color-ink)] md:text-3xl">
                            Audiences
                        </h2>
                    </Link>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-ink-soft)]">
                        Energy Data SA is built for a wide range of users—whether you&apos;re
                        studying, planning, investing, or simply curious.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {audiences.map((a) => (
                        <Link
                            key={a.id}
                            href={`/whoisitfor/${a.slug}`}
                            className="group flex items-start gap-4 rounded-[var(--radius-card)] bg-white p-6 border border-[var(--color-hairline)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40"
                        >
                            <AudienceLogo logo={a.logo} title={a.title} />
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
                                    {a.title}
                                </h3>
                                {a.subtitle && (
                                    <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                                        {a.subtitle}
                                    </p>
                                )}
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
                                    Explore
                                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
