import Link from "next/link";
import HeroSection from "./components/ui/HeroSection";

const topics = [
    { label: "Total Electricity Generated",     href: "/topics/total-electricity-generated" },
    { label: "Electricity Tariffs & Pricing",   href: "/topics/electricity-tariffs-pricing" },
    { label: "Installed Renewable Capacity",    href: "/topics/installed-renewable-capacity" },
    { label: "Energy Intensity of the Economy", href: "/topics/energy-intensity-economy" },
    { label: "CO₂ Emissions (Energy Sector)",   href: "/topics/co2-emissions-energy-sector" },
    { label: "Just Energy Transition",          href: "/topics/just-energy-transition" },
];

export default function Home() {
    return (
        <main>
            <HeroSection eyebrow="South Africa's Open Energy Platform" padding="pt-14 pb-12">
                <h1 className="text-3xl lg:text-5xl font-bold leading-tight tracking-tight max-w-3xl">
                    Open Data and Analytics
                    <br className="hidden sm:block" />
                    for a{" "}
                    <span className="text-green-400">sustainable energy</span>{" "}
                    future
                </h1>
                <p className="mt-4 text-base md:text-lg text-white/60 max-w-[52ch] leading-relaxed">
                    Explore how energy is produced, consumed, and changing in South Africa
                </p>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {topics.map((topic) => (
                        <Link
                            key={topic.href}
                            href={topic.href}
                            className="group flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-4 text-center text-sm font-medium text-white/80 transition-all hover:bg-white hover:text-[#0d1526] hover:border-transparent"
                        >
                            {topic.label}
                        </Link>
                    ))}
                </div>
            </HeroSection>
        </main>
    );
}
