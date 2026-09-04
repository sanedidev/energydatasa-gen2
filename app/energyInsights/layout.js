import { PageEditModeProvider } from "@/app/context/pageEditMode";

export default function EnergyInsightsLayout({ children }) {
    return (
        <PageEditModeProvider>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 pb-28">
                {children}
            </div>
        </PageEditModeProvider>
    );
}
