import { Suspense } from "react";
import { NEBDataProvider } from "@/app/context/NEBData";
import YearSwitcher from "@/app/components/YearSwitcher";

export default function EnergyBalanceLayout({ children }) {
    return (
        // NEBDataProvider reads/writes the ?year= query param (useSearchParams),
        // which Next.js requires a Suspense boundary for.
        <Suspense fallback={null}>
            <NEBDataProvider>
                <YearSwitcher />
                {children}
            </NEBDataProvider>
        </Suspense>
    );
}
