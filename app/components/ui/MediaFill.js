"use client";

import { useResolvedImageUrl } from "@/app/components/editableContent/useResolvedImageUrl";
import { parseIconRef, getIconEntry } from "@/app/lib/animatedIconRegistry";

const DEFAULT_FALLBACK = (
    <div className="flex h-full w-full items-center justify-center text-[var(--color-ink-soft)]/40">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
        </svg>
    </div>
);

// Drop-in replacement for the old `useResolvedImageUrl` + <Image> pairing
// used for AudienceProfile.logo, InsightArticle.imageKey, ImageBlock.key,
// and partner logos. All are plain strings, so a chosen animated icon is
// stored as "icon:<id>" in the very same field - this renders any of the
// three cases a value can be (an animated icon ref, a static /public path
// such as a seeded default partner logo, or a Storage key needing a
// signed URL), filling whatever box the caller already sizes, so the same
// icon or image naturally scales with whichever context it's used in.
export default function MediaFill({ value, alt = "", fallback = DEFAULT_FALLBACK, className = "", fit = "cover" }) {
    const iconId = parseIconRef(value);
    const isStaticPath = !iconId && typeof value === "string" && value.startsWith("/");
    const resolved = useResolvedImageUrl(iconId || isStaticPath ? null : value);
    const src = isStaticPath ? value : resolved;

    if (iconId) {
        const entry = getIconEntry(iconId);
        if (!entry) return fallback;
        const { Icon } = entry;
        return (
            <div className={`flex h-full w-full items-center justify-center bg-[var(--color-accent-soft)] ${className}`}>
                <Icon className="h-[55%] w-[55%] text-[var(--color-accent)]" />
            </div>
        );
    }

    if (!src) return fallback;
    return <img src={src} alt={alt} className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`} />;
}
