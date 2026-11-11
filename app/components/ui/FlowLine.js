// A thin animated gradient line - the redesign's one recurring "energy
// flow" motif, used wherever one section hands off to the next instead of
// a hard border. Generalizes what energy-balance/page.js used to call
// .card-accent (a one-off local style) into a shared component so the
// motif reads as one consistent thread across the site.
export default function FlowLine({ className = "", from = "var(--color-accent)", to = "var(--color-link)" }) {
    return (
        <div
            className={`flow-line ${className}`}
            style={{ "--flow-a": from, "--flow-b": to }}
        />
    );
}
