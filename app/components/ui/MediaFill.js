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
// used for AudienceProfile.logo, InsightArticle.imageKey and ImageBlock.key.
// All three are plain strings, so a chosen animated icon is stored as
// "icon:<id>" in the very same field - this renders either case, filling
// whatever box the caller already sizes (56px logo, cover-aspect card,
// or a content block's width%/maxHeight), so the icon naturally scales
// with whichever of those contexts it's used in.
export default function MediaFill({ value, alt = "", fallback = DEFAULT_FALLBACK, className = "" }) {
    const iconId = parseIconRef(value);
    const src = useResolvedImageUrl(iconId ? null : value);

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
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}
