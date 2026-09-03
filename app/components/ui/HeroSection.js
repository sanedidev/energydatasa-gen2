export default function HeroSection({ eyebrow, dotColor = "bg-green-400", maxWidth = "max-w-7xl", padding = "pt-14 pb-14", children }) {
    return (
        <section
            className="relative overflow-hidden text-white"
            style={{ background: "linear-gradient(135deg, #0d1526 0%, #19223a 55%, #0f2a1c 100%)" }}
        >
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                    backgroundSize: "64px 64px",
                }}
            />
            <div className={`relative mx-auto ${maxWidth} px-4 md:px-6 ${padding}`}>
                {eyebrow && (
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 ring-1 ring-inset ring-white/15">
                        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
                        {eyebrow}
                    </div>
                )}
                {children}
            </div>
        </section>
    );
}
