"use client";

import { useEffect, useRef, useState } from "react";

// Counts a numeric value up from its previous value (0 on first mount)
// whenever `value` changes, running it through the same `format` function
// used for the final display - so "35,482 PJ" counts up digit-by-digit
// instead of just popping in.
//
// This is the one deliberate exception to this redesign's "CSS keyframes
// only, no requestAnimationFrame loop" rule (see ui/motion.css): counting
// through real formatted text content can't be done with a CSS keyframe,
// which only tweens style properties. The loop is short and bounded (it
// runs once per value change and stops), not an ambient/infinite effect,
// so it doesn't carry the performance risk that rule exists to avoid.
export default function AnimatedNumber({ value, format = (n) => String(Math.round(n)), duration = 900 }) {
    const [display, setDisplay] = useState(0);
    const prevValue = useRef(0);
    const reduceMotionRef = useRef(false);

    useEffect(() => {
        reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    useEffect(() => {
        if (!Number.isFinite(value)) return;
        if (reduceMotionRef.current) {
            setDisplay(value);
            prevValue.current = value;
            return;
        }
        const from = prevValue.current;
        const to = value;
        const start = performance.now();
        let raf;
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(from + (to - from) * eased);
            if (t < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                prevValue.current = to;
            }
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value, duration]);

    return format(display);
}
