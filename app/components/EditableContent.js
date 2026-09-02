"use client";

import { Fragment, forwardRef } from "react";
import MediaLibrary from "./MediaLibrary";
import { useEditableContent } from "./useEditableContent";
import { usePermissions } from "../context/permissions";
import { blockHasContent, getBlockBg, getBlockText, isHiddenBlock, isImageBlock, isSectionBlock, isTitleBlock, parseBlocks } from "./editableContent/blockHelpers";
import {
    BlockEditor,
    ConfirmModal,
    DropZone,
    ImageBlockEditor,
    SectionBlockEditor,
    TitleBlockEditor,
} from "./editableContent/BlockEditors";
import ContentView from "./editableContent/ContentView";
import EditToolbar from "./editableContent/EditToolbar";

// ── Main component ────────────────────────────────────────────────────────────
const EditableContent = forwardRef(function EditableContent({
    slug,
    placeholder = "Click Edit to add content.",
    canEdit: canEditProp = undefined,
    defaultContent = null,
    preloadedRecord = undefined,
    onFirstBlockIsTitle = null,
    onSave = null,
    userEmail = null,
    sectionLabel = null,
}, ref) {
    const { canEdit: canEditFromCtx } = usePermissions();
    // When canEdit is not explicitly passed, check permissions for this slug.
    // When it IS passed (e.g. from EditableSections which manages its own mode),
    // use that value directly.
    const canEdit = canEditProp !== undefined ? canEditProp : canEditFromCtx(slug);

    const ec = useEditableContent({
        slug, defaultContent, preloadedRecord,
        onFirstBlockIsTitle, onSave, userEmail, sectionLabel, canEdit, ref,
    });

    // ── Loading ───────────────────────────────────────────────────────────────
    if (ec.loading) {
        return (
            <div className="space-y-2 animate-pulse">
                <div className="h-3 w-3/4 rounded-full bg-slate-100" />
                <div className="h-3 w-1/2 rounded-full bg-slate-100" />
            </div>
        );
    }

    const savedBlocks = parseBlocks(ec.record?.content ?? defaultContent);
    const hasContent  = savedBlocks.some(blockHasContent);

    // ── Edit mode ─────────────────────────────────────────────────────────────
    if (ec.isEditing) {
        return (
            <div className="flex flex-col">
                {ec.confirmDeleteIdx !== null && (
                    <ConfirmModal
                        message={
                            isImageBlock(ec.blocks[ec.confirmDeleteIdx])
                                ? "Delete this image block?"
                                : ec.blocks.length === 1
                                    ? "Clear this content block?"
                                    : "Delete this content block?"
                        }
                        onConfirm={() => { ec.deleteBlock(ec.confirmDeleteIdx); ec.setConfirmDeleteIdx(null); }}
                        onCancel={() => ec.setConfirmDeleteIdx(null)}
                    />
                )}

                {ec.mediaOpen && (
                    <MediaLibrary
                        onSelect={ec.handleImageSelect}
                        onClose={() => { ec.setMediaOpen(false); ec.setPendingImgIdx(null); }}
                    />
                )}

                <DropZone
                    dragging={ec.dragIdx !== null}
                    isActive={ec.dropTarget?.type === "insert" && ec.dropTarget?.afterIdx === -1}
                    onDragOver={() => ec.setDropTarget({ type: "insert", afterIdx: -1 })}
                    onDrop={ec.handleDrop}
                />

                {ec.blocks.map((block, idx) => (
                    <Fragment key={idx}>
                        {isSectionBlock(block) ? (
                            <SectionBlockEditor
                                block={block}
                                onUpdate={(patch) => ec.updateBlock(idx, { ...block, ...patch })}
                                onDelete={() => ec.setConfirmDeleteIdx(idx)}
                                isHidden={!!block.hidden}
                                onToggleHide={() => ec.toggleBlockHide(idx)}
                                isDragging={ec.dragIdx === idx}
                                isSwapTarget={ec.dropTarget?.type === "swap" && ec.dropTarget?.idx === idx && ec.dragIdx !== idx}
                                onDragStart={() => ec.setDragIdx(idx)}
                                onDragOver={(e) => { e.preventDefault(); ec.setDropTarget({ type: "swap", idx }); }}
                                onDrop={ec.handleDrop}
                                onDragEnd={() => { ec.setDragIdx(null); ec.setDropTarget(null); }}
                            />
                        ) : isTitleBlock(block) ? (
                            <TitleBlockEditor
                                block={block}
                                onUpdate={(patch) => ec.updateBlock(idx, { ...block, ...patch })}
                                onDelete={() => ec.setConfirmDeleteIdx(idx)}
                                isHidden={!!block.hidden}
                                onToggleHide={() => ec.toggleBlockHide(idx)}
                                isDragging={ec.dragIdx === idx}
                                isSwapTarget={ec.dropTarget?.type === "swap" && ec.dropTarget?.idx === idx && ec.dragIdx !== idx}
                                onDragStart={() => ec.setDragIdx(idx)}
                                onDragOver={(e) => { e.preventDefault(); ec.setDropTarget({ type: "swap", idx }); }}
                                onDrop={ec.handleDrop}
                                onDragEnd={() => { ec.setDragIdx(null); ec.setDropTarget(null); }}
                            />
                        ) : isImageBlock(block) ? (
                            <ImageBlockEditor
                                block={block}
                                onDelete={() => ec.setConfirmDeleteIdx(idx)}
                                onChangeImage={() => ec.openChangeImage(idx)}
                                onUpdate={(patch) => ec.updateBlock(idx, { ...block, ...patch })}
                                isHidden={!!block.hidden}
                                onToggleHide={() => ec.toggleBlockHide(idx)}
                                isDragging={ec.dragIdx === idx}
                                isSwapTarget={ec.dropTarget?.type === "swap" && ec.dropTarget?.idx === idx && ec.dragIdx !== idx}
                                onDragStart={() => ec.setDragIdx(idx)}
                                onDragOver={(e) => { e.preventDefault(); ec.setDropTarget({ type: "swap", idx }); }}
                                onDrop={ec.handleDrop}
                                onDragEnd={() => { ec.setDragIdx(null); ec.setDropTarget(null); }}
                            />
                        ) : (
                            <BlockEditor
                                index={idx}
                                total={ec.blocks.length}
                                value={getBlockText(block)}
                                onChange={(v) => ec.updateBlock(idx, v)}
                                onDelete={() => ec.setConfirmDeleteIdx(idx)}
                                onMergePrev={
                                    idx > 0 &&
                                    !isImageBlock(ec.blocks[idx - 1]) &&
                                    !isTitleBlock(ec.blocks[idx - 1]) &&
                                    !isSectionBlock(ec.blocks[idx - 1])
                                        ? () => ec.mergeBlocks(idx)
                                        : null
                                }
                                isHidden={isHiddenBlock(block)}
                                onToggleHide={() => ec.toggleBlockHide(idx)}
                                blockBg={getBlockBg(block)}
                                onSetBg={(bg) => ec.updateBlockBg(idx, bg)}
                                refs={ec.textareaRefs}
                                registerTextarea={(el) => { ec.textareaRefs.current[idx] = el; }}
                                blocks={ec.blocks}
                                setBlocks={ec.setBlocks}
                                placeholder={placeholder}
                                isDragging={ec.dragIdx === idx}
                                isSwapTarget={ec.dropTarget?.type === "swap" && ec.dropTarget?.idx === idx && ec.dragIdx !== idx}
                                onDragStart={() => ec.setDragIdx(idx)}
                                onDragOver={(e) => { e.preventDefault(); ec.setDropTarget({ type: "swap", idx }); }}
                                onDrop={ec.handleDrop}
                                onDragEnd={() => { ec.setDragIdx(null); ec.setDropTarget(null); }}
                            />
                        )}

                        <DropZone
                            dragging={ec.dragIdx !== null}
                            isActive={ec.dropTarget?.type === "insert" && ec.dropTarget?.afterIdx === idx}
                            onDragOver={() => ec.setDropTarget({ type: "insert", afterIdx: idx })}
                            onDrop={ec.handleDrop}
                        />
                    </Fragment>
                ))}

                <EditToolbar
                    saving={ec.saving}
                    error={ec.error}
                    draftRestored={ec.draftRestored}
                    pickerRef={ec.pickerRef}
                    showBlockPicker={ec.showBlockPicker}
                    setShowBlockPicker={ec.setShowBlockPicker}
                    handleSave={ec.handleSave}
                    handleCancel={ec.handleCancel}
                    addBlock={ec.addBlock}
                    addTitleBlock={ec.addTitleBlock}
                    addSectionBlock={ec.addSectionBlock}
                    openAddImage={ec.openAddImage}
                    openChangeImage={ec.openChangeImage}
                    blocks={ec.blocks}
                />
            </div>
        );
    }

    // ── View mode ─────────────────────────────────────────────────────────────
    return (
        <ContentView
            savedBlocks={savedBlocks}
            hasContent={hasContent}
            placeholder={placeholder}
            canEdit={canEdit}
            onStartEdit={ec.handleStartEdit}
        />
    );
});

export default EditableContent;
