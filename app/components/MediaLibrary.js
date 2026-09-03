"use client";

import "@/app/ConfigureAmplify";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { list, uploadData, remove, getUrl } from "aws-amplify/storage";

const PREFIX = "insights/";

// ── Client-side image compression (canvas → WebP) ────────────────────────────
async function compressImage(file, maxWidth = 1200, quality = 0.78) {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            const scale  = Math.min(1, maxWidth / img.naturalWidth);
            const w      = Math.round(img.naturalWidth  * scale);
            const h      = Math.round(img.naturalHeight * scale);
            const canvas = document.createElement("canvas");
            canvas.width  = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            canvas.toBlob((blob) => {
                if (!blob) { reject(new Error("Compression failed")); return; }
                const name = file.name.replace(/\.[^.]+$/, ".webp");
                resolve(new File([blob], name, { type: "image/webp" }));
            }, "image/webp", quality);
        };
        img.onerror = reject;
        img.src = objectUrl;
    });
}

// ── Confirm modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 rounded-2xl">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-6 max-w-xs w-full space-y-4">
                <p className="text-sm font-semibold text-slate-900">{message}</p>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={onCancel}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm}
                        className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ className = "h-5 w-5" }) {
    return (
        <svg className={`animate-spin text-slate-400 ${className}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

// ── MediaLibrary modal ────────────────────────────────────────────────────────
// Props:
//   onSelect(key)  — called with the Storage path when the user confirms
//   onClose()      — called to close the modal
export default function MediaLibrary({ onSelect, onClose }) {
    const [images,         setImages]         = useState([]);
    const [loading,        setLoading]        = useState(true);
    const [selected,       setSelected]       = useState(null);   // Storage path
    const [uploading,      setUploading]      = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [deleting,       setDeleting]       = useState(null);   // path being deleted
    const [confirmDeleteKey, setConfirmDeleteKey] = useState(null); // path pending confirm
    const [error,          setError]          = useState(null);
    const fileInputRef = useRef(null);

    // ── Load existing images ──────────────────────────────────────────────────
    // Doesn't set loading=true itself (the mount effect relies on the
    // useState(true) default; a post-upload refresh just swaps the grid in
    // place without a loading flash) - keeps every setState call here past
    // the first `await`, since react-hooks/set-state-in-effect flags a
    // setState reachable synchronously before an effect's first await.
    async function loadImages() {
        try {
            const { items } = await list({ path: PREFIX, options: { pageSize: 200 } });
            const withUrls = await Promise.all(
                items
                    .filter((item) => item.path !== PREFIX)
                    .map(async (item) => {
                        const { url } = await getUrl({ path: item.path });
                        return { key: item.path, url: url.toString(), lastModified: item.lastModified };
                    })
            );
            withUrls.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
            setImages(withUrls);
        } catch {
            setError("Could not load image library.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            await loadImages();
        })();
    }, []);

    // ── Upload a new image ────────────────────────────────────────────────────
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        e.target.value = "";         // allow re-selecting the same file
        setError(null);
        setUploading(true);
        setUploadProgress(0);

        try {
            // 1. Compress
            const compressed = await compressImage(file);
            setUploadProgress(20);

            // 2. Upload directly via the Storage client (progress via onProgress)
            const safe = compressed.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
            const path = `${PREFIX}${Date.now()}-${safe}`;

            const task = uploadData({
                path,
                data: compressed,
                options: {
                    contentType: "image/webp",
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            setUploadProgress(20 + Math.round((transferredBytes / totalBytes) * 75));
                        }
                    },
                },
            });
            await task.result;
            setUploadProgress(100);

            // 3. Refresh the library and auto-select the new image
            await loadImages();
            setSelected(path);
        } catch (err) {
            setError(err.message ?? "Upload failed. Please try again.");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }

    // ── Delete an image ───────────────────────────────────────────────────────
    async function handleDelete(key) {
        setConfirmDeleteKey(null);
        setDeleting(key);
        try {
            await remove({ path: key });
            setImages((prev) => prev.filter((img) => img.key !== key));
            if (selected === key) setSelected(null);
        } catch {
            setError("Delete failed. Please try again.");
        } finally {
            setDeleting(null);
        }
    }

    // ── Confirm selection ─────────────────────────────────────────────────────
    function handleConfirm() {
        if (selected) onSelect(selected);
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-10 px-4 pb-10 overflow-y-auto">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col relative">
                {confirmDeleteKey && (
                    <ConfirmModal
                        message="Delete this image from the library?"
                        onConfirm={() => handleDelete(confirmDeleteKey)}
                        onCancel={() => setConfirmDeleteKey(null)}
                    />
                )}

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <p className="font-semibold text-slate-900">Media Library</p>
                        <p className="text-xs text-slate-400 mt-0.5">Select an existing image or upload a new one</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        {uploading ? "Uploading…" : "Upload new image"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {uploading && (
                        <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span className="text-xs text-slate-500 shrink-0">{uploadProgress}%</span>
                        </div>
                    )}
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

                {/* Image grid */}
                <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <Spinner className="h-6 w-6" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <svg className="h-10 w-10 text-slate-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                            </svg>
                            <p className="text-sm text-slate-400">No images uploaded yet.</p>
                            <p className="text-xs text-slate-300 mt-1">Click &ldquo;Upload new image&rdquo; to add one.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {images.map((img) => (
                                <div
                                    key={img.key}
                                    onClick={() => setSelected(img.key === selected ? null : img.key)}
                                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                        selected === img.key
                                            ? "border-green-500 ring-2 ring-green-300"
                                            : "border-transparent hover:border-slate-300"
                                    }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.key}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 33vw, 25vw"
                                        unoptimized
                                    />
                                    {/* Selected checkmark */}
                                    {selected === img.key && (
                                        <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    {/* Delete button (hover) */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteKey(img.key); }}
                                        disabled={deleting === img.key}
                                        className="absolute bottom-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 text-red-500 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex hover:bg-red-50 disabled:opacity-40"
                                        title="Delete image"
                                    >
                                        {deleting === img.key ? (
                                            <Spinner className="h-3 w-3" />
                                        ) : (
                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 shrink-0">
                    <p className="text-xs text-slate-400">
                        {selected ? "1 image selected" : `${images.length} image${images.length !== 1 ? "s" : ""} in library`}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button onClick={handleConfirm} disabled={!selected}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-40 transition-colors">
                            Use selected image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
