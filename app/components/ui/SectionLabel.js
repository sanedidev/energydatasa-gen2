// The curi3-style numbered editorial section label: "01 WHAT WE DO". Use at
// true page-level section boundaries (a hero, a major content section) -
// not every small sub-caption, or the numbering becomes its own noise.
export default function SectionLabel({ number, dark = false, className = "", children }) {
    return (
        <div className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${dark ? "text-[var(--color-cream)]/60" : "text-[var(--color-ink-soft)]"} ${className}`}>
            {number != null && (
                <span className="text-[var(--color-accent)]">{String(number).padStart(2, "0")}</span>
            )}
            <span>{children}</span>
        </div>
    );
}
