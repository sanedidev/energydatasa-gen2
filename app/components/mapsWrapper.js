"use client";

// Dynamic import lives here (a Client Component) because
// `ssr: false` is not allowed in Server Components.
import dynamic from "next/dynamic";

const Maps = dynamic(() => import("./maps"), {
    ssr: false,
    loading: () => (
        <main className="min-h-screen bg-white">
            <section className="mx-auto max-w-7xl px-6 py-10">
                <div className="mt-14 h-155 animate-pulse rounded-2xl bg-slate-100" />
            </section>
        </main>
    ),
});

export default function MapsWrapper() {
    return <Maps />;
}
