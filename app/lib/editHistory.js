/**
 * Edit history — reads the log of content changes stored in PageContent
 * under the slug "__history__.__index__".
 *
 * Writing history entries is no longer done from here - every write that
 * goes through the manage-content Lambda (see CarrierIndexPage, maps.js,
 * EditablePageHeader, etc.) logs its own history entry server-side as part
 * of that same call. This file now only reads history and reverts entries,
 * both via manage-content too (revert needs the same server-side
 * re-verification as any other write).
 */

import { apiClient as client } from "@/app/lib/apiClient";

const HISTORY_SLUG = "__history__.__index__";

/**
 * Fetch all history entries (newest first).
 */
export async function fetchHistory() {
    try {
        const res = await client.models.PageContent.pageContentBySlug({ slug: HISTORY_SLUG }, { authMode: "apiKey" });
        const rec = res.data?.[0];
        if (rec?.content) return JSON.parse(rec.content);
    } catch {}
    return [];
}

/**
 * Revert a history entry — restores the `before` content for its slug.
 * Admin-only (enforced server-side by manage-content). Returns true on success.
 */
export async function revertEntry(_client, entry) {
    if (entry.before === null || entry.before === undefined) return false;
    try {
        const { data, errors } = await client.mutations.manageContent({
            model: "PageContent",
            op: "revert",
            slug: entry.slug,
            data: { content: entry.before },
        });
        if (errors?.length) return false;
        return !!data?.ok;
    } catch {
        return false;
    }
}

/**
 * Turn a raw slug into a readable label for display.
 * e.g. "topic.total-electricity-generated.__sections__"
 *   → "Total Electricity Generated · Sections Config"
 */
export function labelFromSlug(slug) {
    if (!slug) return slug;
    const parts = slug.split(".").map((p) =>
        p.replace(/^__(.+)__$/, "$1")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
    );
    return parts.join(" · ");
}
