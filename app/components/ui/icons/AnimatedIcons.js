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
