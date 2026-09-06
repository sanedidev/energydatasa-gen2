import Link from "next/link";
import Breadcrumbs from "@/app/components/breadcrumbs";

export const metadata = { title: "Eskom Coal — Power Generating Stations" };

const BASE = "/dashboard/energy-carriers/electricity/generation/eskom/coal/power-generating-stations";

const stations = [
    "Arnot", "Camden", "Duvha", "Grootvlei", "Hendrina", "Kendal",
    "Komati", "Kriel", "Kusile", "Lethabo", "Majuba", "Matimba",
    "Matla", "Medupi", "Tutuka",
];

export default function Page() {
    return (
        <div className="space-y-8">
            <Breadcrumbs items={[
                { label: "Energy Carriers", href: "/dashboard/energy-carriers" },
                { label: "Electricity", href: "/dashboard/energy-carriers/electricity" },
                { label: "Generation", href: "/dashboard/energy-carriers/electricity/generation" },
                { label: "Eskom", href: "/dashboard/energy-carriers/electricity/generation/eskom" },
                { label: "Coal", href: "/dashboard/energy-carriers/electricity/generation/eskom/coal" },
                { label: "Power Generating Stations" },
            ]} />

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Power Generating Stations</h1>
                <p className="mt-2 text-sm text-slate-500">
                    {stations.length} Eskom coal-fired power stations — select a station to view details.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stations.map((name) => {
                    const slug = name.toLowerCase();
                    return (
                        <Link key={slug} href={`${BASE}/${slug}`}
                            className="group flex flex-col rounded-2xl bg-white ring-1 ring-slate-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex-1 p-5">
                                <h2 className="text-sm font-semibold text-slate-900 group-hover:text-green-700 transition-colors">{name}</h2>
                                <p className="mt-1 text-xs text-slate-400">Coal-fired power station</p>
                            </div>
                            <div className="flex items-center justify-end border-t border-slate-50 px-5 py-2.5">
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                                    Open
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
