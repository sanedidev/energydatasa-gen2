"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// A link back into the NEB family that carries the current ?year= along,
// for the few NEB pages (like the methodology page) that are server
// components and so can't just read activeYear from useNEBData() directly.
// Without this, navigating away from a year-scoped page drops the
// selection and falls back to a default year.
export default function NEBBackLink({ href, className, children }) {
    const searchParams = useSearchParams();
    const year = searchParams.get("year");
    return (
        <Link href={year ? `${href}?year=${year}` : href} className={className}>
            {children}
        </Link>
    );
}
