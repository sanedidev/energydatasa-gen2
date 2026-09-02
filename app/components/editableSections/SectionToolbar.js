"use client";

export default function SectionToolbar({ onAddImage, onAddTitle, onAddSection }) {
    return (
        <div className="mb-4 grid grid-cols-3 gap-3">
            <button
                type="button"
                onClick={onAddImage}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-green-200 bg-white py-4 text-sm font-medium text-green-600 hover:border-green-400 hover:bg-green-50 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                </svg>
                Add image
            </button>
            <button
                type="button"
                onClick={onAddTitle}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-green-200 bg-white py-4 text-sm font-medium text-green-600 hover:border-green-400 hover:bg-green-50 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Add title
            </button>
            <button
                type="button"
                onClick={onAddSection}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-green-200 bg-white py-4 text-sm font-medium text-green-600 hover:border-green-400 hover:bg-green-50 transition-colors"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add section
            </button>
        </div>
    );
}
