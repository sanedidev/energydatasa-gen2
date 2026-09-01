/**
 * Edit history — stores a log of content changes in PageContent
 * under the slug "__history__.__index__".
 *
 * Each entry: { id, slug, label, email, action, timestamp, before, after }
 * - action: "update" | "create"
 * - before/after: serialised content string (may be truncated for large payloads)
 *
 * The index is capped at MAX_ENTRIES. Older entries fall off automatically.
 *
 * Note: this reuses PageContent for a system purpose, same pattern as the
 * original app - but unlike the old __admin__/__permissions__ records, this
 * one is just an audit log and grants no privilege, so reusing the
 * any-signed-in-user-can-write model here is fine.
 */

import { apiClient as client } from "@/app/lib/apiClient";

const HISTORY_SLUG  = "__history__.__index__";
const MAX_ENTRIES   = 150;
const MAX_CONTENT   = 4000; // chars to store per before/after

function truncate(str) {
    if (!str || str.length <= MAX_CONTENT) return str ?? null;
    return str.slice(0, MAX_CONTENT) + "…[truncated]";
}

async function fetchBySlug(slug) {
    const res = await client.models.PageContent.pageContentBySlug({ slug });
    return res.data?.[0] ?? null;
}

/**
 * Log a content change. The `_client` param is kept (but unused) for call-site
 * compatibility with every caller ported from the original app.
 */
export async function logEdit(_client, { slug, label, email, action, before, after }) {
    if (!email) return; // unauthenticated — skip
    try {
        const id    = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const entry = {
            id,
            slug,
            label: label || slug,
            email,
            action,
            timestamp: new Date().toISOString(),
            before:    truncate(before),
            after:     truncate(after),
        };

        const rec = await fetchBySlug(HISTORY_SLUG);
        let entries = [];
        if (rec?.content) {
            try { entries = JSON.parse(rec.content); } catch {}
        }

        entries = [entry, ...entries].slice(0, MAX_ENTRIES);
        const content = JSON.stringify(entries);

        if (rec?.id) {
            await client.models.PageContent.update({ id: rec.id, content });
        } else {
            await client.models.PageContent.create({ slug: HISTORY_SLUG, content });
        }
    } catch (err) {
        // Non-fatal — history failure must never break saves
        console.warn("[editHistory] failed to log:", err?.message ?? err);
    }
}

/**
 * Fetch all history entries (newest first).
 */
export async function fetchHistory() {
    try {
        const rec = await fetchBySlug(HISTORY_SLUG);
        if (rec?.content) return JSON.parse(rec.content);
    } catch {}
    return [];
}

/**
 * Revert a history entry — restores the `before` content for its slug.
 * Returns true on success.
 */
export async function revertEntry(_client, entry) {
    if (entry.before === null || entry.before === undefined) return false;
    const rec = await fetchBySlug(entry.slug);
    if (!rec?.id) return false;
    await client.models.PageContent.update({ id: rec.id, content: entry.before });
    return true;
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
