import { NEBDataProvider } from "@/app/context/NEBData";
import { NEBYearsProvider } from "@/app/context/NEBYears";

export default function EnergyBalanceLayout({ children }) {
    return (
        <NEBDataProvider>
            <NEBYearsProvider>{children}</NEBYearsProvider>
        </NEBDataProvider>
    );
}
