/**
 * Client-side helpers for the manage-content Lambda mutation - the sole
 * write path for PageContent, InsightArticle and AudienceProfile now that
 * their schema auth no longer grants authenticated-user write access (see
 * amplify/data/resource.ts). The Lambda re-derives the caller's
 * editablePages server-side from `pageKeys` and enforces it there; these
 * helpers just make the call sites read like the direct model calls they
 * replace.
 */

import { apiClient as client } from "@/app/lib/apiClient";

/** Create-or-update a PageContent record by slug. Mirrors the old
 * find-by-slug-then-create-or-update pattern every call site used to do
 * itself - the Lambda now does that lookup server-side in one round trip. */
export async function upsertPageContent({ slug, content, pageKeys, historyLabel }) {
    const { data, errors } = await client.mutations.manageContent({
        model: "PageContent",
        op: "upsert",
        slug,
        pageKeys,
        historyLabel,
        // The data argument is AWSJSON - AppSync requires that to be sent as
        // a JSON-encoded string, not a raw object (the generated client
        // doesn't do this stringification for you on custom mutation
        // arguments, only on model fields).
        data: JSON.stringify({ content }),
    });
    if (errors?.length) throw new Error(errors[0].message ?? "Failed to save.");
    return data?.record;
}

export async function deletePageContentById({ id, pageKeys, historyLabel }) {
    const { errors } = await client.mutations.manageContent({
        model: "PageContent",
        op: "delete",
        id,
        pageKeys,
        historyLabel,
    });
    if (errors?.length) throw new Error(errors[0].message ?? "Failed to delete.");
}

/** Create a new record on InsightArticle or AudienceProfile. `data` must
 * include `slug` plus the model's own fields. */
export async function createContentRecord({ model, data, pageKeys, historyLabel }) {
    const { data: result, errors } = await client.mutations.manageContent({
        model, op: "create", data: JSON.stringify(data), pageKeys, historyLabel,
    });
    if (errors?.length) throw new Error(errors[0].message ?? "Failed to create.");
    return result?.record;
}

export async function updateContentRecord({ model, id, data, pageKeys, historyLabel }) {
    const { data: result, errors } = await client.mutations.manageContent({
        model, op: "update", id, data: JSON.stringify(data), pageKeys, historyLabel,
    });
    if (errors?.length) throw new Error(errors[0].message ?? "Failed to save.");
    return result?.record;
}

export async function deleteContentRecord({ model, id, pageKeys, historyLabel }) {
    const { errors } = await client.mutations.manageContent({
        model, op: "delete", id, pageKeys, historyLabel,
    });
    if (errors?.length) throw new Error(errors[0].message ?? "Failed to delete.");
}
