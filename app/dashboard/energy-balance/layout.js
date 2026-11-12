import { Suspense } from "react";
import { NEBDataProvider } from "@/app/context/NEBData";

// YearSwitcher used to render here as one standalone bar above every NEB
// page - disconnected from the hero/content it actually controls. It's now
// embedded inside each page's own hero instead (see energy-balance/page.js,
// SectorPage.js, PrimarySupplyPage.js, ConversionPage.js), so this layout
// only needs to provide the data context.
export default function EnergyBalanceLayout({ children }) {
    return (
        // NEBDataProvider reads/writes the ?year= query param (useSearchParams),
        // which Next.js requires a Suspense boundary for.
        <Suspense fallback={null}>
            <NEBDataProvider>
                {children}
            </NEBDataProvider>
        </Suspense>
    );
}
