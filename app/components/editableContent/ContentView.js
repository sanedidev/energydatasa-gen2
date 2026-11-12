"use client";

import Image from "next/image";
import { BG_VIEW, blockHasContent, getBlockBg, getBlockText, isHiddenBlock, isImageBlock, isSectionBlock, isTitleBlock } from "./blockHelpers";
import { useResolvedImageUrl } from "./useResolvedImageUrl";
import MarkdownContent from "./MarkdownContent";

function ImageBlockView({ block }) {
    const src = useResolvedImageUrl(block.key);
    if (!src) return null;
    return (
        <div className="relative rounded-none overflow-hidden" style={{ width: `${block.width ?? 100}%`, height: `${block.maxHeight ?? 400}px` }}>
            <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 80vw" unoptimized />
        </div>
    );
}

export default function ContentView({ savedBlocks, hasContent, placeholder, canEdit, onStartEdit }) {
    return (
        <div>
            {hasContent ? (
                <div className="space-y-3">
                    {savedBlocks
                        .filter((b) => blockHasContent(b) && !isHiddenBlock(b))
                        .map((block, idx) =>
                            isSectionBlock(block) ? (
                                <div key={idx} className="pt-4 pb-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">{block.label}</span>
                                        <div className="flex-1 h-px bg-[var(--color-hairline)]" />
                                    </div>
                                </div>
                            ) : isTitleBlock(block) ? (
                                <div key={idx} className="py-1">
                                    <h2 className="text-2xl font-bold text-[var(--color-ink)]">{block.title}</h2>
                                    {block.subtitle?.trim() && (
                                        <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] max-w-2xl">{block.subtitle}</p>
                                    )}
                                </div>
                            ) : isImageBlock(block) ? (
                                <div key={idx} className={`flex ${(block.align ?? "center") === "right" ? "justify-end" : (block.align ?? "center") === "left" ? "justify-start" : "justify-center"}`}>
                                    <ImageBlockView block={block} />
                                </div>
                            ) : (
                                <div key={idx} className={BG_VIEW[getBlockBg(block)] ?? BG_VIEW.gray}>
                                    <MarkdownContent text={getBlockText(block)} />
                                </div>
                            )
                        )
                    }
                </div>
            ) : (
                <p className="text-sm text-[var(--color-ink-soft)]/70 italic">{placeholder}</p>
            )}
            {canEdit && (
                <button
                    onClick={onStartEdit}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-none border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-all hover:bg-[var(--color-cream-2)] hover:border-[var(--color-ink-soft)]/30"
                >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                </button>
            )}
        </div>
    );
}
