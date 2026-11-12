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
