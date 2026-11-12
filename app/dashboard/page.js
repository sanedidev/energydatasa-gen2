import Link from "next/link";
import HeroSection from "@/app/components/ui/HeroSection";
import { SolarIcon, LeafIcon, BatteryIcon, RippleIcon } from "@/app/components/ui/icons/AnimatedIcons";

export const metadata = { title: "Datasets" };

const SECTIONS = [
    {
        href: "/dashboard/energy-carriers",
        title: "Energy Carriers",
        desc: "Electricity, coal, oil, gas, nuclear, renewables and more.",
        count: "11 categories",
        Icon: SolarIcon,
    },
    {
        href: "/dashboard/energy-efficiency",
        title: "Energy Efficiency",
        desc: "EEDSM, EPCs, tax incentives, standards & labelling.",
        count: "4 categories",
        Icon: LeafIcon,
    },
    {
        href: "/dashboard/energy-planning",
        title: "Energy Planning",
        desc: "IRP, IEP, Gas Master Plan, Liquid Fuels Master Plan.",
        count: "4 categories",
        Icon: BatteryIcon,
    },
    {
        href: "/dashboard/energy-balance",
        title: "National Energy Planning",
        desc: "2024 NEB — primary supply, conversion, and final consumption by sector and commodity.",
        count: "8 sections · primary to final consumption",
        Icon: RippleIcon,
    },
];

export default function DashboardPage() {
    return (
        <main>
            <HeroSection eyebrow="Open Data" maxWidth="max-w-6xl">
                <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    <span className="text-[var(--color-accent)]">Datasets</span>
                </h1>
                <p className="mt-4 max-w-xl text-base text-[var(--color-ink-soft)] leading-relaxed">
                    Explore South African energy data across carriers, efficiency programmes, and long-term planning frameworks.
                </p>
            </HeroSection>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {SECTIONS.map((s) => (
                        <Link
                            key={s.href}
                            href={s.href}
                            className="group flex flex-col rounded-[var(--radius-card)] bg-white border border-[var(--color-hairline)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)]/40"
                        >
                            <div className="p-6 flex-1">
                                <div className="inline-flex h-11 w-11 items-center justify-center rounded-none bg-[var(--color-accent-soft)] text-[var(--color-ink)]">
                                    <s.Icon className="h-6 w-6" />
                                </div>
                                <h2 className="mt-4 text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                                    {s.title}
                                </h2>
                                <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] leading-relaxed">{s.desc}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-[var(--color-hairline)] px-6 py-3">
                                <span className="text-xs text-[var(--color-ink-soft)]/70">{s.count}</span>
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)]">
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
