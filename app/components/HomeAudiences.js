"use client";

import Link from "next/link";
import Image from "next/image";
import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";

function AudienceLogo({ logo, title }) {
    const src = useResolvedImageUrl(logo);
    if (!src) return null;
    return (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <Image src={src} alt={title} width={48} height={48} className="h-full w-full object-cover" unoptimized />
        </div>
    );
}

export default function HomeAudiences({ audiences = [] }) {
    if (!audiences.length) return null;

    return (
        <section className="bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-10">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-600">
                        Audiences
                    </p>
                    <Link href="/whoisitfor" className="hover:text-green-700 transition-colors">
                        <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                            Audiences
                        </h2>
                    </Link>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
                        Energy Data SA is built for a wide range of users—whether you&apos;re
                        studying, planning, investing, or simply curious.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {audiences.map((a) => (
                        <Link
                            key={a.id}
                            href={`/whoisitfor/${a.slug}`}
                            className="group flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <AudienceLogo logo={a.logo} title={a.title} />
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-green-700">
                                    {a.title}
                                </h3>
                                {a.subtitle && (
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                        {a.subtitle}
                                    </p>
                                )}
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-green-700">
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
