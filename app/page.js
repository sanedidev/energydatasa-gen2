"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient as client } from "@/app/lib/apiClient";
import HeroSection from "./components/ui/HeroSection";
import HomeEnergyInsights from "./components/HomeEnergyInsights";
import HomeAudiences from "./components/HomeAudiences";

const topics = [
    { label: "Total Electricity Generated",     href: "/topics/total-electricity-generated" },
    { label: "Electricity Tariffs & Pricing",   href: "/topics/electricity-tariffs-pricing" },
    { label: "Installed Renewable Capacity",    href: "/topics/installed-renewable-capacity" },
    { label: "Energy Intensity of the Economy", href: "/topics/energy-intensity-economy" },
    { label: "CO₂ Emissions (Energy Sector)",   href: "/topics/co2-emissions-energy-sector" },
    { label: "Just Energy Transition",          href: "/topics/just-energy-transition" },
];

function Hero() {
    return (
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
    );
}

export default function Home() {
    const [articles,  setArticles]  = useState([]);
    const [audiences, setAudiences] = useState([]);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [insightsRes, insightsHiddenRes, audiencesRes, audiencesHiddenRes] = await Promise.all([
                    client.models.InsightArticle.list({ authMode: "apiKey" }),
                    client.models.PageContent.pageContentBySlug({ slug: "energyinsights.hidden" }, { authMode: "apiKey" }),
                    client.models.AudienceProfile.list({ authMode: "apiKey" }),
                    client.models.PageContent.pageContentBySlug({ slug: "whoisitfor.hidden" }, { authMode: "apiKey" }),
                ]);

                if (cancelled) return;

                let hiddenInsights = new Set();
                try { hiddenInsights = new Set(JSON.parse(insightsHiddenRes?.data?.[0]?.content ?? "[]")); } catch {}
                let hiddenAudiences = new Set();
                try { hiddenAudiences = new Set(JSON.parse(audiencesHiddenRes?.data?.[0]?.content ?? "[]")); } catch {}

                const insightItems  = (insightsRes?.data  ?? []).filter((a) => a && !hiddenInsights.has(a.id));
                const audienceItems = (audiencesRes?.data ?? []).filter((a) => a && !hiddenAudiences.has(a.id));

                setArticles(insightItems);
                setAudiences(audienceItems);
            } catch (err) {
                console.error("Failed to load home content", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <main className="animate-pulse">
                <Hero />
                <div className="mx-auto max-w-7xl px-4 md:px-6 pb-16 pt-16 space-y-6">
                    <div className="space-y-2">
                        <div className="h-3 w-16 rounded-full bg-slate-100" />
                        <div className="h-8 w-64 rounded-2xl bg-slate-100" />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-2xl bg-slate-50 overflow-hidden">
                                <div className="aspect-video bg-slate-100" />
                                <div className="p-6 space-y-3">
                                    <div className="h-5 w-3/4 rounded-full bg-slate-100" />
                                    <div className="h-3 w-full rounded-full bg-slate-100" />
                                    <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                                    <div className="h-3 w-16 rounded-full bg-slate-100 mt-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main>
            <Hero />
            <HomeEnergyInsights articles={articles} />
            <HomeAudiences audiences={audiences} />
        </main>
    );
}
