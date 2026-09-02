"use client";

// Placeholder for Phase B3 (real Amplify Storage-backed media picker). Same
// props interface as the eventual real component (onSelect, onClose), so
// swapping this out later is a one-file change - nothing that calls
// MediaLibrary needs to know it's a stub.
export default function MediaLibrary({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 p-6 max-w-sm w-full space-y-4">
                <p className="text-sm font-semibold text-slate-900">Media library coming soon</p>
                <p className="text-xs text-slate-500">
                    Image uploads aren&apos;t wired up yet in this rebuild - that&apos;s a separate,
                    deliberately deferred phase (needs its own S3/Amplify Storage backend).
                </p>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
