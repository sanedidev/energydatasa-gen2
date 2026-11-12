"use client";

import { useEffect, useState } from "react";

// A small family of new, purpose-built animated line icons - not ports of
// curi3's own icons (a spinning turbine, a traveling current on wires).
// Each one pairs a different subject with a different animation mechanism
// (radial pulse, path-travel, fill-level, sway, expanding ring), so the
// motif doesn't read as "the same icon reskinned" five times over. Thin
// ink line-art; the teal accent appears only on whatever is actually
// "live" in each mark. All respect prefers-reduced-motion via motion.css,
// except LiveReadingIcon - its travel is SMIL (<animateMotion>), which
// that CSS-class guard can't reach, so it checks the media query directly.
function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const onChange = (e) => setReduced(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return reduced;
}

export function SolarIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="1.1" />
            <g className="motion-sun-breathe" stroke="var(--color-accent)" strokeWidth="1.3" strokeLinecap="round">
                <line x1="24" y1="8" x2="24" y2="3" />
                <line x1="24" y1="40" x2="24" y2="45" />
                <line x1="8" y1="24" x2="3" y2="24" />
                <line x1="40" y1="24" x2="45" y2="24" />
                <line x1="13" y1="13" x2="9.5" y2="9.5" />
                <line x1="35" y1="35" x2="38.5" y2="38.5" />
                <line x1="13" y1="35" x2="9.5" y2="38.5" />
                <line x1="35" y1="13" x2="38.5" y2="9.5" />
            </g>
        </svg>
    );
}

// A pulse tracing a live-data waveform - fits "Energy Data SA" specifically,
// not generic energy iconography.
export function LiveReadingIcon({ className = "h-10 w-10" }) {
    const path = "M2,16 L22,16 L28,5 L36,27 L42,16 L78,16";
    const reduced = useReducedMotion();
    return (
        <svg className={className} viewBox="0 0 80 32" fill="none">
            <path d={path} stroke="currentColor" strokeWidth="1" />
            {reduced ? (
                <circle cx="42" cy="16" r="2" fill="var(--color-accent)" />
            ) : (
                <circle r="2" fill="var(--color-accent)">
                    <animateMotion dur="3.6s" repeatCount="indefinite" path={path} />
                </circle>
            )}
        </svg>
    );
}

export function BatteryIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 28" fill="none">
            <rect x="2" y="4" width="38" height="20" rx="1" stroke="currentColor" strokeWidth="1.1" />
            <rect x="41" y="10" width="4" height="8" fill="currentColor" />
            <rect className="motion-battery-charge" x="6" y="8" width="18" height="12" fill="var(--color-accent)" />
        </svg>
    );
}

// A leaf, gently swaying rather than spinning - for efficiency/
// sustainability-themed sections.
export function LeafIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g className="motion-leaf-sway" style={{ transformOrigin: "24px 40px" }}>
                <path
                    d="M24 40 C24 26 15 16 10 10 C24 10 36 18 36 30 C36 36 30 40 24 40 Z"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                />
                <path d="M24 40 C22 30 18 20 11 11" stroke="var(--color-accent)" strokeWidth="1.1" />
            </g>
        </svg>
    );
}

// Concentric rings expanding and fading from a center point - for hydro/
// water-related sections, or anywhere a "reading just landed" moment fits.
export function RippleIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="2" fill="var(--color-accent)" />
            <circle className="motion-ripple" cx="24" cy="24" r="6" stroke="var(--color-accent)" strokeWidth="1" />
            <circle className="motion-ripple motion-ripple-delay" cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1" />
        </svg>
    );
}

// A slowly turning wind turbine - for the Wind energy carrier. The blades
// are the only accent-colored, moving part; pole and hub stay ink.
export function WindIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <line x1="24" y1="44" x2="24" y2="20" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <g className="motion-turbine-spin" style={{ transformOrigin: "24px 18px" }} fill="var(--color-accent)">
                <path d="M24 18 C22 11 22 5 24 2 C26 5 26 11 24 18 Z" />
                <path d="M24 18 C22 11 22 5 24 2 C26 5 26 11 24 18 Z" transform="rotate(120 24 18)" />
                <path d="M24 18 C22 11 22 5 24 2 C26 5 26 11 24 18 Z" transform="rotate(240 24 18)" />
            </g>
            <circle cx="24" cy="18" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </svg>
    );
}

// A flickering flame - for Natural Gas and other combustion-based carriers.
export function FlameIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g className="motion-flame-flicker" style={{ transformOrigin: "24px 42px" }}>
                <path
                    d="M24 6 C16 14 14 22 14 28 C14 36.5 19 42 24 42 C29 42 34 36.5 34 28 C34 22 32 14 24 6 Z"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                />
                <path
                    d="M24 20 C21 24 20 28 20 31 C20 35 22 38 24 38 C26 38 28 35 28 31 C28 28 27 24 24 20 Z"
                    fill="var(--color-accent)"
                />
            </g>
        </svg>
    );
}

// A classic atom - for Nuclear / Uranium. One full orbit ring plus its
// electron spins together (the common simplified "atom" convention); the
// other two orbits stay still, ink only.
export function NuclearIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <ellipse cx="24" cy="24" rx="16" ry="6" stroke="currentColor" strokeWidth="1" transform="rotate(60 24 24)" />
            <ellipse cx="24" cy="24" rx="16" ry="6" stroke="currentColor" strokeWidth="1" transform="rotate(-60 24 24)" />
            <g className="motion-atom-orbit" style={{ transformOrigin: "24px 24px" }}>
                <ellipse cx="24" cy="24" rx="16" ry="6" stroke="currentColor" strokeWidth="1" />
                <circle cx="40" cy="24" r="2.2" fill="var(--color-accent)" />
            </g>
            <circle cx="24" cy="24" r="2" fill="currentColor" />
        </svg>
    );
}

// A droplet gently bobbing - for Oil / Petroleum.
export function OilIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g className="motion-drop-bob">
                <path
                    d="M24 6 C16 16 12 24 12 30 C12 36.5 17.5 42 24 42 C30.5 42 36 36.5 36 30 C36 24 32 16 24 6 Z"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinejoin="round"
                />
                <path
                    d="M24 18 C19 25 17 29 17 32.5 C17 36.5 20 39 24 39 C28 39 31 36.5 31 32.5 C31 29 29 25 24 18 Z"
                    fill="var(--color-accent)"
                    opacity="0.85"
                />
            </g>
        </svg>
    );
}

// A transmission tower with two beacon lights blinking in alternation -
// for the electricity grid / transmission & distribution.
export function PylonIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                <line x1="14" y1="44" x2="22" y2="10" />
                <line x1="34" y1="44" x2="26" y2="10" />
                <line x1="14" y1="34" x2="34" y2="34" />
                <line x1="16.5" y1="22" x2="31.5" y2="22" />
                <line x1="14" y1="10" x2="34" y2="10" />
            </g>
            <circle className="motion-beacon" cx="14" cy="10" r="1.6" fill="var(--color-accent)" />
            <circle className="motion-beacon motion-beacon-delay" cx="34" cy="10" r="1.6" fill="var(--color-accent)" />
        </svg>
    );
}

// A factory with smoke rising in staggered puffs - for the Industry sector.
export function FactoryIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <path
                d="M8 42 V26 L18 32 V26 L28 32 V22 L40 14 V42 Z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
            />
            <line x1="33" y1="14" x2="33" y2="6" stroke="currentColor" strokeWidth="1.1" />
            <circle className="motion-smoke" cx="33" cy="8" r="2" fill="var(--color-accent)" />
            <circle className="motion-smoke motion-smoke-delay-1" cx="33" cy="8" r="2" fill="var(--color-accent)" />
            <circle className="motion-smoke motion-smoke-delay-2" cx="33" cy="8" r="2" fill="var(--color-accent)" />
        </svg>
    );
}

// Three figures with a ripple of movement passing through them, like a
// wave through a crowd - for the "General Public" audience. The front
// figure is accent-colored; the two behind stay ink.
export function PeopleIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g transform="translate(11,6) scale(0.8)">
                <g className="motion-crowd-bounce motion-crowd-delay-1">
                    <circle cx="0" cy="6" r="4" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M-7,25 C-7,16 -3.5,12 0,12 C3.5,12 7,16 7,25 Z" stroke="currentColor" strokeWidth="1.1" />
                </g>
            </g>
            <g transform="translate(37,6) scale(0.8)">
                <g className="motion-crowd-bounce motion-crowd-delay-2">
                    <circle cx="0" cy="6" r="4" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M-7,25 C-7,16 -3.5,12 0,12 C3.5,12 7,16 7,25 Z" stroke="currentColor" strokeWidth="1.1" />
                </g>
            </g>
            <g transform="translate(24,9)">
                <g className="motion-crowd-bounce">
                    <circle cx="0" cy="6" r="4.5" fill="var(--color-accent)" />
                    <path d="M-8,27 C-8,17 -4,13 0,13 C4,13 8,17 8,27 Z" fill="var(--color-accent)" />
                </g>
            </g>
        </svg>
    );
}

// A small bar chart growing - for "Industry & Investors". Each bar grows
// and settles on its own stagger, like a steadily climbing trend.
export function GrowthIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <line x1="8" y1="40" x2="40" y2="40" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <rect className="motion-grow-bar" x="13" y="28" width="6" height="12" style={{ transformOrigin: "16px 40px" }} fill="var(--color-accent)" opacity="0.55" />
            <rect className="motion-grow-bar motion-grow-delay-1" x="24" y="20" width="6" height="20" style={{ transformOrigin: "27px 40px" }} fill="var(--color-accent)" opacity="0.75" />
            <rect className="motion-grow-bar motion-grow-delay-2" x="35" y="10" width="6" height="30" style={{ transformOrigin: "38px 40px" }} fill="var(--color-accent)" />
        </svg>
    );
}

// A government building with a waving flag - for "Municipalities".
export function TownHallIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
                <path d="M9 19 L24 8 L39 19" />
                <line x1="6" y1="19" x2="42" y2="19" />
                <line x1="14" y1="22" x2="14" y2="35" />
                <line x1="20" y1="22" x2="20" y2="35" />
                <line x1="28" y1="22" x2="28" y2="35" />
                <line x1="34" y1="22" x2="34" y2="35" />
                <line x1="6" y1="35" x2="42" y2="35" />
                <line x1="4" y1="40" x2="44" y2="40" />
            </g>
            <line x1="24" y1="8" x2="24" y2="1" stroke="currentColor" strokeWidth="1.1" />
            <g className="motion-flag-wave" style={{ transformOrigin: "24px 2px" }}>
                <path d="M24 1 L33 3.5 L24 6 Z" fill="var(--color-accent)" />
            </g>
        </svg>
    );
}

// A graduation cap with a swinging tassel - for "Students & Researchers".
export function GraduationIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <path d="M6 18 L24 9 L42 18 L24 27 Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
            <path d="M15 21.5 L15 29 C15 32.5 33 32.5 33 29 L33 21.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <g className="motion-tassel-swing" style={{ transformOrigin: "24px 18px" }}>
                <line x1="24" y1="18" x2="31" y2="30" stroke="var(--color-accent)" strokeWidth="1.1" strokeLinecap="round" />
                <circle cx="31" cy="32" r="1.8" fill="var(--color-accent)" />
            </g>
        </svg>
    );
}

// A document being stamped - for "Policy & Government".
export function StampIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
                <rect x="9" y="13" width="21" height="27" rx="1" />
                <line x1="13.5" y1="20" x2="25.5" y2="20" strokeLinecap="round" />
                <line x1="13.5" y1="25" x2="25.5" y2="25" strokeLinecap="round" />
                <line x1="13.5" y1="30" x2="21" y2="30" strokeLinecap="round" />
            </g>
            <g className="motion-stamp-thump" stroke="var(--color-accent)" strokeWidth="1.1" strokeLinejoin="round">
                <path d="M28 2 L36 2 L34 8 L30 8 Z" />
                <rect x="23" y="8" width="14" height="4" rx="1" />
            </g>
        </svg>
    );
}

// A small heap of coal lumps with a pulsing ember - for the Coal carrier.
// Angular, faceted lumps (not rounded bumps) so it reads as rock, not cloud.
export function CoalIcon({ className = "h-10 w-10" }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none">
            <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
                <path d="M11 38 L10 29 L16 23 L25 21 L33 25 L35 33 L32 38 Z" />
                <path d="M5 38 L6 32 L13 29 L19 33 L18 38 Z" />
                <path d="M27 38 L28 31 L36 28 L42 33 L41 38 Z" />
            </g>
            <circle className="motion-ember-glow" cx="22" cy="30" r="2" fill="var(--color-accent)" />
        </svg>
    );
}
