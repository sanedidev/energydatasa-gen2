// One shared "Source: X · Y" line - the fix for the year/source sentence
// that used to be independently re-typed (with drifting punctuation) across
// the NEB overview, sector, primary-supply and conversion pages. Each page
// should call this exactly once near its hero and drop any other
// restatement of the same fact (footer "Source:" lines, a second card's
// subtitle, etc.) rather than keep both.
export default function SourceLine({ source, date, year, unit, className = "" }) {
    const parts = [source, date, year != null ? String(year) : null, unit].filter(Boolean);
    if (parts.length === 0) return null;
    return <p className={`text-xs text-[var(--color-ink-soft)] ${className}`}>Source: {parts.join(" · ")}</p>;
}
