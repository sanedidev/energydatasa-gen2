"use client";

import "@/app/ConfigureAmplify";
import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

// Amplify Storage image keys resolve to short-lived signed URLs, not a
// stable public URL, so this has to be a hook (not a pure sync helper) -
// cache per key so re-renders / repeated blocks don't refetch a still-valid
// URL.
const urlCache = new Map<string, { url: string; expiresAt: number }>();

export function useResolvedImageUrl(key: string | null | undefined): string | null {
    const [url, setUrl] = useState<string | null>(() => {
        if (!key) return null;
        const cached = urlCache.get(key);
        return cached && cached.expiresAt > Date.now() ? cached.url : null;
    });

    useEffect(() => {
        let cancelled = false;

        async function resolve() {
            if (!key) {
                if (!cancelled) setUrl(null);
                return;
            }
            const cached = urlCache.get(key);
            if (cached && cached.expiresAt > Date.now()) {
                if (!cancelled) setUrl(cached.url);
                return;
            }
            try {
                const result = await getUrl({ path: key });
                const resolvedUrl = result.url.toString();
                const expiresAt = result.expiresAt ? result.expiresAt.getTime() : Date.now() + 10 * 60 * 1000;
                urlCache.set(key, { url: resolvedUrl, expiresAt });
                if (!cancelled) setUrl(resolvedUrl);
            } catch {
                if (!cancelled) setUrl(null);
            }
        }

        resolve();
        return () => { cancelled = true; };
    }, [key]);

    return url;
}
