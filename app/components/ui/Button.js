// curi3's two-button pattern: one solid filled button, one underlined text
// link - both with a trailing arrow. For page-level CTAs only; existing
// icon-only utility buttons (download/edit/delete) are untouched by this.
function ArrowIcon({ className = "h-4 w-4" }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    );
}

export function ButtonPrimary({ as: Tag = "button", className = "", children, ...rest }) {
    return (
        <Tag
            className={`inline-flex items-center gap-2 rounded-lg bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-cream)] transition-colors hover:bg-[var(--color-ink-soft)] ${className}`}
            {...rest}
        >
            {children}
            <ArrowIcon />
        </Tag>
    );
}

export function ButtonLink({ as: Tag = "a", className = "", children, ...rest }) {
    return (
        <Tag
            className={`inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink)] underline decoration-[var(--color-hairline)] underline-offset-4 transition-colors hover:decoration-[var(--color-ink)] ${className}`}
            {...rest}
        >
            {children}
            <ArrowIcon className="h-3.5 w-3.5" />
        </Tag>
    );
}
