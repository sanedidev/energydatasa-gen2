"use client";

import Link from "next/link";
import Image from "next/image";
import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";

function CoverImage({ imageKey, alt }) {
    const src = useResolvedImageUrl(imageKey);
    if (!src) return null;
    return (
        <div className="relative aspect-video overflow-hidden">
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
            />
        </div>
    );
}

export default function HomeEnergyInsights({ articles = [] }) {
    if (!articles.length) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 md:px-6 py-16">
            <div className="mb-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-green-600">
                    Latest
                </p>
                <Link href="/energyInsights" className="hover:text-green-700 transition-colors">
                    <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                        Energy Insights &amp; Updates
                    </h2>
                </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
                    >
                        <Link href={`/energyInsights/${article.slug}`} className="block overflow-hidden">
                            <CoverImage imageKey={article.imageKey} alt={article.title} />
                        </Link>

                        <div className="flex flex-1 flex-col p-6">
                            <Link href={`/energyInsights/${article.slug}`}>
                                <h3 className="text-base font-semibold leading-snug text-slate-900 transition-colors hover:text-green-700">
                                    {article.title}
                                </h3>
                            </Link>

                            {article.excerpt && (
                                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">
                                    {article.excerpt}
                                </p>
                            )}

                            <Link
                                href={`/energyInsights/${article.slug}`}
                                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-green-700 transition-colors hover:text-green-800"
                            >
                                Read more
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
