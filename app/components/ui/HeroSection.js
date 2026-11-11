import SectionLabel from "./SectionLabel";
import FlowLine from "./FlowLine";

// One shared hero for the whole site: "light" (cream-on-ink, the default -
// nearly every hero, including the homepage) or "dark" (ink-on-cream
// inverted, reserved for the few places that want one deliberate dark
// moment - see the redesign plan's NEB section). Replaces 9 one-off
// hardcoded gradients that used to vary per page/sector for no real reason.
// The flow-line hand-off at the bottom is the one recurring motion motif
// tying every hero to the content below it, instead of a hard edge.
export default function HeroSection({ eyebrow, number, variant = "light", maxWidth = "max-w-7xl", padding = "pt-14 pb-14", children }) {
    const dark = variant === "dark";
    return (
        <section className={dark ? "bg-[var(--color-ink)] text-[var(--color-cream)]" : "bg-[var(--color-cream)] text-[var(--color-ink)]"}>
            <div className={`mx-auto ${maxWidth} px-4 md:px-6 ${padding}`}>
                {eyebrow && <SectionLabel number={number} dark={dark}>{eyebrow}</SectionLabel>}
                {children}
            </div>
            <FlowLine />
        </section>
    );
}
