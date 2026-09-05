import Link from "next/link";
import HeroSection from "@/app/components/ui/HeroSection";

export const metadata = { title: "Datasets" };

const SECTIONS = [
    {
        href: "/dashboard/energy-carriers",
        title: "Energy Carriers",
        desc: "Electricity, coal, oil, gas, nuclear, renewables and more.",
        count: "11 categories",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
        ),
        color: "bg-slate-50 text-slate-500 ring-slate-100",
    },
    {
        href: "/dashboard/energy-efficiency",
        title: "Energy Efficiency",
        desc: "EEDSM, EPCs, tax incentives, standards & labelling.",
        count: "4 categories",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
        ),
        color: "bg-green-50 text-green-600 ring-green-100",
    },
    {
        href: "/dashboard/energy-planning",
        title: "Energy Planning",
        desc: "IRP, IEP, Gas Master Plan, Liquid Fuels Master Plan.",
        count: "4 categories",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
        ),
        color: "bg-purple-50 text-purple-600 ring-purple-100",
    },
    {
        href: "/dashboard/energy-balance",
        title: "National Energy Planning",
        desc: "2024 NEB — primary supply, conversion, and final consumption by sector and commodity.",
        count: "8 sections · primary to final consumption",
        icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
            </svg>
        ),
        color: "bg-violet-50 text-violet-600 ring-violet-100",
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
