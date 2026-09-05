"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SectionNav from "./_section-nav";

const HEADER_H = 64;

export default function EnergyPlanningLayout({ children }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        function close() { setOpen(false); }
        close();
    }, [pathname]);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-28">
            {/* Mobile nav toggle */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open section navigation"
                className="md:hidden fixed right-4 z-50 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                style={{ top: `calc(env(safe-area-inset-top, 0px) + ${HEADER_H + 10}px)` }}
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
                Menu
            </button>

            <div className="relative md:flex md:gap-10">
                {/* Desktop sidebar */}
                <aside className="hidden md:block sticky top-18 z-10 w-60 shrink-0 self-start border-r border-slate-100 pr-6">
                    <SectionNav />
                </aside>

                {/* Mobile drawer */}
                {open && (
                    <div className="md:hidden fixed inset-0 z-40">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />
                        <div
                            className="absolute left-0 w-[85%] max-w-[20rem] overflow-y-auto bg-white shadow-xl"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                top: `calc(env(safe-area-inset-top, 0px) + ${HEADER_H}px)`,
                                height: `calc(100vh - env(safe-area-inset-top, 0px) - ${HEADER_H}px)`,
                            }}
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Energy Planning
                                </p>
                                <button
                                    onClick={() => setOpen(false)}
                                    aria-label="Close section menu"
                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <SectionNav />
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 min-w-0">{children}</main>
            </div>
        </div>
    );
}
