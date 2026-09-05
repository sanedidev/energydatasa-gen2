import Link from "next/link";
import HeroSection from "@/app/components/ui/HeroSection";

export const metadata = { title: "Datasets" };

const SECTIONS = [
    {
        href: "/dashboard/energy-carriers",
        title: "Energy Carriers",
        desc: "Electricity, coal, oil, gas, nuclear, renewables and more.",
        count: "1 category",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
        ),
        color: "bg-slate-50 text-slate-500 ring-slate-100",
    },
];

export default function DashboardPage() {
    return (
        <main>
            <HeroSection eyebrow="Open Data" maxWidth="max-w-6xl">
                <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    <span className="text-green-400">Datasets</span>
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/60 leading-relaxed">
                    Explore South African energy data across carriers, efficiency programmes, and long-term planning frameworks.
                </p>
            </HeroSection>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {SECTIONS.map((s) => (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="group flex flex-col rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="p-6 flex-1">
                                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${s.color}`}>
                                    {s.icon}
                                </div>
                                <h2 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-green-700 transition-colors">
                                    {s.title}
                                </h2>
                                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-50 px-6 py-3">
                                <span className="text-xs text-slate-400">{s.count}</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                    Open
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
