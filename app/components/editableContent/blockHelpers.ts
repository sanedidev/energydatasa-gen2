// Pure helpers — no React, fully testable in isolation

// ── Block types ───────────────────────────────────────────────────────────────

export type ImageBlock = {
    type: "image";
    key: string;
    width?: number;
    maxHeight?: number;
    align?: "left" | "center" | "right";
    hidden?: boolean;
};

export type TitleBlock = {
    type: "title";
    title: string;
    subtitle?: string;
    hidden?: boolean;
};

export type SectionBlock = {
    type: "section";
    label: string;
    hidden?: boolean;
};

export type TextBlock = {
    type: "text";
    content: string;
    bg?: string;
    hidden?: boolean;
};

/** A block is a plain string (legacy text) or one of the typed object variants. */
export type Block = string | ImageBlock | TitleBlock | SectionBlock | TextBlock;

// ── Type guards ───────────────────────────────────────────────────────────────

export function isImageBlock(b: unknown): b is ImageBlock {
    return typeof b === "object" && b !== null && (b as ImageBlock).type === "image";
}

export function isTitleBlock(b: unknown): b is TitleBlock {
    return typeof b === "object" && b !== null && (b as TitleBlock).type === "title";
}

export function isSectionBlock(b: unknown): b is SectionBlock {
    return typeof b === "object" && b !== null && (b as SectionBlock).type === "section";
}

// ── Accessors ─────────────────────────────────────────────────────────────────

export function getBlockText(b: Block): string {
    return typeof b === "string" ? b : ((b as TextBlock).content ?? "");
}

export function isHiddenBlock(b: Block): boolean {
    return typeof b === "object" && b !== null && (b as { hidden?: boolean }).hidden === true;
}

export function getBlockBg(b: Block): string {
    return (typeof b === "object" && b !== null && (b as TextBlock).bg) ? (b as TextBlock).bg! : "gray";
}

export function blockHasContent(b: Block): boolean {
    if (isImageBlock(b))   return !!b.key;
    if (isTitleBlock(b))   return !!(b.title?.trim());
    if (isSectionBlock(b)) return !!(b.label?.trim());
    return getBlockText(b).trim().length > 0;
}

// ── Serialization ─────────────────────────────────────────────────────────────

export function parseBlocks(raw: string | null | undefined): Block[] {
    if (!raw) return [""];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as Block[];
    } catch { /* legacy plain string */ }
    return [raw];
}

export function serializeBlocks(blocks: Block[]): string {
    return JSON.stringify(blocks);
}

// ── Image URL ─────────────────────────────────────────────────────────────────

export function resolveImageUrl(key: string | null | undefined): string | null {
    if (!key) return null;
    const base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
    return base ? `${base}/${key}` : null;
}

// ── View-mode background classes ──────────────────────────────────────────────

export const BG_VIEW: Record<string, string> = {
    gray:  "rounded-xl border border-slate-100 bg-slate-50 px-4 py-3",
    white: "rounded-xl border border-slate-200 bg-white px-4 py-3",
    none:  "py-1",
    green: "rounded-xl border border-green-100 bg-green-50 px-4 py-3",
    blue:  "rounded-xl border border-blue-100 bg-blue-50 px-4 py-3",
    amber: "rounded-xl border border-amber-100 bg-amber-50 px-4 py-3",
};

// ── Format helpers ────────────────────────────────────────────────────────────

type FormatType = "bold" | "italic" | "h1" | "h2" | "h3" | "ul" | "ol" | "normal";

export function applyFormat(
    blocks: Block[],
    setBlocks: (b: Block[]) => void,
    refs: { current: HTMLTextAreaElement[] },
    idx: number,
    type: FormatType,
): void {
    const el = refs.current[idx];
    if (!el) return;

    const draft = blocks[idx] as string;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const selected = draft.slice(s, e);
    const pre = draft.slice(0, s);
    const post = draft.slice(e);

    let next = draft;
    let cur = e;

    if (type === "bold") {
        const wrapped = `**${selected || "bold"}**`;
        next = pre + wrapped + post;
        cur = s + wrapped.length;
    } else if (type === "italic") {
        const wrapped = `*${selected || "italic"}*`;
        next = pre + wrapped + post;
        cur = s + wrapped.length;
    } else {
        const lineStart = pre.lastIndexOf("\n") + 1;
        const lineText = draft.slice(lineStart);
        const stripped = lineText.replace(/^(#{1,3} |[-*] |\d+\. )/, "");

        if (type === "h1")          next = draft.slice(0, lineStart) + "# "   + stripped;
        else if (type === "h2")     next = draft.slice(0, lineStart) + "## "  + stripped;
        else if (type === "h3")     next = draft.slice(0, lineStart) + "### " + stripped;
        else if (type === "ul")     next = draft.slice(0, lineStart) + "- "   + stripped;
        else if (type === "ol")     next = draft.slice(0, lineStart) + "1. "  + stripped;
        else if (type === "normal") next = draft.slice(0, lineStart) + stripped;
        cur = s;
    }

    const updated = [...blocks];
    updated[idx] = next;
    setBlocks(updated);
    requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(cur, cur);
    });
}
