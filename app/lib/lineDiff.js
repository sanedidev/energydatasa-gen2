// Small LCS-based line diff for the edit-history "before/after" view - no
// external dependency. Good enough for content up to a few hundred lines
// (history entries are capped at 10000 chars server-side), not meant as a
// general-purpose diff library.

// Pretty-prints JSON content (most history entries are either a block-editor
// array or a plain object) so the diff lines up on real structure instead of
// one giant single-line blob; falls back to the raw text untouched.
export function prettyMaybeJson(text) {
    if (text === null || text === undefined) return "";
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return String(text);
    }
}

// Returns an array of { type: "same" | "add" | "remove", text } lines.
export function lineDiff(beforeText, afterText) {
    const a = (beforeText ?? "").split("\n");
    const b = (afterText ?? "").split("\n");
    const n = a.length, m = b.length;

    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
        for (let j = m - 1; j >= 0; j--) {
            dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
    }

    const result = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
        if (a[i] === b[j]) { result.push({ type: "same", text: a[i] }); i++; j++; }
        else if (dp[i + 1][j] >= dp[i][j + 1]) { result.push({ type: "remove", text: a[i] }); i++; }
        else { result.push({ type: "add", text: b[j] }); j++; }
    }
    while (i < n) { result.push({ type: "remove", text: a[i] }); i++; }
    while (j < m) { result.push({ type: "add", text: b[j] }); j++; }
    return result;
}
