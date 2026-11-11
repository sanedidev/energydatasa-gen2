// Replaces the hand-rolled `rounded-2xl ring-1 ring-slate-200 bg-white
// shadow-sm` idiom (repeated across dozens of files) with curi3's hairline-
// border look: a 1px border, no shadow, no ring. Rolled out incrementally,
// phase by phase, as each area of the site gets its restyle pass - not
// swapped in everywhere at once.
export default function Card({ as: Tag = "div", className = "", padded = true, children, ...rest }) {
    return (
        <Tag
            className={`rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-white ${padded ? "p-6" : ""} ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    );
}
